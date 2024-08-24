import React from "react";
import { Icon } from "@chakra-ui/icons";
import { AbsoluteCenter, Box, Button, Stack, Text } from "@chakra-ui/react";
import { FaLinkedinIn } from "react-icons/fa6";

export function LoginView() {
  const goToLogin = () => (window.location.href = "/login");

  return (
    <Box position="relative" h="100vh">
      <AbsoluteCenter axis="both">
        <Stack spacing={3}>
          <Text>
            Click on the below button to connect a LinkedIn account and
            continue.
          </Text>
          <Stack direction="row">
            <Button
              colorScheme="blue"
              leftIcon={<Icon as={FaLinkedinIn} />}
              onClick={goToLogin}
            >
              Login with LinkedIn
            </Button>
          </Stack>
        </Stack>
      </AbsoluteCenter>
    </Box>
  );
}
