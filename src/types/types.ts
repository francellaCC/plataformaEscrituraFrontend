export type User ={
  name: string,
  nickname:string,
  picture: string | null,

}


export interface StoryRequest{
  title: string;
  description: string;
  genre:string;
  coverImageUrl?:string;
  visibility: 'piblic' | "private";
  status: 'in_progress' | 'completed'
}

export interface StoryResponse{
  id: string;
  title: string,
  description: string;
  genre: string;
  coverImageUrl:string;
  visibility: string;
  status: string;
  createdAt: string;
}

export interface ChapterRequest{
  title:string
}

export interface ChapterResponse{
  idChapter:number;
  title: string;
  createdAt: string
}

export interface TextCell {
  id: string;
  content: string;
  isEditing: boolean;
}


export interface PageRequest {
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