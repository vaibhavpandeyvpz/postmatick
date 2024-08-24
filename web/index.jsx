import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { MainView } from "./components/MainView";

export function createApp() {
  return (
    <ChakraProvider>
      <MainView />
    </ChakraProvider>
  );
}
