import React, { useCallback, useState } from "react";
import Markdown from "react-markdown";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Image,
  Input,
  Stack,
} from "@chakra-ui/react";
import * as api from "../utilities/api";

export default function FinalizePost({
  contentType,
  content,
  image,
  onStartOver,
}) {
  const [isSubmitting, setSubmitting] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);
  const [title, setTitle] = useState("");

  const submitPost = useCallback(
    (e) => {
      e.preventDefault();
      if (isSubmitting) {
        return;
      }

      setSubmitting(true);
      api
        .post(contentType, title, content, image)
        .then(() => {
          setSubmitted(true);
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
    [isSubmitting, setSubmitted, setSubmitting, title],
  );

  if (isSubmitted) {
    return (
      <Alert
        alignItems="center"
        flexDirection="column"
        justifyContent="center"
        p={5}
        status="success"
        textAlign="center"
        variant="subtle"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Post submitted!
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          {contentType === "LINKEDIN"
            ? "It should soon start appearing on the LinkedIn feed."
            : "You can publish it from drafts."}
        </AlertDescription>
        <Button
          colorScheme="green"
          leftIcon={<ArrowBackIcon />}
          mt={3}
          onClick={onStartOver}
        >
          Start over
        </Button>
      </Alert>
    );
  }

  return (
    <form onSubmit={submitPost}>
      <Stack spacing={3}>
        {contentType === "WORDPRESS" && (
          <Input
            placeholder="Enter a post title"
            defaultValue={title}
            onChange={(e) => setTitle(e.target.value)}
            tabIndex={0}
            required
          />
        )}
        <Image src={image} />
        <Markdown>{content}</Markdown>
        <Stack direction="row" spacing={3}>
          <Button
            colorScheme="blue"
            isLoading={isSubmitting}
            rightIcon={<ArrowForwardIcon />}
            type="submit"
          >
            {contentType === "LINKEDIN"
              ? "Post on LinkedIn"
              : "Post on WordPress"}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
