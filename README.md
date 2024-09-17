
   ## ✨ Features
   - 💬 **Text Messaging**: Send real-time messages.
   - 🖼️ **Photo Sharing**: Select and send images from the gallery or take a picture with the camera.
   - 🌍 **Location Sharing**: Share your current location with others.
   - 📶 **Offline Functionality**: Cache messages locally and display them when offline.
   - 🔄 **Real-time Synchronization**: Messages are synced with Firebase Firestore in real-time.
   - 🗺️ **Map Integration**: View shared locations in the chat as a map.
   ```

2. **Badges**:
   Add badges for technologies used (React Native, Firebase, etc.).

 
   ![React Native](https://img.shields.io/badge/React%20Native-v0.64-blue)
   ![Expo](https://img.shields.io/badge/Expo-v44.0.0-lightgrey)
   ![Firebase](https://img.shields.io/badge/Firebase-v9.6.0-orange)
   ```

3. **Screenshots or GIFs**:
   If you have screenshots or screen recordings of the app in action, include them under a "Screenshots" section.

 
   ## 📸 Screenshots

   <img src="path/to/screenshot.png" alt="Chat App Screenshot" width="300"/>

   ```
   Or add GIFs showing the functionality in action.

4. **Table of Contents**:
   If the README is long, you can add a table of contents for easy navigation.


   ## Table of Contents
   - [Features](#features)
   - [Technologies](#technologies)
   - [Getting Started](#getting-started)
   - [Installation](#installation)
   - [How to Use](#how-to-use)
   - [Project Structure](#project-structure)
   - [Future Improvements](#future-improvements)
   - [Troubleshooting](#troubleshooting)
   - [License](#license)
   ```

5. **Detailed Sections**:
   If you want to make the "Installation" or "Getting Started" sections more user-friendly, you could split them into smaller sub-sections and include clearer instructions for each part of the setup (e.g., Firebase config, adding Firestore and Storage).

---

# 📱 Chat App

A **React Native** and **Expo** powered chat application that allows users to send messages, images, and their current location. The app uses **Firebase** for backend services, including Firestore for message storage and Firebase Storage for image uploads. It also integrates with Expo APIs to access the device’s camera, gallery, and geolocation.

## ✨ Features

- 💬 **Text Messaging**: Send real-time messages.
- 🖼️ **Photo Sharing**: Select and send images from the gallery or take a picture with the camera.
- 🌍 **Location Sharing**: Share your current location with others.
- 📶 **Offline Functionality**: Cache messages locally and display them when offline.
- 🔄 **Real-time Synchronization**: Messages are synced with Firebase Firestore in real-time.
- 🗺️ **Map Integration**: View shared locations in the chat as a map.

## 🛠️ Technologies

- **React Native**
- **Expo**
- **Firebase (Firestore & Storage)**
- **Gifted Chat**
- **React Navigation**
- **Expo Image Picker**
- **Expo Location**

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or later)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g expo-cli`)
- **Firebase** project setup (you will need Firebase configuration details)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/chat-app.git
   cd chat-app
   ```

2. **Install dependencies:**

   If you're using npm:

   ```bash
   npm install
   ```

   Or if you're using yarn:

   ```bash
   yarn install
   ```

3. **Firebase Setup:**

   Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/). Add Firestore and Storage to your Firebase project. After that, add your Firebase configuration to a `firebaseConfig.js` file in the root of your project.

   Example `firebaseConfig.js` file:

   ```javascript
   // firebaseConfig.js

   import { initializeApp } from "firebase/app";
   import { getFirestore } from "firebase/firestore";
   import { getStorage } from "firebase/storage";

   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-auth-domain",
     projectId: "your-project-id",
     storageBucket: "your-storage-bucket",
     messagingSenderId: "your-messaging-sender-id",
     appId: "your-app-id"
   };

   const app = initializeApp(firebaseConfig);
   const db = getFirestore(app);
   const storage = getStorage(app);

   export { db, storage };
   ```

4. **Start the app:**

   Run the following command to start the app in development mode:

   ```bash
   npm start
   ```

   This will open the Expo developer tools in your browser. From there, you can run the app on an Android or iOS emulator, or scan the QR code with the Expo Go app on your mobile device.

## 📜 Firebase Rules

To ensure proper security and access control for Firestore and Storage, you may need to add Firebase rules. Here are some sample Firestore and Storage rules:

#### Firestore Rules:

```plaintext
service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{message} {
      allow read, write: if true;
    }
  }
}
```

#### Storage Rules:

```plaintext
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 📂 Project Structure

```bash
├── App.js                 # Main entry point
├── firebaseConfig.js       # Firebase setup (to be created)
├── components
│   ├── Chat.js             # Chat screen, handles messages, image upload, and location sharing
│   ├── CustomActions.js    # Custom actions for image and location sharing
│   ├── Start.js            # Start screen with user authentication
├── assets                  # Images and other static assets
├── package.json            # Project dependencies and scripts
└── README.md               # This file
```

## 💡 How to Use

1. **Start the app**: Launch the app on your mobile device or emulator.
2. **Sign in**: The app uses Firebase Authentication with anonymous sign-in by default.
3. **Start chatting**:
   - Type and send messages in the text field.
   - Use the **+** button to access the following features:
     - **Pick an image** from your gallery or take a new picture with the camera.
     - **Send your current location**, which will be displayed as a map bubble in the chat.
4. **View shared location**: If someone sends their location, you can tap the location bubble to see it on a map.

## 🔮 Future Improvements

- **User Authentication**: Add user authentication with email/password or third-party logins.
- **Push Notifications**: Implement push notifications for message alerts.
- **Profile Management**: Allow users to update their profiles, including usernames and avatars.

## 🛠️ Troubleshooting

- **Expo Go App Issues**: If you encounter issues running the app on your device using Expo Go, try restarting the Expo CLI server or clearing the cache with:
  ```bash
  expo start -c
  ```
  
- **Firebase Connection Issues**: Ensure your Firebase credentials in `firebaseConfig.js` are correct and your Firebase project is properly set up.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

### 📧 Contact

If you have any questions or issues, feel free to reach out or open an issue in the GitHub repository.

