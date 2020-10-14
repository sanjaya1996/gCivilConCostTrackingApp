import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Button,
  ImageBackground,
  Platform,
  Alert,
  StatusBar,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import GraphContainer from "../components/GraphContainer";
import ProjectNameContainer from "../components/ProjectNameContainer";
import PhaseAndPeople from "../components/PhaseAndPeople";
import HeaderButton from "../components/HeaderButton";
import AddNewItem from "../components/AddNewItem";
import LoadingSpinner from "../components/LoadingSpinner";
import DefaultStatusBar from "../components/DefaultStatusBar";
import Colors from "../constant/Colors";
import Card from "../components/Card";
import * as projectsActions from "../store/actions/projects";
import * as projectPhasesActions from "../store/actions/categories";
import * as materialsActions from "../store/actions/materials";
import * as laborsActions from "../store/actions/labors";
import * as miscellanyActions from "../store/actions/miscellanies";
import * as clientsActions from "../store/actions/clients";
import * as supervisorsActions from "../store/actions/supervisors";

//Background Image
const image = {
  uri:
    "https://www.levelset.com/wp-content/uploads/2019/03/bigstock-Construction-Site-5042942.jpg",
};

const HomeScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState();

  const userProject = useSelector((state) => state.projects.userProject);

  const client = useSelector((state) =>
    state.clients.clients.find((client) => client.projectId === userProject.id)
  );
  const dispatch = useDispatch();

  const loadProjectAndPhases = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(projectsActions.fetchProjects());
      await dispatch(projectPhasesActions.fetchProjectPhases());
      await dispatch(materialsActions.fetchMaterials());
      await dispatch(laborsActions.fetchLabors());
      await dispatch(miscellanyActions.fetchMiscellanies());
      await dispatch(clientsActions.fetchClients());
      await dispatch(supervisorsActions.fetchSupervisors());
    } catch (err) {
      setError(err.message);
    }
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    // dispatch(projectsActions.fetchHistoryProjects());
    let unmounted = false;
    loadProjectAndPhases().then(() => {
      if (!unmounted) {
        setIsLoading(false);
      }
    });
    return () => {
      unmounted = true;
    };
  }, [dispatch, loadProjectAndPhases]);

  const availableCategories = useSelector(
    (state) => state.categories.projectCategories
  );

  const currentProjectCategories = availableCategories.filter(
    (category) => category.projectId.indexOf(userProject.id) >= 0
  );

  // Getting all available labors, materials and miscellanies
  const allLabors = useSelector((state) => state.labors.miniPhaseLabors);
  const allMaterials = useSelector(
    (state) => state.materials.miniPhaseMaterials
  );
  const allMiscellanies = useSelector(
    (state) => state.miscellanies.miniPhaseMiscellanies
  );

  //Loaded Project's all Labors, Materials and Miscellanies
  const loadedProjAllMaterials = allMaterials.filter((material) =>
    currentProjectCategories.some(
      (category) => category.id === material.phaseId
    )
  );
  const loadedProjAllLabors = allLabors.filter((labor) =>
    currentProjectCategories.some((category) => category.id === labor.phaseId)
  );
  const loadedProjAllMiscellanies = allMiscellanies.filter((miscellany) =>
    currentProjectCategories.some(
      (category) => category.id === miscellany.phaseId
    )
  );

  //Calculating total cost of each.
  const projectTotalLaborCost = loadedProjAllLabors
    .map((labor) => labor.amountPaid)
    .reduce((total, next) => (total += next), 0);
  const projectTotalMaterialCost = loadedProjAllMaterials
    .map((material) => material.totalCost)
    .reduce((total, next) => (total += next), 0);
  const projectTotalOtherCost = loadedProjAllMiscellanies
    .map((miscellany) => miscellany.totalCost)
    .reduce((total, next) => (total += next), 0);

  // Calculating total budget Spent
  const projectTotalBudgetSpent =
    projectTotalLaborCost + projectTotalMaterialCost + projectTotalOtherCost;

  const deleteConfirmHandler = async (id) => {
    try {
      setError(null);
      setIsDeleting(true);
      await dispatch(clientsActions.deleteClient(id));
    } catch (err) {
      setError(err.message);
    }
    setIsDeleting(false);
  };

  const deleteClientHandler = (id) => {
    Alert.alert("Are you sure?", "Do you really want to delete this client?", [
      { text: "No", style: "default" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => deleteConfirmHandler(id),
      },
    ]);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occured!</Text>
        <Button title="Try again" onPress={loadProjectAndPhases} />
      </View>
    );
  }

  if (!isLoading && userProject.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={{ fontFamily: "open-sans" }}>
          You don't have any project recently!
        </Text>
        <Text style={{ fontFamily: "open-sans" }}>
          Do you want to start new one ?
        </Text>
        <AddNewItem
          title="Start New Project"
          onSelect={() => {
            props.navigation.navigate({
              routeName: "EditProject",
            });
          }}
        />
      </View>
    );
  }

  return (
    <ScrollView>
      <DefaultStatusBar />
      <View style={styles.screen}>
        <View style={styles.card}>
          <ImageBackground source={image} style={styles.image} blurRadius={0}>
            <View style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
              <View style={{ alignItems: "center" }}>
                <View style={styles.companyName}>
                  <Text style={styles.companyNameText}>GREEN</Text>
                  <Text style={styles.companyNameText}>
                    {"  "} CIVIL {"  "}
                  </Text>
                  <Text style={styles.companyNameText}>CON</Text>
                </View>
              </View>

              <GraphContainer
                textColor="white"
                budgetSpent={projectTotalBudgetSpent}
                startedDate={userProject.startDate}
                estimatedDate={userProject.estimatedDate}
                estimatedBudget={userProject.estimatedBudget}
                editable={true}
              />
              <View style={styles.editProject}>
                <Ionicons
                  name="md-create"
                  size={24}
                  color={Colors.buttonColor}
                  onPress={() =>
                    props.navigation.navigate({
                      routeName: "EditProject",
                      params: { projectId: userProject.id },
                    })
                  }
                />
              </View>
            </View>
          </ImageBackground>
        </View>

        <ProjectNameContainer projectName={userProject.projectTitle} />

        {currentProjectCategories.length > 0
          ? currentProjectCategories.map((item, index) => {
              return (
                <PhaseAndPeople
                  key={index}
                  title={item.title}
                  onSelect={() => {
                    props.navigation.navigate({
                      routeName: "ProjectPhase",
                      params: {
                        phaseId: item.id,
                        phaseTitle: item.title,
                        editable: true,
                      },
                    });
                  }}
                />
              );
            })
          : null}
        <View style={styles.footer}>
          {currentProjectCategories.length === 0 ? (
            <AddNewItem
              title="Start Construction"
              textSize={18}
              onSelect={() =>
                props.navigation.navigate({
                  routeName: "EditProjectPhase",
                  params: { title: "Construction", projectId: userProject.id },
                })
              }
            />
          ) : null}

          {currentProjectCategories.length === 1 ? (
            <AddNewItem
              title="Start Interior Design"
              textSize={18}
              onSelect={() =>
                props.navigation.navigate({
                  routeName: "EditProjectPhase",
                  params: {
                    title: "Interior Design",
                    projectId: userProject.id,
                  },
                })
              }
            />
          ) : null}

          {currentProjectCategories.length === 2 ? (
            <AddNewItem
              title="Start Maintenance"
              textSize={18}
              onSelect={() =>
                props.navigation.navigate({
                  routeName: "EditProjectPhase",
                  params: { title: "Maintenance", projectId: userProject.id },
                })
              }
            />
          ) : null}

          <View
            style={{
              ...styles.client,
              alignItems: client ? null : "center",
            }}
          >
            {client ? (
              <View>
                <View>
                  <Text style={{ fontFamily: "open-sans-bold", fontSize: 16 }}>
                    Client:{" "}
                  </Text>
                </View>
                <Card>
                  <View>
                    <View style={styles.clientName}>
                      <Text style={styles.defaultText}>
                        {client.firstName + " " + client.lastName}
                      </Text>
                    </View>
                    <View style={styles.clientDetails}>
                      <Text style={styles.defaultText}>
                        {client.phoneNumber}
                      </Text>
                      <Text style={styles.defaultText}>{client.email}</Text>
                    </View>

                    <View style={styles.buttonsContainer}>
                      <View>
                        <Ionicons
                          name="md-create"
                          size={24}
                          color={Colors.buttonColor}
                          onPress={() =>
                            props.navigation.navigate({
                              routeName: "EditPeople",
                              params: { clientId: client.id },
                            })
                          }
                        />
                      </View>
                      <View></View>
                      <View>
                        {isDeleting ? (
                          <LoadingSpinner size="small" />
                        ) : (
                          <Ionicons
                            name="ios-remove-circle-outline"
                            size={24}
                            color="red"
                            onPress={() => deleteClientHandler(client.id)}
                          />
                        )}
                      </View>
                    </View>
                  </View>
                </Card>
              </View>
            ) : (
              <AddNewItem
                title="Add Client"
                textSize={18}
                onSelect={() =>
                  props.navigation.navigate({
                    routeName: "EditPeople",
                    params: { projectId: userProject.id },
                  })
                }
              />
            )}
          </View>

          <View style={styles.button}>
            <Button
              title="Finish project"
              color={Colors.accentColor}
              onPress={() => {
                Alert.alert(
                  "Are you sure?",
                  "It will remove your project to history!",
                  [
                    { text: "No", style: "default" },
                    {
                      text: "Yes",
                      style: "destructive",
                      onPress: () =>
                        dispatch(projectsActions.finishProject(userProject)),
                    },
                  ]
                );
              }}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
HomeScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Your Project",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName="ios-menu"
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
    flex: 1,
    marginTop: 10,
    padding: 10,
    paddingTop: 0,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  card: {
    flex: 1,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    overflow: "hidden",
  },
  companyName: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  companyNameText: {
    color: "white",
    fontFamily: "open-sans-bold",
    fontSize: 20,
  },
  addTaskContainer: {
    flexDirection: "row",
    marginLeft: 5,
    padding: 10,
  },
  image: {
    resizeMode: "cover",
    justifyContent: "center",
  },
  editProject: {
    alignSelf: "flex-end",
    margin: 20,
    backgroundColor: "white",
    width: 30,
    alignItems: "center",
  },
  footer: {
    margin: 20,
    alignItems: "center",
  },
  client: {
    margin: 40,
    width: "100%",
  },
  clientName: {
    flexDirection: "row",
    alignSelf: "center",
    padding: 10,
  },
  clientDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  defaultText: {
    fontFamily: "open-sans",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  button: {
    marginVertical: 10,
  },
});

export default HomeScreen;
