import React, { useEffect } from "react";
import { AsyncStorage } from "react-native";
import { useDispatch } from "react-redux";

import * as authActions from "../store/actions/auth";
import LoadingSpinner from "../components/LoadingSpinner";

const StartupScreen = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) {
        props.navigation.navigate("Auth");
        return;
      }
      const transformedData = JSON.parse(userData);
      const { token, userId, expiryDate } = transformedData;
      const expirationDate = new Date(expiryDate);

      if (expirationDate <= new Date() || !token || !userId) {
        props.navigation.navigate("Auth");
        return;
      }

      const expirationTime = expirationDate.getTime() - new Date().getTime();

      props.navigation.navigate("Project");
      dispatch(authActions.authenticate(userId, token, expirationTime));
    };

    tryLogin();
  }, [dispatch]);

  return <LoadingSpinner />;
};

export default StartupScreen;
