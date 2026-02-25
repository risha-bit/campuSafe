import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import Tesseract from "tesseract.js";
import * as faceapi from '@vladmandic/face-api';

const CompleteProfile: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [progress, setProgress] = useState("");
    const [step, setStep] = useState<"upload" | "confirm">("upload");
    const [scannedData, setScannedData] = useState<{ name: string; usn: string; branch: string; year: number; course: string; profilePhoto?: string } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkProfileStatus = async () => {
            const currentEmail = localStorage.getItem("currentEmail");
            if (!currentEmail) {
                setIsChecking(false);
                return;
            }

            try {
                const data = await userService.getProfile(currentEmail);
                if (data.isProfileComplete) {
                    // Profile is already complete, redirect away from this page
                    navigate("/profile");
                }
            } catch (error) {
                // If it crashes here ("User not found"), it means they don't have an account
                console.log("No profile exists for this email, staying on Complete Profile");
            } finally {
                setIsChecking(false);
            }
        };

        checkProfileStatus();
    }, [navigate]);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setProgress("Initializing Scan...");

        try {
            // Create a preview URL for the uploaded image
            const imageUrl = URL.createObjectURL(file);
            let finalProfilePhoto = imageUrl;

            try {
                setProgress("Scanning for face...");
                await faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/');
                const img = await faceapi.fetchImage(imageUrl);
                const detection = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions());

                if (detection) {
                    const canvas = document.createElement('canvas');
                    const { x, y, width, height } = detection.box;

                    // Add some padding to frame the face like a real ID photo
                    const pad = Math.min(width, height) * 0.3;
                    const cropX = Math.max(0, x - pad);
                    const cropY = Math.max(0, y - pad * 1.5); // extra padding on top for head
                    const cropWidth = Math.min(img.width - cropX, width + pad * 2);
                    const cropHeight = Math.min(img.height - cropY, height + pad * 2.5);

                    canvas.width = cropWidth;
                    canvas.height = cropHeight;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
                        finalProfilePhoto = canvas.toDataURL('image/jpeg');
                        console.log("Face successfully cropped!");
                    }
                } else {
                    console.log("No face detected by AI.");
                }
            } catch (faceErr) {
                console.warn("Face crop automated extraction skipped/failed:", faceErr);
            }

            setProgress("Enhancing Image for OCR...");

            // Create a high-contrast scaled canvas version specifically for Tesseract
            const enhancedImageUrl = await new Promise<string>((resolve) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');

                    // Tesseract aggressively fails on tiny images ("Image too small to scale").
                    // Forcibly upscale the image if it is too small.
                    const scale = Math.max(1, 1000 / img.height);
                    canvas.width = img.width * scale;
                    canvas.height = img.height * scale;

                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.fillStyle = "white"; // clear background
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                        // Basic Grayscale to remove color noise from ID card backgrounds
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        const data = imageData.data;
                        for (let i = 0; i < data.length; i += 4) {
                            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                            data[i] = avg;     // red
                            data[i + 1] = avg; // green
                            data[i + 2] = avg; // blue
                        }
                        ctx.putImageData(imageData, 0, 0);

                        resolve(canvas.toDataURL('image/jpeg', 1.0));
                    } else {
                        resolve(imageUrl); // fallback
                    }
                };
                img.src = imageUrl;
            });

            setProgress("Initializing OCR...");
            // Run OCR with Tesseract on the enhanced image URL
            const result = await Tesseract.recognize(enhancedImageUrl, 'eng', {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        setProgress(`Extracting: ${Math.round(m.progress * 100)}%`);
                    } else {
                        setProgress(m.status);
                    }
                }
            });
            const text = result.data.text;
            console.log("OCR Extracted Text:\n", text);

            const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

            // Clean text for USN extraction (remove spaces)
            const cleanText = text.replace(/[\s-]/g, '');
            // Look for a typical USN format (e.g. 4SO24CS130), allowing some common OCR misreads like 'O' to '0', 'S' to '5'
            const usnMatch = cleanText.match(/[1-4][A-Z0-9]{2}\d{2}[A-Z0-9]{2}\d{3}/i);
            let usn = usnMatch ? usnMatch[0].toUpperCase() : "";

            // Fix common OCR mistakes in USN prefix if it's meant to be an SJEC USN (4SO)
            if (usn) {
                if (usn.startsWith("4S0") || usn.startsWith("450") || usn.startsWith("45O")) {
                    usn = "4SO" + usn.substring(3);
                }
            }

            let name = "Student";
            let branch = "Computer Science Engineering"; // default
            let course = "B.E";
            let year = 1;

            let explicitNameFound = false;

            // First Pass: Extract Explicit Labels (Name : XYZ)
            for (const line of lines) {
                const nameMatch = line.match(/name\s*[:\-]\s*(.+)/i);
                if (nameMatch) {
                    name = nameMatch[1].trim();
                    explicitNameFound = true;
                }

                const courseMatch = line.match(/course\s*[:\-]\s*(.+)/i);
                if (courseMatch) {
                    const extractedCourse = courseMatch[1].trim();
                    if (/b\.?e\.?|b\.?tech/i.test(extractedCourse)) course = "B.E";
                    else course = extractedCourse.toUpperCase();
                }

                const branchMatch = line.match(/branch\s*[:\-]\s*(.+)/i);
                if (branchMatch) {
                    const extractedBranch = branchMatch[1].trim();
                    if (/cse|computer/i.test(extractedBranch)) branch = "Computer Science Engineering";
                    else if (/mech/i.test(extractedBranch)) branch = "Mechanical Engineering";
                    else if (/ece|electronic/i.test(extractedBranch)) branch = "Electronics and Communication";
                    else if (/civil/i.test(extractedBranch)) branch = "Civil Engineering";
                    else branch = extractedBranch;
                }
            }

            // Second Pass: Weighted Heuristic Scoring (if explicit tags failed or we missed data)
            // Determine the "Name" using a scoring system
            if (!explicitNameFound) {
                const ignoreKeywords = /st joseph|joseph|college|engineering|institute|technology|mangalore|mangaluru|sjec|vamanjoor|valid|blood|dob|ph:|id|principal|signature|date|issue|course|branch/i;

                let bestNameScore = -1;
                let bestNameCandidate = "Student";

                lines.forEach((line) => {
                    let score = 0;
                    const cleanLine = line.trim();

                    // Absolute dealbreakers (score = -100)
                    if (ignoreKeywords.test(cleanLine)) score -= 100;
                    if (cleanLine.length < 4 || cleanLine.length > 30) score -= 100;
                    if (/^[0-9]+$/.test(cleanLine)) score -= 100;
                    if (/[=\-\\|\/]+/.test(cleanLine)) score -= 100; // Garbage symbols
                    if (usn && cleanLine.includes(usn)) score -= 100;
                    if (!/^[A-Z]/i.test(cleanLine)) score -= 100; // Must start with letter

                    // Positive Indicators
                    if (score > -50) {
                        const words = cleanLine.split(' ');
                        const wordCount = words.length;

                        // Names are usually 2-3 words (First, Middle, Last)
                        if (wordCount === 2 || wordCount === 3) score += 20;
                        if (wordCount === 1) score += 5; // Sometimes just a first name
                        if (wordCount > 3) score -= 10; // Unlikely to be a name

                        // Title Case Bonus (e.g. "Minora Risha Dias" vs "MINORA RISHA DIAS")
                        // Many OCRs read names in title-case accurately if printed normally
                        const isTitleCase = words.every(w => /^[A-Z][a-z]+$/.test(w) || /^[A-Z]+$/.test(w));
                        if (isTitleCase) score += 15;

                        // Bonus for long words: Real names contain longer letters, whereas random OCR strings are short abbreviations
                        words.forEach(w => {
                            if (w.length >= 4) score += 5;
                        });

                        if (score > bestNameScore) {
                            bestNameScore = score;
                            bestNameCandidate = cleanLine;
                        }
                    }
                });

                if (bestNameScore > 0) {
                    name = bestNameCandidate;
                }
            }

            // Clean up name artifacts
            name = name.replace(/name\s*[:\-]\s*|student\s*[:\-]\s*/i, '').trim();

            // Broad Scope Fallback for Course/Branch
            // If explicit markers ("Branch : CSE") weren't found, search the whole text blob
            const textAll = text.toLowerCase();
            if (/computer science|cse/i.test(textAll)) branch = "Computer Science Engineering";
            if (/mechanical|mech/i.test(textAll)) branch = "Mechanical Engineering";
            if (/electronics|ece/i.test(textAll)) branch = "Electronics and Communication";
            if (/civil/i.test(textAll)) branch = "Civil Engineering";
            if (/ai|artificial intelligence/i.test(textAll)) branch = "Artificial Intelligence";
            if (/data science|csds/i.test(textAll)) branch = "Data Science";

            if (/b\.?e\.?|b\.?tech|bachelor/i.test(textAll)) course = "B.E";
          
            if (/mca/i.test(textAll)) course = "MCA";
            if (/mba/i.test(textAll)) course = "MBA";

            // Estimate year of study from USN (e.g. 4SO 24 CS 130 -> 24 means 2024 admission)
            if (usn && usn.length >= 5) {
                const admissionYearStr = usn.substring(3, 5);
                const admissionYear = parseInt("20" + admissionYearStr);
                const currentYear = new Date().getFullYear();
                year = currentYear - admissionYear;
                if (year <= 0) year = 1;
                if (year > 4) year = 4;
            }

            setScannedData({
                name: name || "Please Edit Name",
                usn: usn,
                branch: branch,
                course: course,
                year: year || 1,
                profilePhoto: finalProfilePhoto // Use the cropped face photo
            });

            setStep("confirm");
        } catch (error) {
            console.error("OCR Failed", error);
            alert("Failed to extract details from the image. Please try another image.");
        } finally {
            setLoading(false);
            setProgress("");
        }
    };

    const handleConfirm = async () => {
        setLoading(true);
        if (scannedData) {
            try {
                // Save confirmed data along with the email used to login
                const currentEmail = localStorage.getItem("currentEmail");
                await userService.updateProfile({
                    ...scannedData,
                    email: currentEmail || undefined
                });
                navigate("/profile");
            } catch (error) {
                console.error("Failed to complete profile", error);
            } finally {
                setLoading(false);
            }
        }
    };

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500 text-lg">Checking profile status...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex flex-col items-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete Profile</h1>
                <p className="text-gray-500 mb-8 text-center text-sm">
                    {step === "upload"
                        ? "Please upload a clear picture of your SJEC ID card for automated verification."
                        : "Verify and edit the details extracted from your ID card."}
                </p>

                {step === "upload" && (
                    <label className={`w-full flex justify-center flex-col items-center border-dashed border-2 ${loading ? 'border-gray-200 bg-gray-50' : 'border-blue-200 hover:bg-blue-50 cursor-pointer'} rounded-xl p-8 transition relative overflow-hidden`}>
                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            onChange={handleFileUpload}
                            disabled={loading}
                        />
                        <div className={`text-blue-500 mb-4 h-12 w-12 ${loading ? 'bg-gray-200 text-gray-400' : 'bg-blue-100'} rounded-full flex items-center justify-center text-xl transition`}>
                            {loading ? "⌛" : "+"}
                        </div>
                        <p className={`text-lg font-semibold ${loading ? 'text-gray-500' : 'text-blue-700'}`}>
                            {loading ? "Processing Image..." : "Click to upload or scan ID"}
                        </p>
                        <p className="text-sm text-gray-400 mt-2">Supports JPG, PNG (Max 5MB)</p>

                        {loading && (
                            <div className="absolute bottom-0 left-0 h-1 bg-blue-500 animate-pulse w-full"></div>
                        )}
                    </label>
                )}

                {loading && step === "upload" && progress && (
                    <p className="text-blue-600 mt-4 font-semibold text-center animate-pulse capitalize">{progress}</p>
                )}

                {step === "confirm" && scannedData && (
                    <div className="w-full">
                        <div className="bg-gray-50 rounded-lg p-6 space-y-4 shadow-inner mb-6">

                            {/* Display uploaded ID photo mock as face crop */}
                            {scannedData.profilePhoto && (
                                <div className="flex justify-center mb-4">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                                        <img src={scannedData.profilePhoto} alt="Extracted ID" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Name</label>
                                <input
                                    className="text-lg font-medium text-gray-800 bg-transparent border-b border-gray-300 w-full focus:outline-none focus:border-blue-500 pb-1"
                                    value={scannedData.name}
                                    onChange={e => setScannedData({ ...scannedData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">USN</label>
                                <input
                                    className="text-lg font-medium text-gray-800 bg-transparent border-b border-gray-300 w-full focus:outline-none focus:border-blue-500 pb-1"
                                    value={scannedData.usn}
                                    onChange={e => setScannedData({ ...scannedData, usn: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Branch</label>
                                <input
                                    className="text-lg font-medium text-gray-800 bg-transparent border-b border-gray-300 w-full focus:outline-none focus:border-blue-500 pb-1"
                                    value={scannedData.branch}
                                    onChange={e => setScannedData({ ...scannedData, branch: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Course</label>
                                    <input
                                        className="text-lg font-medium text-gray-800 bg-transparent border-b border-gray-300 w-full focus:outline-none focus:border-blue-500 pb-1"
                                        value={scannedData.course}
                                        onChange={e => setScannedData({ ...scannedData, course: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Year</label>
                                    <input
                                        type="number"
                                        className="text-lg font-medium text-gray-800 bg-transparent border-b border-gray-300 w-full focus:outline-none focus:border-blue-500 pb-1"
                                        value={scannedData.year}
                                        onChange={e => setScannedData({ ...scannedData, year: parseInt(e.target.value) || 1 })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setStep("upload")}
                                className="flex-1 px-4 py-3 bg-white text-gray-600 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                            >
                                Retake
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={loading}
                                className={`flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? "Saving..." : "Confirm & Save"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompleteProfile;
