import {
  StyleSheet,
  Pressable,
  Dimensions,
  FlatList,
  Text,
  View,
  Linking,
  Platform,
  Alert,
} from "react-native";
import * as React from "react";
import { useSelector } from "react-redux";

import axios from "axios";

import * as Location from "expo-location";

import { Searchbar } from "react-native-paper";
import { Avatar } from "native-base";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

import Menu from "../components/Menu";
import useToaster from "../MenuFunctions/useToaster";

/*flatlist height and data */
const windowHeight = Dimensions.get("window").height;
const flatlistHeight = windowHeight - 295;

/*Filter Button color functions and press handles */
function Button(props) {
  return (
    <Pressable
      onPress={() => buttonFunction(props)}
      style={{
        backgroundColor: ButtonColor(props).bg,
        height: 40,
        width: 116,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: ButtonColor(props).color,
          fontSize: 16,
          fontWeight: "600",
        }}
      >
        {props.text}
      </Text>
    </Pressable>
  );
}
function buttonFunction(props) {
  props.setOption(props.text);
}
const ButtonColor = (props) => {
  if (props.text == props.option) {
    return { bg: "#2071EB", color: "#fff" };
  } else {
    return { bg: "#EEECEC", color: "#000" };
  }
};

/*Main */
function BrowseScreen({ navigation }) {
  // search
  const [searchQuery, setSearchQuery] = React.useState("");
  const onChangeSearch = (query) => setSearchQuery(query);

  // option
  const [option, setOption] = React.useState("Most Recent");

  // location
  const [location, setLocation] = React.useState({});

  // data to render
  const [data, setData] = React.useState();

  React.useEffect(() => {
    if (option == "Closest") {
      async function getlocation() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setOption("Most Recent");
          return;
        } else if (status === "granted") {
          let { coords } = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest,
            maximumAge: 10000,
          });

          let { latitude, longitude } = coords;
          setLocation({ latitude, longitude });
        }
      }

      getlocation();
    }

    axios({
      method: "post",
      url: "http://192.168.100.166:3000/offers/",
      data: {
        option: option,
        searchQuery: searchQuery,
        location: location,
      },
      responseType: "json",
    })
      .then((response) => setData(response.data))
      .catch((error) => {
        console.error(error);
      });
  }, [option, searchQuery]);

  const resume = useSelector((state) => state.user);
  const [indicator, setIndicator, setResponse] = useToaster();
  function dataToaster(data) {
    setResponse(data);
    setIndicator(indicator + 1);
  }
  async function sendResume(item) {
    await axios({
      method: "post",
      url: "http://192.168.100.166:3000/offerapplication/",
      params: {
        user_id: resume._id,
        offer_id: item._id,
      },
      responseType: "json",
    })
      .then((response) => dataToaster(response))
      .catch((error) => {
        console.error(error);
      });
  }

  function call(item) {
    if (item.phone == "") {
      dataToaster({
        data: {
          title: "Dial info are not found",
          description: "This offer has no number available",
          status: "info",
        },
      });
    } else {
      let phoneNumber;
      if (Platform.OS !== "android") {
        phoneNumber = `telprompt:${item.phone}`;
      } else {
        phoneNumber = `tel:${item.phone}`;
      }
      Linking.openURL(phoneNumber);
    }
  }

  const renderItem = ({ item }) => (
    <View style={contentstyles.card}>
      <Pressable onPress={() => navigation.navigate("Offer", { item: item })}>
        <Avatar
          bg={"blueGray.200"}
          size="100"
          style={contentstyles.adpic}
          source={{
            uri: item.pfp,
          }}
        ></Avatar>
      </Pressable>
      <Pressable
        style={contentstyles.adinfo}
        onPress={() => navigation.navigate("Offer", { item: item })}
      >
        <Text style={contentstyles.adname}>{item.name}</Text>
        <Text style={contentstyles.adaddress}>{item.address}</Text>
        <Text style={contentstyles.adposition}>{item.position}</Text>
      </Pressable>
      <View style={contentstyles.adcontact}>
        <Pressable
          onPress={() => sendResume(item)}
          android_ripple={{ color: "#0F346B", foreground: true, radius: 38 }}
        >
          <View style={contentstyles.addetails}>
            <MaterialCommunityIcons
              name="clipboard-text-outline"
              size={40}
              color="#fff"
            />
          </View>
        </Pressable>
        <Pressable
          onPress={() => call(item)}
          android_ripple={{ color: "#0F346B", foreground: true, radius: 38 }}
        >
          <View
            style={[
              contentstyles.adphone,
              { backgroundColor: item.phone == "" ? "#d4d2d2" : "#2071eb" },
            ]}
          >
            <Feather name="phone" size={40} color="#fff" />
          </View>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={headerstyles}>
        <Menu style={headerstyles.menu} navigation={navigation} />
        {/* <MaterialCommunityIcons
          name="bell-outline"
          size={40}
          color="#2071EB"
          style={headerstyles.notification}
        /> */}
      </View>

      <View style={contentstyles}>
        <Text style={contentstyles.greet}>Welcome, {resume.name}</Text>
        <Searchbar
          placeholder="Search for Jobs, Applications..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          selectionColor="#2071eb"
          inputStyle={contentstyles.input}
          style={contentstyles.searchbar}
        />
        <View style={contentstyles.filterbar}>
          <Button
            text={"Most Recent"}
            option={option}
            setOption={setOption}
          ></Button>
          <Button
            text={"Highest Paid"}
            option={option}
            setOption={setOption}
          ></Button>
          <Button
            text={"Closest"}
            option={option}
            setOption={setOption}
          ></Button>
        </View>
        <View style={contentstyles.cards}>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            style={contentstyles.cards}
            showsVerticalScrollIndicator={false}
          />
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
  notification: {
    position: "absolute",
    right: 0,
    marginRight: 10,
    marginTop: 10,
  },
});

const contentstyles = StyleSheet.create({
  zIndex: -1,
  elevation: -1,
  greet: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2071eb",
    margin: 16,
  },
  searchbar: {
    width: 348,
    height: 48,
    alignSelf: "center",
    borderRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 10,
  },
  input: {
    color: "#2071eb",
    opacity: 0.4,
    fontSize: 14,
    fontWeight: "regular",
    textTransform: "capitalize",
  },

  filterbar: {
    flexDirection: "row",
    height: 40,
    width: 348,
    alignSelf: "center",
    margin: 30,
    backgroundColor: "#EEECEC",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 10,
  },
  cards: {
    width: 348,
    height: flatlistHeight,
    alignSelf: "center",
  },
  card: {
    flexDirection: "row",
    flex: 1,
    // width: 348,
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#EEECEC",
    borderRadius: 12,
  },
  adpic: {
    margin: 8,
  },
  adinfo: {
    width: 164,
    marginHorizontal: 4,
    marginVertical: 12,
  },
  adname: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2071eb",
    textTransform: "capitalize",
  },
  adaddress: {
    fontSize: 10,
    fontWeight: "500",
    color: "#2071eb",
    opacity: 0.4,
    textTransform: "capitalize",
  },
  adposition: {
    borderRadius: 9,
    backgroundColor: "rgba(32, 113, 235, 0.25)",
    paddingLeft: 12,
    padding: 8,
    marginTop: 12,
    fontSize: 12,
    fontWeight: "600",
    color: "#2071eb",
    position: "relative",
    textTransform: "capitalize",
    textAlign: "center",
  },
  adcontact: {
    flexDirection: "column",
    width: 60,
  },
  addetails: {
    height: "50%",
    borderBottomColor: "#fff",
    borderBottomWidth: 0.5,
    backgroundColor: "#2071eb",
    borderTopRightRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
  adphone: {
    height: "50%",
    borderTopColor: "#fff",
    borderTopWidth: 0.5,
    backgroundColor: "#2071eb",
    borderBottomRightRadius: 12,
    justifyContent: "center",
    flexGrow: 1,
    alignItems: "center",
  },
});

export default BrowseScreen;
