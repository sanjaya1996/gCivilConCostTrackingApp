import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Button,
  Platform,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";

import MiniPhaseAssetsList from "../components/MiniPhaseAssetsList";
import * as materialsActions from "../store/actions/materials";
import LoadingSpinner from "../components/LoadingSpinner";
import Colors from "../constant/Colors";

const MiniPhaseMaterialsScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const passedMiniPhaseId = props.navigation.getParam("mPhaseId");
  const passedPhaseId = props.navigation.getParam("projectPhaseId");
  const editable = props.navigation.getParam("editable");
  const availableMaterials = useSelector(
    (state) => state.materials.miniPhaseMaterials
  );
  const dispatch = useDispatch();

  const loadMaterials = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(materialsActions.fetchMaterials());
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      "willFocus",
      loadMaterials
    ); // For drawer Navigator to load after revisiting because in drawer it stores everything in memory in first load.

    return () => {
      willFocusSub.remove();
    };
  }, [loadMaterials]);

  useEffect(() => {
    loadMaterials();
  }, [dispatch, loadMaterials]);

  const displayedMaterials = availableMaterials.filter(
    (materials) => materials.miniPhaseId.indexOf(passedMiniPhaseId) >= 0
  );

  const deleteConfirmedHandler = async (id) => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(materialsActions.deleteMphaseMaterial(id));
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  const deleteHandler = (id) => {
    Alert.alert(
      "Are you Sure?",
      "Do you really want to delete this material?",
      [
        { text: "No", style: "default" },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => deleteConfirmedHandler(id),
        },
      ]
    );
  };

  const editMaterialHandler = (id) => {
    props.navigation.navigate({
      routeName: "EditMaterial",
      params: {
        mPhaseMaterialId: id,
      },
    });
  };

  const addMaterialHandler = (mPid, pId) => {
    props.navigation.navigate({
      routeName: "EditMaterial",
      params: {
        mPhaseId: mPid,
        phaseId: pId,
      },
    });
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occured!</Text>
        <Button
          title="Try again"
          onPress={loadMaterials}
          color={Colors.buttonColor}
        />
      </View>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isLoading && displayedMaterials.length === 0) {
    if (editable) {
      return (
        <View style={styles.centered}>
          <Text style={{ fontFamily: "open-sans" }}>
            No Materials found. Start adding Some !
          </Text>
          <View style={styles.addTaskContainer}>
            <View style={{ paddingRight: 10 }}>
              <Text style={{ fontSize: 30 }}>Add Material</Text>
            </View>

            <View style={{ paddingLeft: 10 }}>
              <Ionicons
                name={Platform.OS === "android" ? "md-add-circle" : "md-add"}
                size={40}
                color={Colors.buttonColor}
                onPress={() =>
                  addMaterialHandler(passedMiniPhaseId, passedPhaseId)
                }
              />
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.centered}>
          <Text style={{ fontFamily: "open-sans" }}>No Materials found.</Text>
        </View>
      );
    }
  }
  return (
    <View style={styles.screen}>
      {editable && (
        <View style={styles.addTaskContainer}>
          <View style={{ paddingRight: 10 }}>
            <Text style={{ fontSize: 30 }}>New Material</Text>
          </View>

          <View style={{ paddingLeft: 10 }}>
            <Ionicons
              name={Platform.OS === "android" ? "md-add-circle" : "md-add"}
              size={40}
              color={Colors.buttonColor}
              onPress={() =>
                addMaterialHandler(passedMiniPhaseId, passedPhaseId)
              }
            />
          </View>
        </View>
      )}

      <FlatList
        data={displayedMaterials}
        renderItem={(itemData) => (
          <View>
            <MiniPhaseAssetsList
              title={itemData.item.materialName}
              quantity={itemData.item.quantityUsed}
              rate={itemData.item.rate}
              totalCost={itemData.item.totalCost}
              description={itemData.item.description}
              onDelete={deleteHandler.bind(this, itemData.item.id)}
              onEdit={editMaterialHandler.bind(this, itemData.item.id)}
              editable={editable}
            />
          </View>
        )}
      />
    </View>
  );
};

MiniPhaseMaterialsScreen.navigationOptions = {
  headerTitle: "Materials",
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
export default MiniPhaseMaterialsScreen;
