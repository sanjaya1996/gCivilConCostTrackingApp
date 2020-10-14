import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Card from "./Card";
import Colors from "../constant/Colors";

const MiniPhaseAssetsList = (props) => {
  const [showDetails, setShowDetails] = useState(false);
  const editable = props.editable;
  return (
    <Card style={styles.cardContainer}>
      <View style={styles.cardTitle}>
        <Text style={styles.boldText}>{props.title}</Text>
      </View>
      <View style={{ marginBottom: 20, flexDirection: "row" }}>
        <Text style={styles.boldText}>Total:</Text>
        <Text style={styles.defaultText}> $ {props.totalCost.toFixed(2)}</Text>
      </View>
      <View>
        <View style={editable ? styles.buttonsContainer : styles.showDetails}>
          {editable && (
            <View>
              <Ionicons
                name="md-create"
                size={24}
                color={Colors.buttonColor}
                onPress={props.onEdit}
              />
            </View>
          )}

          <View>
            <Button
              title={showDetails ? "Hide Details" : "Show Details"}
              color={Colors.buttonColor}
              onPress={() => setShowDetails((prevState) => !prevState)}
            />
          </View>
          {editable && (
            <View>
              <Ionicons
                name="ios-remove-circle-outline"
                size={24}
                color="red"
                onPress={props.onDelete}
              />
            </View>
          )}
        </View>
        {showDetails && (
          <View style={styles.details}>
            {props.quantity && (
              <View style={styles.quantityAndPrice}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.defaultText}>{props.quantity}</Text>
                  <Text style={styles.defaultText}> {props.title}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.defaultText}>{props.quantity} *</Text>
                  <Text style={styles.defaultText}>
                    {props.rate.toFixed(2)}{" "}
                  </Text>
                </View>
              </View>
            )}
            {props.laborName && (
              <View>
                <View style={{ alignItems: "center", padding: 10 }}>
                  <Text style={styles.defaultText}> {props.laborName} </Text>
                </View>
                <View style={styles.contacts}>
                  <Text style={styles.defaultText}>{props.contactNumber} </Text>
                  <Text style={styles.defaultText}>{props.email} </Text>
                </View>
                <View style={{ ...styles.contacts }}>
                  <View style={{ maxWidth: "50%" }}>
                    <Text style={styles.boldText}>Available:</Text>
                    <Text style={styles.defaultText}>{props.availability}</Text>
                  </View>
                  <View>
                    <Text style={styles.boldText}>Pay Rate: </Text>
                    <Text style={styles.defaultText}>
                      $ {props.rate.toFixed(2)} /hr
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.description}>
              <Text style={styles.defaultText}>{props.description}</Text>
            </View>
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    margin: 10,
    padding: 10,
  },
  cardTitle: {
    margin: 10,
    alignItems: "center",
  },
  buttonsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  showDetails: {
    alignItems: "center",
  },
  details: {
    width: "100%",
  },
  quantityAndPrice: {
    padding: 15,
    alignSelf: "center",
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  contacts: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    padding: 10,
  },
  defaultText: {
    fontFamily: "open-sans",
    fontSize: 18,
  },
  description: {
    alignItems: "center",
    padding: 10,
  },
  boldText: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
  },
});

export default MiniPhaseAssetsList;
