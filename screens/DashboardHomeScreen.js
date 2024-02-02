import {
  StyleSheet,
  Pressable,
  Dimensions,
  Image,
  ScrollView,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  BackHandler,
} from "react-native";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as React from "react";

import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { updateName, updateBackground } from "../features/data/employerSlice";

import { Icon, Avatar, Popover, Input } from "native-base";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import useToaster from "../MenuFunctions/useToaster";
import DefaultImage from "../assets/Agency-Profile.png";

function DashboardHomeScreen(navigation) {
  const [data, setData] = React.useState([]);
  const dispatch = useDispatch();
  const company = useSelector((state) => state.employer);
  const DEFAULT_IMAGE = Image.resolveAssetSource(DefaultImage).uri;
  const [saveIndicator, setSaveIndicator] = React.useState(0);
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
  const isFocused = useIsFocused();

  React.useEffect(() => {
    axios({
      method: "post",
      url: "http://192.168.100.166:3000/offersagency/",
      params: {
        id: company._id,
      },
      responseType: "json",
    })
      .then((response) => setData(response.data))
      .catch((error) => {
        console.error(error);
      });
    setSaveIndicator(0);
  }, [isFocused, company]);

  const [indicator, setIndicator, setResponse] = useToaster();
  function dataToaster(data) {
    setResponse(data);
    setIndicator(indicator + 1);
  }
  useFocusEffect(
    React.useCallback(() => {
      if (saveIndicator !== 0) {
        if (company.name == "") {
          dispatch(updateName({ value: "Agency" }));
          setSaveIndicator(saveIndicator + 1);
        } else if (company.background == "") {
          dispatch(updateBackground({ value: DEFAULT_IMAGE }));
          setSaveIndicator(saveIndicator + 1);
        } else {
          axios({
            method: "put",
            url: "http://192.168.100.166:3000/agency/",
            params: {
              email: company.email,
            },
            data: company,
            responseType: "json",
          })
            .then((response) => dataToaster(response))
            .catch((error) => {
              console.log(error);
            });
        }
      }
    }, [saveIndicator])
  );

  /* modal */
  const [isOpen, setIsOpen] = React.useState(Array(data.length).fill(false));
  function updateOpen(index, value) {
    const updatedList = [...isOpen];
    updatedList[index] = value;
    return setIsOpen(updatedList);
  }
  /* modal */
  //
  //
  //
  //
  //
  /* editing */
  const [isEditing, setIsEditing] = React.useState(false);
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function handleChange(value) {
    dispatch(updateName({ value: value }));
  }

  async function pickImage() {
    if (isEditing) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        base64: true,
      });
      if (!result.canceled) {
        dispatch(updateBackground({ value: result.assets[0].uri }));
      }
    } else {
      return;
    }
  }
  /* editing */
  //
  //
  //
  //
  //
  /* saving */
  function save() {
    setIsEditing(false);
    setSaveIndicator(saveIndicator + 1);
  }
  /* saving */
  const renderItem = ({ item, index }) => (
    <Popover
      placement={"top right"}
      trigger={(triggerProps) => {
        return (
          <TouchableOpacity
            style={contentstyles.elementContainer}
            {...triggerProps}
            onPress={() => updateOpen(index, true)}
          >
            <Image
              style={contentstyles.elementImage}
              source={{ uri: item.pfp }}
            ></Image>
            <View style={contentstyles.elementInfo}>
              <Text style={contentstyles.elementName}>{item.position}</Text>
              <Text style={contentstyles.elementDate}>
                {new Date(item.time).toDateString()} - last edited
              </Text>
            </View>
          </TouchableOpacity>
        );
      }}
      isOpen={isOpen[index]}
      onClose={() => updateOpen(index, !isOpen[index])}
    >
      <Popover.Content w="56">
        <Popover.Arrow />
        <Popover.Body justifyContent="center">
          <TouchableOpacity
            onPress={() => {
              updateOpen(index, false);
              navigation.navigation.navigate("DashboardOffer", {
                offer: item,
              });
            }}
            style={buttonPopover.container}
          >
            <Text style={buttonPopover.text}>Go to offer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              updateOpen(index, false);
              navigation.navigation.navigate("DashboardApplicants", {
                offer: item,
              });
            }}
            style={buttonPopover.container}
          >
            <Text style={buttonPopover.text}>See applicants</Text>
          </TouchableOpacity>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
  return (
    <View style={styles.container}>
      {!isEditing && (
        <>
          <View>
            <Image
              style={styles.image}
              source={{
                uri: company.background,
              }}
            ></Image>
          </View>
          <>
            <Text style={styles.name}>{company.name}</Text>
            <View style={styles.edit}>
              <Icon
                as={Feather}
                name="edit"
                size={6}
                color={"#888"}
                onPress={() => setIsEditing(true)}
              />
            </View>
          </>
        </>
      )}
      {isEditing && (
        <>
          <TouchableOpacity onPress={() => pickImage()}>
            <Image
              style={styles.image}
              source={{
                uri: company.background,
              }}
            ></Image>
          </TouchableOpacity>
          <>
            <View style={styles.name}>
              <Input
                style={styles.nameedit}
                value={company.name}
                w="120%"
                variant="underlined"
                onChangeText={(value) => handleChange(capitalize(value))}
              ></Input>
            </View>
            <View style={styles.edit}>
              <Icon
                as={Feather}
                name="save"
                size={6}
                color={"#888"}
                onPress={() => save()}
              />
            </View>
          </>
        </>
      )}
      {/* <Shape
        formula='polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)'
        id="image"
        width="100%"
        height="280px"
      ></Shape> */}
      <View style={contentstyles}>
        <View style={contentstyles.titleContainer}>
          <Text style={contentstyles.title}>Job Offers</Text>
        </View>
        {data.length != 0 && (
          <FlatList
            data={data.slice(0).reverse()}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            style={contentstyles.elementsContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
        {data.length == 0 && (
          <View>
            <Text style={contentstyles.empty}>
              You have no job offers yet, create your first down below 😃
            </Text>
          </View>
        )}
      </View>
      <Pressable
        onPress={() => navigation.navigation.navigate("DashboardNewOffer")}
        style={button.container}
      >
        <Text style={button.text}>Create new offer</Text>
      </Pressable>
    </View>
  );
}

// 23EB15
//d1ffd7
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
    height: 280,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    transform: [
      { perspective: 300 },
      { translateX: -Dimensions.get("window").width * 0.1 },
      { translateY: -Dimensions.get("window").height * 0.1 },
      { rotateY: "-30deg" },
      { scaleX: 2.1 },
    ],
  },
  name: {
    fontSize: 24,
    color: mainColor,
    fontWeight: "500",
    marginLeft: 16,
    bottom: 60,
    width: "50%",
    flexWrap: "wrap",
  },
  nameedit: {
    fontSize: 24,
    color: mainColor,
    fontWeight: "500",
  },
  edit: {
    bottom: 50,
    alignSelf: "flex-end",
    marginRight: 10,
  },
});

const contentstyles = StyleSheet.create({
  flex: 1,
  zIndex: -1,
  elevation: -1,
  marginTop: 5,
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
    alignItems: "center",
    borderColor: sideColor,
    borderRadius: 20,
    borderStartWidth: 5,
    borderEndWidth: 5,
  },
  elementInfo: {
    width: "84%",
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

const button = StyleSheet.create({
  container: {
    height: 45,
    width: "80%",
    backgroundColor: sideColor,
    margin: 30,
    marginTop: 5,
    borderRadius: 20,
    justifyContent: "center",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 10,
  },
  text: {
    alignSelf: "center",
    color: mainColor,
    fontSize: 20,
    fontWeight: "600",
  },
});

const buttonPopover = StyleSheet.create({
  container: {
    height: 30,
    width: "100%",
    // backgroundColor: sideColor,
    borderBottomColor: "#eee",
    borderBottomWidth: 2,
    margin: 2,
    justifyContent: "center",
  },
  text: {
    alignSelf: "center",
    color: mainColor,
    fontSize: 18,
    fontWeight: "500",
  },
});

export default DashboardHomeScreen;
