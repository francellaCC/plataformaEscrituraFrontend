import { useState } from "react";
import { s3Api } from "../services/s3Api";
import type { UserRequest, UserResponse } from "../types/types";

type ProfileConfigModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserRequest) => void;
  initialData?: UserResponse;
}

export default function ProfileConfigModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: ProfileConfigModalProps) {

  const [name, setName] = useState(initialData?.name || "");
  const [profileImage, setProfileImage] = useState<string | null>(initialData?.picture || null);
  const [selectFile, setSelectFile] = useState<File | null>(null)
  const [uploadImagePresigned] = s3Api.useLazyUploadImagePresignedQuery();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectFile(file)
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {

    let picture = initialData?.picture!

    if (selectFile) {
      const { uploadUrl, publicUrl } = await uploadImagePresigned({
        filename: `profiles/${initialData?.id}-${initialData?.nickname}-${selectFile.name}`,
        contentType: selectFile.type,
      }).unwrap()
      const url = new URL(publicUrl);
      const key = url.pathname.startsWith("/") ? url.pathname.substring(1) : url.pathname;
      console.log(key)

      const res = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": selectFile.type },
        body: selectFile
      })
      console.log(res)
      picture = key
    }
    const id = initialData?.id
    console.log("user: ", { id, name, picture })
    onSave({ id, name, picture })
  }
  return (
    <div>
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-xl font-semibold mb-4">Configuración de Perfil</h2>

            {/* Foto de perfil */}
            <div className="flex flex-col items-center gap-2 mb-4">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Foto de perfil"
                  className="w-24 h-24 rounded-full object-cover border"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-3xl font-bold">
                  {name[0]}
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2"
              />
            </div>

            {/* Campos */}
            <div className="mb-4">
              <label className="block text-sm mb-1">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => onClose()}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  handleSubmit(),
                    onClose()
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
