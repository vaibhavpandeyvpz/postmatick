import React, { useEffect, useState, useCallback } from "react";
import {
  AbsoluteCenter,
  Box,
  Button,
  Container,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { LinkedInPoster } from "./LinkedInPoster";
import { Loader } from "./Loader";
import { NewsArticleView, NewsSearchView } from "./NewsSearchView";
import * as api from "../utilities/api";

export function CreatorView() {
  const [selectedArticle, setSelectedArticle] = useState(null);
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

  const resetSelection = useCallback(
    (e) => {
      e.preventDefault();
      setSelectedArticle(null);
    },
    [setSelectedArticle],
  );

  const selectArticle = useCallback(
    (x) => {
      setSelectedArticle(x);
    },
    [setSelectedArticle],
  );

  useEffect(() => {
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
        <Container p={3}>
          <Stack gap={3}>
            <Text color="GrayText">
              <strong>Logged in as:</strong> {user.email}
            </Text>
            {selectedArticle ? (
              <Stack gap={3}>
                <Text>
                  You have selected below article (
                  <Link color="blue.500" href="" onClick={resetSelection}>
                    click here
                  </Link>{" "}
                  to reset):
                </Text>
                <NewsArticleView article={selectedArticle} />
                <LinkedInPoster
                  article={selectedArticle}
                  onClickReset={resetSelection}
                  user={user}
                />
              </Stack>
            ) : (
              <NewsSearchView onArticleSelected={selectArticle} />
            )}
          </Stack>
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
