# Masembe Group — Codebase Fix Specification
> **For Gemini CLI execution. Apply every fix in the order listed. Do not skip items. Do not modify files not listed here unless a fix explicitly requires a new file.**

---

## LEGEND
- **FILE**: Exact file path to modify or create
- **ERROR**: What is wrong and where
- **EFFECT**: What breaks or risks occurring if left unfixed
- **FIX**: Exact implementation instructions with code

---

## FIX-001 — Remove `fix1.txt` from Repository

**FILE:** `fix1.txt` (root)

**ERROR:**
A plain-text internal prompt file called `fix1.txt` exists in the repository root. It was accidentally committed by Gemini CLI during a prior session. It contains internal AI instructions and should never have been pushed to version control.

**EFFECT:**
- Exposes internal development workflow notes publicly if the repo is public
- Pollutes the repository root with a non-project file
- Confuses any contributor or automated tool scanning the repo

**FIX:**

Step 1 — Delete the file:
```bash
rm fix1.txt
```

Step 2 — Add to `.gitignore` to prevent future accidental commits:
```
# In .gitignore, add at the bottom:
fix*.txt
*.prompt.txt
```

Step 3 — If the repo is public, purge from git history:
```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch fix1.txt" \
  --prune-empty --tag-name-filter cat -- --all
git push origin --force --all
```

---

## FIX-002 — Firebase Config: Move Hardcoded Keys to Environment Variables

**FILE:** `src/lib/firebase.ts`

**ERROR:**
The Firebase configuration object has all secrets hardcoded directly in source code:
```ts
const firebaseConfig = {
  apiKey: "AIzaSyDzMQtejKfKhOeX_30hEWOLcjTBWfIPvEE",
  authDomain: "naseeb-b4377.firebaseapp.com",
  projectId: "naseeb-b4377",
  storageBucket: "naseeb-b4377.firebasestorage.app",
  messagingSenderId: "268013548985",
  appId: "1:268013548985:web:2fcea1ae7777d7a4aeb268",
  measurementId: "G-XXKKG5FNNM"
};
```
`.env.example` already defines these as `VITE_FIREBASE_*` variables but they are never consumed.

**EFFECT:**
- Real API keys are committed to git history and visible to anyone with repo access
- If the repo is or becomes public, these keys can be scraped within minutes by bots
- Malicious actors can use the keys to read/write your Firestore, exhaust your Firebase quota, or rack up billing charges
- Google's automated secret scanner may flag and revoke the keys without warning

**FIX:**

Step 1 — Replace `src/lib/firebase.ts` entirely:
```ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const auth = getAuth(app);
```

Step 2 — Create a `.env.local` file in the repo root (this file must NEVER be committed):
```env
VITE_FIREBASE_API_KEY=AIzaSyDzMQtejKfKhOeX_30hEWOLcjTBWfIPvEE
VITE_FIREBASE_AUTH_DOMAIN=naseeb-b4377.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=naseeb-b4377
VITE_FIREBASE_STORAGE_BUCKET=naseeb-b4377.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=268013548985
VITE_FIREBASE_APP_ID=1:268013548985:web:2fcea1ae7777d7a4aeb268
VITE_FIREBASE_MEASUREMENT_ID=G-XXKKG5FNNM
VITE_FIREBASE_DATABASE_URL=https://naseeb-b4377-default-rtdb.firebaseio.com
```

Step 3 — Verify `.gitignore` already contains `.env*`. It does per the existing file, but confirm `.env.local` is covered.

Step 4 — Update `.env.example` to add the missing `databaseURL` field:
```env
VITE_FIREBASE_DATABASE_URL="YOUR_FIREBASE_DATABASE_URL"
```

Step 5 — Set these same environment variables in Vercel:
Go to Vercel Dashboard → Project → Settings → Environment Variables and add every `VITE_FIREBASE_*` key with its real value.

Step 6 — Rotate the exposed API key in the Firebase Console immediately:
Firebase Console → Project Settings → General → Web API Key → Regenerate

---

## FIX-003 — Firebase Realtime Database: Missing `databaseURL`

**FILE:** `src/lib/firebase.ts` (addressed in FIX-002 above, but the underlying issue is separate)

**ERROR:**
`getDatabase(app)` is called without a `databaseURL` in the config. Firebase Realtime Database (RTDB) requires an explicit database URL. Without it, the SDK attempts to auto-derive it from the project ID, which fails silently or connects to the wrong endpoint depending on the Firebase region.

**EFFECT:**
- `useRealtimeDB` hook silently returns empty data and/or fails to write inquiries
- `submitInquiry()` calls in all four forms appear to succeed but data is never stored
- Admin panel shows no inquiries even when users have submitted them
- Errors appear in browser console but are swallowed by the catch block, giving no user feedback

**FIX:**

The database URL for a Firebase project in the default `us-central1` region follows this pattern:
```
https://<PROJECT_ID>-default-rtdb.firebaseio.com
```

For this project:
```
https://naseeb-b4377-default-rtdb.firebaseio.com
```

Confirm the URL in Firebase Console → Realtime Database → Data tab (the URL shown at the top of the data tree is the correct one).

Add it to the config as shown in FIX-002. The key line is:
```ts
databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
```

---

## FIX-004 — Firebase Realtime Database Security Rules

**FILE:** Firebase Console → Realtime Database → Rules (not a code file — must be set in the console or via Firebase CLI)

**ERROR:**
No RTDB security rules are shown in the codebase. The default rules when a new RTDB is created are either fully open (`".read": true, ".write": true`) or fully locked (`".read": false, ".write": false`). Neither is correct for this use case.

**EFFECT:**
- If fully open: Anyone on the internet can read all submitted inquiry data (names, emails, phone numbers) and write unlimited garbage data
- If fully locked: Inquiry form submissions fail silently; the admin panel cannot read any data
- Either state is a GDPR/data-protection risk for your users

**FIX:**

In the Firebase Console → Realtime Database → Rules tab, replace the existing rules with:

```json
{
  "rules": {
    "inquiries": {
      ".read": "auth != null",
      ".write": true,
      "$inquiryId": {
        ".validate": "newData.hasChildren(['firstName', 'lastName', 'email', 'message', 'createdAt', 'status']) && newData.child('email').isString() && newData.child('email').val().length > 5 && newData.child('firstName').isString() && newData.child('firstName').val().length > 0 && newData.child('message').isString() && newData.child('message').val().length >= 5"
      }
    }
  }
}
```

If using Firebase CLI, create `database.rules.json` in the project root:
```json
{
  "rules": {
    "inquiries": {
      ".read": "auth != null",
      ".write": true,
      "$inquiryId": {
        ".validate": "newData.hasChildren(['firstName', 'lastName', 'email', 'message', 'createdAt', 'status']) && newData.child('email').isString() && newData.child('email').val().length > 5 && newData.child('firstName').isString() && newData.child('firstName').val().length > 0 && newData.child('message').isString() && newData.child('message').val().length >= 5"
      }
    }
  }
}
```

Then add to `firebase.json` (create if it doesn't exist):
```json
{
  "database": {
    "rules": "database.rules.json"
  }
}
```

Deploy with:
```bash
firebase deploy --only database
```

---

## FIX-005 — No 404 / Not Found Route

**FILE:** `src/App.tsx`

**ERROR:**
The `<Routes>` block has no catch-all `<Route path="*">`. `vercel.json` correctly rewrites all paths to `index.html` for the SPA, but unmatched routes render a completely blank page with no content, no error message, and no way back.

**EFFECT:**
- Users who mistype a URL, follow a broken link, or get redirected incorrectly see a completely empty white/black page
- No navigation back to the site
- Search engines that crawl broken links receive a 200 status with empty body instead of a proper 404 signal, hurting SEO

**FIX:**

Step 1 — Create `src/pages/NotFoundPage.tsx`:
```tsx
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-xs font-black tracking-[0.6em] uppercase text-white/30 mb-6">
          Error 404
        </p>
        <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-8">
          Lost?
        </h1>
        <p className="text-white/50 text-lg mb-16 max-w-md leading-relaxed">
          This page doesn't exist. Head back to find what you're looking for.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-10 py-4 bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-[#d4af37] transition-colors"
          >
            Home
          </Link>
          <Link
            to="/cars"
            className="px-10 py-4 border border-white/20 text-xs font-black uppercase tracking-widest hover:border-white transition-colors"
          >
            Grid Motors
          </Link>
          <Link
            to="/property"
            className="px-10 py-4 border border-white/20 text-xs font-black uppercase tracking-widest hover:border-white transition-colors"
          >
            Real Estate
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
```

Step 2 — Add the catch-all route in `src/App.tsx` inside `<AnimatedRoutes>`, as the very last `<Route>`:
```tsx
import NotFoundPage from './pages/NotFoundPage';

// Inside the Routes block, add as the final route:
<Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
```

---

## FIX-006 — Admin Route Has No Auth Guard (Flash of Admin UI)

**FILE:** `src/App.tsx` and `src/pages/AdminPage.tsx`

**ERROR:**
The `/admin` route renders `AdminPage` directly. Inside `AdminPage`, auth state is checked via `onAuthStateChanged`, but this is async — there is a window between render and auth resolution where `authLoading` is `true` and a spinner shows. If the auth check fails, the login screen appears. However, the route itself is public and there is no redirect away from `/admin` for unauthenticated users at the router level.

**EFFECT:**
- The admin URL is discoverable and accessible to anyone — no obscurity
- Login screen is visible to all users, revealing that an admin panel exists
- A slow or failed Firebase auth call means the spinner or partial UI is visible
- Future route guards (if someone adds protected sub-routes) would need to be retrofitted

**FIX:**

Step 1 — Create `src/components/ProtectedRoute.tsx`:
```tsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
```

Step 2 — Update the admin route in `src/App.tsx`:
```tsx
import ProtectedRoute from './components/ProtectedRoute';

// Replace the existing admin route:
// BEFORE:
<Route path="/admin" element={<PageTransition><AdminPage /></PageTransition>} />

// AFTER:
<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <PageTransition><AdminPage /></PageTransition>
    </ProtectedRoute>
  }
/>
```

Note: The `AdminPage` component already contains its own auth logic for the login screen. The `ProtectedRoute` wrapping adds router-level protection. Keep both — `ProtectedRoute` guards the route, `AdminPage`'s internal auth handles the login UI flow and Google sign-in trigger.

---

## FIX-007 — No Error Boundaries (Entire App Can White-Screen)

**FILE:** New file `src/components/ErrorBoundary.tsx`, and `src/main.tsx`, and `src/App.tsx`

**ERROR:**
There are no React Error Boundaries anywhere in the component tree. The app uses Three.js (`@react-three/fiber`, `@react-three/drei`), Firebase SDK, Lenis, GSAP, and Swiper. Any unhandled JavaScript error in any of these — a null reference, a failed network call, a bad Three.js WebGL context — will crash the entire React tree and show a blank white screen.

**EFFECT:**
- A single error in one component (e.g., a bad car image path in Three.js) kills the entire page for the user
- No error message, no recovery path, no way for the user to navigate away
- Errors are invisible to you unless you have console access or an error monitoring service
- On mobile where console is inaccessible, you have no way to diagnose what went wrong

**FIX:**

Step 1 — Create `src/components/ErrorBoundary.tsx`:
```tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
    // Wire up your error monitoring service here if/when you add one (e.g. Sentry)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
          <p className="text-xs font-black tracking-[0.6em] uppercase text-white/30 mb-6">
            Something went wrong
          </p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-8">
            An error occurred
          </h1>
          <p className="text-white/50 text-sm mb-12 max-w-md font-mono">
            {this.state.error?.message || 'Unknown error'}
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-8 py-3 bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-[#d4af37] transition-colors"
            >
              Try Again
            </button>
            <Link
              to="/"
              className="px-8 py-3 border border-white/20 text-xs font-black uppercase tracking-widest hover:border-white transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

Step 2 — Wrap the app root in `src/main.tsx`:
```tsx
import ErrorBoundary from './components/ErrorBoundary';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
);
```

Step 3 — Wrap the main content area in `src/App.tsx` inside `AppContent`:
```tsx
import ErrorBoundary from './components/ErrorBoundary';

// In the AppContent return, wrap the main routes:
<ErrorBoundary>
  <ScrollToTop lenisRef={lenisRef} />
  <GlobalHeader />
  <div className="min-h-screen flex flex-col">
    <main className="flex-grow flex flex-col">
      <AnimatedRoutes />
    </main>
    <Footer />
  </div>
  <WhatsAppCTA />
</ErrorBoundary>
```

---

## FIX-008 — `robots.txt` Missing from `public/`

**FILE:** Create `public/robots.txt`

**ERROR:**
No `robots.txt` exists. The `SEO.tsx` component sets `<meta name="robots" content="index, follow">` per page, but without a `robots.txt`, crawlers have no sitemap reference and no explicit rules for which paths to avoid. The `/admin` route will be crawled and may be indexed.

**EFFECT:**
- Search engines crawl `/admin` and may index the admin login screen
- No sitemap reference means crawlers must discover pages through link traversal, which is slower and less complete
- Google Search Console will report a missing `robots.txt` as a configuration warning

**FIX:**

Create `public/robots.txt`:
```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/

Sitemap: https://masembe.vercel.app/sitemap.xml
```

---

## FIX-009 — `sitemap.xml` Missing from `public/`

**FILE:** Create `public/sitemap.xml`

**ERROR:**
No sitemap exists. The `SEO.tsx` component provides per-page metadata but there is no document listing all indexable URLs for search engine crawlers.

**EFFECT:**
- Search engines must discover pages by crawling links, meaning new or deeply nested pages may not be indexed for weeks
- No priority or change-frequency hints, so Google cannot intelligently allocate crawl budget
- Reduces overall search visibility for both Grid Motors and Masembe Real Estate

**FIX:**

Create `public/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- Homepage -->
  <url>
    <loc>https://masembe.vercel.app/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Grid Motors -->
  <url>
    <loc>https://masembe.vercel.app/cars</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://masembe.vercel.app/cars/showroom</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://masembe.vercel.app/cars/inventory</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://masembe.vercel.app/cars/workshop</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://masembe.vercel.app/cars/import</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

  <!-- Real Estate -->
  <url>
    <loc>https://masembe.vercel.app/property</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://masembe.vercel.app/property/showroom</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://masembe.vercel.app/property/portfolio</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://masembe.vercel.app/property/projects</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- General -->
  <url>
    <loc>https://masembe.vercel.app/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://masembe.vercel.app/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

</urlset>
```

Note: Individual `/cars/inventory/:id` and `/property/portfolio/:id` URLs are excluded because they are dynamically rendered from static data. If the inventory grows significantly, consider generating the sitemap at build time using a Vite plugin or a Node script that reads `src/data/cars.ts`.

---

## FIX-010 — OptimizedImage Has No Error / Broken Image Handling

**FILE:** `src/components/OptimizedImage.tsx`

**ERROR:**
The component shows a shimmer placeholder while the image loads and transitions to full opacity on load. However, there is no `onError` handler. If the image path is wrong or the asset doesn't exist (very likely given 25+ cars each with 10+ manually typed asset paths), the img element shows nothing — the shimmer disappears but the image slot is empty and invisible.

**EFFECT:**
- Broken car images show blank spaces in the inventory grid, lookbook, and showroom with no indication to the user
- Gallery modals may appear completely empty with no message
- Admin images in the inventory tab silently fail with no feedback
- Debugging is difficult because there is no visual cue that anything went wrong

**FIX:**

Replace `src/components/OptimizedImage.tsx` entirely:
```tsx
import React, { useState } from 'react';
import { cn } from '../lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  priority?: boolean;
  aspectRatio?: 'auto' | 'square' | 'video' | 'portrait' | 'wide' | 'property' | 'car';
  fallbackText?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  priority = false,
  aspectRatio = 'auto',
  fallbackText,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const aspectRatioClasses = {
    auto: '',
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    wide: 'aspect-[21/9]',
    property: 'aspect-[4/5]',
    car: 'aspect-[16/10]',
  };

  if (hasError) {
    return (
      <div className={cn(
        'relative overflow-hidden bg-black/10 flex flex-col items-center justify-center gap-2',
        aspectRatioClasses[aspectRatio],
        className
      )}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-20"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        {fallbackText && (
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">
            {fallbackText}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      'relative overflow-hidden bg-black/5',
      aspectRatioClasses[aspectRatio],
      className
    )}>
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-black/5 via-black/10 to-black/5" />
      )}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        // @ts-ignore
        fetchpriority={priority ? 'high' : 'auto'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-500',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
```

---

## FIX-011 — Inquiry Forms Have No Rate Limiting or Spam Protection

**FILE:** `src/hooks/useRealtimeDB.ts`, `src/pages/ZeroPage.tsx`, `src/pages/ContactPage.tsx`, `src/components/CarModalContent.tsx`, `src/components/PropertyModalContent.tsx`

**ERROR:**
All four inquiry entry points call `submitInquiry()` which directly calls `push()` on Firebase RTDB with no rate limiting, no debouncing, no honeypot, and no submission cooldown. A single user can submit hundreds of entries per second.

**EFFECT:**
- Spam campaigns or bots can flood the admin panel with thousands of fake inquiries, making it unusable
- Firebase RTDB free tier has 1GB storage and 10GB/month transfer — a spam attack can exhaust both
- Real customer inquiries are buried under spam
- Firebase may temporarily suspend the database for excessive writes

**FIX:**

Step 1 — Add a client-side submission cooldown utility. Create `src/lib/rateLimiter.ts`:
```ts
const submissionLog: Record<string, number> = {};

/**
 * Returns true if the action is allowed, false if it is rate limited.
 * @param key - A unique identifier for the action (e.g. 'inquiry-submit')
 * @param cooldownMs - Minimum milliseconds between allowed submissions (default 60000 = 1 min)
 */
export function isAllowed(key: string, cooldownMs = 60000): boolean {
  const now = Date.now();
  const last = submissionLog[key];
  if (last && now - last < cooldownMs) {
    return false;
  }
  submissionLog[key] = now;
  return true;
}
```

Step 2 — Update `src/hooks/useRealtimeDB.ts` to use the rate limiter in `submitInquiry`:
```ts
import { isAllowed } from '../lib/rateLimiter';

export async function submitInquiry(data: any) {
  if (!isAllowed('inquiry-submit', 60000)) {
    throw new Error('Please wait at least 1 minute before submitting another inquiry.');
  }

  const inquiriesRef = ref(rtdb, 'inquiries');
  const newInquiryRef = push(inquiriesRef);
  const inquiryData = {
    ...data,
    id: newInquiryRef.key,
    createdAt: new Date().toISOString(),
    status: 'new'
  };
  await set(newInquiryRef, inquiryData);
  return newInquiryRef.key;
}
```

Step 3 — Add a honeypot field to `src/pages/ContactPage.tsx` form. Add this hidden input inside the `<form>` element, and check it on submit:
```tsx
{/* Honeypot — hidden from real users, bots fill it in */}
<input
  type="text"
  name="website"
  autoComplete="off"
  tabIndex={-1}
  style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0 }}
  aria-hidden="true"
/>
```

In the `handleSubmit` function of `ContactPage.tsx`, add this check at the very top:
```ts
const honeypot = (e.currentTarget.elements.namedItem('website') as HTMLInputElement)?.value;
if (honeypot) {
  // Bot filled in the hidden field — silently reject
  setSubmitSuccess(true);
  return;
}
```

Apply the same honeypot pattern to `ZeroPage.tsx` inquiry form, `CarModalContent.tsx`, and `PropertyModalContent.tsx`.

---

## FIX-012 — Dead Bundle Weight: Three.js Packages Imported but Unused in Pages

**FILE:** `package.json`, any page that was intended to use `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`

**ERROR:**
`package.json` lists `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, and `three` as full dependencies. Scanning all source files in `src/`, none of the visible page or component files import from these packages in the current build. They exist in `dependencies` (not `devDependencies`), so they are bundled into the production build.

**EFFECT:**
- `three` alone is ~600KB minified; `@react-three/drei` adds another ~300KB; `postprocessing` adds ~200KB
- Total dead weight: approximately 1.1MB+ added to the initial JavaScript bundle
- Directly increases Time to Interactive (TTI) and Largest Contentful Paint (LCP), hurting both user experience and Google PageSpeed scores
- Vercel's serverless function limit and CDN bandwidth costs are increased unnecessarily

**FIX:**

Step 1 — Audit imports across all `src/` files to confirm none use Three.js:
```bash
grep -r "from '@react-three" src/
grep -r "from 'three'" src/
```

Step 2 — If the grep returns nothing, remove the packages:
```bash
npm uninstall three @react-three/fiber @react-three/drei @react-three/postprocessing @types/three
```

Step 3 — If any file does import from these packages and was missed in the spec review, do NOT remove them. Instead, ensure the import is inside a lazy-loaded route using `React.lazy()` and `Suspense` so the Three.js bundle is only loaded when that specific page is visited.

Step 4 — Rebuild and verify bundle size reduction:
```bash
npm run build
# Check the dist/ output for chunk sizes
```

---

## FIX-013 — Firebase Analytics Initialized in Config but `getAnalytics()` Never Called

**FILE:** `src/lib/firebase.ts`

**ERROR:**
The Firebase config includes `measurementId: "G-XXKKG5FNNM"` but `getAnalytics()` is never imported or called. Firebase Analytics is only activated when explicitly initialized. As a result, zero analytics data is being collected despite the measurement ID being configured.

**EFFECT:**
- You have no data on which pages users visit most
- You cannot see which car listings get the most views
- You cannot track inquiry form conversion rates
- You cannot see where users drop off in the scroll journey on ZeroPage
- The `measurementId` sitting unused in the config is misleading

**FIX:**

Update `src/lib/firebase.ts` to initialize Analytics (conditionally, since Analytics does not work in non-browser environments):
```ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const auth = getAuth(app);

// Initialize Analytics only in browser environments where it is supported
isSupported().then((supported) => {
  if (supported) {
    getAnalytics(app);
  }
});
```

---

## FIX-014 — Admin Panel: Inquiry Phone Field Stored Without Validation

**FILE:** `src/pages/ContactPage.tsx`

**ERROR:**
The contact form validates `name`, `email`, and `message` fields but the `phone` field has `type="tel"` with zero validation. Any string — including SQL injection attempts, script tags, or garbage text — is stored directly in Firebase and then rendered in the admin panel without sanitization.

**EFFECT:**
- Admin panel displays raw unvalidated user input, which could include malformed data
- If Firebase data is ever rendered as `innerHTML` anywhere, stored XSS is possible
- The admin panel's formatted phone display (`<a href="tel:...">`) can break or misbehave with malformed input

**FIX:**

In `src/pages/ContactPage.tsx`, add phone validation to the `validateField` function:
```ts
const validateField = (name: string, value: string) => {
  let error = '';
  if (name === 'name') {
    if (!value.trim()) error = 'Name is required';
    else if (value.trim().length < 2) error = 'Name must be at least 2 characters';
  } else if (name === 'email') {
    if (!value.trim()) error = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email address';
  } else if (name === 'message') {
    if (!value.trim()) error = 'Message is required';
    else if (value.trim().length < 10) error = 'Message must be at least 10 characters';
  } else if (name === 'phone') {
    // Phone is optional but if provided must be a plausible phone number
    if (value.trim() && !/^[+\d\s\-().]{7,20}$/.test(value.trim())) {
      error = 'Please enter a valid phone number';
    }
  }
  return error;
};
```

Add `phone` to the form state and touched state:
```ts
const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
const [errors, setErrors] = useState({ name: '', email: '', phone: '', message: '' });
const [touched, setTouched] = useState({ name: false, email: false, phone: false, message: false });
```

Add the error display below the phone input field:
```tsx
{errors.phone && touched.phone && (
  <p className="text-red-500 text-xs mt-2">{errors.phone}</p>
)}
```

---

## FIX-015 — Vercel Missing Cache-Control Headers for Static Assets

**FILE:** `vercel.json`

**ERROR:**
`vercel.json` only contains SPA rewrite rules. There are no `headers` configured for static assets. Vercel's default cache policy for assets served from `public/` is short (typically seconds to minutes), meaning every page visit re-fetches images, fonts, and JavaScript bundles.

**EFFECT:**
- Users on repeat visits re-download multi-megabyte car image assets and JS bundles unnecessarily
- Slower page loads on return visits
- Higher Vercel bandwidth usage and potential cost increase
- PageSpeed and Core Web Vitals scores penalised for missing cache headers

**FIX:**

Replace `vercel.json` entirely:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*).js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*).css",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/robots.txt",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=86400"
        }
      ]
    },
    {
      "source": "/sitemap.xml",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=86400"
        }
      ]
    }
  ]
}
```

---

## FIX-016 — OG / Social Sharing Tags Do Not Work for SPA (CSR Limitation)

**FILE:** `index.html`

**ERROR:**
`SEO.tsx` uses `react-helmet-async` to inject per-page OG tags. However, this is a pure Client-Side Rendered (CSR) React app. Social media crawlers (Facebook, Twitter/X, LinkedIn, WhatsApp link previews) do not execute JavaScript — they read raw HTML. When a user shares a car listing URL, the crawler sees only the default tags in `index.html`, not the car-specific tags set by `SEO.tsx`.

**EFFECT:**
- Every shared URL — regardless of which page — shows the same generic title, description, and image
- WhatsApp link previews for inventory pages show "Masembe Group Of Companies" with no car-specific info
- Facebook/Instagram link shares show no image or the wrong image
- Reduces click-through rate from social sharing, which is a key referral channel for a luxury brand

**FIX (Pragmatic — No SSR Required):**

Since moving to SSR (Next.js) is a large architectural change, the best interim fix is to set strong, accurate defaults in `index.html` that represent the brand well when the specific-page tags are not available, and to document the limitation.

Update `index.html` with richer default tags:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/jpeg" href="/assets/new_re/LOGO.jpg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Primary Meta -->
    <title>Masembe Group Of Companies</title>
    <meta name="description" content="Uganda's premier integrated platform for luxury real estate development and high-performance automotive dealership. Grid Motors Kla & Masembe Real Estate — Kampala." />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://masembe.vercel.app/" />

    <!-- Open Graph -->
    <meta property="og:site_name" content="Masembe Group Of Companies" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://masembe.vercel.app/" />
    <meta property="og:title" content="Masembe Group — Real Estate & Grid Motors Kla" />
    <meta property="og:description" content="Uganda's premier luxury real estate developer and high-performance automotive dealership in Kampala." />
    <meta property="og:image" content="https://masembe.vercel.app/assets/new_re/MASEMBE-RE_logo.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="en_UG" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Masembe Group — Real Estate & Grid Motors Kla" />
    <meta name="twitter:description" content="Uganda's premier luxury real estate developer and high-performance automotive dealership in Kampala." />
    <meta name="twitter:image" content="https://masembe.vercel.app/assets/new_re/MASEMBE-RE_logo.jpg" />

    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Masembe Group Of Companies",
      "url": "https://masembe.vercel.app",
      "logo": "https://masembe.vercel.app/assets/new_re/MASEMBE-RE_logo.jpg",
      "description": "Luxury real estate development and automotive dealership in Kampala, Uganda.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Plot 30 Jinja Road, Conrad House",
        "addressLocality": "Kampala",
        "addressCountry": "UG"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+256750508658",
        "contactType": "customer service",
        "email": "naseebmasembe10@gmail.com"
      },
      "sameAs": [
        "https://www.instagram.com/masembe.naseeb/",
        "https://www.instagram.com/gridmotors.kla/",
        "https://www.tiktok.com/@masembe.naseeb"
      ]
    }
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

The `og:image` path must point to an actual image file in `public/`. Confirm the logo file is at `public/assets/new_re/MASEMBE-RE_logo.jpg`. If not, update the path to whichever logo file exists.

---

## FIX-017 — Loading Skeleton Missing on Car and Property Detail Pages

**FILE:** `src/pages/cars/CarDetailPage.tsx`, `src/pages/property/PropertyDetailPage.tsx`

**ERROR:**
Both detail pages use `useFirestoreDoc` to check if a Firestore override exists for the item. While that check is in flight, the page renders the static fallback data immediately. If Firestore then returns a different version, the content visibly shifts (title, price, images all change after initial render).

**EFFECT:**
- Jarring content shift after page load (high Cumulative Layout Shift / CLS score)
- Hurts Core Web Vitals
- Creates a confusing experience where users may interact with stale static content before the real data loads

**FIX:**

In `src/pages/cars/CarDetailPage.tsx`, add a loading check:
```tsx
const { data: firestoreCar, loading } = useFirestoreDoc<Car>('cars', id || '');

// Show a minimal skeleton while Firestore resolves
if (loading) {
  return (
    <div className="min-h-screen bg-auto-bg text-auto-text pt-24 flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-8 w-full max-w-4xl px-6">
        <div className="w-full h-[40vh] bg-black/10 rounded-2xl" />
        <div className="w-3/4 h-8 bg-black/10 rounded" />
        <div className="w-1/2 h-6 bg-black/10 rounded" />
      </div>
    </div>
  );
}

const car = firestoreCar || staticCars.find(c => c.id === id) || staticCars[0];
```

Apply the same pattern to `src/pages/property/PropertyDetailPage.tsx`:
```tsx
const { data: firestoreProperty, loading } = useFirestoreDoc<Property>('properties', id || '');

if (loading) {
  return (
    <div className="min-h-screen bg-re-bg text-re-text pt-24 flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-8 w-full max-w-4xl px-6">
        <div className="w-full h-[40vh] bg-white/10 rounded-2xl" />
        <div className="w-3/4 h-8 bg-white/10 rounded" />
        <div className="w-1/2 h-6 bg-white/10 rounded" />
      </div>
    </div>
  );
}

const property = firestoreProperty || properties.find(p => p.id === id) || properties[0];
```

Note: `useFirestoreDoc` in `src/hooks/useFirestore.ts` must return `loading` as part of its return object — verify it does (it does, per the current code).

---

## FIX-018 — WhatsApp CTA Does Not Open the App on Desktop

**FILE:** `src/components/WhatsAppCTA.tsx`

**ERROR:**
The WhatsApp link uses `https://wa.me/256750508658?text=...`. On mobile, this deep-links into the WhatsApp app. On desktop, it opens `web.whatsapp.com` which requires the user to be logged in — a friction point that reduces conversions. There is no device detection.

**EFFECT:**
- Desktop users (including potential high-value real estate buyers) face an extra login step or see an unfamiliar WhatsApp Web interface
- Reduces contact conversion rate from desktop visitors
- The WhatsApp Web URL format is different from the deep-link format

**FIX:**

Update `src/components/WhatsAppCTA.tsx`:
```tsx
import { MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

function getWhatsAppUrl(message: string): string {
  const encodedMessage = encodeURIComponent(message);
  const phone = '256750508658';
  
  // Detect mobile via user agent for the deep link vs web decision
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  if (isMobile) {
    // Deep link opens the WhatsApp app directly on mobile
    return `whatsapp://send?phone=${phone}&text=${encodedMessage}`;
  }
  // WhatsApp Web for desktop — no login required if the universal link is used
  return `https://web.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`;
}

export default function WhatsAppCTA() {
  const location = useLocation();
  const isAuto = location.pathname.startsWith('/cars');
  const isHome = location.pathname === '/';

  if (isHome) return null;

  const message = isAuto
    ? "Hi Grid Motors, I'm interested in your luxury fleet."
    : "Hi Masembe Group, I'm interested in your real estate portfolio.";

  return (
    <motion.a
      href={getWhatsAppUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring' }}
      className={cn(
        "fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110",
        isAuto ? "bg-auto-accent text-white" : "bg-re-accent text-black"
      )}
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute inset-0 rounded-full opacity-50"
        style={{ backgroundColor: isAuto ? '#dc2626' : '#d4af37' }}
      />
      <MessageCircle size={28} className="relative z-10" />
    </motion.a>
  );
}
```

---

## FIX-019 — No `.gitignore` Entry for Gemini CLI Artifacts

**FILE:** `.gitignore`

**ERROR:**
Gemini CLI generates temporary files and session artifacts (such as `fix1.txt`) that can be accidentally staged and committed. There are no entries in `.gitignore` to prevent this.

**EFFECT:**
- Prompt files, session logs, and temporary AI-generated files get committed to the repo (as happened with `fix1.txt`)
- Future Gemini CLI sessions may push more internal files
- Repository history becomes polluted with non-project files

**FIX:**

Add these entries to the bottom of `.gitignore`:
```
# Gemini CLI / AI Agent artifacts
fix*.txt
*.prompt.txt
.gemini/
gemini-output/
agent-session/
GEMINI_*.md
CLAUDE_*.md

# General temporary files
*.tmp
*.bak
*.swp
```

---

## FIX-020 — `useFirestoreCollection` Has No Query Limit (Unbounded Reads)

**FILE:** `src/hooks/useFirestore.ts`

**ERROR:**
`useFirestoreCollection` calls `query(collection(db, collectionName), ...queryConstraints)` with no default `limit()` constraint. Every call fetches the entire collection. Currently this affects `cars`, `properties`, and `content` collections.

**EFFECT:**
- As the cars collection grows (currently 24 static + any Firestore additions), every page load reads the entire collection
- Firebase Firestore free tier allows 50,000 reads/day — an inventory page with 100 cars visited by 500 users/day = 50,000 reads from that one component alone
- No pagination UI means there is no way to load more gradually
- Memory usage in the browser grows linearly with collection size

**FIX:**

Update `src/hooks/useFirestore.ts` to add a default limit:
```ts
import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  query,
  doc,
  limit as firestoreLimit
} from 'firebase/firestore';
import type {
  DocumentData,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useFirestoreCollection<T = DocumentData>(
  collectionName: string,
  queryConstraints: QueryConstraint[] = [],
  maxResults: number = 100  // Default cap — override per use case
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const q = query(
        collection(db, collectionName),
        ...queryConstraints,
        firestoreLimit(maxResults)
      );

      const unsubscribe = onSnapshot(q,
        (snapshot) => {
          const items: T[] = [];
          snapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as T);
          });
          setData(items);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error(`Error fetching collection ${collectionName}:`, err);
          setError(err as Error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error(`Error setting up query for ${collectionName}:`, err);
      setTimeout(() => {
        setError(err as Error);
        setLoading(false);
      }, 0);
    }
  }, [collectionName, maxResults]);

  return { data, loading, error };
}

// useFirestoreDoc remains unchanged
export function useFirestoreDoc<T = DocumentData>(
  collectionName: string,
  docId: string
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!docId) {
      setTimeout(() => setLoading(false), 0);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, collectionName, docId),
      (docSnap) => {
        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error(`Error fetching document ${collectionName}/${docId}:`, err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, docId]);

  return { data, loading, error };
}
```

---

## EXECUTION ORDER FOR GEMINI CLI

Apply fixes in this exact sequence to avoid dependency conflicts:

```
1.  FIX-001  — Delete fix1.txt, update .gitignore
2.  FIX-019  — Add full .gitignore AI artifact entries
3.  FIX-002  — Move Firebase keys to env vars (creates .env.local)
4.  FIX-003  — Add databaseURL (resolved via FIX-002)
5.  FIX-004  — Set RTDB security rules (Firebase Console action)
6.  FIX-013  — Initialize Firebase Analytics
7.  FIX-005  — Create NotFoundPage and add catch-all route
8.  FIX-007  — Create ErrorBoundary and wrap app
9.  FIX-006  — Create ProtectedRoute, guard /admin route
10. FIX-010  — Update OptimizedImage with error handling
11. FIX-011  — Add rate limiter, honeypot to all inquiry forms
12. FIX-014  — Add phone validation in ContactPage
13. FIX-008  — Create public/robots.txt
14. FIX-009  — Create public/sitemap.xml
15. FIX-015  — Update vercel.json with cache headers
16. FIX-016  — Update index.html with full OG/structured data
17. FIX-017  — Add loading skeletons to detail pages
18. FIX-018  — Fix WhatsApp deep link for mobile vs desktop
19. FIX-020  — Add limit to useFirestoreCollection
20. FIX-012  — Remove dead Three.js packages (run last, requires build verification)
```

---

## POST-FIX VERIFICATION CHECKLIST

After all fixes are applied, verify the following manually:

- [ ] `git log --oneline` — confirm `fix1.txt` is not in recent commits (if purged)
- [ ] `cat .env.local` — confirm keys exist locally and are NOT in `.gitignore`-excluded state
- [ ] `grep -r "AIzaSy" src/` — should return zero results
- [ ] Firebase Console → RTDB Rules — confirm rules match FIX-004 spec
- [ ] `curl https://masembe.vercel.app/robots.txt` — should return the robots content
- [ ] `curl https://masembe.vercel.app/sitemap.xml` — should return valid XML
- [ ] Navigate to `/nonexistent-route` — should show the 404 page
- [ ] Navigate to `/admin` while logged out — should redirect to `/`
- [ ] Submit an inquiry form twice within 60 seconds — second submit should be blocked
- [ ] Open a car with a broken image path — should show the SVG placeholder, not a blank space
- [ ] Open browser DevTools → Network → check a `.js` bundle response header for `Cache-Control: max-age=31536000`
- [ ] Share a page URL on WhatsApp — preview should show the brand image and description
- [ ] Run `npm run build` — confirm no TypeScript errors and check bundle sizes in output

---

*Spec version: 1.0 — Masembe Group Integrated Platform — April 2026*
