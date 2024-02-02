import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import * as React from "react";
import axios from "axios";
import { Avatar } from "native-base";
import { useSelector, useDispatch } from "react-redux";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useFocusEffect } from "@react-navigation/native";

import Menu from "../components/Menu";

const Tab = createMaterialTopTabNavigator();

function Contacted({ navigation, data }) {
  const contactedAgencies = data.contactedAgencies;
  return (
    <View style={stats.boxcontainer}>
      {contactedAgencies.length != 0 && (
        <ScrollView>
          <View style={stats.contentcontainer}>
            {contactedAgencies
              .slice(0)
              .reverse()
              .map((item) => {
                return (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Offer", { item: item })}
                    key={item._id}
                  >
                    <View style={stats.elementContainer}>
                      <Avatar
                        size="lg"
                        style={stats.elementAvatar}
                        bg="blueGray.200"
                        source={{
                          uri: item.pfp,
                        }}
                      ></Avatar>
                      <View style={stats.elementInfo}>
                        <Text style={stats.elementName}>{item.name}</Text>
                        <Text style={stats.elementPosition}>
                          {item.position}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </View>
        </ScrollView>
      )}
      {contactedAgencies.length == 0 && (
        <View>
          <Text style={stats.empty}>
            You have no pending applications, swipe right and apply for more 😃
          </Text>
        </View>
      )}
    </View>
  );
}

function Accepted({ navigation, data }) {
  const acceptedBy = data.acceptedBy;
  return (
    <View style={stats.boxcontainer}>
      {acceptedBy.length != 0 && (
        <ScrollView>
          <View style={stats.contentcontainer}>
            {acceptedBy
              .slice(0)
              .reverse()
              .map((item) => {
                return (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Offer", { item: item })}
                  >
                    <View style={stats.elementContainer}>
                      <Avatar
                        size="lg"
                        key={item._id}
                        style={stats.elementAvatar}
                        bg="blueGray.200"
                        source={{
                          uri: item.pfp,
                        }}
                      ></Avatar>
                      <View style={stats.elementInfo}>
                        <Text style={stats.elementName}>{item.name}</Text>
                        <Text style={stats.elementPosition}>
                          {item.position}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </View>
        </ScrollView>
      )}
      {acceptedBy.length == 0 && (
        <View>
          <Text style={stats.empty}>
            Your resume hasn't been approved by any employer yet ☹️
          </Text>
        </View>
      )}
    </View>
  );
}

function Agencies({ data, navigation }) {
  return (
    <Tab.Navigator
      screenOptions={{
        swipeEnabled: true,
        tabBarStyle: stats.titleContainer,
        tabBarLabelStyle: stats.title,
        tabBarIndicatorStyle: {
          borderWidth: 1,
          borderColor: "#2071eb",
        },
      }}
    >
      <Tab.Screen
        name="Applied for"
        children={() => <Contacted data={data} navigation={navigation} />}
      />
      <Tab.Screen
        name="Approved By"
        children={() => <Accepted data={data} navigation={navigation} />}
      />
    </Tab.Navigator>
  );
}

/*Main */
function ProfileScreen({ navigation }) {
  const resume = useSelector((state) => state.user);
  const [data, setData] = React.useState({
    contactedAgencies: [],
    acceptedBy: [],
  });
  useFocusEffect(
    React.useCallback(() => {
      axios({
        method: "get",
        url: "http://192.168.100.166:3000/user/applications",
        params: {
          id: resume._id,
        },
        responseType: "json",
      })
        .then((response) => setData(response.data))
        .catch((error) => {
          console.error(error);
        });
    }, [])
  );
  return (
    <View style={styles.container}>
      <View style={headerstyles}>
        {/* <MaterialCommunityIcons name="menu" size={28} color="black" style={headerstyles.menu} /> */}
        <Menu style={headerstyles.menu} navigation={navigation} />
      </View>

      <View style={contentstyles}>
        <Avatar
          bg="blueGray.200"
          size="90"
          style={contentstyles.pfp}
          source={{
            uri: resume.pfp,
          }}
        ></Avatar>
        <Text style={[contentstyles.id, { fontSize: 24 }]}>{resume.name}</Text>
        <Text style={[contentstyles.id, { fontSize: 18 }]}>{resume.job}</Text>
        <View style={contentstyles.box}>
          <Text style={contentstyles.content}>{resume.bio}</Text>
        </View>
        <View style={stats.container}>
          <Agencies data={data} navigation={navigation} />
        </View>
      </View>
    </View>
  );
}

/*Css Styling*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

const headerstyles = StyleSheet.create({
  height: 40,
  marginTop: 20,
  width: "100%",
  position: "relative",
  top: 0,
  menu: {
    marginLeft: 10,
    marginTop: 5,
  },
});

const contentstyles = StyleSheet.create({
  flex: 1,
  zIndex: -1,
  elevation: -1,
  id: {
    fontWeight: "bold",
    color: "#2071eb",
    alignSelf: "center",
  },
  pfp: {
    alignSelf: "center",
    marginVertical: 16,
  },
  box: {
    marginHorizontal: 32,
    marginBottom: 8,
    marginTop: 16,
  },
  content: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
});

const stats = StyleSheet.create({
  container: {
    width: "90%",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 20,
    borderColor: "#2071eb",
    borderWidth: 1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    flex: 1,
    overflow: "hidden",
  },
  boxcontainer: {
    backgroundColor: "#fff",
    flex: 1,
  },
  titleContainer: {
    backgroundColor: "#fff",
    padding: 5,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  title: {
    fontSize: 10,
    fontWeight: "700",
    color: "#2071eb",
  },
  contentcontainer: {
    flexDirection: "column",
  },
  elementContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginHorizontal: 12,
  },
  elementInfo: {
    flex: 1,
    flexDirection: "column",
    padding: 6,
    justifyContent: "center",
  },
  elementName: {
    flexWrap: "wrap-reverse",
    marginLeft: 8,
    fontSize: 16,
    color: "#2071eb",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  elementPosition: {
    marginLeft: 8,
    fontSize: 12,
    color: "#2071eb",
    opacity: 0.8,
    fontWeight: "400",
  },
  elementAvatar: {
    margin: 5,
  },
  empty: {
    fontSize: 18,
    fontWeight: "500",
    color: "#2071eb",
    justifyContent: "center",
    textAlign: "center",
    marginHorizontal: 40,
    marginTop: 20,
  },
});

export default ProfileScreen;
