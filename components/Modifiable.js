import {
  StyleSheet,
  Text,
  View,
  TextInput,
  DeviceEventEmitter,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import * as React from "react";
import { Input, TextArea } from "native-base";
import axios from "axios";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { updateField } from "../features/data/userSlice";

/*Main */
function Modifiable(props) {
  const resume = useSelector((state) => state.user, shallowEqual);

  const [field, setField] = React.useState();
  const [style, setStyle] = React.useState();
  React.useEffect(() => {
    setField(props.text);
  }, [props.text, resume]);

  const dispatch = useDispatch();

  DeviceEventEmitter.addListener("updateStore", () => {
    dispatch(updateField({ data: field, label: props.label }));
  });

  React.useEffect(() => {
    if (props.type == "header") {
      setStyle({
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textAlign: "center",
        fontSize: parseInt(props.size),
      });
    } else {
      setStyle({
        color: "#000",
        fontWeight: "400",
        fontSize: parseInt(props.size),
      });
    }
  }, []);

  function handleChange(text) {
    setField(text);
    // dispatch(updateField({ label: props.label, data: field, }))
  }

  return (
    <View style={{ marginVertical: 1 }}>
      {!props.show && (
        <Text style={[contentstyles.content, style]}>{field}</Text>
      )}
      {props.show && props.type == "text" && (
        <TextArea
          onChangeText={handleChange}
          value={field}
          style={[contentstyles.input, style]}
          editable
          maxLength={props.maxLength}
        />
      )}
      {props.show && props.type == "header" && (
        <Input
          variant="underlined"
          onChangeText={handleChange}
          value={field}
          style={[contentstyles.input, style]}
          editable
          maxLength={props.maxLength}
        />
      )}
    </View>
  );
}

/*Css Styling*/
const contentstyles = StyleSheet.create({
  content: {
    padding: 5,
  },
  input: {
    // backgroundColor: "#7EACF1",
    padding: 5,
  },
});

export default Modifiable;
