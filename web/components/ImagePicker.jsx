import React, { useCallback, useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";
import {
  AbsoluteCenter,
  Badge,
  Box,
  Button,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import * as api from "../utilities/api";

export function ImageResult({ image, onClick }) {
  const goToImage = () => window.open(image.url);

  return (
    <Box
      borderColor="transparent"
      borderRadius="md"
      borderWidth="1px"
      cursor="pointer"
      h="150px"
      onClick={onClick}
      overflow="hidden"
      pos="relative"
      _hover={{ borderColor: "blue.400", boxShadow: "md" }}
    >
      <Stack direction="row" spacing={1} position="absolute" m={1} bottom={0}>
        {!image.premium && (
          <Badge borderRadius="md" colorScheme="green">
            FREE
          </Badge>
        )}
        {image.premium && (
          <Badge borderRadius="md" colorScheme="yellow">
            PREMIUM
          </Badge>
        )}
        {image.formats.map((x) => (
          <Badge borderRadius="md" colorScheme="blue" key={x}>
            {x.toUpperCase()}
          </Badge>
        ))}
      </Stack>
      <Image objectFit="cover" src={image.preview} alt={image.title} />
    </Box>
  );
}

export default function ImagePicker({ onImageSelect }) {
  const [images, setImages] = useState(null);
  const [isDownloadingImage, setDownloadingImage] = useState(false);
  const [isSearchingImages, setSearchingImages] = useState(false);
  const [query, setQuery] = useState("");

  const searchImages = useCallback(
    (e) => {
      e.preventDefault();
      if (isSearchingImages) {
        return;
      }

      setSearchingImages(true);
      api
        .images(query)
        .then(({ images }) => {
          setImages(images);
        })
        .finally(() => {
          setSearchingImages(false);
        });
    },
    [isSearchingImages, query, setImages, setSearchingImages],
  );

  const selectImage = useCallback(
    (x) => {
      if (isDownloadingImage) {
        return;
      }

      setDownloadingImage(true);
      api
        .download(x.id)
        .then(({ image }) => {
          onImageSelect(image.url);
        })
        .finally(() => {
          setDownloadingImage(false);
        });
    },
    [isDownloadingImage, setDownloadingImage],
  );

  return (
    <Stack gap={3}>
      <form onSubmit={searchImages}>
        <Stack direction="row">
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              isDisabled={isDownloadingImage}
              defaultValue={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter search text…"
              tabIndex={0}
              type="search"
            />
          </InputGroup>
          <Button
            isDisabled={isDownloadingImage}
            isLoading={isSearchingImages}
            loadingText="Searching…"
            tabIndex={1}
            type="submit"
            variant="outline"
          >
            Search
          </Button>
        </Stack>
      </form>
      {isSearchingImages ? (
        <Box position="relative" h="100px">
          <AbsoluteCenter axis="both">
            <Text color="gray.300" fontSize="sm">
              Please wait while we are fetching images…
            </Text>
          </AbsoluteCenter>
        </Box>
      ) : images?.length ? (
        <Stack maxHeight="450px" overflowY="auto">
          <SimpleGrid columns={3} spacing={3}>
            {images.map((x) => (
              <ImageResult
                image={x}
                key={x.id}
                onClick={() => selectImage(x)}
              />
            ))}
          </SimpleGrid>
        </Stack>
      ) : (
        <Box position="relative" h="100px">
          <AbsoluteCenter axis="both">
            <Text color="gray.300" fontSize="sm">
              No images to show here.
            </Text>
          </AbsoluteCenter>
        </Box>
      )}
    </Stack>
  );
}
