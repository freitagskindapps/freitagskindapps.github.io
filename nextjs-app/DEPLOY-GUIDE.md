# Next.js Build & Deploy Guide

## Current Situation

**Issue:** Next.js build says "Static" but no output files generated (no `out/` directory)

**Likely Cause:** Next.js 16 default export mode may not be generating files properly

## Solutions

### Option 1: Deploy with Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel (first time)
vercel login

# Deploy from correct directory
cd /home/node/.openclaw/workspace/freitagskindapps.github.io/nextjs-app

# Deploy
vercel --prod
```

### Option 2: Force Static Export

Update `next.config.ts`:

```typescript
const nextConfig = NextConfig({
  output: 'export',
  output: 'standalone',
  distDir: 'out',
});
```

Then rebuild.

### Option 3: Deploy to GitHub Pages

```bash
# Install gh-pages CLI
npm install -g gh-pages

# Build for GitHub Pages
npm run build

# Deploy
npx gh-pages -d out -t main
```

---

**Recommendation:** Try Option 1 first (Vercel CLI deploy). It's the easiest way to get your site live!
