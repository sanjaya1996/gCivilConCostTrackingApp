import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  ImageBackground,
} from "react-native";
import Colors from "../constant/Colors";
import { useSelector } from "react-redux";

const image = {
  uri: "https://www.freegreatpicture.com/files/147/5281-background-color.jpg",
};
const emptyProfile = "https://pbs.twimg.com/media/DKpeGz2X0AAXN9T.jpg";

const UserProfile = (props) => {
  const user = useSelector((state) => state.supervisors.user);
  return (
    <ImageBackground source={image} style={styles.backImage}>
      <View style={styles.profile}>
        <View>
          <Image
            style={styles.image}
            source={{
              uri: user.profilePic ? user.profilePic : emptyProfile,
            }}
          />
        </View>
        {Object.keys(user).length > 0 && (
          <Text style={styles.profileText}>
            {user.firstName + " " + (user.lastName || "")}
          </Text>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  profile: {
    margin: 20,
  },
  backImage: {
    resizeMode: "cover",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "white",
  },
  profileText: {
    color: "white",
    fontSize: 20,
    fontFamily: "open-sans-bold",
    padding: 5,
  },
});

export default UserProfile;
