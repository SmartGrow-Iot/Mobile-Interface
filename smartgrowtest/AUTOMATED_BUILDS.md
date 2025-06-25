# 🤖 Automated APK Builds

This branch is set up for **unlimited free APK builds** using GitHub Actions.

## 🚀 How It Works

### **Automatic Builds:**
- **Push to this branch** → Automatically builds APK
- **Create Pull Request** → Builds APK and comments with download link
- **Manual trigger** → Go to Actions tab and click "Run workflow"

### **Build Process:**
1. Code pushed to `automated-apk-builds` branch
2. GitHub Actions spins up Ubuntu server
3. Installs Node.js, Expo CLI, EAS CLI
4. Builds APK using EAS Build
5. Uploads APK as downloadable artifact

## 📱 Getting Your APK

### **After Build Completes:**
1. Go to **Actions** tab in GitHub
2. Click on latest **"Build Android APK"** workflow
3. Scroll down to **"Artifacts"** section
4. Download **"smartgrow-android-apk"**

## ⚙️ Setup Required (One-time)

### **1. Get Expo Token:**
```bash
# In terminal
eas whoami
# If not logged in: eas login
# Then get token: eas build:configure
```

### **2. Add Secret to GitHub:**
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Name: `EXPO_TOKEN`
4. Value: Your expo token from step 1

## 🎯 Usage Examples

### **For Development:**
```bash
# Make changes to your app
git add .
git commit -m "Add new feature"
git push origin automated-apk-builds
# APK automatically builds and is available in Actions
```

### **For Releases:**
```bash
# Create pull request to main branch
# APK builds automatically
# Download from PR comment link
```

## 💰 Cost: **FREE**
- **GitHub Actions:** 2,000 minutes/month (free)
- **EAS Build:** Uses your 30 builds/month quota
- **Alternative:** Set up your own build runners for unlimited builds

## 🔧 Customization

### **Build Different Profiles:**
Edit `.github/workflows/build-apk.yml`:
```yaml
# Change this line:
run: eas build --platform android --profile preview-apk --non-interactive --wait
# To:
run: eas build --platform android --profile production --non-interactive --wait
```

### **Build on Different Events:**
```yaml
on:
  push:
    branches: [ main, develop, automated-apk-builds ]  # Multiple branches
  schedule:
    - cron: '0 2 * * 1'  # Weekly builds on Monday 2 AM
```

## 🐛 Troubleshooting

### **Build Fails:**
1. Check **Actions** tab for error logs
2. Verify `EXPO_TOKEN` secret is set correctly
3. Ensure `eas.json` configuration is valid

### **No APK Artifact:**
1. Build may have failed before APK creation
2. Check EAS build logs in Actions output
3. Verify Expo account has remaining build quota

## 🎉 Benefits

✅ **Unlimited builds** (within GitHub Actions limits)  
✅ **No local setup required**  
✅ **Automatic on code changes**  
✅ **Team collaboration friendly**  
✅ **Build history and artifacts**  
✅ **Works from any device** 