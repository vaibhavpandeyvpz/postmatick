import React, { useEffect, useState } from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import CreateLinkedInPost from "../components/CreateLinkedInPost";
import CreateWordPressPost from "../components/CreateWordPressPost";
import { CenteredLoader } from "./Loader";
import LoginWithLinkedIn from "../components/LoginWithLinkedIn";
import * as api from "../utilities/api";

export default function ContentTypeChooser({ onContentTypeSelect }) {
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

  const createLinkedInPost = () => onContentTypeSelect("LINKEDIN");
  const createWordPressPost = () => onContentTypeSelect("WORDPRESS");
  const loggedOut = () => setLoggedIn(false);

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={5}>
      <GridItem w="100%">
        {isLoggedIn ? (
          <CreateLinkedInPost
            onClick={createLinkedInPost}
            onLogOut={loggedOut}
          />
        ) : isCheckingStatus ? (
          <CenteredLoader h="250px" />
        ) : (
          <LoginWithLinkedIn />
        )}
      </GridItem>
      <GridItem w="100%">
        <CreateWordPressPost onClick={createWordPressPost} />
      </GridItem>
    </Grid>
  );
}
