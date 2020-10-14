import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Button,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";

import HeaderButton from "../components/HeaderButton";
import * as miniPhasesActions from "../store/actions/miniPhases";
import Card from "../components/Card";
import Colors from "../constant/Colors";

const MiniPhaseScreen = (props) => {
  const [error, setError] = useState();

  const passedMiniPhaseId = props.navigation.getParam("miniPhaseId");
  const passedPhaseId = props.navigation.getParam("projectPhaseId");
  const editable = props.navigation.getParam("editable");

  const renderedMiniPhase = useSelector((state) =>
    state.miniPhases.miniPhases.find(
      (miniPhase) => miniPhase.id === passedMiniPhaseId
    )
  );
  const currentPhaseIsSpecial = useSelector((state) =>
    state.miniPhases.specialMiniPhases.some(
      (phase) => phase.id === passedMiniPhaseId
    )
  );
  const currentMphaseLabors = useSelector(
    (state) => state.labors.miniPhaseLabors
  ).filter((labor) => labor.miniPhaseId === passedMiniPhaseId);

  const currentMphasemiscellanies = useSelector(
    (state) => state.miscellanies.miniPhaseMiscellanies
  ).filter((miscellany) => miscellany.miniPhaseId === passedMiniPhaseId);

  const currentMphaseMaterials = useSelector(
    (state) => state.materials.miniPhaseMaterials
  ).filter((material) => material.miniPhaseId === passedMiniPhaseId);

  const dispatch = useDispatch();

  const loadSpecialMiniPhases = useCallback(async () => {
    setError(null);
    try {
      await dispatch(miniPhasesActions.fetchSpecialMphases());
    } catch (err) {
      setError(err.message);
    }
  }, [setError, currentPhaseIsSpecial]);

  useEffect(() => {
    loadSpecialMiniPhases();
  }, [currentPhaseIsSpecial, loadSpecialMiniPhases]);

  const toggleSpecialHandler = useCallback(async () => {
    await dispatch(
      miniPhasesActions.toggleSpecial(renderedMiniPhase, currentPhaseIsSpecial)
    );
  }, [currentPhaseIsSpecial]);

  useEffect(() => {
    props.navigation.setParams({ toggleSpcl: toggleSpecialHandler });
  }, [toggleSpecialHandler]);

  useEffect(() => {
    props.navigation.setParams({ isSpcl: currentPhaseIsSpecial });
  }, [currentPhaseIsSpecial]);

  const mPhaseTotalLaborCost = currentMphaseLabors
    .map((labor) => labor.amountPaid)
    .reduce((total, currentCost) => (total += currentCost), 0);

  const mPhaseTotalMaterialCost = currentMphaseMaterials
    .map((material) => material.totalCost)
    .reduce((total, currentCost) => (total += currentCost), 0);

  const mPhaseTotalOtherCost = currentMphasemiscellanies
    .map((miscellany) => miscellany.totalCost)
    .reduce((total, currentCost) => (total += currentCost), 0);

  const mPhaseTotalBudgetSpent =
    mPhaseTotalLaborCost + mPhaseTotalMaterialCost + mPhaseTotalOtherCost;

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occured!</Text>
        <Button
          title="Try again"
          onPress={loadSpecialMiniPhases}
          color={Colors.buttonColor}
        />
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.title}>
        <Text style={{ ...styles.labelText, color: "black" }}>
          $$$ COST TRACKING $$$
        </Text>
      </View>
      <View>
        <Card style={{ ...styles.cardContainer, margin: 10 }}>
          <View style={styles.cardHeader}>
            <View style={styles.titleContainer}>
              <Text style={{ ...styles.labelText, color: "black" }}>
                Total Cost
              </Text>
            </View>
          </View>
          <View style={styles.costContainer}>
            <Text style={styles.value}>
              $ {mPhaseTotalBudgetSpent.toFixed(2)}{" "}
            </Text>
          </View>
        </Card>
        <Card style={styles.cardContainer}>
          <View style={styles.cardHeader}>
            <TouchableOpacity
              style={styles.titleContainer}
              onPress={() => {
                props.navigation.navigate({
                  routeName: editable
                    ? "MiniPhaseLabors"
                    : "PreviousProjectMphaseLabor",
                  params: {
                    mPhaseId: passedMiniPhaseId,
                    projectPhaseId: passedPhaseId,
                    editable: editable,
                  },
                });
              }}
            >
              <Text style={styles.labelText}>Labors</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.costContainer}>
            <Text style={styles.value}>
              $ {mPhaseTotalLaborCost.toFixed(2)}{" "}
            </Text>
          </View>
        </Card>

        <Card style={styles.cardContainer}>
          <View style={styles.cardHeader}>
            <TouchableOpacity
              style={styles.titleContainer}
              onPress={() => {
                props.navigation.navigate({
                  routeName: editable
                    ? "MiniPhaseMaterials"
                    : "PreviousProjectMphaseMaterial",
                  params: {
                    mPhaseId: passedMiniPhaseId,
                    projectPhaseId: passedPhaseId,
                    editable: editable,
                  },
                });
              }}
            >
              <Text style={styles.labelText}>Materials</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.costContainer}>
            <Text style={styles.value}>
              $ {mPhaseTotalMaterialCost.toFixed(2)}
            </Text>
          </View>
        </Card>

        <Card style={styles.cardContainer}>
          <View style={styles.cardHeader}>
            <TouchableOpacity
              style={styles.titleContainer}
              onPress={() => {
                props.navigation.navigate({
                  routeName: editable
                    ? "MphaseMiscellaneous"
                    : "PreviousProjectMphaseOther",
                  params: {
                    mPhaseId: passedMiniPhaseId,
                    projectPhaseId: passedPhaseId,
                    editable: editable,
                  },
                });
              }}
            >
              <Text style={styles.labelText}>Other</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.costContainer}>
            <Text style={styles.value}>
              $ {mPhaseTotalOtherCost.toFixed(2)}{" "}
            </Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
};

MiniPhaseScreen.navigationOptions = (navigationData) => {
  // const passedMiniPhaseId = navigationData.navigation.getParam("miniPhaseId");
  // const selectedMiniPhase = MINIPHASES.find(
  //   (miniphase) => miniphase.id === passedMiniPhaseId
  // );
  const miniPhaseTitle = navigationData.navigation.getParam("miniPhaseTitle");
  const toggleSpecial = navigationData.navigation.getParam("toggleSpcl");
  const isSpecial = navigationData.navigation.getParam("isSpcl");
  const editable = navigationData.navigation.getParam("editable") || false;
  if (editable) {
    return {
      headerTitle: miniPhaseTitle,
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="Favorite"
            iconName={isSpecial ? "ios-star" : "ios-star-outline"}
            color="white"
            onPress={toggleSpecial}
          />
        </HeaderButtons>
      ),
    };
  }
  return { headerTitle: miniPhaseTitle };
};

const styles = StyleSheet.create({
  title: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  cardContainer: {
    margin: "10%",
    marginVertical: "5%",
    padding: 10,
    alignItems: "center",
  },
  cardHeader: {
    width: "90%",
    borderBottomWidth: 0.7,
    borderBottomColor: "#ccc",
  },
  titleContainer: {
    alignItems: "center",
    marginVertical: 15,
  },
  costContainer: {
    paddingVertical: 15,
  },
  labelText: {
    color: Colors.buttonColor,
    fontFamily: "open-sans-bold",
    fontSize: 18,
  },
  value: {
    fontFamily: "open-sans",
    fontSize: 18,
  },
});
export default MiniPhaseScreen;
