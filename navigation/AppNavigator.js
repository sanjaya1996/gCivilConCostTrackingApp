import React from "react";
import { SafeAreaView, View, Button, Platform } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { createDrawerNavigator, DrawerItems } from "react-navigation-drawer";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";

import HomeScreen from "../screens/HomeScreen";
import ProjectPhaseScreen from "../screens/ProjectPhaseScreen";
import MiniPhaseScreen from "../screens/MiniPhaseScreen";
import MiniPhaseMaterialsScreen from "../screens/MiniPhaseMaterialsScreen";
import MiniPhaseLaborsScreen from "../screens/MiniPhaseLaborscreen";
import ContactsScreen from "../screens/ContactsScreen";
import SpecialPhasesScreen from "../screens/SpecialPhasesScreen";
import UserProfileScreen from "../screens/UserProfileScreen";
import UserNotesScreen from "../screens/UserNotesScreen";
import ProjectHistoryScreen from "../screens/ProjectHistoryScreen";
import EditMiniPhaseScreen from "../screens/forms/EditMiniPhaseScreen";
import MphaseMiscellaniesScreen from "../screens/MphaseMiscellaniesScreen";
import EditLaborsScreen from "../screens/forms/EditLaborsScreen";
import EditMaterialScreen from "../screens/forms/EditMaterialScreen";
import EditMiscellanyScreen from "../screens/forms/EditMiscellanyScreen";
import EditPhaseScreen from "../screens/forms/EditPhaseScreen";
import EditProjectScreen from "../screens/forms/EditProjectScreen";
import PrevProjectHomeScreen from "../screens/PrevProjectHomeScreen";
import AuthScreen from "../screens/forms/AuthScreen";
import StartupScreen from "../screens/StartupScreen";
import * as authActions from "../store/actions/auth";
import Colors from "../constant/Colors";
import EditPeopleScreen from "../screens/forms/EditPeopleScreen";
import UserProfile from "../components/UserProfile";
import EditProfileScreen from "../screens/forms/EditProfileScreen";
import EditNoteScreen from "../screens/forms/EditNoteScreen";

const defaultStackNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.navBarColor : "android",
    borderBottomWidth: 0.3,
    borderBottomColor: "#ccc",
  },
  headerTitleStyle: {
    fontFamily: "open-sans-bold",
  },
  headerBackTitleStyle: {
    fontFamily: "open-sans",
  },
  headerTintColor: Platform.OS === "android" ? "white" : Colors.navBarColor,
};

const AppNavigator = createStackNavigator(
  {
    Home: { screen: HomeScreen },
    EditProject: {
      screen: EditProjectScreen,
    },
    ProjectPhase: {
      screen: ProjectPhaseScreen,
    },
    EditProjectPhase: {
      screen: EditPhaseScreen,
    },
    EditPeople: { screen: EditPeopleScreen },
    EditMiniPhase: { screen: EditMiniPhaseScreen },
    MiniPhase: {
      screen: MiniPhaseScreen,
    },
    MiniPhaseMaterials: {
      screen: MiniPhaseMaterialsScreen,
    },
    EditMaterial: {
      screen: EditMaterialScreen,
    },
    MiniPhaseLabors: { screen: MiniPhaseLaborsScreen },
    EditLabors: { screen: EditLaborsScreen },
    MphaseMiscellaneous: { screen: MphaseMiscellaniesScreen },
    EditMiscellany: {
      screen: EditMiscellanyScreen,
    },
  },
  {
    defaultNavigationOptions: defaultStackNavOptions,
  }
);

const ContactsNavigator = createStackNavigator(
  {
    Contacts: { screen: ContactsScreen },
    EditPeople: { screen: EditPeopleScreen },
  },
  {
    defaultNavigationOptions: defaultStackNavOptions,
  }
);

const SpecialPhasesNavigator = createStackNavigator(
  {
    Specials: { screen: SpecialPhasesScreen },
    MiniPhase: { screen: MiniPhaseScreen },
  },
  {
    defaultNavigationOptions: defaultStackNavOptions,
  }
);

const tabScreenConfig = {
  ProjectHome: {
    screen: AppNavigator,
    navigationOptions: {
      tabBarLabel: "Project Home",
      tabBarIcon: (tabInfo) => {
        return <Ionicons name="ios-home" size={25} color={tabInfo.tintColor} />;
      },
    },
  },
  Contact: {
    screen: ContactsNavigator,
    navigationOptions: {
      tabBarIcon: (tabInfo) => {
        return (
          <Ionicons name="md-contacts" size={25} color={tabInfo.tintColor} />
        );
      },
    },
  },
  Specials: {
    screen: SpecialPhasesNavigator,
    navigationOptions: {
      tabBarIcon: (tabInfo) => {
        return <Ionicons name="ios-star" size={25} color={tabInfo.tintColor} />;
      },
    },
  },
};

const AppBottomTabNavigator =
  Platform.OS === "android"
    ? createMaterialBottomTabNavigator(tabScreenConfig, {
        activeColor: "white",
        shifting: true,
        barStyle: {
          backgroundColor: Colors.navBarColor,
        },
      })
    : createBottomTabNavigator(tabScreenConfig, {
        tabBarOptions: {
          labelStyle: {
            fontFamily: "open-sans-bold",
          },
          activeTintColor: Colors.primaryColor,
        },
      });
const UserProfileNavigator = createStackNavigator(
  {
    UserProfile: UserProfileScreen,
    EditProfile: EditProfileScreen,
  },
  {
    defaultNavigationOptions: defaultStackNavOptions,
  }
);

export const UserNotesNavigator = createStackNavigator(
  {
    Notes: { screen: UserNotesScreen },
    EditNote: { screen: EditNoteScreen },
  },
  {
    defaultNavigationOptions: defaultStackNavOptions,
  }
);

const ProjectHistoryNavigator = createStackNavigator(
  {
    ProjectHistory: { screen: ProjectHistoryScreen },
    PreviousProjectHome: { screen: PrevProjectHomeScreen },
    PreviousProjectPhase: { screen: ProjectPhaseScreen },
    PreviousProjectMiniPhase: { screen: MiniPhaseScreen },
    PreviousProjectMphaseLabor: { screen: MiniPhaseLaborsScreen },
    PreviousProjectMphaseMaterial: { screen: MiniPhaseMaterialsScreen },
    PreviousProjectMphaseOther: { screen: MphaseMiscellaniesScreen },
  },
  {
    defaultNavigationOptions: defaultStackNavOptions,
  }
);

const ProjectNavigator = createDrawerNavigator(
  {
    Home: AppBottomTabNavigator,
    UserProfile: {
      screen: UserProfileNavigator,
      navigationOptions: { drawerLabel: "My Profile" },
    },
    Notes: {
      screen: UserNotesNavigator,
      navigationOptions: { drawerLabel: "My Notes" },
    },
    ProjectHistory: {
      screen: ProjectHistoryNavigator,
      navigationOptions: { drawerLabel: "My Project History" },
    },
  },
  {
    contentOptions: {
      activeTintColor: Colors.primaryColor,
      labelStyle: {
        fontFamily: "open-sans-bold",
      },
    },
    contentComponent: (props) => {
      const dispatch = useDispatch();
      return (
        <View style={{ flex: 1 }}>
          <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
            <UserProfile />
            <DrawerItems {...props} />
            <View style={{ padding: 10 }}>
              <Button
                title="Logout"
                color={Colors.primaryColor}
                onPress={() => {
                  dispatch(authActions.logout());
                  // props.navigation.navigate("Auth");
                }}
              />
            </View>
          </SafeAreaView>
        </View>
      );
    },
  }
);

const AuthNavigator = createStackNavigator(
  {
    Auth: AuthScreen,
  },
  {
    defaultNavigationOptions: defaultStackNavOptions,
  }
);

const MainNavigator = createSwitchNavigator({
  Startup: StartupScreen,
  Auth: AuthNavigator,
  Project: ProjectNavigator,
});

export default createAppContainer(MainNavigator);
