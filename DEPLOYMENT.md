# Deployment & Hosting Guide

This guide covers how to deploy the Todo App to various hosting platforms.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Firebase Hosting](#firebase-hosting)
3. [Vercel Deployment](#vercel-deployment)
4. [Netlify Deployment](#netlify-deployment)
5. [Environment Variables](#environment-variables)

---

## Prerequisites

Before deploying, ensure you have built the production-ready version of the app:

```bash
npm run build
```

This generates a `dist` folder containing the static files for deployment.

---

## Firebase Hosting

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```
2. **Login and Initialize:**
   ```bash
   firebase login
   firebase init
   ```
   - Select `Hosting`.
   - Set public directory to `dist`.
   - Configure as a single-page app: `Yes`.
3. **Deploy:**
   ```bash
   firebase deploy
   ```

---

## Vercel Deployment

1. **GitHub Integration:**
   - Link your repository to a new project on [Vercel](https://vercel.com).
   - The included `vercel.json` ensures that all routes are correctly handled to prevent 404 errors on refresh.
2. **CLI Option:**
   ```bash
   npm i -g vercel
   vercel
   ```

---

## Netlify Deployment

1. **Routing Fix:**
   A `public/_redirects` file and `netlify.toml` are included to ensure smooth Single-Page App (SPA) routing and enhanced security headers.
2. **Manual Upload or GitHub:**
   - Connect your GitHub repo on [Netlify](https://netlify.com).
   - Set build command: `npm run build`.
   - Set publish directory: `dist`.

---

## Environment Variables

Ensure all platforms have the following environment variables set in their dashboards (copy from your `.env`):

| Variable                            | Description                          |
| :---------------------------------- | :----------------------------------- |
| `VITE_FIREBASE_API_KEY`             | Your Firebase API Key                |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Firebase Auth Domain                 |
| `VITE_FIREBASE_PROJECT_ID`          | Firebase Project ID                  |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Firebase Storage Bucket              |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID         |
| `VITE_FIREBASE_APP_ID`              | Firebase App ID                      |
| `VITE_FIREBASE_MEASUREMENT_ID`      | Firebase Measurement ID              |
| `VITE_FIREBASE_VAPID_KEY`           | Firebase VAPID Key for Notifications |

---

## Troubleshooting

- **404 on Refresh:** Ensure the "Single Page App" setting (or redirection rules like `_redirects`) is correctly applied.
- **Firebase Auth Errors:** Check if the deployment domain is added to the "Authorized Domains" list in the Firebase Console (Auth > Settings).
