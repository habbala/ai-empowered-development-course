const projects = [
  {
    id: 1,
    title: 'Design System',
    description:
      'Built a component library from scratch, covering 40+ components with full Figma and React implementations.',
    tags: ['Design Systems', 'React', 'Figma'],
    url: '#',
  },
  {
    id: 2,
    title: 'Mobile App Redesign',
    description:
      'Led the UX redesign of a fintech app, reducing task completion time by 30% through simplified information architecture.',
    tags: ['UX Research', 'Interaction Design', 'Prototyping'],
    url: '#',
  },
  {
    id: 3,
    title: 'Checkout Flow',
    description:
      'Redesigned and implemented a multi-step checkout, cutting drop-off rate in half with clearer progress and error states.',
    tags: ['UX', 'Frontend', 'A/B Testing'],
    url: '#',
  },
]

export default function Projects() {
  return (
    <section id="work" className="py-24 border-t border-stone-200">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-stone-900 mb-12">Selected work</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <a
              key={project.id}
              href={project.url}
              className="group block bg-white border border-stone-200 rounded-xl p-6 hover:border-accent transition-colors"
            >
              <div className="w-full aspect-video bg-stone-100 rounded-lg mb-5" />
              <h3 className="font-semibold text-stone-900 mb-2 group-hover:text-accent transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-stone-500 mb-4 leading-relaxed">
                {project.description}
              </p>
              <ul className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <li
                    key={tag}
                    className="text-xs bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
