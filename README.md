# 🌍 AI Travel Planner

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)
![Gemini AI](https://img.shields.io/badge/Google%20Gemini%20AI-8E75B2?style=for-the-badge&logo=google&logoColor=white)

**Discover Your Next Adventure with AI: Personalized Itineraries at Your Fingertips.**

An intelligent travel planning application that curates custom trip itineraries based on your interests, budget, and travel companions. Powered by **Google Gemini AI**, **OpenStreetMap**, and **Firebase**.

### 🚀 [View Live Demo](https://ai-trip-planner-sigma-nine.vercel.app/)

![AI Travel Planner Screenshot](public/landing.png)

## ✨ Features

* **🤖 AI-Powered Itineraries:** Generates day-by-day travel plans, including best times to visit and ticket pricing.
* **📍 Smart Location Search:** Integrated with OpenStreetMap (Nominatim) for precise destination selection.
* **🏨 Hotel Recommendations:** Suggests accommodation options with images, prices, and geo-coordinates.
* **🗺️ Interactive Maps:** Visualizes your destination using dynamic maps.
* **🔐 Secure Authentication:** Google Sign-In support (via OAuth 2.0).
* **💾 Cloud Sync:** Saves your trips automatically to Firebase Firestore so you can access them anytime.
* **🎨 Modern UI:** Built with Tailwind CSS, ShadCN UI, and Framer Motion for a smooth user experience.

## 🛠️ Tech Stack

* **Frontend:** React.js (Vite)
* **Styling:** Tailwind CSS, ShadCN UI
* **AI Model:** Google Gemini 1.5 Flash
* **Database & Auth:** Firebase (Firestore, Google Auth)
* **Maps:** Leaflet / OpenStreetMap
* **Icons:** Lucide React, React Icons

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

* Node.js (v18 or higher)
* npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/bhumika0029/AI-Trip-Planner.git](https://github.com/bhumika0029/AI-Trip-Planner.git)
    cd AI-Trip-Planner
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables:**
    Create a `.env.local` file in the root directory and add your API keys:
    ```env
    VITE_GOOGLE_AUTH_CLIENT_ID=your_google_client_id
    VITE_GOOGLE_GEMINI_API_KEY=your_gemini_api_key
    VITE_FIREBASE_API_KEY=your_firebase_api_key
    # Add other Firebase config keys as needed
    ```

4.  **Run the application:**
    ```bash
    npm run dev
    ```

## 📸 Screenshots

| Landing Page | Trip Generation |
|:---:|:---:|
| <img src="public/landing.png" width="300" />

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---
*Built with ❤️ by Bhumika*
