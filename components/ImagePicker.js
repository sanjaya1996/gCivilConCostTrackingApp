import React, { useState } from "react";
import {
  View,
  Image,
  Text,
  Button,
  StyleSheet,
  Alert,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

import Colors from "../constant/Colors";

const ImgPicker = (props) => {
  const [pickedImage, setPickedImage] = useState(
    props.initialImageUri ? props.initialImageUri : null
  );

  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(
      Permissions.CAMERA,
      Permissions.CAMERA_ROLL
    );
    if (result.status !== "granted") {
      Alert.alert(
        "Insufficient permissions!",
        "Sorry, we need camera permissions to make this work!",
        [{ text: "Okay" }]
      );
      return false;
    }
    return true;
  };
  const takeImageHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    const image = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    setPickedImage(image.uri);
    props.onImageTaken(image.uri);
  };

  const pickGalleryImgHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    const image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    setPickedImage(image.uri);
    props.onImageTaken(image.uri);
  };

  return (
    <View style={styles.imagePicker}>
      <View style={styles.imagePreview}>
        {!pickedImage ? (
          <Text>No image picked yet.</Text>
        ) : (
          <ImageBackground style={styles.image} source={{ uri: pickedImage }}>
            <TouchableOpacity
              style={styles.removeImage}
              onPress={() => {
                setPickedImage(null);
                props.onImageTaken(null);
              }}
            >
              <Text style={{ color: "red", fontSize: 15 }}>X</Text>
            </TouchableOpacity>
          </ImageBackground>
        )}
      </View>
      <View style={styles.imagePickerButtons}>
        <View style={styles.button}>
          <Button
            title="Take Image"
            color={Colors.buttonColor}
            onPress={takeImageHandler}
          />
        </View>
        <View style={styles.button}>
          <Button
            title="Choose Image"
            color={Colors.buttonColor}
            onPress={pickGalleryImgHandler}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imagePicker: {
    alignItems: "center",
    margin: 10,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  image: {
    width: "100%",
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
  imagePickerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    padding: 10,
  },
});

export default ImgPicker;
