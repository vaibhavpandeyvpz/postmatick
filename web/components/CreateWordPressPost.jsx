import React from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Heading,
  Button,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import wordpressLogo from "../images/logo-wordpress.svg";

export default function CreateWordPressPost({ onClick }) {
  return (
    <Card variant="outline">
      <CardHeader>
        <Heading size="md">WordPress</Heading>
      </CardHeader>
      <CardBody>
        <Stack spacing={2}>
          <Image src={wordpressLogo} boxSize="50px" alt="WordPress" />
          <Text>
            Create a blog post or article for a WordPress blog based on latest
            news or Google Search results.
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <Button
          colorScheme="gray"
          leftIcon={<AddIcon />}
          onClick={onClick}
          variant="solid"
        >
          Create
        </Button>
      </CardFooter>
    </Card>
  );
}
