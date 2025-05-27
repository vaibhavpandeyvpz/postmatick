import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import SearchResults from "./SearchResults";

export default function SearchGoogleOrNews({ onResultSelect }) {
  return (
    <Tabs align="center" variant="soft-rounded">
      <TabList gap={2}>
        <Tab>Google</Tab>
        <Tab>News API</Tab>
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
      </TabPanels>
    </Tabs>
  );
}
