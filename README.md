# Pomodoro Timer
A mobile application to support work using the Pomodoro Technique.

<!-- ![Showcase](/assets/showcase.png) -->

## Technology
- TypeScript
- React Native
- Tailwind CSS

[![My Skills](https://skillicons.dev/icons?i=ts,react,tailwind)](https://skillicons.dev)


## Create App
1. Create a project
```
npx create-expo-app -t expo-template-blank-typescript
```
2. Install TailwindCSS/NativeWind
```
npm install nativewind
npm install --save-dev tailwindcss@3.3.2
```
3. Create and edit tailwind.config.js
4. Edit babel.config.js
```
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "nativewind/babel",
    ],
  };
};
```
5. Start Expo
```
npx expo start
npx expo start-c (If Tailwind doesn't work)
```

## Setup
1. Update version in app.json
2. Build app
```
eas device:create
eas build --platform ios
```
3. Download ipa file
4. Upload ipa to Apple Store Connect by Transporter