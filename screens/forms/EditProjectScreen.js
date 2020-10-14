import React, { useState, useEffect, useCallback, useReducer } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Text,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";

import HeaderButton from "../../components/HeaderButton";
import * as projectsActions from "../../store/actions/projects";
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
    const updatedValidites = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidites) {
      updatedFormIsValid = updatedFormIsValid && updatedValidites[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidites,
      inputValues: updatedValues,
    };
  }
  return state;
};

const EditProjectScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const projectId = props.navigation.getParam("projectId");
  const editedProject = useSelector((state) =>
    state.projects.projects.find((project) => project.id === projectId)
  );

  const [startedDate, setStartedDate] = useState(
    editedProject ? editedProject.startDate : ""
  );
  const [estimatedDate, setEstimatedDate] = useState(
    editedProject ? editedProject.estimatedDate : ""
  );
  const [datesAreValid, setDatesAreValid] = useState(
    editedProject ? true : false
  );

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProject ? editedProject.projectTitle : "",
      location: editedProject ? editedProject.projectAddress : "",
      estimatedBudget: editedProject ? editedProject.estimatedBudget : "",
    },
    inputValidities: {
      title: editedProject ? true : false,
      location: editedProject ? true : false,
      estimatedBudget: editedProject ? true : false,
    },
    formIsValid: editedProject ? true : false,
  });

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isEstDatePickerVisible, setIsEstDatePickerVisible] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const showEstDatePicker = () => {
    setIsEstDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const hideEstDatePicker = () => {
    setIsEstDatePickerVisible(false);
  };

  const handleConfirm = (datetime) => {
    setStartedDate(moment(datetime).format("DD MMM YYYY"));
    hideDatePicker();
  };
  const handleConfirmEstDate = (datetime) => {
    setEstimatedDate(moment(datetime).format("DD MMM YYYY"));
    hideEstDatePicker();
  };

  useEffect(() => {
    if (error) {
      Alert.alert("An error occured!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  useEffect(() => {
    if (
      startedDate.trim().length === 0 ||
      estimatedDate.trim().length === 0 ||
      new Date(estimatedDate) < new Date(startedDate) ||
      new Date(startedDate) > new Date() ||
      new Date(estimatedDate) < new Date()
    ) {
      setDatesAreValid(false);
    } else {
      setDatesAreValid(true);
    }
  }, [estimatedDate, startedDate]);

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid || !datesAreValid) {
      Alert.alert("Wrong input!", "Please check the errors in the form!", [
        { text: "Okay" },
      ]);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      if (editedProject) {
        await dispatch(
          projectsActions.updateProject(
            projectId,
            formState.inputValues.title,
            formState.inputValues.location,
            startedDate,
            estimatedDate,
            +formState.inputValues.estimatedBudget
          )
        );
      } else {
        await dispatch(
          projectsActions.createProject(
            formState.inputValues.title,
            formState.inputValues.location,
            startedDate,
            estimatedDate,
            +formState.inputValues.estimatedBudget
          )
        );
      }
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  }, [projectId, formState, startedDate, estimatedDate, datesAreValid]);

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
            label="Project Title"
            errorText="Please enter a valid title!"
            autoCapitalize={"words"}
            autoCorrect
            returnKeyType={"next"}
            onInputChange={inputChangeHandler}
            initialValue={editedProject ? editedProject.projectTitle : ""}
            initiallyValid={!!editedProject}
            required
          />
          <Input
            id="location"
            label="Project Location"
            errorText="Please enter a valid address!"
            autoCapitalize={"words"}
            autoCorrect
            returnKeyType={"next"}
            onInputChange={inputChangeHandler}
            initialValue={editedProject ? editedProject.projectAddress : ""}
            initiallyValid={!!editedProject}
            required
          />

          <View style={styles.formControl}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.label}>Started Date:</Text>
              <Ionicons
                name="ios-calendar"
                size={24}
                color={Colors.buttonColor}
                onPress={showDatePicker}
              />
            </View>
            <TextInput
              style={styles.input}
              value={startedDate}
              onChangeText={(text) => setStartedDate(text)}
              editable={false}
            />
            {startedDate.trim().length === 0 && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Please enter a valid date!</Text>
              </View>
            )}
            {new Date(startedDate) > new Date() && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  Started date must be small/equal to current date!
                </Text>
              </View>
            )}
            {new Date(estimatedDate) < new Date(startedDate) && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  Started date must be smaller than estimated date!
                </Text>
              </View>
            )}
          </View>

          <View style={styles.formControl}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.label}>Estimated Completion Date:</Text>
              <Ionicons
                name="ios-calendar"
                size={24}
                color={Colors.buttonColor}
                onPress={showEstDatePicker}
              />
            </View>
            <TextInput
              style={styles.input}
              value={estimatedDate}
              onChangeText={(text) => setEstimatedDate(text)}
              editable={false}
            />
            {estimatedDate.trim().length === 0 && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Please enter a valid date!</Text>
              </View>
            )}
            {new Date(estimatedDate) < new Date(startedDate) && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  Estimated date must be greater than started date!
                </Text>
              </View>
            )}
            {new Date(estimatedDate) < new Date() && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  Estimated date must be greater than current date!
                </Text>
              </View>
            )}
          </View>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
          <DateTimePickerModal
            isVisible={isEstDatePickerVisible}
            mode="date"
            onConfirm={handleConfirmEstDate}
            onCancel={hideEstDatePicker}
          />
          <Input
            id="estimatedBudget"
            label="Estimated Budget"
            errorText="Please enter a valid amount!"
            keyboardType={"decimal-pad"}
            autoCorrect
            returnKeyType={"next"}
            onInputChange={inputChangeHandler}
            initialValue={`${
              editedProject ? editedProject.estimatedBudget : ""
            }`}
            initiallyValid={!!editedProject}
            required
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

EditProjectScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam("submit");
  return {
    headerTitle: "Edit Project",
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
  errorContainer: {
    marginVertical: 5,
  },
  errorText: {
    fontFamily: "open-sans",
    color: "red",
    fontSize: 13,
  },
});

export default EditProjectScreen;
