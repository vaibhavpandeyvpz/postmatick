import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { MainView } from "./views/MainView";

export default function createApp() {
  return (
    <ChakraProvider>
      <MainView />
    </ChakraProvider>
  );
}
