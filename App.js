import React, { useState, useEffect } from "react";

import * as Font from "expo-font";
import { AppLoading } from "expo";
import { enableScreens } from "react-native-screens";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";
import * as Notifications from "expo-notifications";

import miniPhasesReducer from "./store/reducers/miniPhases";
import laborsReducer from "./store/reducers/labors";
import materialsReducer from "./store/reducers/materials";
import miscellaniesReducer from "./store/reducers/miscellanies";
import categoriesReducer from "./store/reducers/categories";
import projectsReducer from "./store/reducers/projects";
import clientsReducer from "./store/reducers/clients";
import managersReducer from "./store/reducers/managers";
import authReducer from "./store/reducers/auth";
import NavigationContainer from "./navigation/NavigationContainer";
import supervisorsReducer from "./store/reducers/supervisors";
import usersNotesReducer from "./store/reducers/userNotes";

enableScreens();

// For foreGround notification when app is running.
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
    };
  },
});

const rootReducer = combineReducers({
  miniPhases: miniPhasesReducer,
  labors: laborsReducer,
  materials: materialsReducer,
  miscellanies: miscellaniesReducer,
  categories: categoriesReducer,
  projects: projectsReducer,
  managers: managersReducer,
  clients: clientsReducer,
  supervisors: supervisorsReducer,
  usersNotes: usersNotesReducer,
  auth: authReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const fetchFonts = () => {
  return Font.loadAsync({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
      />
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
}
