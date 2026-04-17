import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sav.mobile',
  appName: 'Sama SAV',
  webDir: '../dist/sav-ui/browser',
  server: {
    androidScheme: 'http',

  },
  plugins: {
    Preferences: {
      group: 'SAVPrefs',
    },
  },
};

export default config;
