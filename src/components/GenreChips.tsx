const MOODS = [
  { emoji: "🔥", label: "Trending", genre: "" },
  { emoji: "💥", label: "Action", genre: "28" },
  { emoji: "😂", label: "Comedy", genre: "35" },
  { emoji: "😱", label: "Horror", genre: "27" },
  { emoji: "💕", label: "Romance", genre: "10749" },
  { emoji: "🔬", label: "Sci-Fi", genre: "878" },
  { emoji: "🎭", label: "Drama", genre: "18" },
  { emoji: "🕵️", label: "Thriller", genre: "53" },
  { emoji: "✨", label: "Animation", genre: "16" },
  { emoji: "🇧🇩", label: "Bangla", genre: "bangla" },
];

interface GenreChipsProps {
  activeGenre: string;
  onSelect: (genre: string) => void;
}

export default function GenreChips({ activeGenre, onSelect }: GenreChipsProps) {
  return (
    <div className="flex gap-2.5 overflow-x-auto pb-5 px-[4%] hide-scrollbar">
      {MOODS.map((m) => (
        <button
          key={m.label}
          onClick={() => onSelect(m.genre)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-[7px] rounded-full text-[13px] font-semibold border transition-all whitespace-nowrap active:scale-[0.96] ${
            activeGenre === m.genre
              ? "bg-primary/10 border-primary/40 text-primary"
              : "bg-surface2 border-border text-text-secondary hover:border-foreground/15 hover:text-foreground hover:bg-surface3"
          }`}
        >
          <span className="text-base">{m.emoji}</span>
          {m.label}
        </button>
      ))}
    </div>
  );
}
