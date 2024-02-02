import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Pressable,
  Alert,
  BackHandler,
} from "react-native";
import * as React from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import {
  Icon,
  Button,
  Popover,
  Input,
  TextArea,
  Modal,
  FormControl,
  AlertDialog,
} from "native-base";

import useToaster from "../MenuFunctions/useToaster";
import { Entypo, Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import DefaultImage from "../assets/Add-Button-PNG-File.png";
import RepImage from "../assets/Offer-Profile.png";

const mainColor = "#81B387";
const sideColor = "#d1ffd7";
/*Main */
function DashboardOfferScreen({ navigation }) {
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
  const DEFAULT_IMAGE = Image.resolveAssetSource(DefaultImage).uri;
  const REP_IMAGE = Image.resolveAssetSource(RepImage).uri;

  const company = useSelector((state) => state.employer);

  const [data, setData] = React.useState({
    name: "",
    address: "",
    gps: "",
    position: "",
    description: "",
    pfp: DEFAULT_IMAGE,
    phone: "",
    age: [0, 0],
    experience: 0,
    salary: [0, 0],
  });

  const [indicator, setIndicator, setResponse] = useToaster();
  function dataToaster(data) {
    setResponse(data);
    setIndicator(indicator + 1);
  }
  async function pickImage() {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setData((data) => ({
        ...data,
        pfp: result.assets[0].uri,
      }));
    }
  }

  async function create() {
    if (data.position == "") {
      dataToaster({
        data: {
          title: "Offer was not created",
          description: "The position field cannot be empty",
          status: "error",
        },
      });
    } else if (data.pfp == DEFAULT_IMAGE) {
      setData((data) => ({
        ...data,
        pfp: REP_IMAGE,
      }));
      dataToaster({
        data: {
          title: "no photo was added",
          description:
            "you haven't chosen a photo for your offer, the standard photo was chosen instead, if you like to keep it click on the « Create » button again, otherwise tap on the photo to change it.",
          status: "info",
        },
      });
    } else {
      const info = data;
      info.name = company.name;
      info.creatorID = company._id;
      info.applicants = [];
      info.acceptedApplicants = [];

      axios({
        method: "post",
        url: "http://192.168.100.166:3000/offer/",
        params: {},
        data: {
          offer: info,
        },
        responseType: "json",
      })
        .then((response) => dataToaster(response))
        .catch((error) => {
          console.error(error.message);
        });
      navigation.goBack();
    }
  }

  function toInteger(value) {
    if (parseInt(value) == NaN || value == "") {
      return "";
    } else {
      return parseInt(value);
    }
  }

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function handleChange(value, fieldname) {
    setData((data) => ({
      ...data,
      [fieldname]: value,
    }));
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          pickImage();
        }}
      >
        <Image style={styles.image} source={{ uri: data.pfp }}></Image>
      </Pressable>

      <ScrollView>
        <View style={details.container}>
          <View style={details.short}>
            <Text style={details.name}>{company.name}</Text>
            <View style={{ flexDirection: "row", marginTop: 8 }}>
              <Text style={details.positionintro}>Looking for : </Text>
              <View style={details.positionContainer}>
                <Input
                  style={details.position}
                  value={data.position}
                  w="90%"
                  variant="underlined"
                  onChangeText={(value) =>
                    handleChange(capitalize(value), "position")
                  }
                ></Input>
              </View>
            </View>
            <View style={{ flexDirection: "row", marginTop: 12 }}>
              <Text style={details.label}>Phone number: </Text>
              <Input
                keyboardType="numeric"
                style={details.contact}
                value={data.phone}
                w="40%"
                onChangeText={(value) => handleChange(value, "phone")}
              ></Input>
            </View>
            <View style={{ flexDirection: "row", marginTop: 12 }}>
              <Text style={details.label}>Address:</Text>
              <Input
                style={details.contact}
                value={data.address}
                w="60%"
                onChangeText={(value) =>
                  handleChange(capitalize(value), "address")
                }
              ></Input>
              <Icon
                as={Entypo}
                name="location"
                value={data.gps}
                size={8}
                color={mainColor}
                style={{ marginLeft: 16, marginTop: 8 }}
              />

              {/* <Modal
                isOpen={ModalState}
                onClose={() => setModalState(false)}
                justifyContent="center"
                style={styles.modalContainer}
              >
                <Modal.Content maxWidth="400px" style={styles.modal}>
                  <Modal.CloseButton />
                  <Modal.Body>
                    <FormControl>
                      <FormControl.Label style={{ padding: 20 }}>
                        Copy and Paste your GPS link for more accuracy :{" "}
                      </FormControl.Label>
                      <Input
                        onChangeText={(value) => handleChange(value, "gps")}
                        value={data.gps}
                      />
                    </FormControl>
                  </Modal.Body>
                </Modal.Content>
              </Modal> */}
            </View>
            {/* <Text style={details.tooltip}>
              Click on the location icon for more accuracy
            </Text> */}
          </View>
          <Text style={requirements.title}>Requirements</Text>
          <View style={requirements.container}>
            <View style={requirements.requirementContainer}>
              <Text style={requirements.name}>Age Target: </Text>
              <View style={requirements.box}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Input
                    keyboardType="numeric"
                    value={data.age[0].toString()}
                    w="40%"
                    variant="underlined"
                    style={requirements.value}
                    onChangeText={(value) =>
                      handleChange([toInteger(value), data.age[1]], "age")
                    }
                  ></Input>
                  <Text style={requirements.value}>-</Text>
                  <Input
                    keyboardType="numeric"
                    value={data.age[1].toString()}
                    w="40%"
                    variant="underlined"
                    style={requirements.value}
                    onChangeText={(value) =>
                      handleChange([data.age[0], toInteger(value)], "age")
                    }
                  ></Input>
                </View>
              </View>
            </View>
            <View style={requirements.requirementContainer}>
              <Text style={requirements.name}>Experience: </Text>
              <View
                style={[
                  requirements.box,
                  { flexDirection: "row", justifyContent: "space-evenly" },
                ]}
              >
                <Input
                  keyboardType="numeric"
                  variant="underlined"
                  w="40%"
                  h="2/4"
                  style={requirements.value}
                  value={data.experience.toString()}
                  onChangeText={(value) =>
                    handleChange(toInteger(value), "experience")
                  }
                ></Input>
                <Text style={requirements.unit}>Years</Text>
              </View>
            </View>
            <View style={requirements.requirementContainer}>
              <Text style={requirements.name}>Salary: </Text>
              <View style={requirements.box}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                  }}
                >
                  <Input
                    keyboardType="numeric"
                    value={data.salary[0].toString()}
                    w="37%"
                    variant="underlined"
                    style={[requirements.value, { fontSize: 14 }]}
                    onChangeText={(value) =>
                      handleChange([toInteger(value), data.salary[1]], "salary")
                    }
                  ></Input>
                  <Text style={[requirements.value, { marginLeft: 0 }]}>-</Text>
                  <Input
                    keyboardType="numeric"
                    value={data.salary[1].toString()}
                    w="37%"
                    variant="underlined"
                    style={[requirements.value, { fontSize: 14 }]}
                    onChangeText={(value) =>
                      handleChange([data.salary[0], toInteger(value)], "salary")
                    }
                  ></Input>
                  <Text style={requirements.unit}>DA</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={description.container}>
            <Text style={description.title}>About the job</Text>
            <TextArea
              variant="unstyled"
              totalLines={10}
              h="full"
              style={description.content}
              value={data.description}
              onChangeText={(value) => handleChange(value, "description")}
            ></TextArea>
          </View>

          <View style={buttons.container}>
            <Button
              width={100}
              style={{ backgroundColor: "#EEECEC" }}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Text style={[buttons.text, { color: "#d3d3d3" }]}>Cancel</Text>
            </Button>
            <Button
              width={100}
              style={{ backgroundColor: sideColor }}
              onPress={() => create()}
            >
              <Text style={buttons.text}>Create</Text>
            </Button>
          </View>
        </View>
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
    flexGrow: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    bottom: 100,
  },
  modal: {
    height: 180,
    width: 350,
  },
});

const details = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 12,
  },
  short: {
    marginHorizontal: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: "800",
    color: mainColor,
    textTransform: "capitalize",
  },
  positionintro: {
    fontSize: 16,
    fontWeight: "500",
    opacity: 0.7,
    color: mainColor,
    textTransform: "capitalize",
    marginLeft: 20,
    marginTop: 12,
  },
  positionContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: sideColor,
    borderRadius: 10,
    marginLeft: 8,
    padding: 4,
    paddingHorizontal: 12,
    width: 160,
  },
  position: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "800",
    color: mainColor,
    textTransform: "capitalize",
    marginLeft: 10,
  },
  label: {
    opacity: 0.8,
    alignSelf: "center",
    marginRight: 16,
    fontSize: 16,
    fontWeight: "500",
    color: mainColor,
  },
  // tooltip: {
  //   opacity: 0.8,
  //   alignSelf: "center",
  //   padding: 2,
  //   marginLeft: 32,
  //   fontSize: 10,
  //   fontWeight: "500",
  //   color: mainColor,
  // },
  contact: {
    padding: 4,
    marginLeft: 2,
    fontSize: 16,
    fontWeight: "500",
    color: mainColor,
    opacity: 0.5,
    textTransform: "capitalize",
  },
});

const requirements = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginVertical: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: mainColor,
    top: 20,
    marginHorizontal: 24,
    paddingHorizontal: 12,
  },
  requirementContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  box: {
    height: 80,
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: sideColor,
    borderRadius: 25,
  },
  value: {
    padding: 0,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "800",
    color: mainColor,
    textTransform: "uppercase",
    marginLeft: 10,
  },
  name: {
    opacity: 0.8,
    alignSelf: "center",
    fontSize: 16,
    fontWeight: "500",
    color: mainColor,
  },
  unit: {
    color: mainColor,
    fontSize: 16,
    fontWeight: "500",
  },
});

const description = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    paddingHorizontal: 12,
    paddingBottom: 6,
    marginBottom: 6,
    fontSize: 22,
    fontWeight: "600",
    color: mainColor,
    top: 0,
    marginHorizontal: 24,
  },
  content: {
    zIndex: -1,
    elevation: -1,
    fontSize: 12,
    color: mainColor,
    opacity: 0.8,
    padding: 20,
    paddingTop: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

const buttons = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    // margin: 10,
    marginTop: 30,
  },
  text: {
    color: mainColor,
    fontSize: 18,
    fontWeight: "600",
  },
});

export default DashboardOfferScreen;
