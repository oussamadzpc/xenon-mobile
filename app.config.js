module.exports = {
  name: 'xenon-mobile',
  slug: 'xenon-mobile',
  version: '1.0.0',
  
  android: {
    package: 'com.anonymous.xenonmobile',
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