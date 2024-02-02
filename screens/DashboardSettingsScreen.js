import * as React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { Icon, View } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import useUpdate from "../MenuFunctions/useUpdate";
import useShare from "../MenuFunctions/Share";
import FeedbackComponent from "../MenuFunctions/FeedbackComponent";
import useToaster from "../MenuFunctions/useToaster";

import { useSelector } from "react-redux";

import AsyncStorage from "@react-native-async-storage/async-storage";

function DashboardSettings({ navigation }) {
  const company = useSelector((state) => state.employer);
  const [isPressing, setIsPressing] = React.useState([
    false,
    false,
    false,
    false,
  ]);

  const handlePressIn = (i) => {
    let array = [...isPressing];
    array[i] = true;
    setIsPressing(array);
  };

  const handlePressOut = (i) => {
    let array = [...isPressing];
    array[i] = false;
    setIsPressing(array);
  };
  const [indicator, setIndicator, setResponse] = useToaster();
  function dataToaster(data) {
    setResponse(data);
    setIndicator(indicator + 1);
  }

  function nightMode(data) {
    dataToaster(data);
  }

  const [updateIndicator, setUpdateIndicator] = useUpdate(false);
  function handleUpdate() {
    setUpdateIndicator(updateIndicator + 1);
  }

  const [feedback, setFeedback] = React.useState(false);
  function handleFeedback() {
    setFeedback(true);
  }

  function handleShare() {
    useShare();
  }

  function logOut() {
    AsyncStorage.removeItem("@agency");
    navigation.navigate("Login");
  }

  function deleteAccount() {
    axios({
      method: "delete",
      url: "http://192.168.100.166:3000/agency/",
      params: {
        id: company._id,
      },
      responseType: "json",
    })
      .then((response) => dataToaster(response))
      .catch((error) => {
        console.log(error);
      });
    logOut();
  }

  return (
    <View style={styles}>
      <View style={styles.elementContainer}>
        <Text style={styles.title}>General</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPressIn={() => handlePressIn(0)}
          onPressOut={() => handlePressOut(0)}
          style={[styles.element, isPressing[0] && styles.pressedElement]}
          onPress={() =>
            nightMode({
              data: {
                title: "Night Mode",
                description:
                  "Night Mode isn't available yet, we will make sure to include it in the next update!",
                status: "info",
              },
            })
          }
        >
          <Text style={styles.text}>Night Mode</Text>
          <Icon
            as={MaterialCommunityIcons}
            name="weather-night"
            size={6}
            color="dark.400"
          ></Icon>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPressIn={() => handlePressIn(1)}
          onPressOut={() => handlePressOut(1)}
          style={[styles.element, isPressing[1] && styles.pressedElement]}
          onPress={() => handleUpdate()}
        >
          <Text style={styles.text}>Check for Updates</Text>
          <Icon
            as={MaterialCommunityIcons}
            name="update"
            size={6}
            color="green.400"
          ></Icon>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPressIn={() => handlePressIn(2)}
          onPressOut={() => handlePressOut(2)}
          style={[styles.element, isPressing[2] && styles.pressedElement]}
          onPress={() => handleFeedback()}
        >
          <Text style={styles.text}>Feedback</Text>
          <Icon
            as={MaterialCommunityIcons}
            name="message-alert-outline"
            size={6}
            color="blue.400"
          ></Icon>
        </TouchableOpacity>
        <FeedbackComponent feedback={feedback} setFeedback={setFeedback} />

        <TouchableOpacity
          activeOpacity={0.8}
          onPressIn={() => handlePressIn(3)}
          onPressOut={() => handlePressOut(3)}
          style={[styles.element, isPressing[3] && styles.pressedElement]}
          onPress={() => handleShare()}
        >
          <Text style={styles.text}>Share</Text>
          <Icon
            as={MaterialCommunityIcons}
            name="share-variant-outline"
            size={6}
            color="yellow.400"
          ></Icon>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomElementContainer}>
        <Text style={styles.title}>Account</Text>
        <TouchableOpacity style={styles.element} onPress={() => logOut()}>
          <Text style={[styles.text, { color: "red" }]}>Log out</Text>
          <Icon
            as={MaterialCommunityIcons}
            name="logout"
            size={6}
            color="red.400"
          ></Icon>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.element}
          onPress={() => deleteAccount()}
        >
          <Text style={[styles.text, { color: "red" }]}>Delete Account</Text>
          <Icon
            as={MaterialCommunityIcons}
            name="delete-outline"
            size={6}
            color="red.400"
          ></Icon>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const mainColor = "#81B387";
const sideColor = "#d1ffd7";
const styles = StyleSheet.create({
  flex: 1,
  flexDirection: "column",
  justifyContent: "space-between",
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: mainColor,
    margin: 12,
    marginTop: 0,
  },
  elementContainer: {
    marginTop: 34,
  },
  bottomElementContainer: {
    marginBottom: 34,
  },
  element: {
    flexDirection: "row",
    marginVertical: 2,
    marginHorizontal: 12,
    justifyContent: "space-between",
    borderRadius: 12,
    padding: 6,
    paddingHorizontal: 22,
  },
  pressedElement: {
    backgroundColor: sideColor,
  },
  text: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
  },
});

export default DashboardSettings;
