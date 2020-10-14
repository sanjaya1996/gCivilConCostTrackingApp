import React, { useState, useEffect, useCallback, useReducer } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../../components/HeaderButton";
import * as miscellaniesActions from "../../store/actions/miscellanies";
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

const EditMiscellanyScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const mPhaseId = props.navigation.getParam("miniPhaseId");
  const projectPhaseId = props.navigation.getParam("phaseId");
  const miscelId = props.navigation.getParam("mPhaseMiscellanyId");
  const editedMiscellany = useSelector((state) =>
    state.miscellanies.miniPhaseMiscellanies.find(
      (miscellany) => miscellany.id === miscelId
    )
  );
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedMiscellany ? editedMiscellany.title : "",
      description: editedMiscellany ? editedMiscellany.description : "",
      totalCost: editedMiscellany ? editedMiscellany.totalCost : "",
    },
    inputValidities: {
      title: editedMiscellany ? true : false,
      description: editedMiscellany ? true : false,
      totalCost: editedMiscellany ? true : false,
    },
    formIsValid: editedMiscellany ? true : false,
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
      if (editedMiscellany) {
        await dispatch(
          miscellaniesActions.updateMphaseMiscellany(
            miscelId,
            formState.inputValues.title,
            formState.inputValues.description,
            +formState.inputValues.totalCost
          )
        );
      } else {
        await dispatch(
          miscellaniesActions.createMphaseMiscellany(
            mPhaseId,
            projectPhaseId,
            formState.inputValues.title,
            formState.inputValues.description,
            +formState.inputValues.totalCost
          )
        );
      }
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  }, [dispatch, miscelId, formState, mPhaseId, projectPhaseId]);

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
            initialValue={editedMiscellany ? editedMiscellany.title : ""}
            initiallyValid={!!editedMiscellany}
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
            initialValue={editedMiscellany ? editedMiscellany.description : ""}
            initiallyValid={!!editedMiscellany}
            required
            minLength={5}
          />
          <Input
            id="totalCost"
            label="Total Cost"
            errorText="Please enter a valid amount!"
            keyboardType={"decimal-pad"}
            autoCorrect
            returnKeyType={"next"}
            onInputChange={inputChangeHandler}
            initialValue={
              editedMiscellany ? `${editedMiscellany.totalCost}` : ""
            }
            initiallyValid={!!editedMiscellany}
            required
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

EditMiscellanyScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam("submit");
  return {
    headerTitle: navData.navigation.getParam("mPhaseMiscellanyId")
      ? "Edit Other Expenses"
      : "Add Other Expenses",
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
});

export default EditMiscellanyScreen;
