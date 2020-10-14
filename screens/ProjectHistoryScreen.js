import React, { useState, useEffect, useCallback } from "react";
import {
  FlatList,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  Text,
  StyleSheet,
  Platform,
  Alert,
  Button,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";

import HeaderButton from "../components/HeaderButton";
import LoadingSpinner from "../components/LoadingSpinner";
import * as projectsActions from "../store/actions/projects";
import * as categoriesActions from "../store/actions/categories";
import * as miniPhasesActions from "../store/actions/miniPhases";
import * as laborsActions from "../store/actions/labors";
import * as materialsActions from "../store/actions/materials";
import * as miscellaniesActions from "../store/actions/miscellanies";
import Colors from "../constant/Colors";

const ProjectHistoryScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const dispatch = useDispatch();

  const loadHistoryProjects = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(projectsActions.fetchHistoryProjects());
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      "willFocus",
      loadHistoryProjects
    );

    return () => {
      willFocusSub.remove();
    };
  }, [loadHistoryProjects]);

  useEffect(() => {
    let unmounted = false;
    loadHistoryProjects().then(() => {
      if (!unmounted) {
        setIsLoading(false);
      }
    });
    return () => {
      unmounted = true;
    };
  }, [dispatch, loadHistoryProjects]);

  const userHistoryProjects = useSelector(
    (state) => state.projects.userHistoryProjects
  );

  const userProjectClients = useSelector((state) => state.clients.clients);

  const allProjectPhases = useSelector(
    (state) => state.categories.projectCategories
  );
  const allMiniPhases = useSelector((state) => state.miniPhases.miniPhases);
  const allLabors = useSelector((state) => state.labors.miniPhaseLabors);
  const allMaterials = useSelector(
    (state) => state.materials.miniPhaseMaterials
  );
  const allMiscellanies = useSelector(
    (state) => state.miscellanies.miniPhaseMiscellanies
  );

  const deleteConfirmedHandler = async (
    projectId,
    phaseIds,
    mPIds,
    lbrIds,
    matIds,
    misclnyIds
  ) => {
    setIsLoading(true);
    await dispatch(projectsActions.deleteHistoryProject(projectId));
    await dispatch(categoriesActions.deletePhasesOnDltProject(phaseIds));
    await dispatch(miniPhasesActions.deleteMphaseOnDltProject(mPIds));
    await dispatch(laborsActions.deleteLaborsOnDltProject(lbrIds));
    await dispatch(materialsActions.deleteMaterialsOnDltProject(matIds));
    await dispatch(
      miscellaniesActions.deleteMiscellanyOnDltProject(misclnyIds)
    );
    setIsLoading(false);
  };

  const deleteProjectHandler = (
    projectId,
    phaseIds,
    mPIds,
    lbrIds,
    matIds,
    misclnyIds
  ) => {
    Alert.alert(
      "Are you sure?",
      "Do you really want to delete project? Because, you will loose everything belongs to this project!",
      [
        { text: "No", style: "default" },
        {
          text: "Yes",
          style: "destructive",
          onPress: () =>
            deleteConfirmedHandler(
              projectId,
              phaseIds,
              mPIds,
              lbrIds,
              matIds,
              misclnyIds
            ),
        },
      ]
    );
  };

  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occured!</Text>
        <Button title="Try again" onPress={loadHistoryProjects} />
      </View>
    );
  }

  if (!isLoading && userHistoryProjects.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={{ fontFamily: "open-sans" }}>
          You don't have any Previous Projects!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        keyExtractor={(item) => item.id}
        data={userHistoryProjects}
        renderItem={(itemData) => {
          const projectClient = userProjectClients.find(
            (client) => client.projectId === itemData.item.id
          );
          // Getting all assets belonging to rendered project. It's purpose is to delete all assets that belong to the deleted project.
          const phasesOfRenderedProject = allProjectPhases.filter(
            (phase) => phase.projectId.indexOf(itemData.item.id) >= 0
          );
          const mPhasesOfRenderedProject = allMiniPhases.filter((miniPhase) =>
            phasesOfRenderedProject.some(
              (phase) => phase.id === miniPhase.phaseId
            )
          );
          const laborsOfRenderedProject = allLabors.filter((labor) =>
            phasesOfRenderedProject.some((phase) => phase.id === labor.phaseId)
          );
          const materialsOfRenderedProject = allMaterials.filter((material) =>
            phasesOfRenderedProject.some(
              (phase) => phase.id === material.phaseId
            )
          );
          const miscellaniesOfRenderedProj = allMiscellanies.filter(
            (miscellany) =>
              phasesOfRenderedProject.some(
                (phase) => phase.id === miscellany.phaseId
              )
          );
          // Getting Ids to pass in dispatch function to perform delete operation.
          const projectPhaseIds = phasesOfRenderedProject.map(
            (phase) => phase.id
          );
          const miniPhaseIds = mPhasesOfRenderedProject.map(
            (mPhase) => mPhase.id
          );
          const laborIds = laborsOfRenderedProject.map((labor) => labor.id);
          const materialIds = materialsOfRenderedProject.map(
            (material) => material.id
          );
          const miscellanyIds = miscellaniesOfRenderedProj.map(
            (miscellany) => miscellany.id
          );

          return (
            <View style={styles.gridItem}>
              <TouchableCmp
                style={{ flex: 1 }}
                onPress={() =>
                  props.navigation.navigate({
                    routeName: "PreviousProjectHome",
                    params: { projectId: itemData.item.id },
                  })
                }
              >
                <View style={styles.card}>
                  <View style={styles.title}>
                    <Text style={styles.titleText}>
                      {itemData.item.projectTitle}
                    </Text>
                  </View>

                  <View style={styles.cardFooter}>
                    <View style={styles.dataContainer}>
                      <Text style={styles.labelText}>Client: </Text>
                      {projectClient ? (
                        <Text style={styles.valueText}>
                          {projectClient.firstName +
                            " " +
                            projectClient.lastName}
                        </Text>
                      ) : (
                        <Text style={styles.valueText}>No client!</Text>
                      )}
                    </View>
                    <View style={styles.dataContainer}>
                      <Text style={styles.labelText}>Completed: </Text>
                      <Text style={styles.valueText}> 17 Aug 2020</Text>
                    </View>
                    <View style={styles.deleteButton}>
                      <Ionicons
                        name="ios-remove-circle-outline"
                        size={24}
                        color="red"
                        onPress={() =>
                          deleteProjectHandler(
                            itemData.item.id,
                            projectPhaseIds,
                            miniPhaseIds,
                            laborIds,
                            materialIds,
                            miscellanyIds
                          )
                        }
                      />
                    </View>
                  </View>
                </View>
              </TouchableCmp>
            </View>
          );
        }}
      />
    </View>
  );
};

ProjectHistoryScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Completed Projects",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName="ios-menu"
          color="white"
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  screen: {
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    // backgroundColor: "rgba(0,0,0,0.75)",
    backgroundColor: "white",
    margin: 10,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
    borderRadius: 10,
  },
  gridItem: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
  },

  title: {
    alignItems: "center",
    padding: 10,
  },
  titleText: {
    color: Colors.buttonColor,
    fontFamily: "open-sans-bold",
    fontSize: 20,
    textDecorationLine: "underline",
  },
  viewButton: {
    alignItems: "center",
    marginVertical: 10,
  },
  cardFooter: {
    padding: 10,
  },
  dataContainer: {
    flexDirection: "row",
    padding: 5,
  },
  labelText: {
    fontFamily: "open-sans-bold",
  },
  valueText: {
    fontFamily: "open-sans",
  },
  deleteButton: {
    alignSelf: "flex-end",
  },
});
export default ProjectHistoryScreen;
