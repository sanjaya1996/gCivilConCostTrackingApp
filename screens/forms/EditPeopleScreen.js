import React, { useReducer, useCallback, useEffect, useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import Input from "../../components/Input";
import HeaderButton from "../../components/HeaderButton";
import * as clientActions from "../../store/actions/clients";
import * as managersActions from "../../store/actions/managers";
import LoadingSpinner from "../../components/LoadingSpinner";

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

const EditPeopleScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const clientId = props.navigation.getParam("clientId");
  const managerId = props.navigation.getParam("managerId");
  const clientProjectId = props.navigation.getParam("projectId");
  const editedClient = useSelector((state) =>
    state.clients.clients.find((client) => client.id === clientId)
  );
  const editedManager = useSelector((state) =>
    state.managers.managers.find((manager) => manager.id === managerId)
  );
  let editedPeople;
  if (editedManager) {
    editedPeople = editedManager;
    editedManager;
  } else if (editedClient) {
    editedPeople = editedClient;
  }
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      fName: editedPeople ? editedPeople.firstName : "",
      lName: editedPeople ? editedPeople.lastName : "",
      email: editedPeople ? editedPeople.email : "",
      phone: editedPeople ? editedPeople.phoneNumber : "",
    },
    inputValidities: {
      fName: editedPeople ? true : false,
      lName: editedPeople ? true : false,
      email: editedPeople ? true : false,
      phone: editedPeople ? true : false,
    },
    formIsValid: editedPeople ? true : false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert("An error occured", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert("Wrong input!", "Please check the errors in the form!", [
        { text: "Okay" },
      ]);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      if (editedClient) {
        await dispatch(
          clientActions.updateClient(
            clientId,
            formState.inputValues.fName,
            formState.inputValues.lName,
            formState.inputValues.email,
            formState.inputValues.phone
          )
        );
      } else if (clientProjectId) {
        await dispatch(
          clientActions.createClient(
            clientProjectId,
            formState.inputValues.fName,
            formState.inputValues.lName,
            formState.inputValues.email,
            formState.inputValues.phone
          )
        );
      } else if (editedManager) {
        await dispatch(
          managersActions.updateManager(
            managerId,
            formState.inputValues.fName,
            formState.inputValues.lName,
            formState.inputValues.phone,
            formState.inputValues.email
          )
        );
      } else {
        await dispatch(
          managersActions.createManager(
            formState.inputValues.fName,
            formState.inputValues.lName,
            formState.inputValues.phone,
            formState.inputValues.email
          )
        );
      }
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, formState, clientId, clientProjectId]);

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
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <View style={styles.form}>
          <Input
            id="fName"
            label="First Name"
            errorText="Please enter a valid first name!"
            autoCapitalize={"words"}
            autoCorrect
            returnKeyType={"next"}
            onInputChange={inputChangeHandler}
            initialValue={editedPeople ? editedPeople.firstName : ""}
            initiallyValid={!!editedPeople}
            required
          />
          <Input
            id="lName"
            label="Last Name"
            errorText="Please enter a valid first name!"
            autoCapitalize={"words"}
            autoCorrect
            returnKeyType={"next"}
            onInputChange={inputChangeHandler}
            initialValue={editedPeople ? editedPeople.lastName : ""}
            initiallyValid={!!editedPeople}
            required
          />
          <Input
            id="email"
            label="E-mail"
            errorText="Please enter a valid email address!"
            keyboardType={"email-address"}
            autoCapitalize={"none"}
            returnKeyType={"next"}
            onInputChange={inputChangeHandler}
            initialValue={editedPeople ? editedPeople.email : ""}
            initiallyValid={!!editedPeople}
            required
            email
          />
          <Input
            id="phone"
            label="Phone"
            errorText="Please enter a valid phone number!"
            keyboardType={"phone-pad"}
            onInputChange={inputChangeHandler}
            initialValue={editedPeople ? editedPeople.phoneNumber : ""}
            initiallyValid={!!editedPeople}
            required
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

EditPeopleScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam("submit");
  return {
    headerTitle: "Edit Client",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
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

export default EditPeopleScreen;
