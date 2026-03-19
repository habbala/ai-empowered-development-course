const skills = [
  'Figma',
  'React',
  'Design Systems',
  'UX Research',
  'Interaction Design',
  'Tailwind CSS',
  'Prototyping',
  'Accessibility',
]

export default function About() {
  return (
    <section id="about" className="py-24 border-t border-stone-200">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-bold text-stone-900 mb-6">About</h2>
            <p className="text-stone-500 leading-relaxed mb-4">
              I work at the intersection of design and engineering, building products
              that are both well-considered and well-built. I care about the details
              that make interfaces feel right: spacing, motion, feedback, and the
              moments between states.
            </p>
            <p className="text-stone-500 leading-relaxed">
              Previously at [Company]. Currently open to new opportunities.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-stone-900 uppercase tracking-widest mb-6">
              Skills
            </h3>
            <ul className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <li
                  key={skill}
                  className="text-sm bg-stone-100 text-stone-700 px-3 py-1.5 rounded-full"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
