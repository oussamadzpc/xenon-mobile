const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withWorkManager(config) {
  return withAndroidManifest(config, async (config) => {
    const manifest = config.modResults.manifest;
    
    if (!manifest.application) manifest.application = [{}];
    const application = manifest.application[0];
    
    if (!application.provider) application.provider = [];
    
    const hasProvider = application.provider.some(
      p => p.$ && p.$['android:name'] === 'androidx.startup.InitializationProvider'
    );
    
    if (!hasProvider) {
      application.provider.push({
        $: {
          'android:name': 'androidx.startup.InitializationProvider',
          'android:authorities': '${applicationId}.androidx-startup',
          'android:exported': 'false',
          'tools:node': 'merge'
        },
        'meta-data': [{
          $: {
            'android:name': 'androidx.work.WorkManagerInitializer',
            'android:value': 'androidx.startup'
          }
        }]
      });
    }
    
    return config;
  });
};