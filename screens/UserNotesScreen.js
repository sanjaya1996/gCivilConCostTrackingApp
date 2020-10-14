import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Button,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";

import HeaderButton from "../components/HeaderButton";
import Colors from "../constant/Colors";
import * as usersNotesActions from "../store/actions/usersNotes";
import LoadingSpinner from "../components/LoadingSpinner";

const UserNotesScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const notes = useSelector((state) => state.usersNotes.notes);

  const dispatch = useDispatch();

  const loadUsersNotes = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(usersNotesActions.fetchUserNotes());
    } catch (err) {
      setError(err.message);
    }
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    let unmounted = false;
    loadUsersNotes().then(() => {
      if (!unmounted) {
        setIsLoading(false);
      }
    });

    return () => {
      unmounted = true;
    };
  }, [dispatch, loadUsersNotes]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occured!</Text>
        <Button title="Try again" onPress={loadUsersNotes} />
      </View>
    );
  }

  if (!isLoading && notes.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={{ fontFamily: "open-sans" }}>Your Note is Empty!</Text>
        <View style={styles.addNewNote}>
          <Ionicons
            name="ios-create"
            size={Dimensions.get("window").width * 0.12}
            color={Colors.buttonColor}
            onPress={() => {
              props.navigation.navigate("EditNote");
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={notes}
        renderItem={(itemData) => {
          const noteClickedHandler = () => {
            props.navigation.navigate({
              routeName: "EditNote",
              params: { noteId: itemData.item.id },
            });
          };
          return (
            <TouchableOpacity style={styles.note} onPress={noteClickedHandler}>
              <Text style={styles.title}>{itemData.item.title}</Text>
              <Text numberOfLines={1} style={styles.noteOverview}>
                {itemData.item.description}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
      <View style={styles.addNewNote}>
        <Ionicons
          name="ios-create"
          size={Dimensions.get("window").width * 0.12}
          color={Colors.buttonColor}
          onPress={() => {
            props.navigation.navigate("EditNote");
          }}
        />
      </View>
    </View>
  );
};

UserNotesScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "My Notes",
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
    paddingHorizontal: 20,
    paddingHorizontal: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  note: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
  },
  noteOverview: {
    fontFamily: "open-sans",
    fontSize: 12,
  },
  addNewNote: {
    flex: 1,
    right: 0,
    margin: 10,
    bottom: 0,
    position: "absolute",
  },
});
export default UserNotesScreen;
