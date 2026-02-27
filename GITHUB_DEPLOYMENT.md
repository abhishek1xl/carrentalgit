# GitHub Pages Deployment Guide

## Quick Start

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository named `car-rental-system`
3. **Important:** Keep it **PUBLIC** for GitHub Pages to work with free accounts
4. Do NOT initialize with README (we already have one)

### Step 2: Initialize Git Locally

```bash
cd path/to/car-rental-system
git init
git add .
git commit -m "Initial commit: Car Rental System"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/car-rental-system.git
git push -u origin main
```

### Step 3: Configure for GitHub Pages

Update your `package.json` homepage field:

```json
"homepage": "https://YOUR_USERNAME.github.io/car-rental-system"
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 4: Deploy

```bash
npm install
npm run deploy
```

This automatically:
- Builds the production version
- Creates/updates the `gh-pages` branch
- Pushes to GitHub Pages

### Step 5: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Branch", select `gh-pages`
4. Click **Save**
5. Wait 1-2 minutes for the site to deploy

Your app will be live at: `https://YOUR_USERNAME.github.io/car-rental-system`

---

## Troubleshooting

### Issue: "404 Not Found" on GitHub Pages

**Solution:**
1. Verify `homepage` is correctly set in `package.json`
2. Hard refresh browser (Ctrl+Shift+R)
3. Check that `gh-pages` branch exists in repository

### Issue: Styles/Images not loading

**Solution:**
- The homepage must match your repository URL exactly
- Ensure it starts with `https://` not `http://`

### Issue: Repository not showing gh-pages branch

**Solution:**
```bash
# Local verification
npm run deploy

# Check if gh-pages branch was created
git branch -r
```

### Issue: "fatal: not a git repository"

**Solution:**
```bash
git init
git remote add origin https://github.com/YOUR_USERNAME/car-rental-system.git
```

---

## Updating After Deployment

To push new changes to GitHub Pages:

```bash
# Make your changes
git add .
git commit -m "Description of changes"
git push origin main

# Redeploy to GitHub Pages
npm run deploy
```

---

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [React Create App Deployment](https://create-react-app.dev/deployment/#github-pages)
- [gh-pages npm Package](https://www.npmjs.com/package/gh-pages)
