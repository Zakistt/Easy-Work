import {
  StyleSheet,
  Pressable,
  Dimensions,
  Image,
  Text,
  View,
} from "react-native";
import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { updateUser } from "../features/data/userSlice";
import { updateAgency } from "../features/data/employerSlice";

import Logo from "../assets/Logo.png";

function HomeScreen({ navigation }) {
  const [userInfo, setUserInfo] = React.useState(null);
  const [agencyInfo, setAgencyInfo] = React.useState(null);
  const dispatch = useDispatch();

  const LOGO_IMAGE = Image.resolveAssetSource(Logo).uri;

  React.useEffect(() => {
    async function check() {
      AsyncStorage.removeItem("@user");
      AsyncStorage.removeItem("@agency");
      const user = await AsyncStorage.getItem("@user");
      const agency = await AsyncStorage.getItem("@agency");

      if (user) {
        setUserInfo(JSON.parse(user));
        start("employee");
      } else if (agency) {
        setAgencyInfo(JSON.parse(agency));
        start("employer");
      } else {
        navigation.navigate("Login");
      }
    }
    check();
  }, []);

  function start(type) {
    if (type == "employee") {
      Client();
    } else if (type == "employer") {
      Agency();
    }
  }

  async function Client() {
    const email = (await userInfo.email) || "";
    await axios({
      method: "get",
      url: "http://192.168.100.166:3000/user/",
      params: {
        email: email,
      },
      responseType: "json",
    })
      .then(function (response) {
        dispatch(updateUser({ value: response.data }));
        navigation.navigate("Main");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async function Agency() {
    const email = (await agencyInfo.email) || "";
    await axios({
      method: "get",
      url: "http://192.168.100.166:3000/agency/",
      params: {
        email: email,
      },
      responseType: "json",
    })
      .then(function (response) {
        dispatch(updateAgency({ value: response.data }));
        navigation.navigate("Dashboard");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={{ uri: LOGO_IMAGE }}></Image>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignSelf: "center",
  },
});

export default HomeScreen;
