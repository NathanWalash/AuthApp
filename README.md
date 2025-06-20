# AuthApp

A React Native Expo app demonstrating persistent email/password authentication with Firebase and storing user profiles in Cloud Firestore.

## Prerequisites

* Node.js (v14 or newer)
* npm or Yarn
* Expo CLI (local via `npx`)
* A Firebase account

## Getting Started

1. **Clone the repo**

   ```bash
   git clone <YOUR_REPO_URL>
   cd AuthApp
   ```

2. **Install dependencies**

   ```bash
   npm install
   # Install Expo native modules
   npx expo install expo-constants @react-native-async-storage/async-storage
   ```

3. **Create a Firebase project**

   1. Go to the [Firebase Console](https://console.firebase.google.com/) and click **Add project**.
   2. Follow the prompts to create a new project.
   3. In the Console sidebar, select **Authentication → Sign-in method**, and enable **Email/Password**.
   4. In the Console sidebar, select **Firestore Database**, then click **Create database**. Choose your region and start in **Production mode** (or **Test mode** for a 30-day trial).
   5. In **Firestore → Rules**, replace with:

      ```js
      service cloud.firestore {
        match /databases/{database}/documents {
          match /users/{userId} {
            allow create: if request.auth != null && request.auth.uid == userId;
            allow read, update, delete: if request.auth != null && request.auth.uid == userId;
          }
        }
      }
      ```

      Then click **Publish**.

4. **Register a Web App and copy config**

   1. In Firebase Console, go to **Project Settings → Your apps**, click **\</> Web**.
   2. Enter an app nickname (e.g. `AuthAppWeb`), then click **Register app**.
   3. Copy the generated configuration object.

5. **Create your `.env` file**

   In the project root, create a file named `.env` with the following contents, replacing the placeholders with your Firebase config values:

   ```env
   FIREBASE_API_KEY=your_api_key_here
   FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   FIREBASE_APP_ID=your_app_id
   ```

   Ensure `.env` is listed in `.gitignore` to avoid committing secrets.

6. **Run the app**

   ```bash
   npx expo start
   ```

   * Press `a` to open on Android emulator/device
   * Press `i` to open on iOS simulator
   * Press `w` to open in web browser

## Project Structure

```
AuthApp/
├── src/
│   ├── firebase/
│   │   └── config.ts       # Firebase initialization (auth + Firestore)
│   └── screens/
│       ├── LandingScreen.tsx
│       ├── LoginScreen.tsx
│       ├── SignupScreen.tsx
│       └── HomeScreen.tsx
├── App.tsx
├── app.config.js           # Expo config loading .env values
├── metro.config.js         # Metro bundler config for React Native
├── .env                    # Your Firebase credentials (ignored)
└── package.json
```

## Environment Variables

The app uses `expo-constants` to inject the following from `app.config.js`:

* `FIREBASE_API_KEY`
* `FIREBASE_AUTH_DOMAIN`
* `FIREBASE_PROJECT_ID`
* `FIREBASE_STORAGE_BUCKET`
* `FIREBASE_MESSAGING_SENDER_ID`
* `FIREBASE_APP_ID`

## Notes

* On native (iOS/Android), Firebase Auth state persists using AsyncStorage.
* On web, Auth state persists using `window.localStorage`.

## Troubleshooting

* If you see errors about missing `getReactNativePersistence`, clear Metro cache and restart:

  ```bash
  npx expo start -c
  ```
* If your Firestore reads/writes are denied, double-check your security rules and authentication state.

---

