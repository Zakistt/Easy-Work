import {
  StyleSheet,
  Text,
  View,
  Image,
  Linking,
  ScrollView,
  Pressable,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import * as React from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import useToaster from "../MenuFunctions/useToaster";

import { Icon, Button, Popover } from "native-base";
import { Entypo } from "@expo/vector-icons";

/*Main */
function OfferScreen({ navigation, route }) {
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
  const data = route.params.item;
  const user = useSelector((state) => state.user);

  const [isOpen, setIsOpen] = React.useState(false);

  const [indicator, setIndicator, setResponse] = useToaster();
  function dataToaster(data) {
    setResponse(data);
    setIndicator(indicator + 1);
  }

  function openMaps() {
    if (data.address != "") {
      Linking.openURL(
        `https://www.google.com/maps/search/ ${data.address
          .replace(/\u002C/g, "%2C")
          .replace(/\s/g, "+")}`
      );
    } else {
      dataToaster({
        data: {
          title: "Address not found",
          description: "This offer has no address associated",
          status: "info",
        },
      });
    }
  }

  function call() {
    if (data.phone == "") {
      dataToaster({
        data: {
          title: "Dial info are not found",
          description: "This offer has no number associated",
          status: "info",
        },
      });
    } else {
      let phoneNumber;
      if (Platform.OS !== "android") {
        phoneNumber = `telprompt:${data.phone}`;
      } else {
        phoneNumber = `tel:${data.phone}`;
      }
      Linking.openURL(phoneNumber);
      setIsOpen(false);
    }
  }

  async function sendResume() {
    await axios({
      method: "post",
      url: "http://192.168.100.166:3000/offerapplication/",
      params: {
        user_id: user._id,
        offer_id: data._id,
      },
      responseType: "json",
    })
      .then((response) => dataToaster(response))
      .catch((error) => {
        console.error(error);
        throw error;
      });

    setIsOpen(false);
  }

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: data.pfp }}></Image>
      <ScrollView>
        <View style={short.container}>
          <Text style={short.name}>{data.name}</Text>
          <View style={{ flexDirection: "column", marginTop: 4 }}>
            <Text style={short.positionintro}>Looking for : </Text>
            <Text style={short.position}>{data.position}</Text>
          </View>
          <TouchableOpacity
            onPress={() => openMaps()}
            style={{ flexDirection: "row", marginTop: 20 }}
          >
            <Icon as={Entypo} name="location" size={8} color="#2071eb" />
            <Text style={short.address}>
              {data.address || "Unknown address"}
            </Text>
          </TouchableOpacity>
          <View style={requirements.container}>
            {data.age[0] + data.age[1] != 0 && (
              <View style={requirements.box}>
                <Text style={requirements.value}>
                  {data.age[0]}-{data.age[1]}
                </Text>
                <Text style={requirements.name}>Age</Text>
              </View>
            )}
            {data.experience != 0 && (
              <View style={requirements.box}>
                <Text style={requirements.value}>{data.experience}</Text>
                <Text style={requirements.name}>Experience</Text>
              </View>
            )}
            {data.experience != 0 && (
              <View style={requirements.box}>
                <Text style={[requirements.value, { fontSize: 16 }]}>
                  {(data.salary[0] + data.salary[1]) / 2} DA
                </Text>
                <Text style={requirements.name}>salary</Text>
              </View>
            )}
          </View>
        </View>
        {data.description != "" && (
          <View style={description.container}>
            <Text style={description.title}>About the job</Text>
            <Text style={description.content}>{data.description}</Text>
          </View>
        )}
        <Popover
          placement={"top right"}
          trigger={(triggerProps) => {
            return (
              <Button
                style={button.container}
                {...triggerProps}
                onPress={() => setIsOpen(true)}
              >
                Interested ?
              </Button>
            );
          }}
          isOpen={isOpen}
          onClose={() => setIsOpen(!isOpen)}
        >
          <Popover.Content w="56">
            <Popover.Arrow />
            <Popover.CloseButton onPress={() => setIsOpen(false)} />
            <Popover.Header>Are you interested ?</Popover.Header>
            <Popover.Body>
              You can send your resume by applying to this job offer, the
              employer will be notified. Or you can take the initiative and give
              them a call.
            </Popover.Body>
            <Popover.Footer justifyContent="center">
              <Button.Group space={2}>
                <Button
                  style={{ backgroundColor: "#F7996E" }}
                  onPress={() => sendResume()}
                >
                  Apply
                </Button>
                <Button
                  style={{ backgroundColor: "#9BC53D" }}
                  onPress={() => call()}
                >
                  Call
                </Button>
              </Button.Group>
            </Popover.Footer>
          </Popover.Content>
        </Popover>
      </ScrollView>
    </View>
  );
}

/*Css Styling*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "40%",
  },
});

const short = StyleSheet.create({
  container: {
    flex: 1,
    margin: 12,
    marginBottom: 0,
  },
  name: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2071eb",
    textTransform: "capitalize",
  },
  positionintro: {
    fontSize: 16,
    fontWeight: "500",
    opacity: 0.7,
    color: "#000",
    textTransform: "capitalize",
    marginLeft: 20,
    marginTop: 2,
    marginBottom: 6,
  },
  position: {
    width: "90%",
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    textTransform: "capitalize",
    padding: 4,
    paddingHorizontal: 12,
    backgroundColor: "rgba(32, 113, 235, 0.5)",
    borderRadius: 10,
    textAlign: "center",
    alignSelf: "center",
  },
  address: {
    padding: 4,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
    color: "#2071eb",
    opacity: 0.5,
    textTransform: "capitalize",
  },
});

const requirements = StyleSheet.create({
  container: {
    margin: 24,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  box: {
    height: 80,
    width: 90,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2071eb",
    borderRadius: 25,
    marginHorizontal: 26,
  },
  value: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    textTransform: "uppercase",
  },
  name: {
    top: 8,
    fontSize: 14,
    fontWeight: "400",
    color: "#fff",
    textTransform: "capitalize",
  },
});

const description = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    paddingHorizontal: 12,
    paddingBottom: 6,
    fontSize: 22,
    fontWeight: "600",
    color: "#2071eb",
    left: 20,
  },
  content: {
    zIndex: -1,
    elevation: -1,
    fontSize: 12,
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
});

const button = StyleSheet.create({
  flexDirection: "row",
  justifyContent: "space-evenly",
  container: {
    backgroundColor: "#2071eb",
    padding: 12,
    borderRadius: 10,
    height: 60,
    width: 160,
    margin: 10,
    justifyContent: "center",
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
});
export default OfferScreen;
