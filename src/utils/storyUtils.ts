import type { StoryRequest, StoryResponse } from "../types/types";

export const convertStoryResponseToRequest = (response: StoryResponse): StoryRequest => {
  return {
    id: response.id,
    title: response.title,
    description: response.description,
    genre: response.genre,
    coverImageUrl: response.coverImageUrl,
    visibility: response.visibility as 'public' | 'private',
    status: response.status as 'in_progress' | 'completed'
  };
};