import React, { useState, useEffect, useCallback, useReducer } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";

import HeaderButton from "../../components/HeaderButton";
import * as miniPhasesActions from "../../store/actions/miniPhases";
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

const EditMiniPhaseScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const phaseId = props.navigation.getParam("mainPhaseId");
  const mPhaseId = props.navigation.getParam("miniPhaseId");
  const editedMiniPhase = useSelector((state) =>
    state.miniPhases.miniPhases.find((phase) => phase.id === mPhaseId)
  );
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedMiniPhase ? editedMiniPhase.title : "",
      status: editedMiniPhase ? editedMiniPhase.status : "",
      description: editedMiniPhase ? editedMiniPhase.description : "",
    },
    inputValidities: {
      title: editedMiniPhase ? true : false,
      status: editedMiniPhase ? true : false,
      description: editedMiniPhase ? true : false,
    },
    formIsValid: editedMiniPhase ? true : false,
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
      if (editedMiniPhase) {
        await dispatch(
          miniPhasesActions.updateMiniPhase(
            mPhaseId,
            formState.inputValues.title,
            formState.inputValues.status,
            formState.inputValues.description
          )
        );
      } else {
        await dispatch(
          miniPhasesActions.createMiniPhase(
            phaseId,
            formState.inputValues.title,
            formState.inputValues.status,
            formState.inputValues.description
          )
        );
      }
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  }, [dispatch, mPhaseId, formState, phaseId]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        input: inputIdentifier,
        isValid: inputValidity,
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
            id="title"
            label="Title"
            errorText="Please enter a valid title!"
            autoCapitalize={"words"}
            autoCorrect
            returnKeyType={"next"}
            onInputChange={inputChangeHandler}
            initialValue={editedMiniPhase ? editedMiniPhase.title : ""}
            initiallyValid={!!editedMiniPhase}
            required
          />
          <Input
            id="status"
            label="Status"
            errorText="Please enter a valid status!"
            autoCorrect
            returnKeyType={"next"}
            onInputChange={inputChangeHandler}
            initialValue={editedMiniPhase ? editedMiniPhase.status : ""}
            initiallyValid={!!editedMiniPhase}
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
            initialValue={editedMiniPhase ? editedMiniPhase.description : ""}
            initiallyValid={!!editedMiniPhase}
            required
            minLength={5}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

EditMiniPhaseScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam("submit");
  return {
    headerTitle: navData.navigation.getParam("miniPhaseId")
      ? "Edit Your Task"
      : "Add New Task",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Add"
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
  formControl: {
    width: "100%",
  },
  label: {
    fontFamily: "open-sans-bold",
    marginVertical: 8,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
});

export default EditMiniPhaseScreen;
