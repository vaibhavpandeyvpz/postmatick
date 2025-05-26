import React, { useCallback, useState } from "react";
import { ArrowForwardIcon, EditIcon, Search2Icon } from "@chakra-ui/icons";
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
import { Loader } from "./Loader";
import * as api from "../utilities/api";

export function SearchResultView({ result, onResultSelected }) {
  const goToResult = () => window.open(result.url);

  return (
    <Card direction={{ base: "column", sm: "row" }} variant="outline">
      {result.image && (
        <Image
          objectFit="cover"
          maxW={{ base: "100%", sm: "200px" }}
          src={result.image || "https://placehold.co/400?text=no+image"}
          alt={result.title}
        />
      )}
      <Stack>
        <CardBody>
          <Stack gap={1}>
            <Heading noOfLines={2} size="md">
              {result.title}
            </Heading>
            <Text noOfLines={3}>{result.description}</Text>
          </Stack>
        </CardBody>
        <CardFooter>
          <Stack direction="row" gap={1}>
            {onResultSelected && (
              <Button
                colorScheme="blue"
                leftIcon={<EditIcon />}
                onClick={() => onResultSelected(result)}
              >
                Create post
              </Button>
            )}
            <Button
              colorScheme="blue"
              onClick={goToResult}
              rightIcon={<ArrowForwardIcon />}
              variant="outline"
            >
              Read more
            </Button>
          </Stack>
        </CardFooter>
      </Stack>
    </Card>
  );
}

export function ReferencesView({ onResultSelected }) {
  const [results, setResults] = useState(null);
  const [isSearchingResults, setSearchingResults] = useState(false);
  const [query, setQuery] = useState("");

  const searchReferences = useCallback(
    (e) => {
      e.preventDefault();
      if (isSearchingResults) {
        return;
      }

      setSearchingResults(true);
      api
        .references(query)
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
      <form onSubmit={searchReferences}>
        <Stack direction="row">
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Search2Icon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Enter a topic e.g., artificial intelligence"
              defaultValue={query}
              onChange={(e) => setQuery(e.target.value)}
              tabIndex={0}
              type="search"
            />
          </InputGroup>
          {!isSearchingResults && (
            <Button tabIndex={1} type="submit">
              Search
            </Button>
          )}
        </Stack>
      </form>
      {isSearchingResults ? (
        <Box position="relative" h="250px">
          <AbsoluteCenter axis="both">
            <Loader />
          </AbsoluteCenter>
        </Box>
      ) : results?.length ? (
        <Stack maxHeight="650px" overflowY="auto">
          {results.map((x) => (
            <SearchResultView
              result={x}
              key={x.url}
              onResultSelected={onResultSelected}
            />
          ))}
        </Stack>
      ) : (
        <Box position="relative" h="100px">
          <AbsoluteCenter axis="both">
            <Text color="GrayText" fontSize="xs">
              No results to show.
            </Text>
          </AbsoluteCenter>
        </Box>
      )}
    </Stack>
  );
}
