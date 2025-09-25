import React from 'react'
import { useGetProfileImagePresignedQuery } from '../services/s3Api';

export default function ProfilePicture({picture}:{picture:string}) {
  if(!picture){
    return <img src="image.png" className="w-24 h-24 rounded-full object-cover border" />;
  }

  // detectar si la imagen pertenece a s3 o no

  const isFromS3 = picture.includes("s3.amazonaws.com") || !picture.startsWith("http")

  //se llama solo si la imagen es de s3
  const {data, isSuccess} = useGetProfileImagePresignedQuery(picture,{skip: !isFromS3})
  const src = isFromS3 ? (isSuccess ? data?.url : "image.png") : picture;

  return <img className="w-24 h-24 rounded-full object-cover border" src={src} />;
}
