import { ChevronDownIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import ProfilePicture from "../ProfilePicture";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import type { ChapterResponse, UserResponse } from "../../types/types";
import ChapterSelector from "./ChapterSelector";

type StoryHeaderProps = {
  user: UserResponse,
  chapters: ChapterResponse[],
  currentChapter: number | null,
  onSelect: (id: number) => void
}

export default function StoryHeader({ user, chapters, currentChapter, onSelect }: StoryHeaderProps) {
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between ">
      <div className="flex gap-5">
        <button
          className="flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ChevronLeftIcon className="h-4 w-4" /> Volver
        </button>
        <div className="flex justify-between items-center ">
          <ChapterSelector
            chapters={chapters}
            currentChapterId={currentChapter}
            onSelect={onSelect}
          />
        </div>

      </div>

      <div className="relative" ref={profileRef}>
        <button
          onClick={() => setOpenProfile((prev) => !prev)}
          className="flex items-center gap-2"
        >
          <ProfilePicture picture={user?.picture!} width="w-8" height="h-8" />
          <ChevronDownIcon className="w-4 h-4" />
        </button>
        {openProfile && (
          <div className="absolute mt-2 right-0 bg-white border shadow-lg rounded-lg w-48">
            <button
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              onClick={() => navigate("/user/userProfile")}
            >
              👤 Ir al perfil
            </button>
            <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
              🚪 Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
