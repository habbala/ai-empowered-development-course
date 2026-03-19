export default function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-16">
      <div className="max-w-5xl mx-auto px-6 py-24">
        <p className="text-sm font-medium text-accent uppercase tracking-widest mb-6">
          Design Engineer
        </p>
        <h1 className="text-5xl sm:text-6xl font-bold text-stone-900 leading-tight mb-6">
          Your Name
        </h1>
        <p className="text-xl text-stone-500 max-w-xl mb-10 leading-relaxed">
          I design and build digital products. Currently focused on design systems,
          interaction design, and the overlap between code and craft.
        </p>
        <a
          href="#work"
          className="inline-block bg-accent text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors focus-visible:outline-accent"
        >
          See my work
        </a>
      </div>
    </section>
  )
}
