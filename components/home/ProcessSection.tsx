const steps = [
  { title: 'Sourcing the Clay', icon: '01', text: 'Material selected for strength, texture and glaze response.' },
  { title: 'Hand Shaping', icon: '02', text: 'Pieces are formed by hand or wheel with small-batch attention.' },
  { title: 'Kiln Fired', icon: '03', text: 'Heat locks in durability and gives each form its final character.' },
  { title: 'Hand Glazed', icon: '04', text: 'Finishes are applied individually, creating natural variation.' }
]

export function ProcessSection() {
  return (
    <section className="section-pad bg-ivory">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">Our Process</p>
          <h2 className="font-heading text-4xl font-semibold md:text-5xl">From Earth to Everyday Ritual</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          {steps.map((step) => (
            <article key={step.title} className="rounded-lg border border-brown/10 bg-white p-5">
              <span className="font-heading text-4xl font-semibold text-gold">{step.icon}</span>
              <h3 className="mt-3 font-heading text-2xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-text-light">{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
