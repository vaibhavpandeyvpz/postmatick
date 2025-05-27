import React from "react";
import { Box, Center, Spinner } from "@chakra-ui/react";

export function CenteredLoader(props) {
  return (
    <Box position="relative" {...props}>
      <Center axis="both">
        <Loader />
      </Center>
    </Box>
  );
}

export function Loader() {
  return (
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="blue.500"
      size="xl"
    />
  );
}
