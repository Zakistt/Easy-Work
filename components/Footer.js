import { StyleSheet, Pressable, Dimensions, View } from 'react-native';
import * as React from 'react';

import { NativeBaseProvider, Avatar} from "native-base";

import { MaterialCommunityIcons } from '@expo/vector-icons';


/*Footer Button Width  */
const windowWidth = Dimensions.get('window').width
const buttonWidth = windowWidth/3


/* footer functions */
function handleBrowse(navi) {
    navi.navigation.navigate("Browse")
}

function handleProfile(navi) {
    navi.navigation.navigate("Profile")
}

function handleResume(navi) {
    navi.navigation.navigate("Resume")
}



/*Main */
function Footer(props) {
  const navi = props.navi  
  return (
      <NativeBaseProvider>
        <View style={footerstyles}>
          <Pressable
            onPress={() => handleBrowse(navi)}
            style={{ width: buttonWidth, alignItems: "center",}}
            android_ripple={{ color: "#0F346B", radius: 60,}}
          >
            <MaterialCommunityIcons name="briefcase-search-outline" size={40} color="#fff" />
          </Pressable>
          <Pressable
            onPress={() => handleProfile(navi)}
            style={{ width: buttonWidth, alignItems: "center", }}
            android_ripple={{ color: "#0F346B", radius: 30, }}
          >
            <Avatar bg="green.500" size="50" source={{
              uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
            }}>
            </Avatar>
          </Pressable>
          <Pressable
            onPress={() => handleResume(navi)}
            style={{ width: buttonWidth, alignItems: "center", }}
            android_ripple={{ color: "#0F346B", radius: 60, }}
          >
            <MaterialCommunityIcons name="card-account-details-outline" size={40} color="#fff" />
          </Pressable>
        </View>
        </NativeBaseProvider>
    )  
}

/*Css Styling*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const footerstyles = StyleSheet.create({
  height: 50,
  position: "absolute",
  marginTop: 10,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "#2071eb",
  flexDirection: "row",
  alignItems: "center", 
})


export default Footer