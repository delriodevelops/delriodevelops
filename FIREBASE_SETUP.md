# Firebase Admin Dashboard Setup

This guide explains how to set up the Firebase-powered admin dashboard for managing blog posts and projects.

## 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable **Authentication** (Google Sign-In)
4. Enable **Firestore Database**
5. Enable **Storage**

## 2. Authentication Setup

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Google** as a sign-in provider
3. Add your domain to authorized domains (e.g., `localhost`, `your-domain.com`)

## 3. Firestore Rules

Go to **Firestore Database** > **Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Blog posts - public read, authenticated write
    match /blog_posts/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.email == 'iamdelrioo@gmail.com';
    }
    
    // Projects - public read, authenticated write
    match /projects/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.email == 'iamdelrioo@gmail.com';
    }
  }
}
```

## 4. Storage Rules

Go to **Storage** > **Rules** and paste:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Blog cover images
    match /blog-covers/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.email == 'iamdelrioo@gmail.com';
    }
    
    // Project cover images
    match /project-covers/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.email == 'iamdelrioo@gmail.com';
    }
    
    // Project gallery images
    match /project-gallery/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.email == 'iamdelrioo@gmail.com';
    }
    
    // Block everything else
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## 5. Environment Variables

Copy the Firebase config from your project settings and add to `.env.local`:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Admin Authorization
NEXT_PUBLIC_ADMIN_EMAIL=iamdelrioo@gmail.com
```

## 6. Accessing the Dashboard

Navigate to `/admin` to access the dashboard. Sign in with your authorized Google account.

## 7. Features

### Blog Posts
- Create, edit, and delete blog posts
- **Live Markdown Preview** - StackEdit-style split editor
- Upload cover images to Firebase Storage
- Tag categorization
- Auto-generated slugs from titles
- Custom styled articles with scroll animations

### Projects
- Create, edit, and delete projects
- **Cover Image** - Main project image
- **Gallery Images** - Multiple images per project
- Featured project flag
- Custom ordering
- Tags and type categorization
- External URL linking

## 8. Data Structure

### Blog Post
```json
{
  "title": "Post Title",
  "slug": "post-slug",
  "excerpt": "Brief description",
  "content": "Markdown content...",
  "tag": "Category",
  "image": "https://storage.googleapis.com/...",
  "readTime": "5 min read",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Project
```json
{
  "name": "Project Name",
  "description": "Project description",
  "image": "https://storage.googleapis.com/...",
  "images": ["url1", "url2", "url3"],
  "href": "https://project-url.com",
  "tags": ["Tag1", "Tag2"],
  "type": "Product | Side Project | Experiment",
  "featured": true,
  "order": 1,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```
