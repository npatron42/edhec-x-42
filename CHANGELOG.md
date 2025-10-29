# 📋 Changelog - Eco-Refill AI Station

## [1.0.2] - 2025-10-02

### 🐛 Bug Fixes

#### Fixed ScrollView Not Working on Web

**Issue**: Users unable to scroll content on React Native Web platform.

**Root Cause**: React Native Web requires explicit height and flexGrow settings for ScrollView to work properly.

**Changes**:

1. **ScrollView Configuration** ✅
   - Added `height: '100%'` to container styles
   - Added `flexGrow: 1` to contentContainerStyle
   - Enabled `scrollEnabled={true}` explicitly
   - Enabled `showsVerticalScrollIndicator={true}`
   
   **Files updated**:
   - `src/screens/WelcomeScreen.js`
   - `src/screens/QuestionnaireScreen.js`
   - `src/screens/QRCodeScreen.js`
   - `src/screens/DashboardScreen.js`

**Result**: ✅ All screens now scrollable on iOS, Android, and Web

---

## [1.0.1] - 2025-10-02

### 🐛 Bug Fixes

#### Fixed React Native Web Deprecation Warnings

**Issue**: Console showed multiple deprecation warnings when running on web platform.

**Changes**:

1. **Shadow Props Migration** ✅
   - Replaced deprecated `shadow*` props with web-standard `boxShadow`
   - **Files updated**:
     - `src/screens/ProductMatchingScreen.js` (2 occurrences)
     - `src/screens/QRCodeScreen.js` (1 occurrence)
     - `src/screens/DashboardScreen.js` (5 occurrences)
     - `src/components/ProductCard.js` (1 occurrence)
   
   **Before**:
   ```javascript
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.1,
   shadowRadius: 10,
   ```
   
   **After**:
   ```javascript
   boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
   ```
   
   - ✅ All shadow effects work correctly on iOS, Android, and Web
   - ✅ Visual appearance unchanged
   - ✅ `elevation` property retained for Android compatibility

2. **pointerEvents Warning** ℹ️
   - Source: `@react-navigation/stack` library (external dependency)
   - Status: Cannot be fixed in our codebase
   - Impact: Safe to ignore - does not affect functionality
   - Will be resolved in future React Navigation updates

### 📝 Documentation

- Updated `TROUBLESHOOTING.md` with:
  - Explanation of shadow props deprecation and fixes
  - Note about React Navigation's pointerEvents warning
  - Best practices for React Native Web compatibility

### 🎯 Results

**Console Warnings Eliminated**:
- ✅ 9 instances of `"shadow*" style props are deprecated` - **FIXED**
- ℹ️ 1 instance of `props.pointerEvents is deprecated` - **External library** (safe to ignore)

**Platform Compatibility**:
- ✅ iOS: Fully functional
- ✅ Android: Fully functional  
- ✅ Web: Fully functional with minimal warnings

### 🚀 Technical Details

**boxShadow CSS Format**:
```
boxShadow: '<offset-x> <offset-y> <blur-radius> rgba(r, g, b, alpha)'
```

**Example Conversions**:

| iOS/Android Props | Web boxShadow |
|------------------|---------------|
| `shadowOffset: { width: 0, height: 2 }`<br>`shadowOpacity: 0.1`<br>`shadowRadius: 10` | `boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)'` |
| `shadowOffset: { width: 0, height: 2 }`<br>`shadowOpacity: 0.2`<br>`shadowRadius: 5` | `boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)'` |
| `shadowOffset: { width: 0, height: 2 }`<br>`shadowOpacity: 0.05`<br>`shadowRadius: 5` | `boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)'` |

### ✅ Testing

- [x] Web version builds successfully
- [x] No shadow* deprecation warnings in console
- [x] All UI elements display correctly with shadows
- [x] App functionality unchanged
- [x] Navigation works properly
- [x] QR code generation works
- [x] Product matching UI intact

---

## [1.0.0] - 2025-10-02

### 🎉 Initial Release

- ✅ Multi-step personalized questionnaire
- ✅ Tinder-style product matching with swipe gestures
- ✅ AI-powered product recommendations
- ✅ QR code generation for refill stations
- ✅ Environmental impact dashboard
- ✅ Support for iOS, Android, and Web platforms
- ✅ French language interface
- ✅ Comprehensive documentation

---

## 📊 Version Summary

| Version | Date | Key Changes |
|---------|------|-------------|
| 1.0.2 | 2025-10-02 | Fixed ScrollView not working on Web |
| 1.0.1 | 2025-10-02 | Fixed React Native Web deprecation warnings |
| 1.0.0 | 2025-10-02 | Initial release with full feature set |

---

## 🔗 Related Documentation

- [README.md](./README.md) - Project overview and setup
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues and solutions
- [DOCUMENTATION.md](./DOCUMENTATION.md) - Technical documentation
- [QUICKSTART.md](./QUICKSTART.md) - Quick start guide
