import React, { useState, useCallback, useEffect } from "react";
import { View, Text, FlatList, Button, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import * as miniPhasesActions from "../store/actions/miniPhases";
import LoadingSpinner from "../components/LoadingSpinner";
import Card from "../components/Card";

const SpecialPhasesScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const userCurrentProject =
    useSelector((state) => state.projects.userProject) || [];
  const allProjectPhases = useSelector(
    (state) => state.categories.projectCategories
  );
  const userCurrentProjectPhases = allProjectPhases.filter(
    (phase) => phase.projectId.indexOf(userCurrentProject.id) >= 0
  );
  const allSpecialMiniPhases = useSelector(
    (state) => state.miniPhases.specialMiniPhases
  );
  const specialMiniPhases = allSpecialMiniPhases.filter((specialMphase) =>
    userCurrentProjectPhases.some(
      (projectPhase) => projectPhase.id === specialMphase.phaseId
    )
  );

  const dispatch = useDispatch();
  const loadSpecialMiniPhases = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(miniPhasesActions.fetchSpecialMphases());
    } catch (err) {
      setError(err.message);
    }
  }, [dispatch, setError]);

  useEffect(() => {
    let unmounted = false;
    loadSpecialMiniPhases().then(() => {
      if (!unmounted) {
        setIsLoading(false);
      }
    });
    return () => {
      unmounted = true;
    };
  }, [dispatch, loadSpecialMiniPhases]);

  const renderMiniPhase = (itemData) => {
    return (
      <View style={styles.cardsContainer}>
        <Card style={styles.card}>
          <View style={styles.title}>
            <Text style={styles.titleText}>{itemData.item.title}</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Button
              title="VIEW NOW"
              color="#1e90ff"
              onPress={() => {
                props.navigation.navigate({
                  routeName: "MiniPhase",
                  params: {
                    miniPhaseId: itemData.item.id,
                    miniPhaseTitle: itemData.item.title,
                    projectPhaseId: itemData.item.phaseId,
                    isSpcl: true,
                    editable: true,
                  },
                });
              }}
            />
          </View>
        </Card>
      </View>
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isLoading && specialMiniPhases.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={{ fontFamily: "open-sans" }}>
          No Special Tasks found. Start adding some!
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occured!</Text>
        <Button
          title="Try again"
          onPress={loadSpecialMiniPhases}
          color="#1e90ff"
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList data={specialMiniPhases} renderItem={renderMiniPhase} />
    </View>
  );
};

SpecialPhasesScreen.navigationOptions = {
  headerTitle: "Your Specials / WishList",
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
});
export default SpecialPhasesScreen;
