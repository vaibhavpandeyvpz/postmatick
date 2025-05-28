import React, { useState } from "react";
import {
  Box,
  Container,
  Stack,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
} from "@chakra-ui/react";
import ContentCreator from "../components/ContentCreator";
import ContentTypeChooser from "../components/ContentTypeChooser";
import FinalizePost from "../components/FinalizePost";
import PickOrCreateImage from "../components/PickOrCreateImage";
import SearchOrEnterSource from "../components/SearchOrEnterSource";

const steps = [
  { title: "Type" },
  { title: "Source" },
  { title: "Content" },
  { title: "Image" },
  { title: "Finish" },
];

export function MainView() {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });
  const [contentType, setContentType] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);

  const changeContentType = (type) => {
    setActiveStep(1);
    setContentType(type);
  };

  const changeSelectedResult = (result) => {
    setActiveStep(2);
    setSelectedResult(result);
  };

  const changeGeneratedContent = (content) => {
    setActiveStep(3);
    setGeneratedContent(content);
  };

  const changeGeneratedImage = (content) => {
    setActiveStep(4);
    setGeneratedImage(content);
  };

  const resetAll = () => {
    setContentType(null);
    setSelectedResult(null);
    setGeneratedContent(null);
    setGeneratedImage(null);
    setActiveStep(0);
  };

  return (
    <Container maxW="container.md" mt={20} mb={5}>
      <Stack spacing={5}>
        <Stepper index={activeStep}>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>

              <Box flexShrink="0">
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </Box>

              <StepSeparator />
            </Step>
          ))}
        </Stepper>
        {activeStep === 0 && (
          <ContentTypeChooser onContentTypeSelect={changeContentType} />
        )}
        {activeStep === 1 && (
          <SearchOrEnterSource onResultSelect={changeSelectedResult} />
        )}
        {activeStep === 2 && (
          <ContentCreator
            contentType={contentType}
            result={selectedResult}
            onContentCreate={changeGeneratedContent}
          />
        )}
        {activeStep === 3 && (
          <PickOrCreateImage
            contentType={contentType}
            content={generatedContent}
            onImageSelect={changeGeneratedImage}
          />
        )}
        {activeStep === 4 && (
          <FinalizePost
            contentType={contentType}
            content={generatedContent}
            image={generatedImage}
            onStartOver={resetAll}
          />
        )}
      </Stack>
    </Container>
  );
}
