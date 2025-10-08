export default function ChapterNavigation({
  onPrevious,
  onNext,
  disablePrev,
  disableNext,
}: {
  onPrevious: () => void;
  onNext: () => void;
  disablePrev: boolean;
  disableNext: boolean;
}) {
  return (
    <div className="flex justify-between items-center mt-12">
      <button
        onClick={onPrevious}
        disabled={disablePrev}
        className={`px-6 py-2 rounded-lg shadow-sm ${
          disablePrev
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-300 text-gray-800"
        }`}
      >
        ← Capítulo anterior
      </button>

      <button
        onClick={onNext}
        disabled={disableNext}
        className={`px-6 py-2 rounded-lg shadow-sm ${
          disableNext
            ? "bg-gray-300 text-gray-400 cursor-not-allowed"
            : "bg-orange-500 hover:bg-orange-600 text-white"
        }`}
      >
        Siguiente capítulo →
      </button>
    </div>
  );
}
