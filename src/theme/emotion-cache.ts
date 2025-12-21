/**
 * Emotion cache configuration for Material-UI
 * Ensures MUI styles are prepended to the head for proper CSS precedence
 */
import createCache from "@emotion/cache";

export const emotionCache = createCache({
  key: "mui",
  prepend: true,
});
