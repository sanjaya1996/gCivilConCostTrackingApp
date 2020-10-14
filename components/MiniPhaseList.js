import React from "react";
import { View, Text, FlatList, Button, StyleSheet } from "react-native";
import { Card } from "react-native-elements";

import Colors from "../constant/Colors";

const MiniPhaseLists = (props) => {
  const renderMiniPhase = (itemData) => {
    return (
      <Card title={itemData.item.title} titleStyle={{ color: "green" }}>
        <Text style={{ marginBottom: 10 }}></Text>
        <Button
          title="VIEW NOW"
          color={Colors.buttonColor}
          onPress={() => {
            props.navigation.navigate({
              routeName: "MiniPhase",
              params: {
                miniPhaseId: itemData.item.id,
              },
            });
          }}
        />
      </Card>
    );
  };

  return (
    <View style={styles.miniPhaseLists}>
      <FlatList data={props.miniPhasesData} renderItem={renderMiniPhase} />
    </View>
  );
};

const styles = StyleSheet.create({
  miniPhaseLists: {
    flexGrow: 1,
    alignItems: "center",
  },
});
export default MiniPhaseLists;
