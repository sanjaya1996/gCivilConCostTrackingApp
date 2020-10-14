import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
  Button,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";

import HeaderButton from "../components/HeaderButton";
import Colors from "../constant/Colors";
import Card from "../components/Card";
import * as supervisorsActions from "../store/actions/supervisors";
import LoadingSpinner from "../components/LoadingSpinner";

const emptyProfileImage = "https://pbs.twimg.com/media/DKpeGz2X0AAXN9T.jpg";

const UserProfileScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const user = useSelector((state) => state.supervisors.user) || {};

  const dispatch = useDispatch();

  const loadSupervisorProfile = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(supervisorsActions.fetchSupervisors());
    } catch (err) {
      setError(err.message);
    }
  }, [dispatch, setError, setIsLoading]);

  useEffect(() => {
    let unmounted = false;
    loadSupervisorProfile().then(() => {
      if (!unmounted) {
        setIsLoading(false);
      }
    });
    return () => {
      unmounted = true;
    };
  }, [dispatch]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occured!</Text>
        <Button
          title="Try Agian"
          color={Colors.buttonColor}
          onPress={loadSupervisorProfile}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={[Colors.primaryColor, "#8f66ed"]}
        style={styles.gradient}
      >
        <View style={styles.editProfile}>
          {Object.keys(user).length === 0 ? (
            <Ionicons
              name={Platform.OS === "ios" ? "ios-person-add" : "md-person-add"}
              size={30}
              color="white"
              onPress={() => props.navigation.navigate("EditProfile")}
            />
          ) : (
            <FontAwesome5
              name="user-edit"
              size={30}
              color="white"
              onPress={() =>
                props.navigation.navigate({
                  routeName: "EditProfile",
                  params: { superId: user.id },
                })
              }
            />
          )}
        </View>
      </LinearGradient>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: user.profilePic ? user.profilePic : emptyProfileImage,
          }}
          style={styles.image}
        />
      </View>
      <View style={styles.nameAndProfession}>
        {user.firstName && (
          <Text style={styles.userNameText}>
            {user.firstName + " " + (user.lastName || "")}
          </Text>
        )}
        <Text style={styles.defaultText}>{user.jobTitle}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Card style={styles.detail}>
          <View style={{ justifyContent: "center" }}>
            <Ionicons
              name={Platform.OS === "android" ? "md-mail" : "ios-mail"}
              size={24}
              color={Colors.primaryColor}
            />
          </View>
          <Text style={{ ...styles.defaultText, marginLeft: 5 }}>
            {user.email}
          </Text>
        </Card>
        <Card style={styles.detail}>
          <View style={{ justifyContent: "center" }}>
            <Ionicons
              name={Platform.OS === "android" ? "md-call" : "ios-call"}
              size={24}
              color={Colors.primaryColor}
            />
          </View>
          <Text style={{ ...styles.defaultText, marginLeft: 5 }}>
            {user.phoneNumber}
          </Text>
        </Card>
      </View>
    </View>
  );
};

UserProfileScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Your Profile",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName="ios-menu"
          color="white"
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    height: "100%",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gradient: {
    height: "20%",
  },
  editProfile: {
    alignSelf: "flex-end",
    margin: 10,
  },
  imageContainer: {
    alignItems: "center",
    marginTop: "-12%",
  },
  image: {
    width: Dimensions.get("window").width * 0.32,
    height: Dimensions.get("window").width * 0.32,
    borderRadius: (Dimensions.get("window").width * 0.32) / 2,
  },
  nameAndProfession: {
    alignItems: "center",
    marginVertical: 10,
  },
  userNameText: {
    fontFamily: "open-sans-bold",
    fontSize: 20,
  },
  defaultText: {
    fontFamily: "open-sans",
    fontSize: 16,
    padding: 5,
  },
  detailsContainer: {
    marginTop: 20,
    padding: 10,
  },
  detail: {
    flexDirection: "row",
    marginBottom: 15,
  },
});
export default UserProfileScreen;
