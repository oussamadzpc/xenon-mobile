export default {
  name: 'xenon-mobile',
  version: '1.0.0',
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