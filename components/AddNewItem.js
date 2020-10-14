import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../constant/Colors";

const AddNewItem = (props) => {
  return (
    <View style={styles.addTaskContainer}>
      <View style={{ paddingRight: 10 }}>
        <Text style={{ ...styles.title, fontSize: props.textSize || 30 }}>
          {props.title}
        </Text>
      </View>

      <View style={{ paddingLeft: 10 }}>
        <Ionicons
          name={Platform.OS === "android" ? "md-add-circle" : "md-add"}
          size={props.textSize + 7 || 40}
          color={Colors.buttonColor}
          onPress={props.onSelect}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  addTaskContainer: {
    flexDirection: "row",
    marginLeft: 5,
    padding: 10,
  },
  title: {
    fontFamily: "open-sans",
  },
});

export default AddNewItem;
