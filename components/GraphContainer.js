import React from "react";
import { View, Dimensions, Text, StyleSheet } from "react-native";
import { Svg, Circle, Text as SVGText, TSpan } from "react-native-svg";

import Colors from "../constant/Colors";

const GraphContainer = (props) => {
  //Circular Progress Bar Variable
  const { width } = Dimensions.get("window");
  const size = width - 287;
  const strokeWidth = width / 35;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const textColor = props.textColor;

  let rightSideTitle = "Estimated Date :";
  if (!props.editable) {
    rightSideTitle = "Project Review :";
  }

  // Progress Value Calculation
  const totalEstimation = props.estimatedBudget;
  const budgetSpent = props.budgetSpent;
  const progressValue = Math.round((budgetSpent / totalEstimation) * 100) || 0;
  const svgProgress = 100 - progressValue;

  // Date and Days Calculation
  const currentDate = new Date();
  const estimate = new Date(props.estimatedDate);
  const diffTime = Math.abs(estimate - currentDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 0;

  return (
    <View style={{ padding: 10 }}>
      <View style={{ flexDirection: "row" }}>
        <View style={{ margin: 5 }}>
          <Text style={{ ...styles.label, color: textColor, fontSize: 15 }}>
            Budget Spent:{" "}
          </Text>
        </View>
        <View style={{ margin: 5 }}>
          <Text
            style={{
              ...styles.label,
              color: textColor,
              fontSize: 15,
              marginLeft: 30,
            }}
          >
            {rightSideTitle}
          </Text>
        </View>
      </View>
      <View style={styles.graphContainer}>
        <View
          style={{
            paddingRight: 20,
            alignItems: "center",
          }}
        >
          <View>
            <Svg width={size} height={size}>
              <Circle
                stroke="white"
                fill="none"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                {...{ strokeWidth }}
              />
              <Circle
                stroke={Colors.buttonColor}
                fill="none"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={radius * Math.PI * 2 * (svgProgress / 100)}
                strokeLinecap="round"
                transform={`rotate(-90, ${size / 2}, ${size / 2})`}
                {...{ strokeWidth }}
              />
              <SVGText fontSize="15" textAnchor="middle" fill={textColor}>
                <TSpan x={size / 2} y={size / 2 + 5}>
                  {`${progressValue}%`}
                </TSpan>
              </SVGText>
            </Svg>
          </View>
          <View
            style={{
              margin: 10,
              alignItems: "center",
            }}
          >
            <Text
              style={[
                props.projectPhase
                  ? { ...styles.value, fontSize: 20 }
                  : { color: textColor, fontFamily: "open-sans", fontSize: 20 },
              ]}
            >
              $ {budgetSpent.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.daysLeft}>
          {props.editable ? (
            <View>
              <Text style={{ color: textColor, fontWeight: "bold" }}>
                {props.projectPhase ? (
                  <Text style={{ ...styles.value, fontSize: radius * 1.5 }}>
                    {diffDays}
                  </Text>
                ) : (
                  <Text
                    style={{ fontSize: radius * 1.7, fontFamily: "open-sans" }}
                  >
                    {diffDays}
                  </Text>
                )}

                <Text style={styles.label}>days to go</Text>
              </Text>
            </View>
          ) : (
            <View>
              <View style={{ flexDirection: "row", marginBottom: 10 }}>
                <Text
                  style={{ color: textColor, fontFamily: "open-sans-bold" }}
                >
                  Estimated $:
                </Text>
                <Text
                  style={[
                    props.projectPhase
                      ? styles.value
                      : { color: textColor, fontFamily: "open-sans" },
                  ]}
                >
                  {"  "}
                  {props.estimatedBudget}
                </Text>
              </View>
              <View style={{ flexDirection: "row", marginBottom: 10 }}>
                <Text
                  style={{ color: textColor, fontFamily: "open-sans-bold" }}
                >
                  Completed:
                </Text>
                <Text
                  style={[
                    props.projectPhase
                      ? styles.value
                      : { color: textColor, fontFamily: "open-sans" },
                  ]}
                >
                  {"  "}
                  {props.startedDate}
                </Text>
              </View>
            </View>
          )}

          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: textColor, fontFamily: "open-sans-bold" }}>
              Started:
            </Text>
            <Text
              style={[
                props.projectPhase
                  ? styles.value
                  : { color: textColor, fontFamily: "open-sans" },
              ]}
            >
              {"  "}
              {props.startedDate}
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Text style={{ color: textColor, fontFamily: "open-sans-bold" }}>
              Estimated:
            </Text>
            <Text
              style={[
                props.projectPhase
                  ? styles.value
                  : { color: textColor, fontFamily: "open-sans" },
              ]}
            >
              {"  "}
              {props.estimatedDate}
            </Text>
          </View>
        </View>
      </View>
      {props.projectPhase ? (
        <View style={styles.costDetails}>
          <View style={styles.costDetailsText}>
            <Text style={styles.label}>Labor: </Text>
            <Text style={styles.value}>$ {props.laborCost.toFixed(2)}</Text>
          </View>
          <View style={styles.costDetailsText}>
            <Text style={styles.label}>Material: </Text>
            <Text style={styles.value}>$ {props.materialCost.toFixed(2)}</Text>
          </View>
          <View style={styles.costDetailsText}>
            <Text style={styles.label}>Other: </Text>
            <Text style={styles.value}>$ {props.otherCost.toFixed(2)}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  graphContainer: {
    alignItems: "center",
    flexDirection: "row",
    paddingRight: 10,
    justifyContent: "space-between",
  },

  costDetails: {
    marginVertical: 15,
  },
  costDetailsText: {
    paddingVertical: 5,
    flexDirection: "row",
  },
  label: {
    fontFamily: "open-sans-bold",
    color: "white",
  },
  value: {
    fontFamily: "open-sans",
    color: "white",
  },
});

export default GraphContainer;
