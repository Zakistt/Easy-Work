import {
  StyleSheet,
  Pressable,
  Dimensions,
  FlatList,
  Text,
  View,
  TextInput,
  DeviceEventEmitter,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import * as React from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { updateField, updateUser, updatePfp } from "../features/data/userSlice";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { Avatar, Icon, Button, AlertDialog } from "native-base";
import { Entypo } from "@expo/vector-icons";

import * as ImagePicker from "expo-image-picker";

import Menu from "../components/Menu";

import Modifiable from "../components/Modifiable";
import Sliders from "../components/Sliders";
import Contacts from "../components/Contacts";
import useToaster from "../MenuFunctions/useToaster";

import DefaultImage from "../assets/User-Profile.png";

import axios from "axios";

/*Main */
function ResumeScreen({ navigation }) {
  const resume = useSelector((state) => state.user);
  const DEFAULT_IMAGE = Image.resolveAssetSource(DefaultImage).uri;
  const dispatch = useDispatch();

  const [key, setKey] = React.useState([0, 1, 2, 3, 4]);
  const [sliderKey, setSliderKey] = React.useState(0);
  const [saveBoolean, setSaveBoolean] = React.useState(0);
  const isFocused = useIsFocused();

  const [updateIsOpen, setUpdateIsOpen] = React.useState(false);
  const updateOnClose = () => {
    setUpdateIsOpen(false);
    setSaveBoolean(0);
    axios({
      method: "get",
      url: "http://192.168.100.166:3000/user/",
      params: {
        email: resume.email,
      },
      responseType: "json",
    })
      .then(function (response) {
        dispatch(updateUser({ value: response.data }));
      })
      .catch((error) => {
        console.error(error);
      });
    setKey([key[0] + 1, key[1] + 1, key[2] + 1, key[3] + 1, key[4] + 1]);
    setSliderKey(sliderKey + 1);
    setShow(!show);
  };
  const updateCancelRef = React.useRef(null);

  React.useEffect(() => {
    setSaveBoolean(0);
  }, [isFocused, resume]);

  const [indicator, setIndicator, setResponse] = useToaster();
  function dataToaster(data) {
    setResponse(data);
    setIndicator(indicator + 1);
  }
  useFocusEffect(
    React.useCallback(() => {
      if (saveBoolean !== 0) {
        if (resume.name == "") {
          dispatch(updateField({ label: "name", data: "User" }));
          setSaveBoolean(saveBoolean + 1);
        } else if (resume.pfp == "") {
          dispatch(updatePfp({ value: DEFAULT_IMAGE }));
          setSaveBoolean(saveBoolean + 1);
        } else {
          axios({
            method: "put",
            url: "http://192.168.100.166:3000/user/",
            params: {
              email: resume.email,
            },
            data: resume,
            responseType: "json",
          })
            .then((response) => dataToaster(response))
            .catch((error) => {
              console.error(error);
            });
        }
      }
    }, [saveBoolean])
  );
  const [show, setShow] = React.useState(false);

  function modify() {
    setShow(!show);
    if (show) {
      setUpdateIsOpen(false);
      DeviceEventEmitter.emit("updateStore");
      setSaveBoolean(saveBoolean + 1);
    }
  }

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

  const skillsRender = React.useMemo(() => {
    const length = resume.skills.length;
    if (length == 0) {
      return false;
    } else {
      return true;
    }
  }, [resume.skills, sliderKey]);

  async function pickImage() {
    if (show) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        base64: true,
      });
      if (!result.canceled) {
        dispatch(updatePfp({ value: result.assets[0].uri }));
      }
    } else {
      return;
    }
  }

  return (
    <View style={styles.container}>
      <View style={headerstyles}>
        <Menu style={headerstyles.menu} navigation={navigation} />
      </View>

      <View style={contentstyles}>
        <Text style={contentstyles.greet}>Your Resume</Text>
        <Text style={contentstyles.instruction}>
          Fill in your info to create a resume
        </Text>

        <View style={contentstyles.id}>
          <Pressable
            onPress={() => {
              pickImage();
            }}
          >
            <Avatar
              bg="blueGray.200"
              size="120"
              source={{
                uri: resume.pfp,
              }}
            ></Avatar>
          </Pressable>
          <View style={{ width: 170, justifyContent: "center" }}>
            <Modifiable
              key={key[0]}
              label="name"
              size={20}
              text={resume.name}
              type="header"
              maxLength={30}
              show={show}
            />
            <Modifiable
              key={key[1]}
              label="job"
              size={15}
              text={resume.job}
              type="header"
              maxLength={40}
              show={show}
            />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            style={contentstyles.info}
            automaticallyAdjustKeyboardInsets={true}
          >
            <View style={contentstyles.infoInside}>
              {/* bio box*/}
              {(show || resume.bio.length !== 0) && (
                <View style={contentstyles.boxes}>
                  <Text style={contentstyles.titles}>About </Text>
                  <Modifiable
                    key={key[2]}
                    label="bio"
                    size={11}
                    text={resume.bio}
                    type="text"
                    maxLength={200}
                    show={show}
                  />
                </View>
              )}

              {/* work experience box*/}
              {(show || resume.work.length !== 0) && (
                <View style={contentstyles.boxes}>
                  <Text style={contentstyles.titles}>Work Experience</Text>
                  <Modifiable
                    key={key[3]}
                    label="work"
                    size={11}
                    text={resume.work}
                    type="text"
                    maxLength={400}
                    show={show}
                  />
                </View>
              )}

              {/* education box*/}
              {(show || resume.education.length !== 0) && (
                <View style={contentstyles.boxes}>
                  <Text style={contentstyles.titles}>Education</Text>
                  <Modifiable
                    key={key[4]}
                    label="education"
                    size={11}
                    text={resume.education}
                    type="text"
                    maxLength={400}
                    show={show}
                  />
                </View>
              )}

              {/* skills box*/}
              {(show || skillsRender) && (
                <View style={contentstyles.boxes}>
                  <Text style={contentstyles.titles}>Skills</Text>
                  <View>
                    <Sliders key={sliderKey} show={show} data={resume.skills} />
                  </View>
                </View>
              )}

              {/* contacts box*/}
              {(show || contactsRender) && (
                <View style={contentstyles.boxes}>
                  <Text style={contentstyles.titles}>Contacts</Text>
                  <View>
                    <Contacts show={show} contacts={resume.contacts} />
                  </View>
                </View>
              )}
            </View>
            <View style={contentstyles.button}>
              <TouchableOpacity
                onPress={function () {
                  if (show) {
                    setUpdateIsOpen(true);
                  } else {
                    modify();
                  }
                }}
              >
                <Text
                  style={[
                    contentstyles.modify,
                    { display: show ? "none" : "flex" },
                  ]}
                >
                  Set up resume
                </Text>
                <Text
                  style={[
                    contentstyles.modify,
                    { display: show ? "flex" : "none" },
                  ]}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
            <AlertDialog
              leastDestructiveRef={updateCancelRef}
              isOpen={updateIsOpen}
              onClose={updateOnClose}
            >
              <AlertDialog.Content>
                <AlertDialog.CloseButton />
                <AlertDialog.Header>
                  <View
                    style={{
                      flexDirection: "row",
                      // justifyContent: "space-between",
                      alignItems: "center",
                      marginLeft: 16,
                      marginTop: 8,
                    }}
                  >
                    <Icon
                      as={Entypo}
                      name="warning"
                      size={8}
                      color={"warning.300"}
                    />
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: 600,
                        marginLeft: 8,
                      }}
                    >
                      Warning
                    </Text>
                  </View>
                </AlertDialog.Header>
                <AlertDialog.Body>
                  Updating your resume will permenantly remove all approval of
                  the old resume and all contacted agencies will have to approve
                  the new version as well, do you want to update anyway?
                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <Button.Group space={2}>
                    <Button
                      variant="unstyled"
                      colorScheme="coolGray"
                      onPress={updateOnClose}
                      ref={updateCancelRef}
                    >
                      Cancel
                    </Button>
                    <Button
                      style={{ backgroundColor: "#2071eb" }}
                      onPress={() => modify()}
                    >
                      Update
                    </Button>
                  </Button.Group>
                </AlertDialog.Footer>
              </AlertDialog.Content>
            </AlertDialog>
          </KeyboardAwareScrollView>
        </View>
      </View>

      {/* <Footer navi={navi} /> */}
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
  zIndex: -1,
  elevation: -1,
  flex: 1,
  greet: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2071eb",
    marginTop: 16,
    alignSelf: "center",
  },
  instruction: {
    fontSize: 16,
    fontWeight: "400",
    color: "#2071eb",
    opacity: 0.6,
    marginTop: 8,
    alignSelf: "center",
  },
  id: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 310,
    height: 120,
    marginTop: 20,
    paddingHorizontal: 5,
    backgroundColor: "#2071eb",
    alignSelf: "center",
  },
  info: {
    width: 310,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#2071eb",
    alignSelf: "center",
    // overflow: "hidden",
  },
  infoInside: {
    paddingBottom: 64,
  },
  boxes: {
    margin: 16,
    marginBottom: 16,
  },
  titles: {
    color: "#2071eb",
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 14,
    marginBottom: 6,
  },
  button: {
    position: "relative",
    justifyContent: "center",
    alignSelf: "center",
    zIndex: 2,
    bottom: 40,
    backgroundColor: "#2071eb",
    // width: 120,
    height: 40,
    borderRadius: 40,
    padding: 10,
    paddingHorizontal: 20,
  },
  modify: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    alignSelf: "center",
  },
});

export default ResumeScreen;
