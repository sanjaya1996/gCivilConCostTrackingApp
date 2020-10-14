import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { FontAwesome5, FontAwesome } from "@expo/vector-icons";

import Card from "../components/Card";
import Colors from "../constant/Colors";

const ProjectNameContainer = (props) => {
  return (
    <Card style={styles.projectNameContainer}>
      <View style={styles.projectName}>
        <Text style={styles.titleText}>{props.projectName}</Text>
      </View>
      <View style={styles.projectNameChild}>
        <View>
          <Text style={styles.defaultText}>
            Shower <FontAwesome5 name="cloud-rain" size={24} /> 18°C
          </Text>
        </View>
        <View>
          <Text style={styles.defaultText}>
            Sydney NSW 2220{" "}
            <FontAwesome
              name="map-marker"
              size={24}
              color={Colors.buttonColor}
            />
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  projectNameContainer: {
    margin: 10,
  },
  projectName: {
    alignItems: "center",
    paddingBottom: 20,
  },
  projectNameChild: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  titleText: {
    fontFamily: "open-sans-bold",
    fontSize: 20,
  },
  defaultText: {
    fontFamily: "open-sans",
  },
});
export default ProjectNameContainer;
