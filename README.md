# MERN Stack Candidate Submission System

A professional, feature-rich MERN Stack application implemented for a candidate onboarding evaluation. The application collects personal details, addresses, and multiple dynamic documents, matching structural requirements from the PDF specification while utilizing a premium Dark Glassmorphic user interface.

---

## 🚀 Key Features

### 💻 Frontend (Vite + React.js + Vanilla CSS)
* **Glassmorphic Theme:** Beautiful dark-mode user interface with violet and cyan glowing accents, custom radial blurred floating gradient backdrops, and active styling.
* **Side-by-Side Compact Layout:** Space-optimized multi-column design reducing vertical scrolling to improve overall user experience.
* **Address Synchronization:** Toggle checkbox that automatically replicates residential address values to permanent address and toggles editable/disabled states.
* **Dynamic Documents Grid:** Custom table to dynamically add/remove document rows (supports custom title, category dropdown, and type-validated file inputs).
* **Robust Client-side Validations:** Instantly checks mandatory constraints, email formats, minimum age (>= 18 years), file mismatch checks, and a minimum requirement of 2 documents before submission.
* **Scroll-to-Error Helper:** Automatically scrolls the browser smoothly to the first invalid field and focuses it when a submission is blocked by validation errors.
* **Dynamic Error Alert Summary:** Summarizes all active form validation errors inside the top alert banner as a bulleted list for a user-friendly summary.

### ⚙️ Backend (Node.js + Express.js + MongoDB + Multer)
* **Decoupled Architecture:** Utilizes separated collections for `Candidate` and `Document` with schema-level references (`candidateId`).
* **Disk Space Hygiene middleware:** Cleans up newly uploaded temporary files from the disk automatically if a candidate request fails validation middleware rules.
* **Express-Validator Pipeline:** Validates schema constraints including conditional permanent address logic, email uniqueness checks, dob-to-age checks, and minimum file count rules.
* **Type-Mismatch Validation:** Server-side validation verifying that uploaded files match their designated dropdown types ('image' -> image file, 'pdf' -> pdf file).

---

## 📂 Project Structure

```bash
MERN_Machine_Test/
├── Clinet/                  # React Frontend (Vite)
│   ├── src/
│   │   ├── components/      # React Presentation Components
│   │   │   ├── AddressSection.jsx
│   │   │   ├── DocumentUpload.jsx
│   │   │   └── CandidateForm.jsx
│   │   ├── services/        # Axios API Client Connections
│   │   │   └── api.js
│   │   ├── validations/     # Client-side validation algorithms
│   │   │   └── validation.js
│   │   ├── App.jsx
│   │   ├── index.css        # Premium Vanilla CSS styles (No Frameworks)
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── Server/                  # Node.js Express Backend
│   ├── src/
│   │   ├── config/          # MongoDB Connection setup
│   │   ├── controllers/     # Candidate route handling (decoupled saves)
│   │   ├── middleware/      # express-validator & Multer file uploads
│   │   ├── models/          # Candidate and Document Mongoose Schemas
│   │   ├── routes/          # Express API route endpoints
│   │   └── utils/           # Math age & file limit helpers
│   ├── uploads/             # Server file upload destination directory
│   ├── app.js
│   └── server.js
│
└── README.md
```

---

## 🛠️ Installation & Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v16+ recommended)
* [MongoDB](https://www.mongodb.com/) (running locally or cloud cluster connection string)

### 1. Database Connection setup
Create a `.env` file in the root `Server/` directory and add your port and MongoDB URI configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/MERNForm_Project
```

### 2. Start the Backend Server
```bash
# Open terminal in root project directory
npm run dev
```
The server will connect to MongoDB and start listening on port `5000`.

### 3. Start the Frontend Application
```bash
# Open a new terminal tab and navigate to Clinet
cd Clinet
npm install
npm run dev
```
The application will launch Vite dev server at `http://localhost:3000/`. It uses Vite's proxy configurations to redirect API requests from port 3000 to port 5000 automatically.
