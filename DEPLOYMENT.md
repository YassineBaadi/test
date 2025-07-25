# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Environment Variables**: You'll need to configure these in Vercel

## Step-by-Step Deployment

### 1. Connect Your Repository

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Next.js project

### 2. Configure Environment Variables

In your Vercel project settings, add these environment variables:

```
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_ID=your-google-oauth-client-id
GOOGLE_SECRET=your-google-oauth-client-secret
```

**Important Notes:**

- Replace `your-domain.vercel.app` with your actual Vercel domain
- Generate a secure `NEXTAUTH_SECRET` (you can use `openssl rand -base64 32`)
- Google OAuth credentials are optional but recommended

### 3. Build Settings

Vercel should automatically detect these settings:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 4. Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be live at the provided URL

## Troubleshooting

### Common Issues

1. **Build Failures**

   - Check the build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`
   - Verify environment variables are set correctly

2. **API Routes Not Working**

   - Ensure environment variables are configured
   - Check that the storage service is working properly

3. **Authentication Issues**
   - Verify `NEXTAUTH_URL` matches your deployment URL
   - Check Google OAuth credentials if using Google sign-in

### Environment Variables Guide

#### NEXTAUTH_SECRET

Generate a secure secret:

```bash
openssl rand -base64 32
```

#### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add your Vercel domain to authorized origins
6. Add `https://your-domain.vercel.app/api/auth/callback/google` to authorized redirect URIs

## Post-Deployment

1. **Test all features**: Authentication, cart, purchases, etc.
2. **Monitor logs**: Check Vercel function logs for any errors
3. **Set up custom domain** (optional): Configure in Vercel dashboard

## Local Development

For local development, create a `.env.local` file:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-local-secret
GOOGLE_ID=your-google-oauth-client-id
GOOGLE_SECRET=your-google-oauth-client-secret
```

## Support

If you encounter issues:

1. Check Vercel build logs
2. Verify environment variables
3. Test locally first
4. Check Next.js and Vercel documentation
