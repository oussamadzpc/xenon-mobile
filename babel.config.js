export default {
  name: 'xenon-mobile',
  version: '1.0.0',
  
  // ⬇️ أضف هذا
  android: {
    package: 'com.anonymous.xenonmobile'
  },
  
  plugins: [
    [
      'expo-build-properties',
      {
        android: {
          enableProguardInReleaseBuilds: false,
        },
      },
    ],
  ],
};