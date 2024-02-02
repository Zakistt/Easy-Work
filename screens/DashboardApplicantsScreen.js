import {
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  Text,
  View,
  TouchableOpacity,
  BackHandler,
} from "react-native";

import * as React from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Avatar, ScrollView } from "native-base";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

function Approved(props) {
  const approved = props.data.acceptedApplicants || [];
  return (
    <View style={styles.container}>
      <View style={contentstyles}>
        {approved.length != 0 && (
          <FlatList
            data={approved}
            renderItem={(item) => props.renderItem(item.item, props.type)}
            keyExtractor={(item) => item._id}
            style={contentstyles.elementsContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
        {approved.length == 0 && (
          <View>
            <Text style={contentstyles.empty}>
              You have not approved any application yet, swipe right to check
              them 😃
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

function Pending(props) {
  const pending = props.data.applicants || [];
  return (
    <View style={styles.container}>
      <View style={contentstyles}>
        {pending.length != 0 && (
          <FlatList
            data={pending}
            renderItem={(item) => props.renderItem(item.item, props.type)}
            keyExtractor={(item) => item._id}
            style={contentstyles.elementsContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
        {pending.length == 0 && (
          <View>
            <Text style={contentstyles.empty}>
              No one has applied for this job offer yet ☹️
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

/*Main */
function DashboardApplicantsScreen({ navigation, route }) {
  React.useEffect(() => {
    function BACKACTION() {
      navigation.goBack();
      return true;
    }
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      BACKACTION
    );
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backHandler);
  }, []);
  const id = route.params.offer._id;
  const [data, setData] = React.useState([]);
  const [refresh, setRefresh] = React.useState(0);
  React.useEffect(() => {
    axios({
      method: "get",
      url: "http://192.168.100.166:3000/offerapplicants/",
      params: {
        id: id,
      },
      responseType: "json",
    })
      .then((response) => setData(response.data))
      .catch((error) => {
        console.error(error);
      });
  }, [refresh]);
  function renderItem(item, type) {
    return (
      <TouchableOpacity
        style={contentstyles.elementContainer}
        onPress={() =>
          navigation.navigate("DashboardResume", {
            user: item,
            offer: route.params.offer,
            type: type,
            refresh: refresh,
            setRefresh: setRefresh,
          })
        }
      >
        <Avatar
          style={contentstyles.elementImage}
          source={{ uri: item.pfp }}
        ></Avatar>
        <View style={contentstyles.elementInfo}>
          <Text style={contentstyles.elementName}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={contentstyles}>
        <View style={contentstyles.titleContainer}>
          <Text style={contentstyles.title}>Applicants</Text>
        </View>
        <Tab.Navigator
          screenOptions={{
            swipeEnabled: true,
            tabBarStyle: stats.titleContainer,
            tabBarLabelStyle: stats.title,
            tabBarIndicatorStyle: {
              borderWidth: 1,
              borderColor: mainColor,
            },
          }}
        >
          <Tab.Screen
            name="Pending"
            children={() => (
              <Pending renderItem={renderItem} data={data} type="pending" />
            )}
          />
          <Tab.Screen
            name="Approved"
            children={() => (
              <Approved renderItem={renderItem} data={data} type="approved" />
            )}
          />
        </Tab.Navigator>
      </View>
    </View>
  );
}

const mainColor = "#81B387";
const sideColor = "#d1ffd7";
/*Css Styling*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 200,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});

const contentstyles = StyleSheet.create({
  flex: 1,
  marginTop: 5,
  marginBottom: 10,
  titleContainer: {
    height: 40,
    justifyContent: "center",
    backgroundColor: sideColor,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: mainColor,
    marginLeft: 20,
  },
  // subtitleContainer: {
  //   marginTop: 10,
  //   height: 36,
  //   justifyContent: "center",
  //   backgroundColor: sideColor,
  // },
  // subtitle: {
  //   fontSize: 20,
  //   fontWeight: "600",
  //   color: mainColor,
  //   marginLeft: 20,
  //   textAlign: "center",
  // },
  empty: {
    fontSize: 18,
    fontWeight: "500",
    color: mainColor,
    justifyContent: "center",
    textAlign: "center",
    marginHorizontal: 40,
    marginTop: 20,
  },
  elementsContainer: {
    marginHorizontal: 20,
  },
  elementContainer: {
    flexDirection: "row",
    marginTop: 10,
    padding: 10,
    marginHorizontal: 20,
    height: 80,
    alignItems: "center",
    // backgroundColor: "#eeefff",
    borderColor: sideColor,
    borderRadius: 20,
    borderStartWidth: 5,
    borderEndWidth: 5,
  },
  elementInfo: {
    flexDirection: "column",
  },
  elementImage: {
    height: 60,
    width: 60,
  },
  elementName: {
    marginLeft: 8,
    fontSize: 16,
    color: mainColor,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  elementDate: {
    padding: 10,
    fontSize: 12,
    color: mainColor,
    opacity: 0.8,
    fontWeight: "400",
  },
});
const stats = StyleSheet.create({
  titleContainer: {
    backgroundColor: "#fff",
    padding: 5,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: mainColor,
  },
});

export default DashboardApplicantsScreen;
