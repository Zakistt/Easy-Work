import {
  StyleSheet,
  Pressable,
  Dimensions,
  Image,
  FlatList,
  SectionList,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import useToaster from "../MenuFunctions/useToaster";

import { Avatar, Icon, ScrollView } from "native-base";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

/*Main */
function SettingsScreen({ navigation, route }) {
  const user = useSelector((state) => state.user);

  const [indicator, setIndicator, setResponse] = useToaster();
  function dataToaster(data) {
    setResponse(data);
    setIndicator(indicator + 1);
  }

  function nightMode(data) {
    dataToaster(data);
  }

  function logOut() {
    AsyncStorage.removeItem("@user");
    navigation.navigate("Login");
  }

  function deleteAccount() {
    axios({
      method: "delete",
      url: "http://192.168.100.166:3000/user/",
      params: {
        id: user._id,
      },
      responseType: "json",
    })
      .then((response) => dataToaster(response))
      .catch((error) => {
        console.error(error);
      });
    logOut();
  }

  return (
    <View style={styles.container}>
      <View style={contentstyles}>
        <Text style={contentstyles.title}>Settings</Text>
      </View>
      <View style={contentstyles.buttons}>
        <TouchableOpacity
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
          <View style={contentstyles.buttonContainer}>
            <Text style={contentstyles.text}>Night Mode</Text>
            <Icon
              as={MaterialCommunityIcons}
              name="weather-night"
              size={6}
              color="dark.400"
            ></Icon>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => logOut()}>
          <View
            style={[
              contentstyles.buttonContainer,
              { borderBottomColor: "red" },
            ]}
          >
            <Text style={[contentstyles.text, { color: "red" }]}>Log out</Text>
            <Icon
              as={MaterialCommunityIcons}
              name="logout"
              size={6}
              color="red.400"
            ></Icon>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteAccount()}>
          <View
            style={[
              contentstyles.buttonContainer,
              { borderBottomColor: "red" },
            ]}
          >
            <Text style={[contentstyles.text, { color: "red" }]}>
              Delete Account
            </Text>
            <Icon
              as={MaterialCommunityIcons}
              name="delete"
              size={6}
              color="red.400"
            ></Icon>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// const mainColor = "#81B387";
// const sideColor = "#d1ffd7";
/*Css Styling*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

const contentstyles = StyleSheet.create({
  flex: 1,
  marginTop: 5,
  marginBottom: 10,
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2071eb",
    textAlign: "center",
  },
  buttons: {
    bottom: "65%",
    // marginBottom: 40,
    padding: 2,
    width: "50%",
    alignSelf: "center",
  },
  buttonContainer: {
    paddingBottom: 10,
    marginBottom: 20,
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
  },
});

export default SettingsScreen;
