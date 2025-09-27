# Authentication Components

This directory contains the authentication-related components for the Evecta application.

## Components

### AuthPage.js
The main authentication page component that provides:
- Modern, responsive sign-in and sign-up forms
- Google OAuth integration
- Form validation with error handling
- Loading states and animations
- Beautiful UI with glassmorphism effects

### GoogleCallback.js
Handles the OAuth callback from Google:
- Processes the authorization code
- Handles success and error states
- Redirects users appropriately after authentication

## Features

### Design Improvements
- **Modern UI**: Clean, professional design with gradient backgrounds
- **Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: Proper focus states and keyboard navigation
- **Glassmorphism**: Modern frosted glass effect with backdrop blur

### Google OAuth Integration
- **Seamless Login**: One-click Google authentication
- **Automatic Registration**: New users are automatically registered
- **Profile Sync**: Google profile picture and name are synced
- **Secure**: Uses OAuth 2.0 with proper token handling

### Form Validation
- **Real-time Validation**: Instant feedback on form inputs
- **Comprehensive Checks**: Email format, password strength, confirmation matching
- **Error States**: Clear error messages with visual indicators
- **Success States**: Confirmation messages and smooth transitions

## Usage

### Accessing the Auth Page
Navigate to `/auth` to access the authentication page.

### Google OAuth Flow
1. User clicks "Continue with Google"
2. Redirected to Google's OAuth consent screen
3. After consent, redirected to `/auth/google/callback`
4. Callback processes the authorization code
5. User is logged in and redirected to dashboard

### API Integration
The authentication components integrate with the backend API:
- `POST /authenticate/login` - Email/password login
- `POST /authenticate/register` - User registration
- `GET /oauth/google/login` - Google OAuth initiation
- `GET /oauth/google/callback` - Google OAuth callback

## Styling

The components use a comprehensive CSS file (`AuthPage.css`) with:
- CSS Grid and Flexbox for layouts
- CSS Custom Properties for theming
- Media queries for responsive design
- Keyframe animations for interactions
- High contrast mode support
- Reduced motion support for accessibility

## Dependencies

- React Router for navigation
- Lucide React for icons
- Custom AuthContext for state management
- Custom API service for backend communication
