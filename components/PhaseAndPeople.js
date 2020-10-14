import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import Colors from "../constant/Colors";

const PhaseAndPeople = (props) => {
  return (
    <TouchableOpacity
      style={styles.phasePeopleContainer}
      onPress={props.onSelect}
    >
      <View style={{ paddingBottom: 12, justifyContent: "center" }}>
        <Text style={styles.phaseText}> {props.title} </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  phasePeopleContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  phaseText: {
    fontFamily: "open-sans-bold",
    fontSize: Dimensions.get("window").width * 0.07,
    color: Colors.buttonColor,
    textDecorationLine: "underline",
  },
});
export default PhaseAndPeople;
