# Push Notifications Setup Guide for EAS Build

## ✅ What's Already Configured

Your app is now configured for push notifications with EAS build. Here's what's been set up:

### 1. **EAS Configuration**
- ✅ EAS CLI installed and logged in
- ✅ Project configured for iOS and Android builds
- ✅ `eas.json` configured with proper build profiles

### 2. **App Configuration**
- ✅ `app.json` updated with push notification permissions
- ✅ `expo-notifications` plugin configured
- ✅ iOS background modes include `remote-notification`
- ✅ Android permissions include notification-related permissions
- ✅ Notification icon created

### 3. **Code Implementation**
- ✅ `useNotifications` hook created
- ✅ Push notification test components added
- ✅ Supabase integration ready

## 🚀 Next Steps for Production

### **Step 1: Set Up Push Credentials**

#### **For iOS (Apple Push Notification Service - APNs):**
1. Go to [Apple Developer Console](https://developer.apple.com/account/)
2. Navigate to Certificates, Identifiers & Profiles
3. Create a new APNs certificate or key
4. Download the certificate/key file
5. Upload to Expo: `eas credentials`

#### **For Android (Firebase Cloud Messaging - FCM):**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing
3. Add your Android app (use package name: `app.rork.traffic-flow-map`)
4. Download `google-services.json`
5. Upload to Expo: `eas credentials`

### **Step 2: Build Your App**

```bash
# For iOS
eas build --platform ios --profile production

# For Android  
eas build --platform android --profile production

# For both
eas build --platform all --profile production
```

### **Step 3: Test Push Notifications**

Once your app is built and installed:

1. **Get Push Token:** The app will automatically register and get a push token
2. **Send Test Notification:** Use the test button in Settings
3. **Send from Backend:** Use Expo's push API or your own server

### **Step 4: Submit to App Stores**

```bash
# Submit to App Store
eas submit --platform ios

# Submit to Play Store  
eas submit --platform android
```

## 🔧 Environment Variables

Make sure to update these in your `app.json`:

```json
"extra": {
  "EXPO_PUBLIC_GOOGLE_MAPS_API_KEY": "your_actual_google_maps_api_key",
  "EXPO_PUBLIC_SUPABASE_URL": "your_actual_supabase_url", 
  "EXPO_PUBLIC_SUPABASE_ANON_KEY": "your_actual_supabase_anon_key"
}
```

## 📱 Testing Push Notifications

### **Local Testing (Development):**
- Use the test buttons in your app's Settings screen
- Works on physical devices only (not simulators)

### **Production Testing:**
- Build with EAS and install on device
- Push tokens will be generated automatically
- Send notifications via Expo's push API or your backend

## 🚨 Important Notes

1. **Physical Device Required:** Push notifications only work on real devices
2. **Permissions:** Users must grant notification permissions
3. **Internet Required:** Push token registration needs internet connection
4. **EAS Build Required:** Expo Go doesn't support production push notifications

## 📞 Support

If you encounter issues:
1. Check Expo's push notification documentation
2. Verify your credentials are properly uploaded
3. Ensure you're using EAS builds (not Expo Go)
4. Test on physical devices only

---

**Your app is ready for push notifications!** 🎉 