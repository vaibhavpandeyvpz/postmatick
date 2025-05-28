import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import CustomUrlSource from "./CustomUrlSource";
import SearchResults from "./SearchResults";

export default function SearchOrEnterSource({ onResultSelect }) {
  const submitUrlSource = (url) => {
    onResultSelect({
      title: "Dummy title",
      url,
    });
  };

  return (
    <Tabs align="center" variant="soft-rounded">
      <TabList gap={2}>
        <Tab>Google</Tab>
        <Tab>News API</Tab>
        <Tab>Custom</Tab>
      </TabList>
      <TabPanels>
        <TabPanel px={0}>
          <SearchResults
            provider="GOOGLE"
            placeholder="Enter a search term e.g., how to make kadai paneer"
            onResultSelect={onResultSelect}
          />
        </TabPanel>
        <TabPanel px={0}>
          <SearchResults
            provider="NEWSAPI"
            placeholder="Enter a topic e.g., artificial intelligence"
            onResultSelect={onResultSelect}
          />
        </TabPanel>
        <TabPanel px={0}>
          <CustomUrlSource onSubmitUrl={submitUrlSource} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
