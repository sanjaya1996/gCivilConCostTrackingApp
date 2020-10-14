import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  SectionList,
  Text,
  StyleSheet,
  Platform,
  Alert,
  Button,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";

import Colors from "../constant/Colors";
import * as managersActions from "../store/actions/managers";
import LoadingSpinner from "../components/LoadingSpinner";

const ContactsScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState();

  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState("");

  const dispatch = useDispatch();

  const loadManagers = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(managersActions.fetchManagers());
    } catch (err) {
      setError(err.message);
    }
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    let unmounted = false;
    loadManagers().then(() => {
      if (!unmounted) {
        setIsLoading(false);
      }
    });
    return () => {
      unmounted = true;
    };
  }, [dispatch]);

  // Array sorting function
  function compare(a, b) {
    if (a.firstName < b.firstName) {
      return -1;
    }
    if (a.firstName > b.firstName) {
      return 1;
    }
    return 0;
  }
  const managers = useSelector((state) => state.managers.managers);
  managers.sort(compare);
  const clients = useSelector((state) => state.clients.clients);
  clients.sort(compare);
  const userId = useSelector((state) => state.auth.userId);
  const labors = useSelector((state) =>
    state.labors.miniPhaseLabors.filter(
      (labor) => labor.supervisorId.indexOf(userId) >= 0
    )
  );
  labors.sort(compare);

  let Managers;
  let Clients;
  let Labors;

  if (!isSearching || searchText.trim().length === 0) {
    Managers = managers;
    Clients = clients;
    Labors = labors;
  } else {
    Managers = managers.filter((manager) =>
      manager.firstName.toLowerCase().includes(searchText.toLowerCase())
    );
    Clients = clients.filter((client) =>
      client.firstName.toLowerCase().includes(searchText.toLowerCase())
    );
    Labors = labors.filter((labor) =>
      labor.firstName.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  if (Managers.length === 0) {
    Managers = ["Not found!"];
  }
  if (Clients.length === 0) {
    Clients = ["Not found!"];
  }
  if (Labors.length === 0) {
    Labors = ["Not found!"];
  }
  const DATA = [
    {
      title: "Manager",
      data: Managers,
    },
    {
      title: "Clients",
      data: Clients,
    },
    {
      title: "Labors",
      data: Labors,
    },
  ];

  const SectionHeader = (itemData) => {
    return (
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.headerTitle}>{itemData.title}</Text>
        </View>
        {itemData.title === "Manager" && (
          <View style={{ paddingRight: 5 }}>
            <Ionicons
              name={Platform.OS === "ios" ? "ios-add" : "md-add"}
              size={25}
              color={Colors.primaryColor}
              onPress={() =>
                props.navigation.navigate({
                  routeName: "EditPeople",
                })
              }
            />
          </View>
        )}
      </View>
    );
  };

  const Item = (itemData) => {
    const [isPressed, setIsPressed] = useState(false);

    const deleteConfirmHandler = async (id) => {
      setError(null);
      setIsDeleting(true);
      try {
        await dispatch(managersActions.deletManager(id));
      } catch (err) {
        setError(err.message);
      }
      setIsDeleting(false);
    };
    const deleteManagerHandler = (id) => {
      Alert.alert(
        "Are you sure?",
        "Do you really want to delete this manager?",
        [
          { text: "No", style: "default" },
          {
            title: "Yes",
            style: "destructive",
            onPress: () => deleteConfirmHandler(id),
          },
        ]
      );
    };

    return (
      <View style={styles.item}>
        {itemData.item.firstName ? (
          <TouchableOpacity
            onPress={() => setIsPressed((prevState) => !prevState)}
          >
            <Text style={styles.itemTitle}>{itemData.item.firstName}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={{ color: "#6A6A67" }}>{itemData.item}</Text>
        )}

        {isPressed && (
          <View style={styles.contactDetails}>
            <View style={styles.phoneOrEmail}>
              <Text style={styles.label}>phone:</Text>
              <Text style={styles.value}>{itemData.item.phoneNumber}</Text>
            </View>
            <View style={styles.phoneOrEmail}>
              <Text style={styles.label}>email:</Text>
              <Text style={styles.value}>{itemData.item.email}</Text>
            </View>
            {itemData.section.title === "Manager" ? (
              <View style={styles.buttonsContainer}>
                <View>
                  {isDeleting ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    <Ionicons
                      name="md-create"
                      size={24}
                      color={Colors.buttonColor}
                      onPress={() => {
                        props.navigation.navigate({
                          routeName: "EditPeople",
                          params: { managerId: itemData.item.id },
                        });
                      }}
                    />
                  )}
                </View>
                <View>
                  <Ionicons
                    name="ios-remove-circle-outline"
                    size={24}
                    color="red"
                    onPress={() => {
                      deleteManagerHandler(itemData.item.id);
                    }}
                  />
                </View>
              </View>
            ) : null}
          </View>
        )}
      </View>
    );
  };

  // MAIN COMPONENT

  const textChangeHandler = (text) => {
    setIsSearching(true);
    setSearchText(text);
  };

  if (error) {
    return (
      <View style={styles.ceneterd}>
        <Text>An error occured!</Text>
        <Button
          title="Try again"
          color={Colors.buttonColor}
          onPress={loadManagers}
        />
      </View>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <View style={styles.screen}>
      <View style={styles.searchSection}>
        <Ionicons
          style={styles.searchIcon}
          name={Platform.OS === "android" ? "md-search" : "ios-search"}
          size={24}
          color="black"
        />

        <TextInput
          placeholder="Search"
          placeholderTextColor="#6A6A67"
          style={styles.input}
          onChangeText={textChangeHandler}
          value={searchText}
        />
      </View>
      <SectionList
        sections={DATA}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item, section }) => (
          <Item item={item} section={section} />
        )}
        renderSectionHeader={({ section }) => (
          <SectionHeader title={section.title} />
        )}
      />
    </View>
  );
};

ContactsScreen.navigationOptions = {
  headerTitle: "Your Contacts",
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    margin: 10,
  },
  ceneterd: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchSection: {
    marginBottom: 20,
    flexDirection: "row",
    backgroundColor: "rgba(220,220,220,1.0)",
    borderRadius: 10,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    width: "80%",
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    color: "black",
    fontFamily: "open-sans",
  },
  sectionHeader: {
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ccc",
  },
  headerTitle: {
    fontSize: 14,
    fontFamily: "open-sans-bold",
  },
  item: {
    padding: 8,
    borderBottomWidth: 0.7,
    borderBottomColor: "#ccc",
  },
  itemTitle: {
    fontSize: 18,
    fontFamily: "open-sans",
  },
  contactDetails: {
    padding: 10,
  },
  phoneOrEmail: {
    flexDirection: "row",
    paddingBottom: 5,
  },
  label: {
    fontFamily: "open-sans",
  },
  value: {
    fontFamily: "open-sans",
    color: "#1e90ff",
    paddingLeft: 4,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
  },
});
export default ContactsScreen;
