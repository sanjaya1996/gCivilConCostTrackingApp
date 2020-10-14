import React from "react";
import { StatusBar, Platform } from "react-native";

const DefaultStatusBar = () => {
  return (
    <StatusBar
      barStyle={Platform.OS === "android" ? "light-content" : "dark-content"}
      backgroundColor="black"
    />
  );
};

export default DefaultStatusBar;
