import * as React from "react";
import {
  StyleSheet,
  Pressable,
  TouchableOpacity,
  FlatList,
  Text,
  View,
  BackHandler,
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  Avatar,
  ScrollView,
  Slider,
  Icon,
  Alert,
  useToast,
  VStack,
  HStack,
  IconButton,
  CloseIcon,
} from "native-base";
import * as Linking from "expo-linking";
import { Entypo } from "@expo/vector-icons";
import useToaster from "../MenuFunctions/useToaster";

/*Main */
function DashboardResumeScreen({ navigation, route }) {
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
  const resume = route.params.user;
  const offer = route.params.offer;
  const type = route.params.type;

  const skillsRender = React.useMemo(() => {
    const length = resume.skills.length;
    if (length == 0) {
      return false;
    } else {
      return true;
    }
  }, []);

  const contactsRender = React.useMemo(() => {
    const apps = resume.contacts.apps;
    const physical = resume.contacts.physical;

    const length =
      apps.filter((element) => element.value.length !== 0).length +
      physical.filter((element) => element.value.length !== 0).length;

    if (length == 0) {
      return false;
    } else {
      return true;
    }
  }, [resume.contacts]);

  const icons = {
    facebook: { icon: "facebook", color: "#3b5998" },
    instagram: { icon: "instagram", color: "#e4405f" },
    twitter: { icon: "twitter", color: "#00acee" },
    linkedin: { icon: "linkedin", color: "#0072b1" },
    phone: { icon: "phone", color: "#25d366" },
    mail: { icon: "mail", color: "#c71610" },
    address: { icon: "address", color: "#660000" },
  };

  const [indicator, setIndicator, setResponse] = useToaster();
  function dataToaster(data) {
    setResponse(data);
    setIndicator(indicator + 1);
  }

  // contact functions
  async function openApps(value) {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(value);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(value);
    } else {
      dataToaster({
        data: {
          title: "Oops",
          description:
            "The URL this resume's owner has provided is not valid and cannot be open",
          status: "warning",
        },
      });
    }
  }

  function openPhysical(name, value) {
    try {
      switch (name) {
        case "phone":
          Linking.openURL(`tel:${value}`);
          break;
        case "mail":
          Linking.openURL(`mailto:${value}`);
          break;
        case "address":
          Linking.openURL(
            `https://www.google.com/maps/search/ ${value
              .replace(/\u002C/g, "%2C")
              .replace(/\s/g, "+")}`
          );
          break;
      }
    } catch (error) {
      dataToaster({
        data: {
          title: "Oops",
          description:
            "Something went wrong... if this problem persists please leave a feedback!",
          status: "error",
        },
      });
    }
  }

  /* toast */
  const toast = useToast();

  const ToastAlert = ({
    id,
    status,
    variant,
    title,
    description,
    isClosable,
    ...rest
  }) => (
    <Alert
      maxWidth="90%"
      alignSelf="center"
      flexDirection="row"
      status={status ? status : "info"}
      variant={variant}
      {...rest}
    >
      <VStack space={1} flexShrink={1} w="100%">
        <HStack
          flexShrink={1}
          alignItems="center"
          justifyContent="space-between"
        >
          <HStack space={2} flexShrink={1} alignItems="center">
            <Alert.Icon />
            <Text
              fontSize="md"
              fontWeight="medium"
              flexShrink={1}
              color={
                variant === "solid"
                  ? "lightText"
                  : variant !== "outline"
                  ? "darkText"
                  : null
              }
            >
              {title}
            </Text>
          </HStack>
          <IconButton
            variant="unstyled"
            icon={<CloseIcon size="3" />}
            _icon={{
              color: variant === "solid" ? "lightText" : "darkText",
            }}
            onPress={() => toast.close(id)}
          />
        </HStack>
        <Text
          px="6"
          color={
            variant === "solid"
              ? "lightText"
              : variant !== "outline"
              ? "darkText"
              : null
          }
        >
          {description}
        </Text>
      </VStack>
    </Alert>
  );

  const ToastDetails = {
    approveApplication: {
      success: {
        description:
          "The application has been approved and is now removed from the pending appliacant's list",
      },
      error: {
        description:
          "Something went wrong, the application hasn't been approved yet ",
      },
    },
    removeApplication: {
      success: {
        description: "The application has been removed successfully",
      },
      error: {
        description:
          "Something went wrong, the application hasn't been removed yet",
      },
    },
    disapproveApplication: {
      success: {
        description:
          "The application has been disapproved and is now removed from the approved appliacants list, it has been now moved to the pending applicants list",
      },
      error: {
        description:
          "Something went wrong, the application hasn't been disapproved yet",
      },
    },
  };

  /*toast */

  function handleResponse(response, list) {
    if (response.status == 200) {
      toast.show({
        render: ({ id }) => {
          return (
            <ToastAlert
              id={id}
              status={"success"}
              title={response.data}
              variant={"left-accent"}
              isClosable={true}
              {...ToastDetails[list].success}
            />
          );
        },
      });
    } else {
      toast.show({
        render: ({ id }) => {
          return (
            <ToastAlert
              id={id}
              status={"error"}
              title={response.data}
              isClosable={true}
              {...ToastDetails[list].error}
            />
          );
        },
      });
    }
  }

  /*button functions*/
  function approveApplication() {
    axios({
      method: "post",
      url: "http://192.168.100.166:3000/offerapproveapplication/",
      params: {
        user_id: resume._id,
        offer_id: offer._id,
      },
      responseType: "json",
    })
      .then((response) => handleResponse(response, "approveApplication"))
      .catch((error) => {
        console.error(error);
      });
    route.params.setRefresh(route.params.refresh + 1);
    navigation.goBack();
  }

  function removeApplication() {
    axios({
      method: "delete",
      url: "http://192.168.100.166:3000/offerdeleteapplication/",
      params: {
        user_id: resume._id,
        offer_id: offer._id,
      },
      responseType: "json",
    })
      .then((response) => handleResponse(response, "removeApplication"))
      .catch((error) => {
        console.error(error);
      });
    route.params.setRefresh(route.params.refresh + 1);
    navigation.goBack();
  }

  function disapproveApplication() {
    axios({
      method: "delete",
      url: "http://192.168.100.166:3000/offerdisapproveapplication/",
      params: {
        user_id: resume._id,
        offer_id: offer._id,
      },
      responseType: "json",
    })
      .then((response) => handleResponse(response, "disapproveApplication"))
      .catch((error) => {
        console.error(error);
      });
    route.params.setRefresh(route.params.refresh + 1);
    navigation.goBack();
  }
  /*button functions*/

  return (
    <View style={styles.container}>
      <View style={contentstyles}>
        <View style={contentstyles.id}>
          <Avatar
            bg="green.200"
            size="120"
            source={{
              uri: resume.pfp,
            }}
          ></Avatar>
          <View style={{ width: 170, justifyContent: "center" }}>
            <Text style={contentstyles.header}>{resume.name}</Text>
            <Text style={[contentstyles.header, { fontSize: 15 }]}>
              {resume.job}
            </Text>
          </View>
        </View>
        <KeyboardAwareScrollView>
          {/* style={{ height: flatlistHeight }} */}
          <ScrollView style={{ height: "80%" }}>
            <View>
              <View style={contentstyles.info}>
                <View>
                  {/* bio box*/}
                  {resume.bio.length !== 0 && (
                    <View style={contentstyles.boxes}>
                      <Text style={contentstyles.titles}>About </Text>
                      <Text style={[contentstyles.text, { fontSize: 11 }]}>
                        {resume.bio}
                      </Text>
                    </View>
                  )}

                  {/* work experience box*/}
                  {resume.work.length !== 0 && (
                    <View style={contentstyles.boxes}>
                      <Text style={contentstyles.titles}>Work Experience</Text>
                      <Text style={[contentstyles.text, { fontSize: 11 }]}>
                        {resume.work}
                      </Text>
                    </View>
                  )}

                  {/* education box*/}
                  {resume.education.length !== 0 && (
                    <View style={contentstyles.boxes}>
                      <Text style={contentstyles.titles}>Education</Text>
                      <Text style={[contentstyles.text, { fontSize: 11 }]}>
                        {resume.education}
                      </Text>
                    </View>
                  )}

                  {/* skills box*/}
                  {skillsRender && (
                    <View style={contentstyles.boxes}>
                      <Text style={contentstyles.titles}>Skills</Text>
                      <View>
                        <View>
                          {resume.skills.map((element) => {
                            return (
                              <View key={element.key}>
                                <Text>{element.title}</Text>
                                <View style={styles.element}>
                                  <Slider
                                    w="3/4"
                                    // maxW="300"
                                    colorScheme="green"
                                    defaultValue={element.value}
                                    minValue={0}
                                    maxValue={100}
                                    step={10}
                                  >
                                    <Slider.Track>
                                      <Slider.FilledTrack />
                                    </Slider.Track>
                                  </Slider>
                                </View>
                                <View style={contentstyles.preventer}></View>
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    </View>
                  )}

                  {/* contacts box*/}
                  {contactsRender && (
                    <View style={contentstyles.boxes}>
                      <Text style={contentstyles.titles}>Contacts</Text>
                      <View>
                        <View style={{ flexDirection: "column" }}>
                          <View style={contentstyles.contacts}>
                            {resume.contacts.apps
                              .filter((element) => element.value !== "")
                              .map((element) => {
                                return (
                                  <TouchableOpacity
                                    key={element.key}
                                    style={contentstyles.contactContainer}
                                    onPress={() => {
                                      openApps(element.value);
                                    }}
                                  >
                                    <Icon
                                      as={Entypo}
                                      name={icons[element.name].icon}
                                      size={6}
                                      color={icons[element.name].color}
                                    />
                                    <Text
                                      style={[
                                        contentstyles.contactLink,
                                        { color: icons[element.name].color },
                                      ]}
                                    >
                                      {element.value}
                                    </Text>
                                  </TouchableOpacity>
                                );
                              })}
                          </View>
                          <View style={contentstyles.contacts}>
                            {resume.contacts.physical
                              .filter((element) => element.value !== "")
                              .map((element) => {
                                return (
                                  <TouchableOpacity
                                    key={element.key}
                                    style={contentstyles.contactContainer}
                                    onPress={() => {
                                      openPhysical(element.name, element.value);
                                    }}
                                  >
                                    <Icon
                                      as={Entypo}
                                      name={icons[element.name].icon}
                                      size={6}
                                      color={icons[element.name].color}
                                    />
                                    <Text
                                      style={[
                                        contentstyles.contactLink,
                                        { color: icons[element.name].color },
                                      ]}
                                    >
                                      {element.value}
                                    </Text>
                                  </TouchableOpacity>
                                );
                              })}
                          </View>
                        </View>
                      </View>
                    </View>
                  )}
                  <View style={contentstyles.buttoncontainer}>
                    {type == "pending" && (
                      <>
                        <View style={contentstyles.button.remove}>
                          <Pressable
                            onPress={() => {
                              removeApplication();
                            }}
                          >
                            <Text style={contentstyles.buttontext.remove}>
                              Remove
                            </Text>
                          </Pressable>
                        </View>
                        <View style={contentstyles.button.approve}>
                          <Pressable
                            onPress={() => {
                              approveApplication();
                            }}
                          >
                            <Text style={contentstyles.buttontext.approve}>
                              Approve
                            </Text>
                          </Pressable>
                        </View>
                      </>
                    )}
                    {type == "approved" && (
                      <>
                        <View style={contentstyles.button.remove}>
                          <Pressable
                            onPress={() => {
                              disapproveApplication();
                            }}
                          >
                            <Text style={contentstyles.buttontext.remove}>
                              Disapprove
                            </Text>
                          </Pressable>
                        </View>
                      </>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
}

/*Css Styling*/

const mainColor = "#81B387";
const sideColor = "#d1ffd7";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

const contentstyles = StyleSheet.create({
  zIndex: -1,
  elevation: -1,
  marginTop: 20,
  marginBottom: 150,
  id: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 310,
    height: 120,
    marginTop: 20,
    paddingHorizontal: 5,
    backgroundColor: sideColor,
    alignSelf: "center",
  },
  info: {
    zIndex: -1,
    width: 310,
    paddingBottom: 24,
    borderWidth: 1,
    borderColor: sideColor,
    alignSelf: "center",
  },
  boxes: {
    margin: 16,
    marginBottom: 0,
  },
  titles: {
    color: mainColor,
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 14,
  },
  buttoncontainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 30,
  },
  button: {
    remove: {
      backgroundColor: "#ff0000",
      width: 120,
      height: 40,
      borderRadius: 40,
      padding: 10,
    },
    approve: {
      backgroundColor: "#00ff00",
      width: 120,
      height: 40,
      borderRadius: 40,
      padding: 10,
    },
  },
  buttontext: {
    remove: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#fff",
      alignSelf: "center",
    },
    approve: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#fff",
      alignSelf: "center",
    },
  },
  header: {
    padding: 5,
    color: mainColor,
    fontWeight: "bold",
    alignSelf: "center",
    textAlign: "center",
    fontSize: 20,
  },
  text: {
    padding: 5,
    color: "#000",
    fontWeight: "400",
  },
  contacts: {
    // flexDirection: "column ",
    // justifyContent: "space-evenly",
  },
  contactContainer: {
    flexDirection: "row",
    margin: 8,
    alignItems: "center",
  },
  contactLink: {
    fontSize: 12,
    marginLeft: 8,
  },
  preventer: {
    width: "100%",
    height: 30,
    elevation: 99,
    zIndex: 99,
    position: "absolute",
    marginTop: 15,
  },
});

export default DashboardResumeScreen;
