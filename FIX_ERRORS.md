# حل مشكلة INSTALL_PARSE_FAILED_NO_CERTIFICATES

## المشكلة
Expo Go لا يثبت على الجهاز بسبب مشكلة شهادات

## الحلول

### 1. حذف Expo Go القديم من الجهاز
```bash
adb uninstall host.exp.exponent
adb uninstall com.xenon.iptv
```

### 2. تنظيف cache
```bash
adb shell pm clear host.exp.exponent
```

### 3. تشغيل بدون Expo Go (أفضل طريقة)
```bash
# بناء APK مباشرة
npx expo prebuild --platform android
npx expo run:android
```

### 4. أو استخدام Tunnel
```bash
npx expo start --tunnel
# ثم افتح الرابط في متصفح الجهاز
```

### 5. أو استخدام LAN
```bash
npx expo start --lan
```

## إذا استمرت المشكلة

### تحديث ADB
```bash
# في Android SDK
sdkmanager --update
```

### إعادة تشغيل ADB
```bash
adb kill-server
adb start-server
```

### التحقق من الجهاز
```bash
adb devices
adb shell getprop ro.build.version.sdk
```
