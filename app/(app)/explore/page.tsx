const upcomingScenes = [
  {
    title: "Govern",
    description: "When a micro-automation idea is generated from the Idea Generation Subsystem, operators will use an Intake Form to submit to the Deepcurrents Leadership for review.",
    status: "In Progress"
  },
  {
    title: "Design & build",
    description: "Program Increment (PI) Planning",
    status: "Prototype"
  },
  {
    title: "Accelerate",
    description: "",
    status: "Planning"
  }
];

export default function ExplorePage() {
  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-slate-800 bg-slate-950/60 p-8">
        <h1 className="text-3xl font-semibold text-slate-100">Micro-Automation System Development (preview)</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Identify (through processing mining, user input, data-driven signals) and enable (ideas, automaters+operators) automation with speed, precision and scale leading to zero touch, zero defect, real-time, highly efficient delivery of solutions/products.
        </p>
      </header>
      <section className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
        <h2 className="text-xl font-semibold text-slate-100">Outstanding Items/Questions</h2>
        <p className="mt-2 text-sm text-slate-300">
          Currently outstanding items that are TBD
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
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </section>
    </div>
  );
}

