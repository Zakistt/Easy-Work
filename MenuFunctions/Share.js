import { Share } from "react-native";
import { Alert } from "native-base";

export default async function useShare() {
  try {
    const result = await Share.share({
      message: "https://dlkaz,mova.kdmza,mofaz",
      url: "https://dlkaz,mova.kdmza,mofaz",
      title: "description of share",
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    Alert.alert(error.message);
  }
}
