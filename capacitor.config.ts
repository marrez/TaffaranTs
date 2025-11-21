import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.taffaran.app',
  appName: 'Taffaran',
  webDir: 'dist',
  plugins: {
    Haptics: {
      enabled: true
    }
  }
};

export default config;
