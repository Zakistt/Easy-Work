import React from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Modal, FormControl, Button, TextArea } from "native-base";

function FeedbackComponent(props) {
  const feedback = props.feedback;

  const [feedbackmessage, setFeedbackmessage] = React.useState("");
  function sendFeedback() {
    props.setFeedback(false);
    if (feedbackmessage !== "") {
      // console.log(feedbackmessage)
      // send to the db
    }
    setFeedbackmessage("");
  }
  return (
    <Modal
      isOpen={feedback}
      onClose={() => props.setFeedback(false)}
      avoidKeyboard
      justifyContent="center"
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior="position"
        enabled
        style={{ justifyContent: "center" }}
      >
        <Modal.Content style={styles.modal} maxWidth="400px" marginBottom={20}>
          <Modal.CloseButton />
          <Modal.Header>Feedback</Modal.Header>
          <Modal.Body>
            <FormControl>
              <TextArea
                onChangeText={(text) => setFeedbackmessage(text)}
                value={feedbackmessage}
                editable
                maxLength={100}
              />
            </FormControl>
          </Modal.Body>
          <Button
            style={{ backgroundColor: "#2071eb" }}
            onPress={() => sendFeedback()}
          >
            Send
          </Button>
        </Modal.Content>
      </KeyboardAvoidingView>
    </Modal>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modal: {
    height: 220,
    width: 300,
  },
});
export default FeedbackComponent;
