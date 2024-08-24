import React, { useEffect, useState, useCallback } from "react";
import {
  AbsoluteCenter,
  Box,
  Button,
  Container,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Loader } from "./Loader";
import * as api from "../utilities/api";

export function CreatorView() {
  const [isFetchingUser, setFetchingUser] = useState(false);
  const [isLoggingOut, setLoggingOut] = useState(false);
  const [user, setUser] = useState(null);

  const logOut = useCallback(() => {
    if (isLoggingOut) {
      return;
    }

    setLoggingOut(true);
    api
      .logOut()
      .then(() => {
        window.location.href = "/";
      })
      .finally(() => {
        setLoggingOut(false);
      });
  }, []);

  useEffect(() => {
    if (isFetchingUser || user) {
      return;
    }

    setFetchingUser(true);
    api
      .profile()
      .then(({ user }) => {
        setUser(user);
      })
      .finally(() => {
        setFetchingUser(false);
      });
  }, []);

  return (
    <>
      {user ? (
        <Container>
          <Text>Logged in as {user.email}</Text>
        </Container>
      ) : isFetchingUser ? (
        <Box position="relative" h="100vh">
          <AbsoluteCenter axis="both">
            <Loader />
          </AbsoluteCenter>
        </Box>
      ) : (
        <Box position="relative" h="100vh">
          <AbsoluteCenter axis="both">
            <Stack gap={3}>
              <Stack gap={1}>
                <Text>Session may have been revoked or expired.</Text>
                <Text fontSize="xs">Try logging in again to fix this.</Text>
              </Stack>
              <Stack direction="row">
                <Button
                  colorScheme="red"
                  isLoading={isLoggingOut}
                  loadingText="Logging out…"
                  onClick={logOut}
                >
                  Logout
                </Button>
              </Stack>
            </Stack>
          </AbsoluteCenter>
        </Box>
      )}
    </>
  );
}
