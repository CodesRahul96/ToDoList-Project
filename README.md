# 📝 Modern React Todo App

<p align="center"><i>A fast, premium, and feature-rich Todo application built with React, Vite, and Firebase. Featuring real-time synchronization, biometric-like profile management, offline support (PWA), and a stunning glassmorphism UI.</i></p>

---

## 🚀 [Live Demo](https://react-cool-todo-app.netlify.app/)

[![Netlify Status](https://api.netlify.com/api/v1/badges/e3b07d34-f0da-4280-9076-fd40eea893c6/deploy-status)](https://app.netlify.com/sites/react-cool-todo-app/deploys)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/CodesRahul96/ToDoList-Project?color=%23b624ff)
![GitHub last commit](https://img.shields.io/github/last-commit/CodesRahul96/ToDoList-Project?color=%23b624ff)

---

## 💻 Tech Stack

- **Frontend:** [React.js](https://reactjs.org/) (v18+), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **UI Framework:** [Material UI (MUI)](https://mui.com/)
- **Styling:** [Emotion](https://emotion.sh/) (Styled Components)
- **Backend/Auth:** [Firebase](https://firebase.google.com/) (Authentication & Firestore)
- **PWA:** [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- **State Persistence:** [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) (via localForage)

---

## ⚡ Core Features

### 🔐 Modern Authentication

- Support for **Google** Sign-In.
- Secure Email/Password authentication.
- Automatic profile synchronization (Name & Profile Picture) from auth providers.

### 🔄 Real-time Cloud Sync

- Sync all your tasks, categories, and settings across devices via **Firebase Firestore**.
- Intelligent conflict resolution to ensure data integrity.
- Offline-first approach: edit tasks offline and they sync automatically when you're back online.

### 📱 Progressive Web App (PWA)

- Installable on iOS, Android, and Desktop.
- Full offline functionality.
- Custom splash screens and app badges for a native feel.
- Periodic background updates.

### 🎨 Premium UI/UX

- **Glassmorphism Design:** Modern, sleek interface with blur effects and vibrant gradients.
- **Dynamic Themes:** Multiple color palettes and a fully responsive Dark Mode.
- **Micro-animations:** Smooth transitions and hover effects for a premium feel.

### 🤖 Smart Features

- **AI Emoji Suggestions:** On-device AI (Gemini Nano) for smart task category suggestions.
- **Task Sharing:** Share tasks via unique links or QR codes.
- **Voice Support:** Tasks can be read aloud using the native Speech Synthesis API.

---

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/CodesRahul96/ToDoList-Project.git
cd ToDoList-Project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory and add your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Run the development server

```bash
npm run dev
```

---

## 🚀 Deployment

The app is pre-configured for seamless deployment to multiple platforms:

- **Firebase Hosting:** [Hosting Guide](DEPLOYMENT.md#firebase-hosting)
- **Vercel:** Optimized via `vercel.json` ([Setup](DEPLOYMENT.md#vercel-deployment))
- **Netlify:** Pre-configured with `netlify.toml` and `_redirects` ([Setup](DEPLOYMENT.md#netlify-deployment))

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

---

## 📷 Screenshots

<p align="center">
  <img src="https://github.com/CodesRahul96/ToDoList-Project/blob/main/screenshots/mobile_todolist.png" width="250px" />
  <img src="https://github.com/CodesRahul96/ToDoList-Project/blob/main/screenshots/mobile_todolist1.png" width="250px" />
  <img src="https://github.com/CodesRahul96/ToDoList-Project/blob/main/screenshots/desktop_todolist.png" width="500px" />
  <img src="https://github.com/CodesRahul96/ToDoList-Project/blob/main/screenshots/desktop_todolist2.png" width="500px" />
</p>

---

## 📄 License

Made with ❤️ by [CodesRahul96](https://github.com/CodesRahul96).  
Licensed under the [MIT License](LICENSE).
