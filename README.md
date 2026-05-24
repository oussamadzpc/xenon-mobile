# XENO 4K PRO - Mobile App

تطبيق Android لـ XENO 4K PRO IPTV

## المتطلبات
- Node.js 18+
- Expo CLI
- Android Studio (للبناء المحلي)

## التثبيت

```bash
# 1. تثبيت المكتبات
npm install

# 2. تشغيل على Android
npx expo start --android

# 3. بناء APK
npx eas build --platform android --profile preview
```

## المميزات
- ✅ بث مباشر (Live TV)
- ✅ أفلام (Movies)
- ✅ مسلسلات (Series)
- ✅ تسجيل دخول عبر Supabase
- ✅ دعم HLS Streaming
- ✅ تصميم احترافي Dark Theme

## الهيكل
```
src/
├── components/     # المكونات المشتركة
├── screens/        # الشاشات
├── navigation/     # التنقل
├── hooks/          # Custom Hooks
├── services/       # الخدمات (Supabase, Storage)
├── utils/          # الأدوات (Parsers, Country Data)
└── constants/      # الثوابت (Theme, Colors)
```
