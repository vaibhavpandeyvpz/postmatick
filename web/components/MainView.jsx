import React, { useEffect, useState } from "react";
import { AbsoluteCenter, Box } from "@chakra-ui/react";
import { CreatorView } from "./CreatorView";
import { Loader } from "./Loader";
import { LoginView } from "./LoginView";
import * as api from "../utilities/api";

export function MainView() {
  const [isCheckingStatus, setCheckingStatus] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    setCheckingStatus(true);
    api
      .status()
      .then(({ logged }) => {
        setLoggedIn(logged === "in");
      })
      .finally(() => {
        setCheckingStatus(false);
      });
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <CreatorView />
      ) : isCheckingStatus ? (
        <Box position="relative" h="100vh">
          <AbsoluteCenter axis="both">
            <Loader />
          </AbsoluteCenter>
        </Box>
      ) : (
        <LoginView />
      )}
    </>
  );
}
