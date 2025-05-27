import React, { useCallback, useState } from "react";
import Markdown from "react-markdown";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Button, Stack, Textarea } from "@chakra-ui/react";
import * as api from "../utilities/api";

export default function ContentCreator({
  contentType,
  result,
  onContentCreate,
}) {
  const [prompt, setPrompt] = useState(
    contentType === "LINKEDIN"
      ? "Create short content for a LinkedIn post based on the following content from an online article. Include relevant and potential hashtags at the end of content that will help in making content trending or viral."
      : "Create a SEO-friendly blog post or article of ideal word count based on the following content from an online article.",
  );
  const [isGeneratingContent, setGeneratingContent] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");

  const generateContent = useCallback(
    (e) => {
      e.preventDefault();
      if (isGeneratingContent) {
        return;
      }

      setGeneratingContent(true);
      api
        .write(result.url, prompt)
        .then(({ content }) => {
          setGeneratedContent(content);
        })
        .finally(() => {
          setGeneratingContent(false);
        });
    },
    [prompt],
  );

  const submitContent = useCallback(
    () => onContentCreate(generatedContent),
    [generatedContent],
  );

  return (
    <Stack gap={3}>
      <form onSubmit={generateContent}>
        <Stack gap={3}>
          <Textarea
            placeholder="Enter optional prompt to customize output text…"
            defaultValue={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
            tabIndex={0}
          />
          <Stack direction="row" gap={3}>
            <Button
              isLoading={isGeneratingContent}
              loadingText="Generating…"
              tabIndex={1}
              type="submit"
              variant="outline"
            >
              {!!generatedContent ? "Regenerate" : "Generate"}
            </Button>
            <Button
              colorScheme="blue"
              isDisabled={!generatedContent}
              onClick={submitContent}
              rightIcon={<ArrowForwardIcon />}
              tabIndex={2}
            >
              Continue
            </Button>
          </Stack>
          {generatedContent && <Markdown>{generatedContent}</Markdown>}
        </Stack>
      </form>
    </Stack>
  );
}
