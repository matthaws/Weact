import { APIKey } from "./secrets.js";

export const fetchRandomGif = tag => {
  return fetch(
    `https://api.giphy.com/v1/gifs/random?api_key=${APIKey}&tag=${tag}&rating=G`
  );
};
