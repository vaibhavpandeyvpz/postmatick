import React, { useCallback, useState } from "react";
import { Icon } from "@chakra-ui/icons";
import {
  AbsoluteCenter,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  Image,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import ReactHashtag from "react-hashtag";
import { FaArrowRotateLeft, FaGlobe, FaPaperPlane } from "react-icons/fa6";
import { Loader } from "./Loader";
import * as api from "../utilities/api";

export function LinkedInPoster({ article, user, onClickReset }) {
  const [generatedImage, setGeneratedImage] = useState(null);
  const [generatedText, setGeneratedText] = useState(null);
  const [isGeneratedTextExpanded, setGeneratedTextExpanded] = useState(false);
  const [isGenerating, setGenerating] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);

  const toggleGeneratedText = (e) => {
    e.preventDefault();
    setGeneratedTextExpanded(!isGeneratedTextExpanded);
  };

  const generateContent = useCallback(() => {
    if (isGenerating) {
      return;
    }

    setGenerating(true);
    api
      .write(article.url, article.image)
      .then(({ text, image }) => {
        setGeneratedImage(image);
        setGeneratedText(text);
        setGeneratedTextExpanded(false);
      })
      .finally(() => {
        setGenerating(false);
      });
  }, [isGenerating, setGeneratedImage, setGeneratedText, setGenerating]);

  const submitPost = useCallback(() => {
    if (isSubmitting) {
      return;
    }

    setSubmitting(true);
    api.post(generatedText, generatedImage).finally(() => {
      setSubmitted(true);
      setSubmitting(false);
    });
  }, [
    generatedImage,
    generatedText,
    isSubmitting,
    setSubmitted,
    setSubmitting,
  ]);

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
          It should soon start appearing on the LinkedIn feed.
        </AlertDescription>
        <Button
          colorScheme="green"
          leftIcon={<Icon as={FaArrowRotateLeft} />}
          mt={3}
          onClick={onClickReset}
        >
          Start over
        </Button>
      </Alert>
    );
  }

  return (
    <Stack gap={3}>
      {isGenerating ? (
        <Box position="relative" h="250px">
          <AbsoluteCenter axis="both">
            <Loader />
          </AbsoluteCenter>
        </Box>
      ) : (
        <>
          {generatedText && (
            <Card>
              <CardBody>
                <Stack gap={3}>
                  <Stack alignItems="center" direction="row" gap={3}>
                    <Avatar
                      src={
                        user.picture || "https://placehold.co/400?text=no+image"
                      }
                    />
                    <Stack gap={0}>
                      <Text>
                        <strong>{user.name}</strong> (He/him/his)
                      </Text>
                      <Text fontSize="sm">SEO Champion | Prev: ISRO</Text>
                      <Text fontSize="xs">
                        14m &bull; Edited &bull; <Icon as={FaGlobe} />
                      </Text>
                    </Stack>
                  </Stack>
                  <Stack gap={0}>
                    <Text noOfLines={isGeneratedTextExpanded ? null : 3}>
                      <ReactHashtag
                        renderHashtag={(value) => (
                          <Link color="blue.400" key={value}>
                            {value}
                          </Link>
                        )}
                      >
                        {generatedText}
                      </ReactHashtag>
                    </Text>
                    <Link
                      color="GrayText"
                      href=""
                      onClick={toggleGeneratedText}
                    >
                      &hellip;{isGeneratedTextExpanded ? "less" : "more"}
                    </Link>
                  </Stack>
                  <Image
                    objectFit="cover"
                    maxW={{ base: "100%" }}
                    src={
                      generatedImage || "https://placehold.co/400?text=no+image"
                    }
                    alt={article.title}
                  />
                </Stack>
              </CardBody>
            </Card>
          )}
          <Stack justifyContent="center" direction="row" gap={1}>
            <Button
              colorScheme="blue"
              disabled={isSubmitting}
              leftIcon={<Icon as={FaArrowRotateLeft} />}
              onClick={generateContent}
            >
              {generatedText ? "Re-generate" : "Generate"}
            </Button>
            {generatedText && (
              <Button
                isLoading={isSubmitting}
                onClick={submitPost}
                rightIcon={<Icon as={FaPaperPlane} />}
              >
                Post on LinkedIn
              </Button>
            )}
          </Stack>
        </>
      )}
    </Stack>
  );
}
