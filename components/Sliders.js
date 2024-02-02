import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  DeviceEventEmitter,
} from "react-native";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { updateSkills } from "../features/data/userSlice";

import { Slider, Input, Icon } from "native-base";

import { MaterialIcons } from "@expo/vector-icons";

/*Main */
function Sliders(props) {
  const dispatch = useDispatch();

  const [Elements, setElements] = React.useState([]);
  const [Add, setAdd] = React.useState(Elements.length);

  React.useEffect(() => {
    setElements(props.data);
  }, [props.data]);

  DeviceEventEmitter.addListener("updateStore", () => {
    let skills = [...Elements].filter((value) => value.title != "");
    let sortedSkills = [];
    for (let i = 0; i < skills.length; i++) {
      let input = { ...skills[i] };
      input.key = i;
      sortedSkills[i] = input;
    }
    setElements(sortedSkills);
    setAdd(Elements.length);
    dispatch(updateSkills({ data: sortedSkills }));
  });

  function updateKey() {
    let inputs = [...Elements];
    for (let i = 0; i < Elements.length; i++) {
      let input = { ...Elements[i] };
      input.key = i;
      inputs[i] = input;
    }

    setElements(inputs);
  }

  function createSkill() {
    updateKey();
    setElements([...Elements, { key: Elements.length, title: "", value: 50 }]);
    setAdd(Add + 1);
  }

  function updateInput(text, i) {
    // 1. Make a shallow copy of the items
    let inputs = [...Elements];
    // 2. Make a shallow copy of the item you want to mutate
    let input = { ...Elements[i] };
    // 3. Replace the property you're intested in
    input.title = text;
    //    but that's why we made a copy first
    inputs[i] = input;
    // 5. Set the state to our new copy
    // dispatch(updateSkills({ data: inputs }));
    setElements(inputs);
  }

  function updateValue(v, i) {
    let items = [...Elements];
    let item = {
      ...items[i],
      value: v,
    };
    items[i] = item;
    // dispatch(updateSkills({ data: items }));
    return setElements(items);
  }

  function cancelSkill(element) {
    const skills = Elements.filter((value) => value !== element);
    updateKey();
    setAdd(Add - 1);
    // dispatch(updateSkills({ data: skills }));
    setElements(skills);
  }

  if (props.show == false) {
    return (
      <View>
        {Elements.map((element) => {
          return (
            <View key={element.key}>
              <Text>{element.title}</Text>
              <View style={styles.element}>
                <Slider
                  w="3/4"
                  maxW="300"
                  colorScheme="blue"
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
              <View style={styles.preventer}></View>
            </View>
          );
        })}
      </View>
    );
  } else {
    return (
      <View>
        <View style={styles.container}>
          {Elements.map((element, i) => {
            return (
              <View key={element.key}>
                <View>
                  <Input
                    w={"3/4"}
                    variant="underlined"
                    placeholder="Enter Skill name"
                    value={element.title}
                    onChangeText={(text) => updateInput(text, i)}
                  />
                </View>
                <View style={styles.element}>
                  <Slider
                    w="3/4"
                    maxW="300"
                    colorScheme="blue"
                    onChangeEnd={(v) => updateValue(v, i)}
                    defaultValue={element.value}
                    minValue={0}
                    maxValue={100}
                    step={10}
                  >
                    <Slider.Track>
                      <Slider.FilledTrack />
                    </Slider.Track>
                    <Slider.Thumb />
                  </Slider>
                  <Pressable
                    style={[
                      styles.cancelButton,
                      { display: props.show ? "flex" : "none" },
                    ]}
                    onPress={() => cancelSkill(element)}
                  >
                    <MaterialIcons name="cancel" size={24} color="red" />
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
        <View>
          {Add < 6 && (
            <Pressable
              style={[
                styles.addButton,
                { display: props.show ? "flex" : "none" },
              ]}
              onPress={() => createSkill()}
            >
              <MaterialIcons name="add-circle" size={28} color="#2071eb" />
            </Pressable>
          )}
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
  element: {
    marginBottom: 10,
    flexDirection: "row",
  },
  preventer: {
    width: "100%",
    height: 30,
    elevation: 99,
    zIndex: 99,
    position: "absolute",
    marginTop: 15,
  },

  addButton: {
    position: "relative",
    alignSelf: "flex-end",
    top: 5,
    marginBottom: 5,
  },
  cancelButton: {
    paddingLeft: 40,
  },
});

export default Sliders;
