import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import ImageCreator from "./ImageCreator";
import ImagePicker from "./ImagePicker";

export default function PickOrCreateImage({
  contentType,
  content,
  onImageSelect,
}) {
  return (
    <Tabs align="center" variant="soft-rounded">
      <TabList gap={2}>
        <Tab>Stock image</Tab>
        <Tab>Generate</Tab>
      </TabList>
      <TabPanels>
        <TabPanel px={0}>
          <ImagePicker onImageSelect={onImageSelect} />
        </TabPanel>
        <TabPanel px={0}>
          <ImageCreator
            contentType={contentType}
            content={content}
            onImageCreate={onImageSelect}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
