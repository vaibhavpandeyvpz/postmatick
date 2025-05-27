import React, { useCallback, useEffect, useState } from "react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Button, Image, Stack, Textarea } from "@chakra-ui/react";
import * as api from "../utilities/api";

export default function ImageCreator({ contentType, content, onImageCreate }) {
  const [prompt, setPrompt] = useState("");
  const [isGeneratingIdea, setGeneratingIdea] = useState(false);
  const [isGeneratingImage, setGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState("");

  const generateImage = useCallback(
    (e) => {
      e.preventDefault();
      if (isGeneratingImage) {
        return;
      }

      setGeneratingImage(true);
      api
        .draw(contentType, content, prompt)
        .then(({ image }) => {
          setGeneratedImage(image);
        })
        .finally(() => {
          setGeneratingImage(false);
        });
    },
    [isGeneratingImage, prompt, setGeneratingImage],
  );

  useEffect(() => {
    setGeneratingIdea(true);
    api
      .idea(contentType, content)
      .then(({ prompt }) => {
        setPrompt(prompt);
      })
      .finally(() => {
        setGeneratingIdea(false);
      });
  }, []);

  const submitImage = useCallback(
    () => onImageCreate(generatedImage),
    [generatedImage],
  );

  return (
    <Stack gap={3}>
      <form onSubmit={generateImage}>
        <Stack gap={3}>
          <Textarea
            isDisabled={isGeneratingIdea}
            defaultValue={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter optional prompt to customize output image…"
            tabIndex={0}
          />
          <Stack direction="row" gap={3}>
            <Button
              isDisabled={isGeneratingIdea}
              isLoading={isGeneratingImage}
              loadingText="Generating…"
              tabIndex={1}
              type="submit"
              variant="outline"
            >
              {!!generatedImage ? "Regenerate" : "Generate"}
            </Button>
            <Button
              colorScheme="blue"
              isDisabled={isGeneratingIdea || !generatedImage}
              onClick={submitImage}
              rightIcon={<ArrowForwardIcon />}
              tabIndex={2}
            >
              Continue
            </Button>
          </Stack>
          {generatedImage && <Image src={generatedImage} />}
        </Stack>
      </form>
    </Stack>
  );
}
