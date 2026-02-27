# CampuSafe

## Why CampuSafe
CampuSafe was born out of the need to streamline the process of reporting, finding, and claiming lost items within a college campus. Traditional lost and found systems are often fragmented, relying on word of mouth, scattered WhatsApp groups, or poorly maintained physical logs. This leads to low recovery rates and frustrated students. 

CampuSafe centralizes this process into a single, intuitive platform. It empowers students to quickly report items they've found or lost, providing a transparent and efficient way to reunify belongings with their rightful owners. By leveraging a centralized system, CampuSafe fosters a stronger, more helpful campus community.

## Key Features
- **Centralized Lost & Found Feed**: A real-time, easily searchable feed of all items reported lost or found on campus.
- **Reporting System**: Users can easily report new found or lost items with descriptions, images, and locations.
- **Claiming Process Flow**: A structured system for claiming items, allowing the finder to provide specific return instructions and pickup locations.
- **OCR ID Verification**: Automated extraction of student details from ID cards to ensure secure and verified user profiles.
- **User Profiles**: Personalized profiles to track a user's reported items and claim history.

## Technology Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)

## Deployment
The application adopts a decoupled architecture for deployment:
- **Backend**: Deployed as a web service on **Render**, handling API requests, database interactions, and business logic.
- **Frontend**: Deployed as a static page on platforms like Vercel or Netlify (currently configured for Vercel), providing a fast, responsive user interface.

## Installation and Setup
### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB instance (local or Atlas)
- Git

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Backend` directory and add the necessary environment variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/campusafe # Or your MongoDB Atlas URI
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd Frontend/campus-lost-found
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Frontend/campus-lost-found` directory and configure the API URL:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Verification Criteria
To verify the system is running correctly:
1. **Application Load**: Access the frontend application URL; the login or home page should load successfully without console errors.
2. **API Communication**: The frontend clearly communicates with the backend (e.g., fetching the feed of items).
3. **Login functionality**: Users should be able to authenticate.
4. **Post Creation**: A user should successfully post a new finding or lost item, and it should immediately appear on the feed.
5. **Claiming Flow**: A user can click "Claim" on an item, and follow the flow to receive instructions from the poster. 
6. **Backend Health**: Accessing the root API endpoint (e.g., `http://localhost:5000/`) should return a confirming message like "CampuSafe API is running".
