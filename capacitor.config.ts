import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c0ef37b8e9934782b45fd623824039bb',
  appName: 'Taffaran',
  webDir: 'dist',
  server: {
    url: 'https://c0ef37b8-e993-4782-b45f-d623824039bb.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Haptics: {
      enabled: true
    }
  }
};

export default config;
