import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Text,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";

import HeaderButton from "../../components/HeaderButton";
import * as categoriesActions from "../../store/actions/categories";
import LoadingSpinner from "../../components/LoadingSpinner";
import Colors from "../../constant/Colors";

const EditPhaseScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const projectId = props.navigation.getParam("projectId");
  const projectPhaseId = props.navigation.getParam("projPhaseId");
  const phaseTitle = props.navigation.getParam("title");
  const editedPhase = useSelector((state) =>
    state.categories.projectCategories.find(
      (phase) => phase.id === projectPhaseId
    )
  );

  const dispatch = useDispatch();
  const [title, setTitle] = useState(
    editedPhase ? editedPhase.title : phaseTitle
  );
  const [startedDate, setStartedDate] = useState(
    editedPhase ? editedPhase.startDate : ""
  );
  const [estimatedDate, setEstimatedDate] = useState(
    editedPhase ? editedPhase.estimatedDate : ""
  );
  const [estimatedBudget, setEstimatedBudget] = useState(
    editedPhase ? editedPhase.estimatedBudget : ""
  );
  const [budgetIsValid, setBudgetIsValid] = useState(
    editedPhase ? true : false
  );
  const [datesAreValid, setDatesAreValid] = useState(
    editedPhase ? true : false
  );

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
  // const start = new Date(startedDate);
  // const estimate = new Date(estimatedDate);
  // const diffTime = Math.abs(estimate - start);
  // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  useEffect(() => {
    if (error) {
      Alert.alert("An error occured", error, [{ text: "Okay" }]);
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
    if (!budgetIsValid || !datesAreValid) {
      Alert.alert("Wrong input!", "Please check the errors in the form", [
        { text: "Okay" },
      ]);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      if (editedPhase) {
        await dispatch(
          categoriesActions.updateProjectPhase(
            projectPhaseId,
            startedDate,
            estimatedDate,
            +estimatedBudget
          )
        );
      } else {
        await dispatch(
          categoriesActions.createProjectPhase(
            projectId,
            title,
            startedDate,
            estimatedDate,
            +estimatedBudget
          )
        );
      }
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, [
    dispatch,
    projectId,
    projectPhaseId,
    title,
    startedDate,
    estimatedDate,
    estimatedBudget,
    datesAreValid,
  ]);
  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  const budgetChangeHandler = (text) => {
    if (text.trim().length === 0) {
      setBudgetIsValid(false);
    } else {
      setBudgetIsValid(true);
    }
    setEstimatedBudget(text);
  };

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
          <View style={styles.formControl}>
            <Text style={styles.label}>Project Phase Title:</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={(text) => setTitle(text)}
              editable={false}
            />
          </View>

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
                  Estimated date must be greated than started date!
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

          <View style={styles.formControl}>
            <Text style={styles.label}>Estimated Budget:</Text>
            <TextInput
              style={styles.input}
              value={`${estimatedBudget}`}
              onChangeText={budgetChangeHandler}
            />
            {!budgetIsValid && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  Please enter a valid amount!
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

EditPhaseScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam("submit");

  return {
    headerTitle: navData.navigation.getParam("projPhaseId")
      ? "Edit Project Phase"
      : "Add Project Phase",
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

export default EditPhaseScreen;
