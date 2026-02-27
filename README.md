##  Problem statement 2

#  CampuSafe

A secure, campus-restricted Lost & Found platform designed to streamline the process of reporting and recovering lost items within a college environment.

---

##  Problem statement 

College campuses lack a structured and secure system to manage lost and found items. Students rely on scattered WhatsApp groups, notice boards, and word of mouth — leading to:

- Low recovery rates  
- Unorganized communication  
- No verification of users  
- High chances of misuse  

There is no centralized, authenticated platform built specifically for campus communities.

---

##  Solution

CampuSafe provides a **student-only digital platform** that:

- Restricts access to institutional email IDs (e.g., `@sjec.ac.in`)
- Verifies users through ID scanning (OCR-based profile creation)
- Allows posting of lost/found items with images
- Provides a searchable, real-time item feed
- Ensures only verified campus members can access the system

---

##  Key Features

-  Institutional Email Authentication  
-  OCR-based Student ID Verification  
-  Image-based Lost & Found Posting  
-  Centralized & Searchable Feed  
-  Structured Claim Process  
-  User Profiles with Activity Tracking  

---

## Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- Tailwind CSS

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB (Mongoose)

**Deployment**
- Backend: Render (Web Service)
- Frontend: Render (Static Site)

---

## Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Git

---

###  Backend Setup

```bash
cd Backend
npm install
```

Run backend:

```bash
npm run dev
```

---

###  Frontend Setup

```bash
cd Frontend/campus-lost-found
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

---

##  Verification Checklist

- Application loads without console errors  
- Backend responds at `/` endpoint  
- Login works with institutional email  
- Users can create lost/found posts  
- Posts appear instantly on feed  
- Claim flow functions correctly  

---

##  Vision

To modernize and secure the traditional lost and found process within campuses by building a scalable, verified, and community-driven digital solution.

---

##  Future Improvements

- AI-based matching between lost and found posts  
- Real-time notifications  
- Admin moderation panel  
- Multi-campus scalability  

---

###  Developed for VOIDHACK 2026
- Minora Dias @SJEC (SOLO)
