# Google Maps API Setup Guide

## 🔧 **Required APIs for Traffic Tracker**

To make the location search work, you need to enable these APIs in your Google Cloud Console:

### **1. Google Maps JavaScript API**
- **Purpose**: Map rendering and display
- **Status**: ✅ Already working (map displays)

### **2. Google Places API** 
- **Purpose**: Location search and autocomplete
- **Status**: ❌ **This is likely the issue!**
- **Required for**: Search functionality

### **3. Google Geocoding API**
- **Purpose**: Address to coordinates conversion (fallback)
- **Status**: ❌ **Also needs to be enabled**
- **Required for**: Backup search functionality

## 🚀 **Step-by-Step Setup**

### **Step 1: Go to Google Cloud Console**
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (the one with your API key)

### **Step 2: Enable Required APIs**
1. Go to **APIs & Services** > **Library**
2. Search for and enable these APIs:
   - **Google Places API**
   - **Google Geocoding API**
   - **Google Maps JavaScript API** (should already be enabled)

### **Step 3: Check API Key Restrictions**
1. Go to **APIs & Services** > **Credentials**
2. Click on your API key
3. Under **API restrictions**, make sure these APIs are allowed:
   - Google Maps JavaScript API
   - Google Places API  
   - Google Geocoding API

### **Step 4: Check Billing**
1. Go to **Billing** in the left sidebar
2. Ensure billing is enabled for your project
3. Google Places API requires billing to be enabled

### **Step 5: Test the Configuration**
1. In the app, tap the settings icon (⚙️) next to the search bar
2. This will show your API key status and test the search
3. Try searching for "New York" or any major city

## 🔍 **Common Issues & Solutions**

### **Issue: "REQUEST_DENIED" Error**
**Solution**: 
- Enable the required APIs in Google Cloud Console
- Check that billing is enabled
- Verify API key restrictions allow the required APIs

### **Issue: "OVER_QUERY_LIMIT" Error**
**Solution**:
- Check your billing quota
- Wait a few minutes and try again
- Consider upgrading your billing plan

### **Issue: "API key not configured"**
**Solution**:
- Check your `app.json` file has the correct API key
- Verify the environment variable is set correctly

### **Issue: "ZERO_RESULTS"**
**Solution**:
- Try different search terms
- Check if the location exists
- This is normal for some searches

## 📱 **Testing in the App**

1. **Open the app** and go to the map screen
2. **Tap the search bar** and type a location (e.g., "Los Angeles")
3. **Look for results** - you should see a list of matching locations
4. **If no results appear**, tap the settings icon (⚙️) next to the search bar
5. **Check the console logs** for detailed error messages

## 🛠️ **Debug Information**

The app now includes enhanced debugging:
- **Console logs** show detailed API responses
- **Error messages** are user-friendly
- **Settings button** shows API configuration status
- **Fallback search** uses Geocoding API if Places API fails

## 💰 **Cost Information**

- **Google Places API**: $17 per 1000 requests
- **Google Geocoding API**: $5 per 1000 requests  
- **Google Maps JavaScript API**: Free for basic usage
- **Free tier**: $200 credit per month

## 🎯 **Next Steps**

1. **Enable the APIs** in Google Cloud Console
2. **Test the search** in the app
3. **Check console logs** for any remaining errors
4. **Contact support** if issues persist

---

**Need Help?** Check the console logs in your development environment for detailed error messages that will help identify the specific issue. 