# Deploying CourierIt on Render

Follow these steps to deploy your CourierIt Package Tracking System on Render:

## 1. Connect Your Repository

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" and select "Web Service"
3. Connect your GitHub account if you haven't already
4. Select your repository: `VarsityPlug0/Tracking-System`

## 2. Configure Your Web Service

Render should automatically detect the following settings:
- **Name**: courierit-tracking-system (or any name you prefer)
- **Runtime**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**: 
  - `NODE_ENV`: production
  - `PORT`: 3000 (Render will automatically set this)

## 3. Deploy

1. Click "Create Web Service"
2. Render will automatically build and deploy your application
3. Wait for the build to complete (usually takes 2-5 minutes)

## 4. Access Your Application

Once deployed, Render will provide you with a URL like:
`https://courierit-tracking-system.onrender.com`

Your application will be available at:
- Main tracking page: `https://your-app-name.onrender.com`
- Admin panel: `https://your-app-name.onrender.com/admin`

## 5. Environment Variables

If you need to add any environment variables in the future:
1. Go to your service dashboard on Render
2. Click "Environment" in the sidebar
3. Add your variables and click "Save Changes"
4. Render will automatically redeploy with the new variables

## 6. Automatic Deployments

Render automatically redeploys your application whenever you push changes to your GitHub repository.

## 7. Custom Domain (Optional)

To use a custom domain:
1. Go to your service dashboard on Render
2. Click "Settings" in the sidebar
3. Scroll to "Custom Domains"
4. Follow the instructions to add your domain

## Notes

- Your application uses port 3000 internally, but Render will expose it on the standard HTTP/HTTPS ports
- The application will automatically scale based on traffic
- Render provides free SSL certificates for all services