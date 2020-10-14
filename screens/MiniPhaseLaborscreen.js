import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";

import MiniPhaseAssetsList from "../components/MiniPhaseAssetsList";
import * as laborsActions from "../store/actions/labors";
import LoadingSpinner from "../components/LoadingSpinner";
import Colors from "../constant/Colors";

const MiniPhaseLaborsScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const passedMphaseId = props.navigation.getParam("mPhaseId");
  const passedPhaseId = props.navigation.getParam("projectPhaseId");
  const editable = props.navigation.getParam("editable");

  const availableLabors = useSelector((state) => state.labors.miniPhaseLabors);

  const dispatch = useDispatch();

  const loadLabors = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(laborsActions.fetchLabors());
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    loadLabors();
  }, [dispatch, loadLabors]);

  const miniPhaseLabors = availableLabors.filter(
    (labors) => labors.miniPhaseId.indexOf(passedMphaseId) >= 0
  );

  const addLaborHandler = (mPid, pId) => {
    props.navigation.navigate({
      routeName: "EditLabors",
      params: { miniPhaseId: mPid, phaseId: pId },
    });
  };

  const editLaborHandler = (id) => {
    props.navigation.navigate({
      routeName: "EditLabors",
      params: {
        mPhaseLbrId: id,
      },
    });
  };

  const deleteConfirmedHandler = async (id) => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(laborsActions.deleteMphaseLabor(id));
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  const deleteLaborHandler = (id) => {
    Alert.alert("Are you sure?", "Do you really want to delete this labor?", [
      { text: "No", style: "default" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => deleteConfirmedHandler(id),
      },
    ]);
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occured!</Text>
        <Button
          title="Try again"
          onPress={loadLabors}
          color={Colors.buttonColor}
        />
      </View>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isLoading && miniPhaseLabors.length === 0) {
    if (editable) {
      return (
        <View style={styles.centered}>
          <Text style={{ fontFamily: "open-sans" }}>
            No Labors found. Start adding Some !
          </Text>
          <View style={styles.addTaskContainer}>
            <View style={{ paddingRight: 10 }}>
              <Text style={{ fontSize: 30 }}>Add Labor</Text>
            </View>

            <View style={{ paddingLeft: 10 }}>
              <Ionicons
                name={Platform.OS === "android" ? "md-add-circle" : "md-add"}
                size={40}
                color={Colors.buttonColor}
                onPress={() => addLaborHandler(passedMphaseId, passedPhaseId)}
              />
            </View>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.centered}>
        <Text style={{ fontFamily: "open-sans" }}>No Labors found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {editable && (
        <View style={styles.addTaskContainer}>
          <View style={{ paddingRight: 10 }}>
            <Text style={{ fontSize: 30 }}>New Labor</Text>
          </View>

          <View style={{ paddingLeft: 10 }}>
            <Ionicons
              name={Platform.OS === "android" ? "md-add-circle" : "md-add"}
              size={40}
              color={Colors.buttonColor}
              onPress={() => addLaborHandler(passedMphaseId, passedPhaseId)}
            />
          </View>
        </View>
      )}

      <FlatList
        data={miniPhaseLabors}
        renderItem={(itemData) => (
          <View>
            <MiniPhaseAssetsList
              title={itemData.item.role}
              laborName={itemData.item.firstName + " " + itemData.item.lastName}
              rate={itemData.item.hourlyRate}
              contactNumber={itemData.item.phoneNumber}
              email={itemData.item.email}
              availability={itemData.item.availability}
              description={itemData.item.description}
              totalCost={itemData.item.amountPaid}
              onDelete={deleteLaborHandler.bind(this, itemData.item.id)}
              onEdit={() => editLaborHandler(itemData.item.id)}
              editable={editable}
            />
          </View>
        )}
      />
    </View>
  );
};

MiniPhaseLaborsScreen.navigationOptions = {
  headerTitle: "Labors",
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    margin: 10,
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
  cardContainer: {
    margin: 10,
    padding: 10,
  },
  cardTitle: {
    margin: 10,
    alignItems: "center",
  },
  totalAmount: {},
  buttonsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
export default MiniPhaseLaborsScreen;
