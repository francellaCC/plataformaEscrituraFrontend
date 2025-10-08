export default function ChapterSelector({
  chapters,
  currentChapterId,
  onSelect,
}: {
  chapters: { idChapter: number; title: string }[];
  currentChapterId: number | null;
  onSelect: (id: number) => void;
}) {
  return (
    <select
      value={currentChapterId || ""}
      onChange={(e) => onSelect(Number(e.target.value))}
      className="border rounded-lg px-3 py-1 w-48"
    >
      {chapters.map((chapter, index) => (
        <option key={chapter.idChapter} value={chapter.idChapter}>
          {index + 1}. {chapter.title}
        </option>
      ))}
    </select>
  );
}
