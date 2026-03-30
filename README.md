# CareerSync - Advanced Tech Recruitment Platform

**Tagline:** Your Next Engineering Role, Synchronized.

---

## 🔹 System Architecture & Overview

CareerSync is a comprehensive, full-stack recruitment marketplace engineered to bridge the gap between candidates seeking top-tier tech opportunities and innovative companies hiring skilled professionals. Modeled after industry-leading job boards and Applicant Tracking Systems (ATS), CareerSync utilizes a highly scalable, modern tech stack integrated with artificial intelligence to optimize the employment journey.

The system is logically partitioned into three core operational domains:
1.  **Candidate Portal:** A responsive interface empowering job seekers to seamlessly discover roles, apply, and manage their applications.
2.  **Recruiter Dashboard:** A dedicated environment for companies and recruiters to post open roles, manage their employer brand, and track incoming candidate applications.
3.  **Administrative Console:** A centralized control plane for system administrators to monitor platform health, manage users, and oversee marketplace activities.

---

## ✨ Core Capabilities (MVP & Phase 2 Roadmap)

* **Robust Identity Management:** Secure, stateless user registration and authentication leveraging JSON Web Tokens (JWT).
* **Frictionless Recruiter Onboarding:** An optimized, multi-step registration pipeline for vetting and onboarding new companies.
* **Job Board Management:** Empowering recruiters with CRUD (Create, Read, Update, Delete) operations to dynamically manage their active job postings.
* **Intelligent Role Discovery:** An intuitive, grid-based interface allowing candidates to effortlessly browse and filter available technical roles.
* **End-to-End Application Flow:** A meticulously designed candidate journey encompassing job selection, resume submission, and continuous tracking.
* **Secure Financial Processing:** Enterprise-grade payment gateway integration via Razorpay for premium job listings or recruiter subscriptions.
* **AI-Driven Concierge:** Integration with the Google Gemini API to provide a smart, conversational assistant that aids candidates in pinpointing the exact role they desire.
* **Dynamic Reputation System:** An automated feedback loop where candidates and companies can leave mutual reviews upon process completion.

---

## 🚀 Technology Stack

CareerSync is architected upon the MERN stack, heavily utilizing Next.js for server-side rendering and optimized frontend performance.

* **Client Environment:** Next.js 15 (App Router architecture), React 19, TypeScript for type safety, and Tailwind CSS for utility-first styling.
* **Server Environment:** Node.js 20 runtime executing Express.js 5.
* **Data Persistence:** MongoDB, utilizing Mongoose as the Object Data Modeling (ODM) layer.
* **Security & Auth:** JWT (JSON Web Tokens) for stateless session management.
* **Payment Gateway:** Razorpay.
* **Artificial Intelligence:** Google Gemini API.
* **Bidirectional Communication (Phase 2):** Socket.IO for real-time, event-driven chat between candidates and recruiters.

---

## 📂 Repository Structure

To maintain a strict separation of concerns, the monorepo is divided into distinct frontend and backend directories.

### Backend Application (`careersync-backend`)
* `/src/config`: Centralized configuration for database connections and environment parsing.
* `/src/controllers`: Core business logic handling incoming HTTP requests and responses.
* `/src/middlewares`: Interceptors for request validation, authorization checks, and global exception handling.
* `/src/models`: Mongoose schema definitions representing the database entities.
* `/src/routes`: RESTful API endpoint declarations mapping URIs to specific controllers.
* `server.js`: The application bootstrap and server initialization script.

### Client Application (`careersync-frontend`)
* `/src/app`: Core page routing utilizing the Next.js App Router paradigm.
* `/src/components`: Modular, reusable React components strategically categorized by feature domain (`auth`, `chat`, `partner`) and generic UI elements (`ui`).
* `/src/context`: Global application state management (e.g., maintaining the Authentication lifecycle).
* `/src/lib`: Reusable utility classes and the centralized `axios` HTTP client configuration.

---

## ⚙️ Deployment & Local Setup

### System Prerequisites
* Node.js Engine (v20 or newer)
* Node Package Manager (npm)
* An active MongoDB instance (Local daemon or MongoDB Atlas cluster)
* Provisioned API keys for Razorpay and Google Gemini

### Backend Initialization
1.  Navigate into the API directory: `cd careersync-backend`
2.  Resolve project dependencies: `npm install`
3.  Establish a `.env` file at the root of the directory and configure your secrets:
    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_cryptographically_secure_jwt_secret
    RAZORPAY_KEY_ID=your_razorpay_test_key_id
    RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret
    GEMINI_API_KEY=your_gemini_api_key
    ```
4.  Launch the development server: `npm run dev`

### Frontend Initialization
1.  Navigate into the client directory: `cd careersync-frontend`
2.  Resolve UI dependencies: `npm install`
3.  Establish a `.env.local` file to inject environment variables into the Next.js build:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8000/api
    NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_test_key_id
    ```
