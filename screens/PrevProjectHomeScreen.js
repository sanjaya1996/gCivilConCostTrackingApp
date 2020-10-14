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
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import GraphContainer from "../components/GraphContainer";
import ProjectNameContainer from "../components/ProjectNameContainer";
import PhaseAndPeople from "../components/PhaseAndPeople";
import LoadingSpinner from "../components/LoadingSpinner";
import * as projectsActions from "../store/actions/projects";
import * as projectPhasesActions from "../store/actions/categories";
import * as materialsActions from "../store/actions/materials";
import * as laborsActions from "../store/actions/labors";
import * as miscellanyActions from "../store/actions/miscellanies";

//Background Image
const image = {
  uri:
    "https://www.levelset.com/wp-content/uploads/2019/03/bigstock-Construction-Site-5042942.jpg",
};

const PrevProjectHomeScreen = (props) => {
  const passedProjectId = props.navigation.getParam("projectId");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

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
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    // dispatch(projectsActions.fetchHistoryProjects());
    loadProjectAndPhases();
  }, [dispatch, loadProjectAndPhases]);

  const loadedProject = useSelector(
    (state) => state.projects.userHistoryProjects
  ).find((project) => project.id === passedProjectId);

  const currentProjectCategories = useSelector(
    (state) => state.categories.projectCategories
  ).filter((category) => category.projectId.indexOf(passedProjectId) >= 0);

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

  return (
    <ScrollView>
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
                startedDate={loadedProject.startDate}
                estimatedDate={loadedProject.estimatedDate}
                estimatedBudget={loadedProject.estimatedBudget}
                editable={false}
              />
            </View>
          </ImageBackground>
        </View>

        <ProjectNameContainer projectName={loadedProject.projectTitle} />

        {currentProjectCategories.length > 0
          ? currentProjectCategories.map((item, index) => {
              return (
                <PhaseAndPeople
                  key={index}
                  title={item.title}
                  onSelect={() => {
                    props.navigation.navigate({
                      routeName: "PreviousProjectPhase",
                      params: {
                        phaseId: item.id,
                        phaseTitle: item.title,
                        editable: false,
                      },
                    });
                  }}
                />
              );
            })
          : null}
      </View>
    </ScrollView>
  );
};

PrevProjectHomeScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Your History",
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
  button: {
    marginVertical: 10,
  },
});
export default PrevProjectHomeScreen;
