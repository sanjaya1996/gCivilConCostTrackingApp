import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";

import HeaderButton from "../../components/HeaderButton";
import Colors from "../../constant/Colors";
import * as userNotesActions from "../../store/actions/usersNotes";

const EditNoteScreen = (props) => {
  const passedNoteId = props.navigation.getParam("noteId");
  const editedNote = useSelector((state) =>
    state.usersNotes.notes.find((note) => note.id === passedNoteId)
  );
  const dispatch = useDispatch();

  const [error, setError] = useState();

  const [title, setTitle] = useState(editedNote ? editedNote.title : "");
  const [description, setDescription] = useState(
    editedNote ? editedNote.description : ""
  );
  const [pickedImages, setPickedImages] = useState(
    editedNote ? (editedNote.images ? editedNote.images : []) : []
  );
  const [titleIsValid, setTitleIsValid] = useState(editedNote ? true : false);
  const [descriptionIsValid, setDescriptionIsValid] = useState(
    editedNote ? true : false
  );
  const [showIcons, setShowIcons] = useState(true);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [pickedDateTime, setPickedDateTime] = useState(
    editedNote
      ? editedNote.reminderTime
        ? editedNote.reminderTime
        : null
      : null
  );
  const [notificationId, setNotificationId] = useState(
    editedNote
      ? editedNote.notificationId
        ? editedNote.notificationId
        : null
      : null
  );

  useEffect(() => {
    if (error) {
      Alert.alert("An error occured!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const submitHandler = useCallback(async () => {
    if (!titleIsValid || !descriptionIsValid) {
      Alert.alert(
        "Not allowed!",
        "Please make sure you have title and description of your note!",
        [{ text: "Okay" }]
      );
      return;
    }
    setError(null);
    try {
      if (editedNote) {
        await dispatch(
          userNotesActions.updateNote(
            passedNoteId,
            title,
            description,
            pickedImages,
            pickedDateTime,
            notificationId
          )
        );
      } else {
        if (pickedDateTime) {
          const scheduledTime = pickedDateTime.getTime() - new Date().getTime();
          if (scheduledTime < 0) {
            Alert.alert(
              "Invalid time!",
              "Make sure you set a reminder for future not for past time!",
              [{ text: "Okay" }]
            );
            return;
          } else {
            const notificationIdentifier = await Notifications.scheduleNotificationAsync(
              {
                content: {
                  title: "Your reminder",
                  body: title,
                  data: {
                    navigateTo: {
                      routeName: "EditNote",
                      noteId: passedNoteId,
                    },
                  },
                },
                trigger: {
                  seconds: scheduledTime / 1000,
                },
              }
            );
            await dispatch(
              userNotesActions.createNote(
                title,
                description,
                pickedImages,
                pickedDateTime,
                notificationIdentifier
              )
            );
          }
        } else {
          await dispatch(
            userNotesActions.createNote(
              title,
              description,
              pickedImages,
              pickedDateTime,
              notificationId
            )
          );
        }
      }
    } catch (err) {
      setError(err.message);
    }

    props.navigation.navigate("Notes");
  }, [
    dispatch,
    passedNoteId,
    title,
    description,
    pickedImages,
    titleIsValid,
    descriptionIsValid,
    pickedDateTime,
    notificationId,
  ]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  const titleChangeHandler = (text) => {
    if (text.trim().length === 0) {
      setTitleIsValid(false);
    } else {
      setTitleIsValid(true);
    }
    setTitle(text);
  };
  const descriptionChangeHandler = (text) => {
    if (text.trim().length === 0) {
      setDescriptionIsValid(false);
    } else {
      setDescriptionIsValid(true);
    }
    setDescription(text);
  };

  const verifyPermissions = async (permissionMode) => {
    let result;
    if (permissionMode === "camera") {
      result = await Permissions.askAsync(
        Permissions.CAMERA,
        Permissions.CAMERA_ROLL
      );
    } else if (permissionMode === "notification") {
      result = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    }

    if (result.status !== "granted") {
      Alert.alert(
        "Insufficient permissions!",
        `Sorry, we need ${permissionMode} permissions to make this work!`,
        [{ text: "Okay" }]
      );
      return false;
    }
    return true;
  };

  const takeImageHandler = async () => {
    const hasPermission = await verifyPermissions("camera");
    if (!hasPermission) {
      return;
    }
    const image = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!image.cancelled) {
      setPickedImages((prevState) => [...prevState, { uri: image.uri }]);
    }
  };

  const pickGalleryImgHandler = async () => {
    const hasPermission = await verifyPermissions("camera");
    if (!hasPermission) {
      return;
    }
    const image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!image.cancelled) {
      setPickedImages((prevState) => [...prevState, { uri: image.uri }]);
    }
  };

  const removeImage = (imageUri) => {
    setPickedImages((prevState) =>
      prevState.filter((image) => image.uri !== imageUri)
    );
  };

  const notificationBtnClickHandler = async () => {
    const hasPermission = await verifyPermissions("notification");
    if (!hasPermission) {
      return;
    }
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = async (datetime) => {
    const scheduledTime = datetime.getTime() - new Date().getTime();
    if (scheduledTime < 0) {
      Alert.alert(
        "Invalid time!",
        "Make sure you set a reminder for future not for past time!",
        [{ text: "Okay" }]
      );
      hideDatePicker();
      return;
    }
    if (editedNote) {
      triggerNotificationHandler(datetime);
    }

    hideDatePicker();
    setPickedDateTime(datetime);
  };

  const triggerNotificationHandler = async (datetime) => {
    const seconds = Math.round(
      (datetime.getTime() - new Date().getTime()) / 1000
    );
    const notificationIdentifier = await Notifications.scheduleNotificationAsync(
      {
        content: {
          title: "Your reminder",
          body: title,
          data: {
            navigateTo: {
              routeName: "EditNote",
              noteId: passedNoteId,
            },
          },
        },
        trigger: {
          seconds: seconds,
        },
      }
    );

    if (editedNote) {
      await dispatch(
        userNotesActions.updateNote(
          passedNoteId,
          title,
          description,
          pickedImages,
          datetime,
          notificationIdentifier
        )
      );
    }

    setNotificationId(notificationIdentifier);
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          style={{
            marginBottom: showIcons
              ? Dimensions.get("window").height * 0.1
              : null,
          }}
        >
          <View style={styles.screen}>
            <TextInput
              placeholder="Add title..."
              style={styles.titleInput}
              value={title}
              onChangeText={titleChangeHandler}
              maxLength={50}
              onFocus={() => setShowIcons(false)}
              onBlur={() => setShowIcons(true)}
            />
            <TextInput
              placeholder="Add description..."
              style={styles.descriptionInput}
              multiline={true}
              textAlignVertical="top"
              value={description}
              onChangeText={descriptionChangeHandler}
              onFocus={() => setShowIcons(false)}
              onBlur={() => setShowIcons(true)}
            />
          </View>

          {pickedImages.length > 0 &&
            pickedImages.map((item, index) => {
              return (
                <View key={index} style={styles.imagePreview}>
                  <ImageBackground
                    style={styles.image}
                    source={{ uri: item.uri }}
                  >
                    <TouchableOpacity
                      style={styles.removeImage}
                      onPress={() => {
                        removeImage(item.uri);
                      }}
                    >
                      <Text style={{ color: "red", fontSize: 15 }}>X</Text>
                    </TouchableOpacity>
                  </ImageBackground>
                </View>
              );
            })}
          {pickedDateTime ? (
            <View style={{ margin: 15 }}>
              <Text style={styles.timeText}>Scheduled reminder:</Text>
              <View style={styles.timeAndClear}>
                <View>
                  <Text style={styles.timeText}>
                    {moment(pickedDateTime).format("YYYY-MM-DD  HH:mm A")}
                  </Text>
                </View>
                <View style={styles.clearButton}>
                  <Button
                    title="Clear Reminder"
                    color="#707070"
                    onPress={async () => {
                      if (editedNote) {
                        await Notifications.cancelScheduledNotificationAsync(
                          notificationId
                        );
                        await dispatch(
                          userNotesActions.updateNote(
                            passedNoteId,
                            title,
                            description,
                            pickedImages,
                            null,
                            null
                          )
                        );
                      }

                      setPickedDateTime();
                      setNotificationId();
                    }}
                  />
                </View>
              </View>
            </View>
          ) : (
            <View>
              <View style={styles.reminder}>
                <View style={{ marginRight: 10 }}>
                  <Button
                    title="Remind me later"
                    color={Colors.buttonColor}
                    onPress={notificationBtnClickHandler}
                  />
                </View>
                <View>
                  <Ionicons
                    name="md-notifications"
                    size={45}
                    color={Colors.buttonColor}
                    onPress={notificationBtnClickHandler}
                  />
                </View>
              </View>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                date={new Date()}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
            </View>
          )}
        </ScrollView>
        {showIcons && (
          <View style={styles.footerIcons}>
            {editedNote && (
              <View>
                <AntDesign
                  name="delete"
                  size={Dimensions.get("window").width * 0.09}
                  color="#707070"
                  onPress={async () => {
                    await dispatch(userNotesActions.deleteNote(passedNoteId));
                    if (notificationId) {
                      Notifications.cancelScheduledNotificationAsync(
                        notificationId
                      );
                    }
                    props.navigation.goBack();
                  }}
                />
              </View>
            )}

            <View>
              <Ionicons
                name={Platform.OS === "ios" ? "ios-camera" : "md-camera"}
                size={Dimensions.get("window").width * 0.09}
                color="#707070"
                onPress={takeImageHandler}
              />
            </View>
            <View>
              <Ionicons
                name={Platform.OS === "ios" ? "ios-images" : "md-images"}
                size={Dimensions.get("window").width * 0.09}
                color="#707070"
                onPress={pickGalleryImgHandler}
              />
            </View>
            {editedNote && (
              <View>
                <Ionicons
                  name="ios-create"
                  size={Dimensions.get("window").width * 0.09}
                  color="#707070"
                  onPress={() => {
                    props.navigation.push("EditNote");
                  }}
                />
              </View>
            )}
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

EditNoteScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam("submit");
  return {
    headerTitle: navData.navigation.getParam("noteId")
      ? "Note Details"
      : "Add new Note",
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
  screen: {
    flex: 1,
    margin: 20,
  },
  titleInput: {
    marginVertical: 20,
    fontFamily: "open-sans-bold",
    fontSize: 22,
  },
  descriptionInput: {
    marginVertical: 20,
    fontFamily: "open-sans",
    fontSize: 16,
    padding: 10,
    marginBottom: 30,
  },
  imagePreview: {
    width: "100%",
    height: Dimensions.get("window").height * 0.4,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: Dimensions.get("window").width * 0.8,
    height: "100%",
  },
  removeImage: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 20,
    height: 20,
    alignItems: "center",
    borderRadius: 10,
  },
  reminder: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    padding: 10,
  },
  timeAndClear: {
    padding: 10,
  },
  timeText: {
    fontSize: 20,
  },
  clearButton: {
    alignItems: "flex-start",
  },
  footerIcons: {
    width: "100%",
    padding: 10,
    bottom: 0,
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#ccc",
  },
});

export default EditNoteScreen;
