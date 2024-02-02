import { StyleSheet, View, Share } from "react-native";
import * as React from "react";
import {
  NativeBaseProvider,
  useDisclose,
  Icon,
  Stagger,
  IconButton,
} from "native-base";

import useUpdate from "../MenuFunctions/useUpdate";
import useShare from "../MenuFunctions/Share";
import FeedbackComponent from "../MenuFunctions/FeedbackComponent";

import {
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

function MenuStagger({ navigation }) {
  const { isOpen, onToggle } = useDisclose();
  // Feedback
  const [feedback, setFeedback] = React.useState(false);
  function handleFeedback() {
    onToggle();
    setFeedback(true);
  }

  // Share
  function handleShare() {
    useShare();
    onToggle();
  }

  // Update
  const [updateIndicator, setUpdateIndicator] = useUpdate(true);
  function update() {
    setUpdateIndicator(updateIndicator + 1);
    onToggle();
  }

  // Settings
  function settings() {
    navigation.navigate("Settings");
    onToggle();
  }

  return (
    <View style={[styles.container, { height: isOpen ? 280 : 40 }]}>
      <View style={styles.button}>
        <IconButton
          mb="4"
          borderRadius="full"
          size="10"
          onPress={onToggle}
          bg="#2071eb"
          icon={<Icon as={Entypo} size="8" name="menu" color="#fff" />}
        />
      </View>
      <View style={styles.buttons}>
        <Stagger
          visible={isOpen}
          initial={{
            opacity: 0,
            scale: 0,
            translateY: 34,
          }}
          animate={{
            translateY: 0,
            scale: 1,
            opacity: 10,
            transition: {
              type: "spring",
              mass: 0.8,
              velocity: 10,
              duration: 100,
              stagger: {
                offset: 30,
                reverse: false,
              },
            },
          }}
          exit={{
            translateY: 34,
            scale: 0.5,
            opacity: 0,
            transition: {
              duration: 100,
              velocity: 50,
              stagger: {
                offset: 30,
                // reverse: true
              },
            },
          }}
        >
          <IconButton
            onPress={() => handleFeedback()}
            mb="4"
            bg="indigo.500"
            size="10"
            colorScheme="indigo"
            borderRadius="full"
            icon={
              <Icon
                as={MaterialIcons}
                size="6"
                name="feedback"
                _dark={{
                  color: "warmGray.50",
                }}
                color="warmGray.50"
              />
            }
          />

          <FeedbackComponent feedback={feedback} setFeedback={setFeedback} />

          <IconButton
            onPress={() => handleShare()}
            mb="4"
            bg="yellow.400"
            size="10"
            colorScheme="yellow"
            borderRadius="full"
            icon={
              <Icon
                as={MaterialCommunityIcons}
                _dark={{
                  color: "warmGray.50",
                }}
                size="6"
                name="share-outline"
                color="warmGray.50"
              />
            }
          />

          <IconButton
            onPress={() => update()}
            mb="4"
            bg="teal.400"
            size="10"
            colorScheme="teal"
            borderRadius="full"
            icon={
              <Icon
                as={MaterialCommunityIcons}
                _dark={{
                  color: "warmGray.50",
                }}
                size="6"
                name="update"
                color="warmGray.50"
              />
            }
          />

          <IconButton
            onPress={() => settings()}
            mb="4"
            bg="red.500"
            size="10"
            colorScheme="red"
            borderRadius="full"
            icon={
              <Icon
                as={MaterialIcons}
                size="6"
                name="settings"
                _dark={{
                  color: "warmGray.50",
                }}
                color="warmGray.50"
              />
            }
          />
        </Stagger>
      </View>
    </View>
  );
}

function Menu({ navigation }) {
  return (
    <NativeBaseProvider>
      <MenuStagger navigation={navigation} />
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 8,
    marginTop: 8,
    width: 50,
  },
  button: {},
  buttons: {
    width: 50,
  },
});

export default Menu;
