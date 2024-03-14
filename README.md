# Pomodoro Timer
A mobile application to support work using the Pomodoro Technique.


[<img src="/assets/download.svg">](https://apps.apple.com/jp/app/%E3%83%9D%E3%83%A2%E3%83%89%E3%83%BC%E3%83%AD%E9%9B%86%E4%B8%AD%E4%BD%9C%E6%A5%AD/id6478929673?l=en-US)

<img src="/assets/screentshots/6.7/focus1.png" style="width: 24%; height: auto;" />
<img src="/assets/screentshots/6.7/focus2.png" style="width: 24%; height: auto;" />
<img src="/assets/screentshots/6.7/break1.png" style="width: 24%; height: auto;" />
<img src="/assets/screentshots/6.7/setting.png" style="width: 24%; height: auto;" />

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
npx expo start -c (If Tailwind doesn't work)
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

## Audio
1. Install expo-av
```
npx expo install expo-av
```

## Troubleshooting
```
npm install -g eas-cli to update eas-cli
```