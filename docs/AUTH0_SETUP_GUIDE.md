# Auth0 Setup Guide for 9Vectors

This guide will walk you through setting up Auth0 authentication for the 9Vectors SaaS application.

## Overview

9Vectors uses Auth0 for authentication, following the same pattern as the Measurement13 application. Auth0 provides secure authentication with features like:
- Social login (Google, Microsoft, etc.)
- Email/password authentication
- Multi-factor authentication (MFA)
- Secure token management
- User management dashboard

## Prerequisites

- An Auth0 account (free tier is sufficient for development)
- Access to your backend API running on port 3001

## Step 1: Create an Auth0 Account

1. Go to [https://auth0.com/](https://auth0.com/)
2. Click "Sign Up" and create a free account
3. Choose a unique tenant name (e.g., `9vectors-dev`)
   - Your tenant domain will be: `your-tenant.auth0.com`

## Step 2: Create an Auth0 Application

1. Log in to your [Auth0 Dashboard](https://manage.auth0.com/)
2. Navigate to **Applications** → **Applications** in the sidebar
3. Click **"+ Create Application"**
4. Configure your application:
   - **Name**: `9Vectors SaaS` (or any name you prefer)
   - **Application Type**: Select **"Single Page Web Applications"**
   - Click **"Create"**

## Step 3: Configure Application Settings

After creating the application, you'll be taken to the application settings page:

### Basic Information
1. Note your **Domain** (e.g., `your-tenant.auth0.com`)
2. Note your **Client ID** (e.g., `abc123xyz456`)

### Application URIs
Scroll down to the **Application URIs** section and configure:

#### Allowed Callback URLs
Add both development and production URLs (comma-separated):
```
http://localhost:5173, http://localhost:3005, https://www.9vectors.com
```

#### Allowed Logout URLs
Add both development and production URLs:
```
http://localhost:5173, http://localhost:3005, https://www.9vectors.com
```

#### Allowed Web Origins
Add both development and production URLs:
```
http://localhost:5173, http://localhost:3005, https://www.9vectors.com
```

### Advanced Settings
Scroll to **Advanced Settings** → **Grant Types** and ensure these are checked:
- ✅ Implicit
- ✅ Authorization Code
- ✅ Refresh Token

Click **"Save Changes"** at the bottom of the page.

## Step 4: Create an Auth0 API (Optional but Recommended)

If you want to secure your backend API with Auth0:

1. Navigate to **Applications** → **APIs** in the sidebar
2. Click **"+ Create API"**
3. Configure:
   - **Name**: `9Vectors API`
   - **Identifier**: `https://api.9vectors.com` (this is your API audience)
   - **Signing Algorithm**: `RS256`
4. Click **"Create"**

## Step 5: Configure Environment Variables

Update your `.env` file in the root of the 9Vectors project:

```env
# Auth0 Configuration
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id-here
VITE_AUTH0_AUDIENCE=https://your-tenant.auth0.com/api/v2/
```

Replace:
- `your-tenant.auth0.com` with your actual Auth0 domain
- `your-client-id-here` with your actual Client ID from Step 3
- If you created an API in Step 4, use that API identifier as the audience

## Step 6: Configure Social Connections (Optional)

To enable social login (Google, Microsoft, etc.):

1. Navigate to **Authentication** → **Social** in the sidebar
2. Click on the provider you want to enable (e.g., **Google**)
3. Follow the instructions to set up the social connection
4. Enable the connection for your application

### Popular Social Connections:
- **Google**: Requires Google OAuth 2.0 credentials
- **Microsoft**: Requires Azure AD app registration
- **GitHub**: Requires GitHub OAuth app
- **Facebook**: Requires Facebook app

## Step 7: Backend API Configuration

Ensure your backend API is configured to accept Auth0 tokens. Update `/api/.env`:

```env
# Auth0 Configuration (for backend validation)
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=https://api.9vectors.com
```

The backend should already have the Auth0 sync endpoint configured in `/api/routes/authRoutes.js`.

## Step 8: Test the Authentication Flow

1. Start your development servers:
   ```bash
   # Frontend (from project root)
   npm run dev

   # Backend (from /api directory)
   cd api && npm start
   ```

2. Open your browser to `http://localhost:3005`

3. Click the **"Sign In"** button in the header

4. You should be redirected to the Auth0 login page

5. Choose to sign up with email or a social provider

6. After successful authentication, you'll be redirected back to the application

7. You should see your user profile in the header dropdown

## Authentication Flow Details

The authentication flow in 9Vectors works as follows:

1. **User clicks "Sign In"** → Redirected to Auth0 login page
2. **User authenticates** → Auth0 validates credentials
3. **Auth0 redirects back** → With an authorization code
4. **Frontend exchanges code** → Gets access token and ID token
5. **Frontend syncs user** → Calls backend API to sync Auth0 user with Cosmos DB
6. **Backend creates/updates user** → Stores user data in Cosmos DB
7. **User is logged in** → App displays user info and grants access

## File Structure

The Auth0 integration consists of these key files:

```
src/
├── config/
│   └── auth0Config.js          # Auth0 configuration
├── contexts/
│   └── Auth0Context.jsx        # Auth0 context with backend sync
├── providers/
│   └── Auth0ProviderWithHistory.jsx  # Auth0 provider wrapper
└── components/
    └── AppLayout.jsx           # Header with login/logout buttons
```

## Troubleshooting

### Issue: "Callback URL mismatch" error
**Solution**: Ensure the callback URL in your Auth0 application settings matches the URL you're running the app on.

### Issue: "Invalid state" error
**Solution**: Clear your browser's localStorage and try again. This usually happens during development when tokens get stale.

### Issue: User logs in but data doesn't sync
**Solution**: Check that:
1. Your backend API is running on port 3001
2. The `VITE_API_URL` environment variable is set correctly
3. The backend has the Auth0 sync endpoint configured

### Issue: CORS errors
**Solution**: Ensure your backend API has CORS configured to allow requests from `http://localhost:5173` and `http://localhost:3005`.

## Production Deployment

When deploying to production:

1. Update the Auth0 application settings with your production URL
2. Update your production environment variables:
   ```env
   VITE_AUTH0_DOMAIN=your-tenant.auth0.com
   VITE_AUTH0_CLIENT_ID=your-production-client-id
   VITE_AUTH0_AUDIENCE=https://api.9vectors.com
   ```
3. Consider creating a separate Auth0 application for production
4. Enable MFA (Multi-Factor Authentication) for enhanced security
5. Configure custom branding in Auth0 dashboard

## Security Best Practices

1. **Never commit** Auth0 credentials to version control
2. **Use environment variables** for all sensitive data
3. **Enable MFA** for production users
4. **Regular security audits** in Auth0 dashboard
5. **Monitor login attempts** and failed authentications
6. **Set up email verification** for new users
7. **Configure rate limiting** to prevent brute force attacks

## Additional Resources

- [Auth0 Documentation](https://auth0.com/docs)
- [Auth0 React SDK](https://auth0.com/docs/quickstart/spa/react)
- [Auth0 Dashboard](https://manage.auth0.com/)
- [Auth0 Community Forum](https://community.auth0.com/)

## Support

For issues specific to 9Vectors authentication:
1. Check the browser console for errors
2. Check the backend API logs
3. Verify Auth0 dashboard logs under **Monitoring** → **Logs**

For Auth0-specific issues:
- Visit [Auth0 Community Forum](https://community.auth0.com/)
- Check [Auth0 Documentation](https://auth0.com/docs)
