import { useNavigate } from "react-router-dom";
import BollywoodCard from "../components/bollywood/BollywoodCard.jsx";

const fake = [
  { title: "Star couple spotted at airport", tag: "Trending" },
  { title: "New teaser breaks internet", tag: "Exclusive" },
  { title: "Top 10 Bollywood songs this week", tag: "Music" },
];

export default function BollywoodHome() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
     <header className="px-4 py-4 border-b border-white/10 flex items-center justify-between">
  <div className="text-lg font-semibold tracking-wide">BollywoodBuzz</div>

  {/* hidden dot: BIG clickable area, tiny visible dot */}
  <button
    aria-label="hidden"
    onClick={() => nav("/secret")}
    className="h-10 w-10 flex items-center justify-center rounded-full"
    style={{ WebkitTapHighlightColor: "transparent" }}
  >
    <span className="w-3 h-3 rounded-full bg-white/10" />
  </button>
</header>

      <main className="px-4 py-5 space-y-3">
        <div className="rounded-2xl p-4 bg-white/5 border border-white/10">
          <div className="text-sm text-white/70">Top Story</div>
          <div className="text-xl font-semibold mt-1">
            Box office clash this Friday — insiders react
          </div>
          <div className="text-sm text-white/60 mt-2">
            Rumors, reactions, and what it means for the weekend numbers.
          </div>
        </div>

        <div className="grid gap-3">
          {fake.map((a) => (
            <BollywoodCard key={a.title} title={a.title} tag={a.tag} />
          ))}
        </div>
      </main>
    </div>
  );
}