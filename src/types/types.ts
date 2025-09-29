export type User = {
  name: string,
  nickname: string,
  picture: string | null,

}

export type UserRequest = {
  id?: number,
  name: string,
  picture: string | null,
}

export type UserResponse = {
  id?:number,
  name: string,
  nickname?: string,
  picture: string | null,
}

export interface StoryRequest {
  title: string;
  description: string;
  genre: string;
  coverImageUrl?: string;
  visibility: 'piblic' | "private";
  status: 'in_progress' | 'completed'
}

export interface StoryResponse {
  id: string;
  title: string,
  description: string;
  genre: string;
  coverImageUrl: string;
  visibility: string;
  status: string;
  createdAt: string;
}

export interface ChapterRequest {
  title: string
}

export interface ChapterResponse {
  idChapter: number;
  title: string;
  createdAt: string
}

export interface ChapterWithPages {
  idChapter: number;
  title: string;
  pages: PageResponse[];
}

export interface TextCell {
  id: string;
  content: string;
  isEditing: boolean;
  pageId?: number;
  pageNumber?: number;
  localImages?: { file: File; previewUrl: string }[]; //para manejar las imagenes antes de subirlas a S3
}


export interface PageRequest {
  id?: number ;
  content: string;
  pageNumber: number;
}


export interface PageResponse {
  id: number;
  content: string;
  pageNumber: number;
  chapterId: number;
  createdAt: string;
}

export interface PaginatedPages{
  pages: PageResponse[],
  total: number
}