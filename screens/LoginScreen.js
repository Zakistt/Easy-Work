import {
  StyleSheet,
  Pressable,
  Dimensions,
  Image,
  Text,
  View,
  BackHandler,
} from "react-native";
import * as React from "react";
import axios from "axios";

import { Provider, useSelector, useDispatch } from "react-redux";
import { updateUser } from "../features/data/userSlice";
import { updateAgency } from "../features/data/employerSlice";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useToaster from "../MenuFunctions/useToaster";

import Logo from "../assets/Logo.png";

// web 859176767077-i043ip2clekuias7ah601r9rcv1e4a0n.apps.googleusercontent.com

//ios 859176767077-iqtjm7effpbdtu04rhlfig771uk4t87p.apps.googleusercontent.com

//android 859176767077-ckuqpt6fm1sh7jp7sasnps7vflgoien1.apps.googleusercontent.com

// Facebook Key Hash:                  tmQ/J6Egu29Ts616JdmCPY7DBoU=
WebBrowser.maybeCompleteAuthSession();

export default function Login({ navigation }) {
  const LOGO_IMAGE = Image.resolveAssetSource(Logo).uri;

  const [userInfo, setUserInfo] = React.useState(null);
  const [agencyInfo, setAgencyInfo] = React.useState(null);

  const [indicator, setIndicator, setResponse] = useToaster();
  function dataToaster(data) {
    setResponse(data);
    setIndicator(indicator + 1);
  }

  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      androidClientId:
        "859176767077-ckuqpt6fm1sh7jp7sasnps7vflgoien1.apps.googleusercontent.com",
      iosClientId:
        "859176767077-iqtjm7effpbdtu04rhlfig771uk4t87p.apps.googleusercontent.com",
      webClientId:
        "859176767077-i043ip2clekuias7ah601r9rcv1e4a0n.apps.googleusercontent.com",
      expoClientId:
        "859176767077-l760gg3m499oivs0o8b1a8sp2hcapk6i.apps.googleusercontent.com",
    },
    {
      projectNameForProxy: "@zakistt/recruit",
    }
  );

  React.useEffect(() => {
    function BACKACTION() {
      return true;
    }
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      BACKACTION
    );
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backHandler);
  }, []);
  const [type, setType] = React.useState(null);

  React.useEffect(() => {
    handleSingInWithGoogle();
  }, [response]);

  React.useEffect(() => {
    if (type == "employee" && userInfo) {
      Client();
    } else if (type == "employer" && agencyInfo) {
      Agency();
    }
  }, [userInfo, agencyInfo]);

  async function handleSingInWithGoogle() {
    if (response?.type === "success") {
      await getInfo(response.authentication.accessToken, type);
    }
  }

  const getInfo = async (token, type) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (type == "employee") {
        const user = await response.json();
        setUserInfo(user);
        await AsyncStorage.setItem("@user", JSON.stringify(user));
      } else if (type == "employer") {
        const agency = await response.json();
        setAgencyInfo(agency);
        await AsyncStorage.setItem("@agency", JSON.stringify(agency));
      }
    } catch (error) {
      throw error;
    }
  };

  const dispatch = useDispatch();

  function handleAgencyButton() {
    setType("employer");
    promptAsync({
      projectNameForProxy: "@zakistt/recruit",
    });
  }

  function createAgency(data) {
    const newagency = {
      email: data.email,
      name: data.name,
      background: data.picture,
    };
    axios({
      method: "post",
      url: "http://192.168.100.166:3000/agency/",
      data: { agency: newagency },
      responseType: "json",
    })
      .then((response) => {
        dataToaster(response);
      })
      .catch((error) => {
        throw error;
      });
  }

  async function Agency() {
    const email = await agencyInfo.email;
    axios({
      method: "get",
      url: "http://192.168.100.166:3000/agency/",
      params: {
        email: email,
      },
      responseType: "json",
    })
      .then(function (response) {
        if (response.data.agency == 0) {
          createAgency(agencyInfo);
          Agency();
        } else {
          dispatch(updateAgency({ value: response.data }));
          navigation.navigate("Dashboard");
        }
      })
      .catch((error) => {
        AsyncStorage.removeItem("@agency");
        throw error;
      });
  }

  function handleClientButton() {
    setType("employee");
    promptAsync({
      projectNameForProxy: "@zakistt/recruit",
    });
  }

  async function createUser(data) {
    const newuser = {
      email: data.email,
      name: data.name,
      pfp: data.picture,
    };
    axios({
      method: "post",
      url: "http://192.168.100.166:3000/user/",
      data: { user: newuser },
      responseType: "json",
    })
      .then((response) => {
        dataToaster(response);
      })
      .catch((error) => {
        throw error;
      });
  }

  async function Client() {
    const email = await userInfo.email;
    axios({
      method: "get",
      url: "http://192.168.100.166:3000/user/",
      params: {
        email: email,
      },
      responseType: "json",
    })
      .then(function (response) {
        if (response.data.user == 0) {
          createUser(userInfo);
          Client();
        } else {
          dispatch(updateUser({ value: response.data }));
          navigation.navigate("Main");
        }
      })
      .catch((error) => {
        AsyncStorage.removeItem("@user");
        throw error;
      });
  }

  // function facebook() {
  //   window.fbAsyncInit = function () {
  //     FB.init({
  //       appId: "{your-app-id}",
  //       cookie: true,
  //       xfbml: true,
  //       version: "{api-version}",
  //     });

  //     FB.AppEvents.logPageView();
  //   };

  //   (function (d, s, id) {
  //     var js,
  //       fjs = d.getElementsByTagName(s)[0];
  //     if (d.getElementById(id)) {
  //       return;
  //     }
  //     js = d.createElement(s);
  //     js.id = id;
  //     js.src = "https://connect.facebook.net/en_US/sdk.js";
  //     fjs.parentNode.insertBefore(js, fjs);
  //   })(document, "script", "facebook-jssdk");
  // }

  // const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });

  // React.useEffect(() => {
  //   //Handle google login
  //   // if (response?.type === "success") {
  //   //   const { authentication } = response;
  //   //   console.log(authentication);
  //   //   props.setStarted(true);
  //   // }
  // }, [response]);

  return (
    <View style={styles.rootContainer}>
      <View style={styles.container}>
        <View style={styles.intro}>
          <Image style={styles.logo} source={{ uri: LOGO_IMAGE }}></Image>
          <Text style={styles.greetings}>Welcome to Easy Work</Text>
          <Text style={styles.motto}>You have Exactly What Someone Needs</Text>
        </View>

        <View style={styles.buttons}>
          <Pressable
            onPress={() => handleClientButton()}
            style={styles.buttonClient}
          >
            <Text style={styles.titleClient}>Looking for a job ?</Text>
          </Pressable>
          <Pressable
            onPress={() => handleAgencyButton()}
            style={styles.buttonAgency}
          >
            <Text style={styles.titleAgency}>Looking for employees ?</Text>
          </Pressable>
          <Text style={styles.instruction}>
            {/* Once you click on either buttons below, you will be propmted with
          Google authentication box, you will then be redirected to your
          account, if you don't have an account, one will be created for you */}
            Only your google account is needed both to sign up & to login.
          </Text>
        </View>
      </View>
    </View>
  );
}

const mainColor = "#81B387";
const sideColor = "#d1ffd7";

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginVertical: 80,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  intro: {
    alignItems: "center",
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 40,
  },
  greetings: {
    width: 400,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
  },
  motto: {
    width: 300,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  instruction: {
    width: 380,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "300",
    color: "#000",
  },
  buttons: {
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 60,
  },
  buttonClient: {
    height: 46,
    width: 340,
    backgroundColor: "#2071eb",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 10,
    margin: 10,
    padding: 5,
  },
  buttonAgency: {
    height: 46,
    width: 340,
    backgroundColor: sideColor,
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 10,
    margin: 10,
    padding: 5,
  },
  titleClient: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#fff",
    alignSelf: "center",
  },
  titleAgency: {
    fontWeight: "bold",
    fontSize: 20,
    color: mainColor,
    alignSelf: "center",
  },
});
