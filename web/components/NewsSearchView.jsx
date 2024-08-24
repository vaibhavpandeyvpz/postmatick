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

export function NewsArticleView({ article, onArticleSelected }) {
  const goToArticle = () => window.open(article.url);

  return (
    <Card direction={{ base: "column", sm: "row" }} variant="outline">
      <Image
        objectFit="cover"
        maxW={{ base: "100%", sm: "200px" }}
        src={article.image || "https://placehold.co/400?text=no+image"}
        alt={article.title}
      />
      <Stack>
        <CardBody>
          <Stack gap={1}>
            <Heading noOfLines={2} size="md">
              {article.title}
            </Heading>
            <Text noOfLines={3}>{article.description}</Text>
          </Stack>
        </CardBody>
        <CardFooter>
          <Stack direction="row" gap={1}>
            {onArticleSelected && (
              <Button
                colorScheme="blue"
                leftIcon={<EditIcon />}
                onClick={() => onArticleSelected(article)}
              >
                Create post
              </Button>
            )}
            <Button
              colorScheme="blue"
              onClick={goToArticle}
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

export function NewsSearchView({ onArticleSelected }) {
  const [articles, setArticles] = useState(null);
  const [isSearchingArticles, setSearchingArticles] = useState(false);
  const [query, setQuery] = useState("");

  const searchArticles = useCallback(
    (e) => {
      e.preventDefault();
      if (isSearchingArticles) {
        return;
      }

      setSearchingArticles(true);
      api
        .news(query)
        .then(({ articles }) => {
          setArticles(articles);
        })
        .finally(() => {
          setSearchingArticles(false);
        });
    },
    [isSearchingArticles, query, setArticles, setSearchingArticles],
  );

  return (
    <Stack gap={3}>
      <form onSubmit={searchArticles}>
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
          {!isSearchingArticles && (
            <Button tabIndex={1} type="submit">
              Search
            </Button>
          )}
        </Stack>
      </form>
      {isSearchingArticles ? (
        <Box position="relative" h="250px">
          <AbsoluteCenter axis="both">
            <Loader />
          </AbsoluteCenter>
        </Box>
      ) : articles?.length ? (
        <Stack maxHeight="650px" overflowY="auto">
          {articles.map((x) => (
            <NewsArticleView
              article={x}
              key={x.url}
              onArticleSelected={onArticleSelected}
            />
          ))}
        </Stack>
      ) : (
        <Box position="relative" h="100px">
          <AbsoluteCenter axis="both">
            <Text color="GrayText" fontSize="xs">
              No articles to show.
            </Text>
          </AbsoluteCenter>
        </Box>
      )}
    </Stack>
  );
}
