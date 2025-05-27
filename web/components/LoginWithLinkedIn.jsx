import React from "react";
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
import { ArrowForwardIcon } from "@chakra-ui/icons";
import linkedinLogo from "../images/logo-linkedin.svg";

export default function LoginWithLinkedIn() {
  const goToLogin = () => (window.location.href = "/login");

  return (
    <Card variant="outline">
      <CardHeader>
        <Heading size="md">LinkedIn</Heading>
      </CardHeader>
      <CardBody>
        <Stack spacing={2}>
          <Image src={linkedinLogo} boxSize="50px" alt="WordPress" />
          <Text>
            To create a social media posts for engagement on LinkedIn, please
            login with your LinkedIn account first.
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <Button
          colorScheme="blue"
          rightIcon={<ArrowForwardIcon />}
          onClick={goToLogin}
          variant="solid"
        >
          Login
        </Button>
      </CardFooter>
    </Card>
  );
}
