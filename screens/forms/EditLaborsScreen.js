import React, { useState, useEffect, useCallback, useReducer } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";

import HeaderButton from "../../components/HeaderButton";
import * as laborsActions from "../../store/actions/labors";
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

const EditLaborsScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const mphaseId = props.navigation.getParam("miniPhaseId");
  const projectPhaseId = props.navigation.getParam("phaseId");

  const lbrId = props.navigation.getParam("mPhaseLbrId");
  const editedLabor = useSelector((state) =>
    state.labors.miniPhaseLabors.find((labor) => labor.id === lbrId)
  );

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      fName: editedLabor ? editedLabor.firstName : "",
      lName: editedLabor ? editedLabor.lastName : "",
      email: editedLabor ? editedLabor.email : "",
      phone: editedLabor ? editedLabor.phoneNumber : "",
      role: editedLabor ? editedLabor.role : "",
      payRate: editedLabor ? editedLabor.hourlyRate : "",
      availability: editedLabor ? editedLabor.availability : "",
      amountPaid: editedLabor ? editedLabor.amountPaid : "",
      accountDetails: editedLabor ? editedLabor.accountDetails : "",
      description: editedLabor ? editedLabor.description : "",
    },
    inputValidities: {
      fName: editedLabor ? true : false,
      lName: editedLabor ? true : false,
      email: editedLabor ? true : false,
      phone: editedLabor ? true : false,
      role: editedLabor ? true : false,
      payRate: editedLabor ? true : false,
      availability: editedLabor ? true : false,
      amountPaid: editedLabor ? true : false,
      accountDetails: editedLabor ? true : false,
      description: editedLabor ? true : false,
    },
    formIsValid: editedLabor ? true : false,
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
      if (editedLabor) {
        await dispatch(
          laborsActions.updateMphaseLabor(
            lbrId,
            formState.inputValues.fName,
            formState.inputValues.lName,
            formState.inputValues.email,
            formState.inputValues.phone,
            formState.inputValues.role,
            +formState.inputValues.payRate,
            formState.inputValues.availability,
            +formState.inputValues.amountPaid,
            formState.inputValues.accountDetails,
            formState.inputValues.description
          )
        );
      } else {
        await dispatch(
          laborsActions.createMphaseLabor(
            mphaseId,
            projectPhaseId,
            formState.inputValues.fName,
            formState.inputValues.lName,
            formState.inputValues.email,
            formState.inputValues.phone,
            formState.inputValues.role,
            +formState.inputValues.payRate,
            formState.inputValues.availability,
            +formState.inputValues.amountPaid,
            formState.inputValues.accountDetails,
            formState.inputValues.description,
            formState.inputValues.fNameisValid
          )
        );
      }
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  }, [dispatch, lbrId, formState, mphaseId, projectPhaseId]);

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
            id="fName"
            label="First Name"
            errorText="Please enter a valid first name!"
            autoCapitalize={"words"}
            autoCorrect
            returnKeyType={"next"}
            onInputChange={inputChangeHandler}
            initialValue={editedLabor ? editedLabor.firstName : ""}
            initiallyValid={!!editedLabor}
            required
          />
          <Input
            id="lName"
            label="Last Name"
            errorText="Please enter a valid last name!"
            autoCapitalize={"words"}
            autoCorrect
            returnKeyType={"next"}
            onInputChange={inputChangeHandler}
            initialValue={editedLabor ? editedLabor.lastName : ""}
            initiallyValid={!!editedLabor}
          />
          <Input
            id="email"
            label="Email"
            errorText="Please enter a valid email address!"
            keyboardType={"email-address"}
            autoCapitalize={"none"}
            returnKeyType={"next"}
            onInputChange={inputChangeHandler}
            initialValue={editedLabor ? editedLabor.email : ""}
            initiallyValid={!!editedLabor}
            required
            email
          />
          <Input
            id="phone"
            label="Phone"
            errorText="Please enter a valid phone number!"
            keyboardType={"phone-pad"}
            onInputChange={inputChangeHandler}
            initialValue={editedLabor ? editedLabor.phoneNumber : ""}
            initiallyValid={!!editedLabor}
            required
          />
          <Input
            id="role"
            label="Role"
            errorText="Please enter a valid labor's role!"
            keyboardType={"default"}
            autoCapitalize={"words"}
            autoCorrect
            returnKeyType={"next"}
            onInputChange={inputChangeHandler}
            initialValue={editedLabor ? editedLabor.role : ""}
            initiallyValid={!!editedLabor}
            required
          />
          <Input
            id="payRate"
            label="Pay Rate"
            errorText="Please enter a valid amount!"
            keyboardType={"decimal-pad"}
            returnKeyType={"next"}
            onInputChange={inputChangeHandler}
            initialValue={editedLabor ? `${editedLabor.hourlyRate}` : ""}
            initiallyValid={!!editedLabor}
            required
          />
          <Input
            id="availability"
            label="Availability"
            errorText="Please enter a valid day!"
            keyboardType={"default"}
            autoCapitalize={"words"}
            autoCorrect
            returnKeyType={"next"}
            onInputChange={inputChangeHandler}
            initialValue={editedLabor ? editedLabor.availability : ""}
            initiallyValid={!!editedLabor}
            required
          />
          <Input
            id="amountPaid"
            label="Amount Paid"
            errorText="Please enter a valid amount!"
            keyboardType={"decimal-pad"}
            returnKeyType={"next"}
            onInputChange={inputChangeHandler}
            initialValue={editedLabor ? `${editedLabor.amountPaid}` : ""}
            initiallyValid={!!editedLabor}
            required
          />
          <Input
            id="accountDetails"
            label="Account Details"
            errorText="Please enter a valid account!"
            keyboardType={"default"}
            returnKeyType={"next"}
            onInputChange={inputChangeHandler}
            initialValue={editedLabor ? editedLabor.accountDetails : ""}
            initiallyValid={!!editedLabor}
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
            initialValue={editedLabor ? editedLabor.description : ""}
            initiallyValid={!!editedLabor}
            required
            minLength={5}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

EditLaborsScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam("submit");
  return {
    headerTitle: navData.navigation.getParam("mPhaseLbrId")
      ? "Edit Labor"
      : "Add New Labor",
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

export default EditLaborsScreen;
