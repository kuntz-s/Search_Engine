import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text } from "react-native";
import { ThemeProvider } from "styled-components/native";
import {
  useFonts as useOpenSans,
  OpenSans_400Regular,
} from "@expo-google-fonts/open-sans";
import {
  useFonts as useRoboto,
  Roboto_400Regular,
} from "@expo-google-fonts/roboto";
import { Navigation } from "./src/infrastructure/navigation/index.js";
import { theme } from "./src/infrastructure/theme/index.js";
import { SearchContextProvider } from "./src/services/SearchContext.js";
//import { View, Text } from "react-native";

export default function App() {
  const [openSansLoaded] = useOpenSans({ OpenSans_400Regular });
  const [robotoLoaded] = useRoboto({ Roboto_400Regular });

  if (!robotoLoaded || !openSansLoaded) {
    return null;
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <SearchContextProvider>
          <Navigation/>
        </SearchContextProvider>
      </ThemeProvider>
      <StatusBar style="auto" />
    </>
  );
}
