# 🚀 AnimeStream - Vercel Deployment Guide

Complete guide to deploy your anime streaming website to Vercel with optimal performance and all advanced features.

## 📋 Prerequisites

- Node.js 18+ installed
- Vercel account ([signup here](https://vercel.com))
- Git repository with your code
- Basic knowledge of environment variables

## 🔧 Pre-deployment Setup

### 1. Environment Configuration

Create a `.env.local` file in your project root (based on `.env.example`):

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_NAME=AnimeStream

# Analytics (Optional but recommended)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
GOOGLE_VERIFICATION_ID=your_google_verification_id
BING_VERIFICATION_ID=your_bing_verification_id

# API Configuration
NEXT_PUBLIC_API_URL=https://api.consumet.org
API_TIMEOUT=30000

# Feature Flags
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_SERVICE_WORKER=true

NODE_ENV=production
```

### 2. Build Verification

Test your build locally before deployment:

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Test the production build
npm start
```

## 🌐 Deployment Methods

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   # First deployment
   vercel

   # Production deployment
   vercel --prod
   ```

### Method 2: GitHub Integration

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Visit [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Configure settings (see below)
   - Deploy!

## ⚙️ Vercel Configuration

### Project Settings

In Vercel dashboard, configure these settings:

**Build & Development Settings:**
- Framework Preset: `Next.js`
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`
- Development Command: `npm run dev`

**Environment Variables:**
Add all variables from your `.env.local` file in the Environment Variables section.

**Domains:**
- Add your custom domain if you have one
- Configure DNS settings

### Function Configuration

The `vercel.json` file is already configured with:
- 30-second timeout for API functions
- Global edge deployment
- Optimized caching headers
- Security headers

## 🚀 Performance Optimizations

### Automatic Optimizations Included

1. **Edge Functions**: API routes deployed globally
2. **Image Optimization**: Next.js Image component with WebP/AVIF
3. **Static Generation**: Pre-rendered pages for better SEO
4. **Incremental Static Regeneration**: Fresh content with caching
5. **Bundle Optimization**: Code splitting and tree shaking
6. **CDN**: Global content delivery network

### Manual Optimizations

1. **Enable Analytics**
   ```bash
   vercel env add VERCEL_ANALYTICS_ID
   ```

2. **Add Speed Insights**
   - Install: `npm install @vercel/speed-insights`
   - Add to your layout (already included)

3. **Configure Monitoring**
   - Set up error tracking (Sentry)
   - Monitor Core Web Vitals

## 📱 PWA Configuration

Your site is already configured as a Progressive Web App with:

- **Service Worker**: Offline caching and background sync
- **Web App Manifest**: Install prompt on mobile devices
- **Push Notifications**: Episode updates and announcements
- **Offline Support**: Cached content when offline

### Testing PWA Features

1. Open your deployed site on mobile
2. Check for "Add to Home Screen" prompt
3. Test offline functionality
4. Verify push notifications (if configured)

## 🔍 SEO Configuration

### Automatic SEO Features

- **Dynamic Sitemap**: `/sitemap.xml`
- **Robots.txt**: `/robots.txt`
- **Meta Tags**: Optimized for social sharing
- **Open Graph**: Twitter and Facebook cards
- **Structured Data**: Schema.org markup
- **Canonical URLs**: Proper SEO structure

### Post-Deployment SEO Tasks

1. **Submit Sitemap**
   - Google Search Console: Add `your-domain.vercel.app/sitemap.xml`
   - Bing Webmaster Tools: Submit sitemap

2. **Verify Ownership**
   - Add verification meta tags
   - Upload verification files

3. **Monitor Performance**
   - Google PageSpeed Insights
   - Core Web Vitals
   - Search Console reports

## 🛡️ Security Configuration

### Built-in Security Features

- **HTTPS**: Automatic SSL certificates
- **Security Headers**: CSP, HSTS, XSS protection
- **CORS**: Configured for API endpoints
- **Rate Limiting**: Built into Vercel Edge Functions

### Additional Security Steps

1. **Environment Variables**
   - Never commit sensitive data
   - Use Vercel's encrypted environment variables

2. **API Security**
   - Monitor API usage
   - Implement rate limiting if needed
   - Use CORS for external domains

## 📊 Monitoring & Analytics

### Built-in Monitoring

- **Vercel Analytics**: Real-time visitor data
- **Performance Metrics**: Core Web Vitals
- **Function Logs**: API performance monitoring
- **Deployment History**: Rollback capabilities

### External Monitoring (Optional)

1. **Google Analytics**
   ```javascript
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

2. **Error Tracking**
   ```bash
   npm install @sentry/nextjs
   ```

3. **Uptime Monitoring**
   - UptimeRobot
   - Pingdom
   - StatusCake

## 🔄 CI/CD & Updates

### Automatic Deployments

- **Push to main**: Automatic production deployment
- **Pull Requests**: Preview deployments
- **Branch Protection**: Review before merge

### Manual Updates

```bash
# Pull latest changes
git pull origin main

# Deploy to production
vercel --prod
```

### Rolling Back

```bash
# List deployments
vercel ls

# Promote specific deployment
vercel promote <deployment-url>
```

## 📈 Performance Monitoring

### Core Web Vitals Targets

- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)  
- **CLS**: < 0.1 (Cumulative Layout Shift)

### Optimization Tips

1. **Images**: Use WebP/AVIF formats
2. **Fonts**: Preload critical fonts
3. **JavaScript**: Code splitting and lazy loading
4. **API**: Implement caching strategies
5. **CDN**: Leverage Vercel's global edge network

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check logs
   vercel logs <deployment-url>
   
   # Local debugging
   npm run build
   ```

2. **API Timeouts**
   - Increase function timeout in `vercel.json`
   - Optimize API calls
   - Implement caching

3. **Image Loading Issues**
   - Verify image domains in `next.config.js`
   - Check CORS settings
   - Use absolute URLs

4. **PWA Not Working**
   - Verify HTTPS deployment
   - Check service worker registration
   - Test manifest.json

### Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [GitHub Issues](https://github.com/yourusername/animestream/issues)

## ✅ Post-Deployment Checklist

- [ ] Site loads correctly on desktop and mobile
- [ ] All pages and routes working
- [ ] API endpoints responding
- [ ] Video player functioning
- [ ] Search and filters working
- [ ] PWA install prompt appears on mobile
- [ ] Service worker caching content
- [ ] SEO meta tags present
- [ ] Analytics tracking (if configured)
- [ ] Error monitoring active
- [ ] Performance metrics acceptable
- [ ] Security headers configured
- [ ] Custom domain configured (if applicable)

## 🎉 Success!

Your AnimeStream website is now live! Share it with friends and enjoy streaming anime with all the modern features:

- ⚡ Blazing fast performance
- 📱 PWA mobile app experience  
- 🔍 SEO optimized for discovery
- 🛡️ Secure and reliable
- 🌐 Global CDN delivery
- 📊 Analytics and monitoring

---

**Live Demo**: `https://your-domain.vercel.app`

**Support**: For deployment issues, create an issue in the GitHub repository.

**Updates**: The site will automatically update when you push changes to the main branch.