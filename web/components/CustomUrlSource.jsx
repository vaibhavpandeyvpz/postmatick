import React, { useCallback, useState } from "react";
import { LinkIcon } from "@chakra-ui/icons";
import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
} from "@chakra-ui/react";

export default function CustomUrlSource({ onSubmitUrl }) {
  const [url, setUrl] = useState("");

  const submitUrl = useCallback(() => onSubmitUrl(url), [url]);

  return (
    <Stack gap={3}>
      <form onSubmit={submitUrl}>
        <Stack direction="row">
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <LinkIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Enter a URL e.g., https://vaibhavpandey.com/..."
              defaultValue={url}
              onChange={(e) => setUrl(e.target.value)}
              tabIndex={0}
              type="url"
            />
          </InputGroup>
          <Button tabIndex={1} type="submit" variant="outline">
            Submit
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
