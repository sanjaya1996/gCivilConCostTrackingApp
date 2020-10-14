import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

import Colors from "../constant/Colors";

const LoadingSpinner = (props) => {
  return (
    <View style={styles.centered}>
      <ActivityIndicator
        size={props.size || "large"}
        color={Colors.primaryColor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoadingSpinner;
