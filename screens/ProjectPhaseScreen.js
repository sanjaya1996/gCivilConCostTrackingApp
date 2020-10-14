import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import * as projectPhasesActions from "../store/actions/categories";
import * as miniPhasesActions from "../store/actions/miniPhases";
import * as laborsActions from "../store/actions/labors";
import * as materialsActions from "../store/actions/materials";
import * as miscellanyActions from "../store/actions/miscellanies";
import GraphContainer from "../components/GraphContainer";
import HeaderButton from "../components/HeaderButton";
import LoadingSpinner from "../components/LoadingSpinner";
import Card from "../components/Card";
import Colors from "../constant/Colors";

const ProjectPhaseScreen = (props) => {
  const editable = props.navigation.getParam("editable");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const dispatch = useDispatch();

  const loadPhaseAndMiniPhases = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(projectPhasesActions.fetchProjectPhases());
      await dispatch(miniPhasesActions.fetchMiniPhases());
      await dispatch(miniPhasesActions.fetchSpecialMphases());
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    loadPhaseAndMiniPhases();
  }, [dispatch, loadPhaseAndMiniPhases]);

  const specialMiniPhases = useSelector(
    (state) => state.miniPhases.specialMiniPhases
  );

  const editMiniPhaseHandler = (id) => {
    props.navigation.navigate("EditMiniPhase", { miniPhaseId: id });
  };

  const deleteConfirmedHandler = async (
    id,
    laborIds,
    materialIds,
    miscellanyIds
  ) => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(miniPhasesActions.deleteMiniPhase(id));
      await dispatch(laborsActions.deleteLaborsOnDltMphase(laborIds));
      await dispatch(materialsActions.deleteMaterialsOnDltMphase(materialIds));
      await dispatch(
        miscellanyActions.deleteMiscellanyOnDltMphase(miscellanyIds)
      );
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  const deleteHandler = (id, lbrIds, matIds, misclIds) => {
    Alert.alert("Are you sure?", "Do you really want to delete this task?", [
      { text: "No", style: "default" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => deleteConfirmedHandler(id, lbrIds, matIds, misclIds),
      },
    ]);
  };

  const renderMiniPhase = (itemData) => {
    const isSpecial = specialMiniPhases.some(
      (phase) => phase.id === itemData.item.id
    );

    // getting all assets of miniPhase so that we can delete everything whenever miniPhase is deleted.
    const currentMpLabors = currentPhaseLabors.filter(
      (labor) => labor.miniPhaseId.indexOf(itemData.item.id) >= 0
    );
    const currentMpMaterials = currentPhaseMaterials.filter(
      (material) => material.miniPhaseId.indexOf(itemData.item.id) >= 0
    );
    const currentMpMiscellanies = currentPhaseMiscellanies.filter(
      (miscellany) => miscellany.miniPhaseId.indexOf(itemData.item.id) >= 0
    );
    // getting ids
    const laborIds = currentMpLabors.map((item) => item.id);
    const materialIds = currentMpMaterials.map((item) => item.id);
    const miscellanyIds = currentMpMiscellanies.map((item) => item.id);

    return (
      <View style={styles.cardsContainer}>
        <Card style={styles.card}>
          <View style={styles.title}>
            <Text style={styles.titleText}>{itemData.item.title}</Text>
          </View>
          <View style={styles.buttonsContainer}>
            {editable && (
              <View>
                <Ionicons
                  name="md-create"
                  size={24}
                  color={Colors.buttonColor}
                  onPress={() => {
                    editMiniPhaseHandler(itemData.item.id);
                  }}
                />
              </View>
            )}

            <View>
              <Button
                title="VIEW NOW"
                color={Colors.buttonColor}
                onPress={() => {
                  props.navigation.navigate({
                    routeName: editable
                      ? "MiniPhase"
                      : "PreviousProjectMiniPhase",
                    params: {
                      miniPhaseId: itemData.item.id,
                      miniPhaseTitle: itemData.item.title,
                      projectPhaseId: projectPhaseId,
                      isSpcl: isSpecial,
                      editable: editable,
                    },
                  });
                }}
              />
            </View>
            {editable && (
              <View>
                <Ionicons
                  name="ios-remove-circle-outline"
                  size={24}
                  color="red"
                  onPress={() =>
                    deleteHandler(
                      itemData.item.id,
                      laborIds,
                      materialIds,
                      miscellanyIds
                    )
                  }
                />
              </View>
            )}
          </View>
        </Card>
      </View>
    );
  };

  const projectPhaseId = props.navigation.getParam("phaseId");
  const currentProjectPhase = useSelector((state) =>
    state.categories.projectCategories.find(
      (phase) => phase.id === projectPhaseId
    )
  );

  const availableMiniPhases = useSelector(
    (state) => state.miniPhases.miniPhases
  );
  const availableLabors = useSelector((state) => state.labors.miniPhaseLabors);
  const availableMaterials = useSelector(
    (state) => state.materials.miniPhaseMaterials
  );
  const availableMiscellanies = useSelector(
    (state) => state.miscellanies.miniPhaseMiscellanies
  );

  const displayedminiPhases = availableMiniPhases.filter(
    (miniPhase) => miniPhase.phaseId.indexOf(projectPhaseId) >= 0
  );

  const currentPhaseLabors = availableLabors.filter(
    (labor) => labor.phaseId === projectPhaseId
  );

  const currentPhaseMaterials = availableMaterials.filter(
    (material) => material.phaseId === projectPhaseId
  );
  const currentPhaseMiscellanies = availableMiscellanies.filter(
    (miscellany) => miscellany.phaseId === projectPhaseId
  );

  const currentPhaseTotalLbrCost = currentPhaseLabors
    .map((item) => item.amountPaid)
    .reduce((total, next) => total + next, 0);
  const currentPhaseTotalMatCost = currentPhaseMaterials
    .map((item) => item.totalCost)
    .reduce((total, next) => total + next, 0);
  const currentPhaseTotalOtherCost = currentPhaseMiscellanies
    .map((item) => item.totalCost)
    .reduce((total, next) => total + next, 0);

  const phaseTotalBudgetSpent =
    currentPhaseTotalLbrCost +
    currentPhaseTotalMatCost +
    currentPhaseTotalOtherCost;

  const addMiniPhaseHandler = () => {
    props.navigation.navigate({
      routeName: "EditMiniPhase",
      params: {
        mainPhaseId: projectPhaseId,
      },
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occured!</Text>
        <Button title="Try again" onPress={loadPhaseAndMiniPhases} />
      </View>
    );
  }

  return (
    <FlatList
      ListHeaderComponent={
        <>
          <View style={styles.screen}>
            <GraphContainer
              textColor="white"
              textBackGroundColor=""
              projectPhase={true}
              laborCost={currentPhaseTotalLbrCost}
              materialCost={currentPhaseTotalMatCost}
              otherCost={currentPhaseTotalOtherCost}
              budgetSpent={phaseTotalBudgetSpent}
              startedDate={currentProjectPhase.startDate}
              estimatedDate={currentProjectPhase.estimatedDate}
              estimatedBudget={currentProjectPhase.estimatedBudget}
              editable={true}
            />
          </View>
          {editable && (
            <View style={styles.addTaskContainer}>
              <View style={{ paddingRight: 10 }}>
                <Text style={{ fontSize: 30 }}>New Task</Text>
              </View>

              <View style={{ paddingLeft: 10 }}>
                <Ionicons
                  name={Platform.OS === "android" ? "md-add-circle" : "md-add"}
                  size={40}
                  color={Colors.buttonColor}
                  onPress={addMiniPhaseHandler}
                />
              </View>
            </View>
          )}
        </>
      }
      data={displayedminiPhases}
      renderItem={renderMiniPhase}
      ListFooterComponent={
        <View>
          {displayedminiPhases.length === 0 ? (
            <View style={{ ...styles.centered, marginVertical: 20 }}>
              <Text style={styles.fallbackText}>No task found !</Text>
              {editable && (
                <Text style={styles.fallbackText}>
                  Maybe start adding some tasks?
                </Text>
              )}
            </View>
          ) : null}
        </View>
      }
    />
  );
};

ProjectPhaseScreen.navigationOptions = (navigationData) => {
  const pId = navigationData.navigation.getParam("phaseId");
  const title = navigationData.navigation.getParam("phaseTitle");
  const editable = navigationData.navigation.getParam("editable");
  if (editable) {
    return {
      headerTitle: title,
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            iconName="md-create"
            onPress={() => {
              navigationData.navigation.navigate("EditProjectPhase", {
                projPhaseId: pId,
              });
            }}
          />
        </HeaderButtons>
      ),
    };
  } else {
    return { headerTitle: title };
  }
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginTop: 20,
    marginHorizontal: 15,
    paddingTop: 0,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "rgba(20,20,30,0.9)",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addTaskContainer: {
    flexDirection: "row",
    marginLeft: 5,
    padding: 10,
  },
  cardsContainer: {
    paddingBottom: 25,
  },
  card: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
  title: {
    alignItems: "center",
    padding: 10,
  },
  titleText: {
    fontFamily: "open-sans-bold",
    fontSize: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  fallbackText: {
    fontFamily: "open-sans",
    fontSize: 16,
  },
});
export default ProjectPhaseScreen;
