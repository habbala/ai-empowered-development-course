export default function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-stone-50/90 backdrop-blur border-b border-stone-200">
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="font-semibold text-stone-900 hover:text-accent transition-colors">
          Your Name
        </a>
        <ul className="flex items-center gap-8">
          <li>
            <a href="#work" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">
              Work
            </a>
          </li>
          <li>
            <a href="#about" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">
              About
            </a>
          </li>
          <li>
            <a href="#contact" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
