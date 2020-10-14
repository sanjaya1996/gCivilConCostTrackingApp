import React, { useReducer, useCallback, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Text,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../../components/HeaderButton";
import Input from "../../components/Input";
import * as supervisorsActions from "../../store/actions/supervisors";
import ImagePicker from "../../components/ImagePicker";

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

const EditProfileScreen = (props) => {
  const supervisorId = props.navigation.getParam("superId");
  const editedUser = useSelector((state) =>
    state.supervisors.supervisors.find(
      (supervisor) => supervisor.id === supervisorId
    )
  );
  const [selectedImage, setSelectedImage] = useState(
    editedUser ? editedUser.profilePic : null
  );
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      fName: editedUser ? editedUser.firstName : "",
      lName: editedUser ? editedUser.lastName : "",
      email: editedUser ? editedUser.email : "",
      phone: editedUser ? editedUser.phoneNumber : "",
      jobTitle: editedUser ? editedUser.jobTitle : "",
    },
    inputValidities: {
      fName: editedUser ? true : false,
      lName: editedUser ? true : false,
      email: editedUser ? true : false,
      phone: editedUser ? true : false,
      jobTitle: editedUser ? true : false,
    },
    formIsValid: editedUser ? true : false,
  });

  const dispatch = useDispatch();

  const submitHandler = useCallback(() => {
    if (!formState.formIsValid) {
      Alert.alert("Wrong input!", "Please check the errors in the form!", [
        { text: "Okay" },
      ]);
      return;
    }
    if (editedUser) {
      dispatch(
        supervisorsActions.updateSupervisorProfile(
          supervisorId,
          formState.inputValues.fName,
          formState.inputValues.lName,
          formState.inputValues.email,
          formState.inputValues.phone,
          formState.inputValues.jobTitle,
          selectedImage
        )
      );
    } else {
      dispatch(
        supervisorsActions.createSupervisorProfile(
          formState.inputValues.fName,
          formState.inputValues.lName,
          formState.inputValues.email,
          formState.inputValues.phone,
          formState.inputValues.jobTitle,
          selectedImage
        )
      );
    }
    props.navigation.goBack();
  }, [dispatch, formState, supervisorId, selectedImage]);

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

  const imageTakenHandler = (imagePath) => {
    setSelectedImage(imagePath);
  };

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
            initialValue={editedUser ? editedUser.firstName : ""}
            initiallyValid={!!editedUser}
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
            initialValue={editedUser ? editedUser.lastName : ""}
            initiallyValid={!!editedUser}
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
            initialValue={editedUser ? editedUser.email : ""}
            initiallyValid={!!editedUser}
            required
            email
          />
          <Input
            id="phone"
            label="Phone"
            errorText="Please enter a valid phone number!"
            keyboardType={"phone-pad"}
            returnKeyType={"next"}
            onInputChange={inputChangeHandler}
            initialValue={editedUser ? editedUser.phoneNumber : ""}
            initiallyValid={!!editedUser}
            required
          />
          <Input
            id="jobTitle"
            label="Job Title"
            errorText="Please enter a valid job!"
            autoCapitalize={"words"}
            autoCorrect
            onInputChange={inputChangeHandler}
            initialValue={editedUser ? editedUser.jobTitle : ""}
            initiallyValid={!!editedUser}
            required
          />
        </View>
        <ImagePicker
          initialImageUri={editedUser ? editedUser.profilePic : null}
          onImageTaken={imageTakenHandler}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
});

EditProfileScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam("submit");
  return {
    headerTitle: "Edit Profile",
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

export default EditProfileScreen;
