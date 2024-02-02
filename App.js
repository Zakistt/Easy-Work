import React from "react";
import { BackHandler } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import BrowseScreen from "./screens/BrowseScreen";
import ResumeScreen from "./screens/ResumeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import OfferScreen from "./screens/OfferScreen";

import Settings from "./screens/SettingsScreen";

import DashboardHomeScreen from "./screens/DashboardHomeScreen";
import DashboardNewOfferScreen from "./screens/DashboardNewOfferScreen";
import DashboardOfferScreen from "./screens/DashboardOfferScreen";
import DashboardApplicantsScreen from "./screens/DashboardApplicantsScreen";
import DashboardResumeScreen from "./screens/DashboardResumeScreen";
import DashboardSettingsScreen from "./screens/DashboardSettingsScreen";

import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  createStackNavigator,
  TransitionSpecs,
  CardStyleInterpolators,
  TransitionPresets,
} from "@react-navigation/stack";
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NativeBaseProvider, Avatar } from "native-base";

import { Provider } from "react-redux";
import store from "./store/store";
import { useSelector } from "react-redux";

import { MaterialCommunityIcons } from "@expo/vector-icons";

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();
const Drawer = createDrawerNavigator();

function Offers() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Browse" component={BrowseScreen}></Stack.Screen>
      <Stack.Screen name="Offer" component={OfferScreen}></Stack.Screen>
    </Stack.Navigator>
  );
}

function DashboardHome() {
  return (
    <Drawer.Navigator
      initialRouteName={Dashboard}
      drawerContent={(props) => <DashboardSettingsScreen {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen name="Dashboard" component={DashboardHomeScreen} />
    </Drawer.Navigator>
  );
}

function Dashboard() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="DashboardHome"
        component={DashboardHome}
      ></Stack.Screen>
      <Stack.Screen
        name="DashboardNewOffer"
        component={DashboardNewOfferScreen}
      ></Stack.Screen>
      <Stack.Screen
        name="DashboardOffer"
        component={DashboardOfferScreen}
      ></Stack.Screen>

      <Stack.Group
        screenOptions={{
          presentation: "transparentModal",
          cardOverlayEnabled: true,
          gestureEnabled: true,
          gestureDirection: "vertical",
          ...TransitionPresets.RevealFromBottomAndroid,
          // transitionSpec: {
          //   open: TransitionSpecs.RevealFromBottomAndroidSpec,
          //   close: TransitionSpecs.RevealFromBottomAndroidSpec,
          // },
          // CardStyleInterpolators:
          //   CardStyleInterpolators.forScaleFromCenterAndroid,
          cardStyle: {
            width: "100%",
            position: "absolute",
            top: 0,

            // right: 40,
            bottom: 1,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}
      >
        <Stack.Screen
          name="DashboardApplicants"
          component={DashboardApplicantsScreen}
        ></Stack.Screen>
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          presentation: "transparentModal",
          propagateSwipe: true,
          cardOverlayEnabled: true,
          gestureEnabled: true,
          gestureDirection: "vertical",
          ...TransitionPresets.RevealFromBottomAndroid,
          // transitionSpec: {
          //   open: TransitionSpecs.RevealFromBottomAndroidSpec,
          //   close: TransitionSpecs.BottomSheetSlideInSpec,
          // },
          // CardStyleInterpolators:
          //   CardStyleInterpolators.forScaleFromCenterAndroid,
          cardStyle: {
            width: "100%",
            position: "absolute",
            top: 80,

            // right: 40,
            bottom: 1,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}
      >
        <Stack.Screen
          name="DashboardResume"
          component={DashboardResumeScreen}
        ></Stack.Screen>
      </Stack.Group>
    </Stack.Navigator>
  );
}

// function ProfileStack() {
//    return (
//     <Stack.Navigator
//       screenOptions={{
//         headerShown: false,
//     }}>
//       <Stack.Screen name="Profile" component={ProfileScreen}></Stack.Screen>
//       <Stack.Screen name="Dashboard" component={Dashboard}></Stack.Screen>
//     </Stack.Navigator>
//   )
// }

function Main() {
  useFocusEffect(
    React.useCallback(() => {
      function BACKACTION() {
        BackHandler.exitApp();
        return true;
      }
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        BACKACTION
      );
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", backHandler);
    }, [])
  );

  const pfp = useSelector((state) => state.user.pfp);

  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name !== "Profile") {
            let iconName;

            if (route.name === "Offers") {
              iconName = "briefcase-search-outline";
            } else if (route.name === "Resume") {
              iconName = "card-account-details-outline";
            }
            return (
              <MaterialCommunityIcons name={iconName} size={40} color="#fff" />
            );
          } else {
            return (
              <Avatar
                bg="blueGray.200"
                size="50"
                source={{
                  uri: pfp,
                }}
              ></Avatar>
            );
          }
        },
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: { backgroundColor: "#2071eb" },
        tabBarIconStyle: {
          width: 50,
          height: 50,
          margin: -10,
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarIndicatorStyle: { backgroundColor: "#fff" },
      })}
    >
      <Tab.Screen
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            navigation.jumpTo("Offers");
          },
        })}
        name="Offers"
        component={Offers}
      ></Tab.Screen>

      <Tab.Screen
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            navigation.jumpTo("Profile");
          },
        })}
        name="Profile"
        component={ProfileScreen}
      ></Tab.Screen>

      <Tab.Screen
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            navigation.jumpTo("Resume");
          },
        })}
        name="Resume"
        component={ResumeScreen}
      ></Tab.Screen>
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <Provider store={store}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Group>
              <Stack.Screen name="Home" component={HomeScreen}></Stack.Screen>
              <Stack.Screen name="Login" component={LoginScreen}></Stack.Screen>
              <Stack.Screen name="Main" component={Main}></Stack.Screen>
              <Stack.Screen
                name="Dashboard"
                component={Dashboard}
              ></Stack.Screen>
            </Stack.Group>
            <Stack.Group
              screenOptions={{
                presentation: "transparentModal",
                cardOverlayEnabled: true,
                gestureEnabled: true,
                gestureDirection: "vertical",
                gestureResponseDistance: 1000,
                // propagateSwipe: true,
                ...TransitionPresets.RevealFromBottomAndroid,
                cardStyle: {
                  width: "100%",
                  // position: "absolute",
                  top: "65%",
                  // right: 40,
                  bottom: 1,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                },
              }}
            >
              <Stack.Screen name="Settings" component={Settings} />
            </Stack.Group>
          </Stack.Navigator>
        </Provider>
      </NativeBaseProvider>
    </NavigationContainer>
  );
}

export default App;
