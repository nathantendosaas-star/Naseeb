# Firebase Firestore Setup Guide

To ensure that inquiry submissions and the admin panel function correctly, you must configure your Firestore security rules and create the necessary indexes.

## 1. Security Rules

Copy and paste these rules into your Firebase Console under **Firestore Database > Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Inquiries can be created by anyone, but read/modified only by authenticated admins
    match /inquiries/{inquiry} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    
    // Global site content can be read by anyone, modified only by admins
    match /content/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Cars (Showroom) inventory
    match /cars/{car} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Properties (Portfolio) inventory
    match /properties/{property} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 2. Indexes

If the Admin Panel shows a "Query Error," it is likely because Firestore needs a composite index for sorting.

Check your **Browser Console (F12)** when visiting the Inquiries tab. Firestore usually provides a direct link in the error message that will pre-configure the index for you.

Alternatively, manually create this index in the Firebase Console under **Firestore Database > Indexes**:

- **Collection ID**: `inquiries`
- **Fields to Index**:
  1. `createdAt` (Descending)
  2. `__name__` (Descending) - *Automatically added by Firestore*

Or if you filter by status:
- **Collection ID**: `inquiries`
- **Fields to Index**:
  1. `status` (Ascending)
  2. `createdAt` (Descending)

## 3. Deployment

If you are using the Firebase CLI, you can also save these rules in a `firestore.rules` file and deploy them using `firebase deploy --only firestore:rules`.
$content
