# Firebase Cloud Functions Deployment Guide

This guide will help you deploy the `getTasks` Cloud Function to Firebase.

## Prerequisites

1. **Firebase CLI**: Make sure you have Firebase CLI installed globally
   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase Project**: Ensure you have a Firebase project set up and the project ID matches your configuration.

3. **Authentication**: Log in to Firebase
   ```bash
   firebase login
   ```

## Setup Steps

### 1. Install Dependencies

First, install the main project dependencies:
```bash
npm install
```

Then install the functions dependencies:
```bash
cd functions
npm install
cd ..
```

### 2. Initialize Firebase Project (if not already done)

If this is the first time setting up Firebase for this project:
```bash
firebase init
```

Select the following features:
- ✅ Functions: Configure a Cloud Functions directory
- ✅ Firestore: Configure security rules and indexes files
- ✅ Hosting: Configure files for Firebase Hosting (optional)

When prompted:
- Choose your existing Firebase project
- Select TypeScript for functions
- Use the default functions directory (`functions`)
- Install dependencies with npm

### 3. Set Up Environment Variables

Make sure your Firebase project configuration is properly set up. The functions will use the service account from `private/service-account.json`.

## Deployment Commands

### Deploy Only Functions
```bash
# Deploy all functions
firebase deploy --only functions

# Or use the npm script
npm run functions:deploy
```

### Deploy Everything (Functions + Firestore + Hosting)
```bash
firebase deploy
```

### Deploy Specific Function
```bash
firebase deploy --only functions:getTasks
```

## Testing the Function

### Local Testing with Emulator
```bash
# Start the Firebase emulator
firebase emulators:start --only functions

# Or use the npm script
npm run functions:serve
```

### Testing the Deployed Function

Once deployed, you can test the function using the Firebase Admin SDK or by calling it from your frontend application.

Example usage in your frontend:
```typescript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const getTasks = httpsCallable(functions, 'getTasks');

// Call the function
const result = await getTasks();
console.log(result.data);
```

## Function Details

### `getTasks` Function
- **Type**: HTTPS Callable Function
- **Authentication**: Required (user must be logged in)
- **Returns**: Tasks from `/users/{uid}/tasks` collection
- **Ordering**: Tasks ordered by `createdAt` in descending order
- **Response Format**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "task-id",
        "title": "Task title",
        "description": "Task description",
        "createdAt": "timestamp",
        // ... other task fields
      }
    ],
    "count": 5
  }
  ```

## Troubleshooting

### Common Issues

1. **Authentication Error**: Make sure the user is logged in before calling the function
2. **Permission Denied**: Check Firestore security rules allow read access to user's tasks
3. **Function Not Found**: Ensure the function is deployed successfully
4. **Build Errors**: Check TypeScript compilation errors in the functions directory

### Debugging

1. **View Function Logs**:
   ```bash
   firebase functions:log
   ```

2. **Test Locally**:
   ```bash
   firebase emulators:start --only functions
   ```

3. **Check Function Status**:
   ```bash
   firebase functions:list
   ```

## Security Considerations

- The function automatically validates user authentication
- Users can only access their own tasks (based on their UID)
- Firestore security rules should be configured to match this access pattern

## Next Steps

After successful deployment:
1. Update your frontend to use the new Cloud Function
2. Test the function with real data
3. Monitor function performance in the Firebase Console
4. Set up monitoring and alerting as needed
