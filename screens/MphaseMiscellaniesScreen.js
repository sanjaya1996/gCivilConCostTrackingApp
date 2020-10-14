import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Platform,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";

import MiniPhaseAssetsList from "../components/MiniPhaseAssetsList";
import * as miscellaniesActions from "../store/actions/miscellanies";
import LoadingSpinner from "../components/LoadingSpinner";
import Colors from "../constant/Colors";

const MphaseMiscellaniesScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const passedMiniPhaseId = props.navigation.getParam("mPhaseId");
  const passedPhaseId = props.navigation.getParam("projectPhaseId");
  const editable = props.navigation.getParam("editable");

  const availableMiscellanies = useSelector(
    (state) => state.miscellanies.miniPhaseMiscellanies
  );
  const dispatch = useDispatch();

  const loadMiscellanies = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(miscellaniesActions.fetchMiscellanies());
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    loadMiscellanies();
  }, [dispatch, loadMiscellanies]);

  const displayedOtherExpenses = availableMiscellanies.filter(
    (others) => others.miniPhaseId.indexOf(passedMiniPhaseId) >= 0
  );

  const deleteConfirmedHandler = async (id) => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(miscellaniesActions.deleteMphaseMiscellany(id));
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  const deleteHandler = (id) => {
    Alert.alert("Are you sure?", "Do you really want to delete this?", [
      { text: "No", style: "default" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => deleteConfirmedHandler(id),
      },
    ]);
  };

  const addMiscellanyHandler = (mpId, pId) => {
    props.navigation.navigate({
      routeName: "EditMiscellany",
      params: { miniPhaseId: mpId, phaseId: pId },
    });
  };

  const editMiscellanyHandler = (id) => {
    props.navigation.navigate({
      routeName: "EditMiscellany",
      params: {
        mPhaseMiscellanyId: id,
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
        <Button
          title="Try again"
          onPress={loadMiscellanies}
          color={Colors.buttonColor}
        />
      </View>
    );
  }

  if (!isLoading && displayedOtherExpenses.length === 0) {
    if (editable) {
      return (
        <View style={styles.centered}>
          <Text style={{ fontFamily: "open-sans" }}>
            No Other requirements found. Start adding Some !
          </Text>
          <View style={styles.addTaskContainer}>
            <View style={{ paddingRight: 10 }}>
              <Text style={{ fontSize: 30 }}>Add Now</Text>
            </View>

            <View style={{ paddingLeft: 10 }}>
              <Ionicons
                name={Platform.OS === "android" ? "md-add-circle" : "md-add"}
                size={40}
                color={Colors.buttonColor}
                onPress={() =>
                  addMiscellanyHandler(passedMiniPhaseId, passedPhaseId)
                }
              />
            </View>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.centered}>
        <Text style={{ fontFamily: "open-sans" }}>
          No Other requirements found.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.addTaskContainer}>
        <View style={{ paddingRight: 10 }}>
          <Text style={{ fontSize: 30 }}>Add New</Text>
        </View>

        <View style={{ paddingLeft: 10 }}>
          <Ionicons
            name={Platform.OS === "android" ? "md-add-circle" : "md-add"}
            size={40}
            color={Colors.buttonColor}
            onPress={() =>
              addMiscellanyHandler(passedMiniPhaseId, passedPhaseId)
            }
          />
        </View>
      </View>

      <FlatList
        data={displayedOtherExpenses}
        renderItem={(itemData) => (
          <View>
            <MiniPhaseAssetsList
              title={itemData.item.title}
              totalCost={itemData.item.totalCost}
              description={itemData.item.description}
              onDelete={deleteHandler.bind(this, itemData.item.id)}
              onEdit={() => editMiscellanyHandler(itemData.item.id)}
              editable={editable}
            />
          </View>
        )}
      />
    </View>
  );
};

MphaseMiscellaniesScreen.navigationOptions = {
  headerTitle: "Other",
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
});
export default MphaseMiscellaniesScreen;
