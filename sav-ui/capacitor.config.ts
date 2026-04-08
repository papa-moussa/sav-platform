import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sav.mobile',
  appName: 'SAV Mobile',
  webDir: '../dist/sav-ui/browser',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    Preferences: {
      group: 'SAVPrefs',
    },
  },
};

export default config;
