# iOS Build Guide

## Prerequisites

- **Xcode 15+** installed (macOS only)
- **Node.js 18+** and npm
- **CocoaPods** installed: `sudo gem install cocoapods`
- Apple Developer account (for device testing/distribution)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Build Web Assets
```bash
npm run build
```

### 3. Sync to iOS
```bash
npm run ios:sync
# or manually: npx cap sync ios
```

### 4. Open in Xcode
```bash
npm run ios:open
# or manually: npx cap open ios
```

### 5. Run on Simulator/Device
In Xcode:
- Select a target device/simulator
- Click Run (⌘R)

## Development Workflow

### Live Reload During Development
```bash
# Terminal 1: Run dev server
npm run dev

# Terminal 2: Open iOS app
npm run ios:open
```

Configure Capacitor to point to your dev server by uncommenting the `server.url` in `capacitor.config.ts` (already configured for Lovable).

### Production Build
```bash
# Build optimized web assets
npm run build

# Sync to iOS
npm run ios:sync

# Open Xcode
npm run ios:open
```

**Important**: Before App Store submission, remove or comment out `server.url` in `capacitor.config.ts` to use bundled assets.

## App Configuration

### App Icons & Splash Screens

Generate assets using Capacitor Assets:
```bash
npx @capacitor/assets generate --ios
```

Place source images in:
- `resources/icon.png` (1024x1024)
- `resources/splash.png` (2732x2732)

### Modify App Info

Edit `ios/App/App/Info.plist` for:
- Bundle identifier
- Display name
- Permissions (if adding camera, location, etc.)

### Signing & Provisioning

In Xcode:
1. Select project → Signing & Capabilities
2. Choose your Team
3. Xcode will auto-generate provisioning profiles

## Plugins Used

- **@capacitor/core** - Base runtime
- **@capacitor/haptics** - Tactile feedback
- **@capacitor/preferences** - Persistent storage

## Troubleshooting

### Build fails with "Command PhaseScriptExecution failed"
```bash
cd ios/App
pod install
```

### Stale assets after web changes
```bash
npm run build
npx cap copy ios  # Faster than full sync
```

### App doesn't reflect code changes
- Ensure you ran `npm run build` after code changes
- Check `capacitor.config.ts` - if `server.url` is set, it loads from remote
- Clean build in Xcode: Product → Clean Build Folder (⇧⌘K)

### Safe area issues (notch cutting off UI)
Use the CSS utilities added in `src/index.css`:
```css
.safe-top { padding-top: env(safe-area-inset-top); }
.safe-area { /* all insets */ }
```

## Performance Tips

- **Animations**: Test on physical device; simulators can be misleading
- **Heavy shadows/gradients**: May impact 60fps on older devices
- **Haptics**: Only trigger on meaningful interactions to avoid fatigue

## Distribution

### TestFlight (Internal Testing)
1. Archive in Xcode: Product → Archive
2. Upload to App Store Connect
3. Add internal testers

### App Store Release
1. Remove dev `server.url` from `capacitor.config.ts`
2. Bump version in `ios/App/App.xcodeproj`
3. Archive & upload to App Store Connect
4. Submit for review

## Notes

- Deck reduced to **32 cards** (7→A, 8 per hand)
- Game state auto-saves using Preferences plugin
- Haptics gracefully degrade on web (no-op)
