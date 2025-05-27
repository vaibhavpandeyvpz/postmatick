import React, { useCallback, useState } from "react";
import { ArrowForwardIcon, EditIcon, SearchIcon } from "@chakra-ui/icons";
import {
  AbsoluteCenter,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
} from "@chakra-ui/react";
import * as api from "../utilities/api";
import placeholder from "../images/placeholder.svg";

export function SearchResult({ result, onResultSelect }) {
  const goToResult = () => window.open(result.url);

  return (
    <Card direction={{ base: "column", sm: "row" }} variant="outline">
      <Image
        objectFit="cover"
        maxW={{ base: "100%", sm: "100px" }}
        maxH={{ base: "100%", sm: "100px" }}
        src={result.image || placeholder}
        alt={result.title}
      />
      <Stack gap={0}>
        <CardBody>
          <Stack gap={1}>
            <Heading noOfLines={2} size="md" textAlign="start">
              {result.title}
            </Heading>
            <Text noOfLines={3} textAlign="start">
              {result.description}
            </Text>
            <Text color="gray.400" noOfLines={1} textAlign="start">
              {result.url}
            </Text>
          </Stack>
        </CardBody>
        <CardFooter pt={0}>
          <Stack direction="row" gap={2}>
            {onResultSelect && (
              <Button
                colorScheme="blue"
                rightIcon={<ArrowForwardIcon />}
                onClick={() => onResultSelect(result)}
              >
                Continue
              </Button>
            )}
            <Button colorScheme="blue" onClick={goToResult} variant="ghost">
              Read more
            </Button>
          </Stack>
        </CardFooter>
      </Stack>
    </Card>
  );
}

export default function SearchResults({
  provider,
  placeholder,
  onResultSelect,
}) {
  const [results, setResults] = useState(null);
  const [isSearchingResults, setSearchingResults] = useState(false);
  const [query, setQuery] = useState("");

  const searchOnWeb = useCallback(
    (e) => {
      e.preventDefault();
      if (isSearchingResults) {
        return;
      }

      setSearchingResults(true);
      api
        .search(provider, query)
        .then(({ results }) => {
          setResults(results);
        })
        .finally(() => {
          setSearchingResults(false);
        });
    },
    [isSearchingResults, query, setResults, setSearchingResults],
  );

  return (
    <Stack gap={3}>
      <form onSubmit={searchOnWeb}>
        <Stack direction="row">
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder={placeholder}
              defaultValue={query}
              onChange={(e) => setQuery(e.target.value)}
              tabIndex={0}
              type="search"
            />
          </InputGroup>
          <Button
            isLoading={isSearchingResults}
            loadingText="Searching…"
            tabIndex={1}
            type="submit"
            variant="outline"
          >
            Search
          </Button>
        </Stack>
      </form>
      {isSearchingResults ? (
        <Box position="relative" h="100px">
          <AbsoluteCenter axis="both">
            <Text color="gray.300" fontSize="sm">
              Please wait while we are fetching results…
            </Text>
          </AbsoluteCenter>
        </Box>
      ) : results?.length ? (
        <Stack maxHeight="650px" overflowY="auto">
          {results.map((x) => (
            <SearchResult
              result={x}
              key={x.url}
              onResultSelect={onResultSelect}
            />
          ))}
        </Stack>
      ) : (
        <Box position="relative" h="100px">
          <AbsoluteCenter axis="both">
            <Text color="gray.300" fontSize="sm">
              No results to show here.
            </Text>
          </AbsoluteCenter>
        </Box>
      )}
    </Stack>
  );
}
