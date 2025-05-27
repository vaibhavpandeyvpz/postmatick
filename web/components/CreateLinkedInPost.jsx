import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import linkedinLogo from "../images/logo-linkedin.svg";
import * as api from "../utilities/api";

export default function CreateLinkedInPost({ onClick, onLogOut }) {
  const [user, setUser] = useState(null);
  const [isLoggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    api.profile().then(({ user }) => {
      console.log(user);
      setUser(user);
    });
  }, []);

  const logOut = useCallback(() => {
    if (isLoggingOut) {
      return;
    }

    setLoggingOut(true);
    api
      .logOut()
      .then(() => {
        onLogOut();
      })
      .finally(() => {
        setLoggingOut(false);
      });
  }, [isLoggingOut, setLoggingOut]);

  return (
    <Card variant="outline">
      <CardHeader>
        <Heading size="md">LinkedIn</Heading>
      </CardHeader>
      <CardBody>
        <Stack spacing={2}>
          <Image src={linkedinLogo} boxSize="50px" alt="WordPress" />
          <Text>
            Create a social media post for engagement on LinkedIn based on
            latest news or Google Search results.
          </Text>
          {user && <Text>Logged in as: {user.email}</Text>}
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <Stack direction="row" spacing={2}>
          <Button
            colorScheme="blue"
            leftIcon={<AddIcon />}
            onClick={onClick}
            variant="solid"
          >
            Create
          </Button>
          <Button
            isLoading={isLoggingOut}
            colorScheme="red"
            leftIcon={<CloseIcon />}
            loadingText="Logging out…"
            onClick={logOut}
            variant="ghost"
          >
            Logout
          </Button>
        </Stack>
      </CardFooter>
    </Card>
  );
}
