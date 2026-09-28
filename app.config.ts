import type { ExpoConfig } from "expo/config";

/**
 * Configuração do aplicativo (Expo).
 * O identificador do pacote é o mesmo usado na geração do APK pelo EAS Build.
 */

const BUNDLE_ID = "com.app.motivaapp";

const config: ExpoConfig = {
  name: "Motiva",
  slug: "motiva-app",
  // Conta Expo dona do projeto no EAS. Sem isso, o build para e pergunta
  // qual conta usar, porque ha mais de uma com permissao.
  owner: "leobacelarcunha",
  version: "4.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "motiva",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: BUNDLE_ID,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: BUNDLE_ID,
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#000000",
        },
      },
    ],
    [
      "expo-build-properties",
      {
        android: {
          buildArchs: ["armeabi-v7a", "arm64-v8a"],
          minSdkVersion: 24,
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  // Projeto no EAS. Como este config e dinamico (.ts), o eas-cli nao
  // consegue gravar o id sozinho e ele precisa ficar aqui.
  extra: {
    eas: {
      projectId: "311ad129-96c4-4645-a9c5-459b0e284184",
    },
  },
};

export default config;
