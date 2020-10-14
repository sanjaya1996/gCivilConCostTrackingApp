import React from "react";
import { HeaderButton } from "react-navigation-header-buttons";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";

import Colors from "../constant/Colors";

const CustomHeaderButton = (props) => {
  return (
    <HeaderButton
      {...props}
      IconComponent={Ionicons}
      iconSize={23}
      color={Platform.OS === "ios" ? Colors.navBarColor : "white"}
    />
  );
};

export default CustomHeaderButton;
