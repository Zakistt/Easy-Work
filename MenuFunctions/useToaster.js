import * as React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

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

export default function useToaster() {
  const [response, setResponse] = React.useState({
    data: {
      title: "",
      description: "",
      status: "",
    },
  });
  const [indicator, setIndicator] = React.useState(0);
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
              style={{ fontWeight: "700" }}
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
  React.useEffect(() => {
    if (indicator == 0) {
      return;
    } else {
      toast.show({
        render: ({ id }) => {
          return (
            <ToastAlert
              id={id}
              status={response.data.status || "error"}
              title={response.data.title}
              variant={"left-accent"}
              isClosable={true}
              description={response.data.description}
            />
          );
        },
      });
    }
  }, [indicator]);

  return [indicator, setIndicator, setResponse];
}
