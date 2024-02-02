import React from "react";
import { Dimensions } from "react-native";
import {
  IconButton,
  Alert,
  useToast,
  VStack,
  HStack,
  Text,
  CloseIcon,
} from "native-base";

const windowHeight = Dimensions.get("window").height;
const toastTopStyle = (windowHeight * 7) / 8;

function useUpdate(menu) {
  const [updateIndicator, setUpdateIndicator] = React.useState(0);
  const toast = useToast();
  React.useEffect(() => {
    if (updateIndicator == 0) {
      return;
    } else {
      //send a request to an api to check if theres any update
      let status;
      let title;
      if (false) {
        status = "info";
        title =
          "This version of the app is not up to date! we recommend you get the latest version.";
      } else {
        status = "success";
        title = "This version of the app is up to date.";
      }
      toast.show({
        placement: "bottom",
        variant: "left-accent",
        render: () => {
          return (
            <Alert
              style={{
                top: menu ? toastTopStyle : 0,
                alignSelf: "center",
              }}
              w="80%"
              status={status}
            >
              <VStack w="95%">
                <HStack space={10} justifyContent="space-between">
                  <HStack space={4} flexShrink={1} w="95%">
                    <Alert.Icon mt="1" />
                    <Text fontSize="14" color="coolGray.800">
                      {title}
                    </Text>
                  </HStack>
                  <IconButton
                    onPress={() => toast.closeAll()}
                    variant="unstyled"
                    _focus={{
                      borderWidth: 0,
                    }}
                    icon={<CloseIcon size="3" />}
                    _icon={{
                      color: "coolGray.600",
                    }}
                  />
                </HStack>
              </VStack>
            </Alert>
          );
        },
      });
    }
  }, [updateIndicator]);
  return [updateIndicator, setUpdateIndicator];
}

export default useUpdate;
