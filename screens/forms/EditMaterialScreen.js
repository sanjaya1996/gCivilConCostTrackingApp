import React, { useState, useEffect, useCallback, useReducer } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../../components/HeaderButton";
import * as materialsActions from "../../store/actions/materials";
import Input from "../../components/Input";
import LoadingSpinner from "../../components/LoadingSpinner";
import Colors from "../../constant/Colors";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};

const EditMaterialScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const matId = props.navigation.getParam("mPhaseMaterialId");
  const mPhaseId = props.navigation.getParam("mPhaseId");
  const projectPhaseId = props.navigation.getParam("phaseId");
  const editedMaterial = useSelector((state) =>
    state.materials.miniPhaseMaterials.find((material) => material.id === matId)
  );
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      materialName: editedMaterial ? editedMaterial.materialName : "",
      quantityUsed: editedMaterial ? editedMaterial.quantityUsed : "",
      rate: editedMaterial ? editedMaterial.rate : "",
      totalCost: editedMaterial ? editedMaterial.totalCost : "",
      description: editedMaterial ? editedMaterial.description : "",
    },
    inputValidities: {
      materialName: editedMaterial ? true : false,
      quantityUsed: editedMaterial ? true : false,
      rate: editedMaterial ? true : false,
      totalCost: editedMaterial ? true : false,
      description: editedMaterial ? true : false,
    },
    formIsValid: editedMaterial ? true : false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert("An error occured!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert("Wrong input!", "Please check the errors in the form.", [
        { text: "Okay" },
      ]);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      if (editedMaterial) {
        await dispatch(
          materialsActions.updateMphaseMaterial(
            matId,
            formState.inputValues.materialName,
            +formState.inputValues.quantityUsed,
            +formState.inputValues.rate,
            +formState.inputValues.totalCost,
            formState.inputValues.description
          )
        );
      } else {
        await dispatch(
          materialsActions.createMphaseMaterial(
            mPhaseId,
            projectPhaseId,
            formState.inputValues.materialName,
            +formState.inputValues.quantityUsed,
            +formState.inputValues.rate,
            +formState.inputValues.totalCost,
            formState.inputValues.description
          )
        );
      }
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  }, [dispatch, matId, formState, mPhaseId, projectPhaseId]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <View style={styles.form}>
          <Input
            id="materialName"
            label="Material Name"
            errorText="Please enter a valid material!"
            autoCapitalize={"words"}
            autoCorrect
            returnKeyType={"next"}
            onInputChange={inputChangeHandler}
            initialValue={editedMaterial ? editedMaterial.materialName : ""}
            initiallyValid={!!editedMaterial}
            required
          />
          <Input
            id="quantityUsed"
            label="Quantity Used"
            errorText="Please enter a valid quantity!"
            keyboardType={"decimal-pad"}
            autoCorrect
            returnKeyType={"next"}
            onInputChange={inputChangeHandler}
            initialValue={
              editedMaterial ? `${editedMaterial.quantityUsed}` : ""
            }
            initiallyValid={!!editedMaterial}
            required
          />
          <Input
            id="rate"
            label="Price Rate"
            errorText="Please enter a valid amount!"
            keyboardType={"decimal-pad"}
            autoCorrect
            returnKeyType={"next"}
            onInputChange={inputChangeHandler}
            initialValue={editedMaterial ? `${editedMaterial.rate}` : ""}
            initiallyValid={!!editedMaterial}
            required
          />
          <Input
            id="totalCost"
            label="Budget Spent"
            errorText="Please enter a valid amount!"
            keyboardType={"decimal-pad"}
            autoCorrect
            returnKeyType={"next"}
            onInputChange={inputChangeHandler}
            initialValue={editedMaterial ? `${editedMaterial.totalCost}` : ""}
            initiallyValid={!!editedMaterial}
            required
          />
          <Input
            id="description"
            label="Description"
            errorText="Please enter a valid description!"
            keyboardType={"default"}
            autoCapitalize={"sentences"}
            autoCorrect
            multiline
            numberOfLines={3}
            onInputChange={inputChangeHandler}
            initialValue={editedMaterial ? editedMaterial.description : ""}
            initiallyValid={!!editedMaterial}
            required
            minLength={5}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

EditMaterialScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam("submit");
  return {
    headerTitle: navData.navigation.getParam("mPhaseMaterialId")
      ? "Edit Material"
      : "Add Material",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="submit"
          iconName="ios-checkmark-circle-outline"
          onPress={submitFn}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default EditMaterialScreen;
