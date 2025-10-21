const upcomingScenes = [
  {
    title: "Automation constellation",
    description: "Navigate interconnected workflows as a radial graph. Hover to preview metrics, click to deep link into the 2D detail view.",
    status: "In design"
  },
  {
    title: "Run replay",
    description: "Timeline-based playback that blends 3D flow with live log excerpts and guardrail events.",
    status: "Prototype"
  },
  {
    title: "Failure landscape",
    description: "Map ontology clusters in 3D space to spot systemic gaps and hot spots.",
    status: "Planning"
  }
];

export default function ExplorePage() {
  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-slate-800 bg-slate-950/60 p-8">
        <h1 className="text-3xl font-semibold text-slate-100">3D Explorer (preview)</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          This is the progressive enhancement layer. When WebGL is available, Spline and Three.js scenes will load. Otherwise, users see this fast 2D companion with the same navigation.
        </p>
      </header>
      <section className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
        <h2 className="text-xl font-semibold text-slate-100">Fallback mode</h2>
        <p className="mt-2 text-sm text-slate-300">
          If a device disables WebGL or opts into reduced motion, the explorer presents these storyboards and links. Each scene is mirrored as structured content so nothing is lost.
        </p>
        <ul className="mt-4 grid gap-4 md:grid-cols-3">
          {upcomingScenes.map((scene) => (
            <li key={scene.title} className="rounded-2xl border border-slate-800/70 bg-slate-900/50 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{scene.status}</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{scene.title}</p>
              <p className="text-xs text-slate-400">{scene.description}</p>
            </li>
          ))}
        </ul>
      </section>
      <section className="rounded-3xl border border-accent/40 bg-accent/10 p-6 shadow-glow">
        <h2 className="text-xl font-semibold text-accent">Integration checklist</h2>
        <ul className="mt-3 space-y-2 text-sm text-accent/90">
          <li>Embed Spline canvas as lazy-loaded component with feature detection</li>
          <li>Provide keyboard navigation overlay for every spatial interaction</li>
          <li>Stream telemetry overlays via websocket → synchronized 2D summary</li>
        </ul>
      </section>
    </div>
  );
}
