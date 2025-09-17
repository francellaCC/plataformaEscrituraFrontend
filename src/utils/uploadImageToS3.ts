// 🔹 Subida a S3 usando key
export async function uploadImageToS3(
  file: File,
  key: string,
  getPresignedUrl: (args: { filename: string; contentType: string }) => Promise<{ uploadUrl: string }>
) {
  const { uploadUrl } = await getPresignedUrl({ filename: key, contentType: file.type });

  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!res.ok) throw new Error(`Failed to upload ${key} to S3. Status: ${res.status}`);

  return key; // 🔹 Guardamos solo el key, no la URL
}