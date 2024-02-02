import * as React from "react";
import {
  StyleSheet,
  View,
  Pressable,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from "react-native";
import { Input, Icon, Modal, FormControl, Button, Tooltip } from "native-base";

import { useSelector, useDispatch } from "react-redux";
import { updateContactValue } from "../features/data/userSlice";

import { Entypo } from "@expo/vector-icons";

/*Main */
function Contracts(props) {
  const icons = {
    facebook: { icon: "facebook", color: "#3b5998" },
    instagram: { icon: "instagram", color: "#e4405f" },
    twitter: { icon: "twitter", color: "#00acee" },
    linkedin: { icon: "linkedin", color: "#0072b1" },
    phone: { icon: "phone", color: "#25d366" },
    mail: { icon: "mail", color: "#c71610" },
    address: { icon: "address", color: "#660000" },
  };
  const Contacts = useSelector((state) => state.user.contacts);
  const dispatch = useDispatch();

  const [Modals, setModals] = React.useState({
    apps: [
      { key: 0, state: false },
      { key: 1, state: false },
      { key: 2, state: false },
      { key: 3, state: false },
    ],
    physical: [
      { key: 4, state: false },
      { key: 5, state: false },
      { key: 6, state: false },
    ],
  });

  const [Value, setValue] = React.useState("");

  if (props.show == false) {
    return (
      <View style={{ flexDirection: "column" }}>
        <View style={styles.icons}>
          {Contacts.apps
            .filter((element) => element.value !== "")
            .map((element) => {
              return (
                <Icon
                  key={element.key}
                  as={Entypo}
                  name={icons[element.name].icon}
                  size={6}
                  color={icons[element.name].color}
                />
              );
            })}
        </View>
        <View style={styles.icons}>
          {Contacts.physical
            .filter((element) => element.value !== "")
            .map((element) => {
              return (
                <Icon
                  key={element.key}
                  as={Entypo}
                  name={icons[element.name].icon}
                  size={6}
                  color={icons[element.name].color}
                />
              );
            })}
        </View>
      </View>
    );
  } else {
    return (
      <View style={{ flexDirection: "column" }}>
        <View style={styles.icons}>
          {Contacts.apps.map((element, i) => {
            return (
              <View key={element.key}>
                <Icon
                  as={Entypo}
                  name={icons[element.name].icon}
                  size={6}
                  color={icons[element.name].color}
                  onPress={() => {
                    setValue(Contacts.apps[i].value);
                    setModals(
                      { ...Modals },
                      (Modals.apps[i] = { key: i, state: true })
                    );
                  }}
                />
                <Modal
                  isOpen={Modals.apps[i].state}
                  onClose={() =>
                    setModals(
                      { ...Modals },
                      (Modals.apps[i] = { key: i, state: false })
                    )
                  }
                  avoidKeyboard
                  justifyContent="center"
                  style={styles.modalContainer}
                >
                  <KeyboardAvoidingView
                    behavior="position"
                    enabled
                    style={{ justifyContent: "center" }}
                  >
                    <Modal.Content
                      maxWidth="400px"
                      marginBottom={20}
                      style={styles.modal}
                    >
                      <Modal.CloseButton />
                      <Modal.Body>
                        <FormControl>
                          <FormControl.Label>
                            Enter the link to your {element.name} account:{" "}
                          </FormControl.Label>
                          <Input
                            onChangeText={(text) => setValue(text)}
                            value={Value}
                          />
                        </FormControl>
                      </Modal.Body>
                      <Button
                        style={{ backgroundColor: "#2071eb" }}
                        onPress={() => {
                          dispatch(
                            updateContactValue({
                              index: i,
                              value: Value,
                              category: "apps",
                            })
                          );
                          setModals(
                            { ...Modals },
                            (Modals.apps[i] = { key: i, state: false })
                          );
                          setValue("");
                        }}
                      >
                        Save
                      </Button>
                    </Modal.Content>
                  </KeyboardAvoidingView>
                </Modal>
              </View>
            );
          })}
        </View>
        <View style={styles.icons}>
          {Contacts.physical.map((element, i) => {
            return (
              <View key={element.key}>
                <Icon
                  as={Entypo}
                  name={icons[element.name].icon}
                  size={6}
                  color={icons[element.name].color}
                  onPress={() => {
                    setValue(Contacts.physical[i].value);
                    setModals(
                      { ...Modals },
                      (Modals.physical[i] = { key: i, state: true })
                    );
                  }}
                />
                <Modal
                  isOpen={Modals.physical[i].state}
                  onClose={() =>
                    setModals(
                      { ...Modals },
                      (Modals.physical[i] = { key: i, state: false })
                    )
                  }
                  avoidKeyboard
                  justifyContent="center"
                  style={styles.modalContainer}
                >
                  <KeyboardAvoidingView
                    behavior="position"
                    enabled
                    style={{ justifyContent: "center" }}
                  >
                    <Modal.Content
                      maxWidth="400px"
                      marginBottom={20}
                      style={styles.modal}
                    >
                      <Modal.CloseButton />
                      <Modal.Body>
                        <FormControl>
                          {element.name == "phone" && (
                            <FormControl.Label>
                              Enter your {element.name} number:{" "}
                            </FormControl.Label>
                          )}
                          {element.name != "phone" && (
                            <FormControl.Label>
                              Enter your {element.name}:{" "}
                            </FormControl.Label>
                          )}
                          <Input
                            onChangeText={(text) => setValue(text)}
                            value={Value}
                          />
                        </FormControl>
                      </Modal.Body>
                      <Button
                        style={{ backgroundColor: "#2071eb" }}
                        onPress={() => {
                          dispatch(
                            updateContactValue({
                              index: i,
                              value: Value,
                              category: "physical",
                            })
                          );
                          setModals(
                            { ...Modals },
                            (Modals.physical[i] = { key: i, state: false })
                          );
                          setValue("");
                        }}
                      >
                        Save
                      </Button>
                    </Modal.Content>
                  </KeyboardAvoidingView>
                </Modal>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
}

/*Css Styling*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
  },
  modal: {
    height: 160,
    width: 350,
  },
  icons: {
    marginBottom: 16,
    margin: 8,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});

export default Contracts;
