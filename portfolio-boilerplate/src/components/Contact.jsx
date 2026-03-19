export default function Contact() {
  return (
    <section id="contact" className="py-24 border-t border-stone-200">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-stone-900 mb-4">Get in touch</h2>
        <p className="text-stone-500 mb-8 max-w-md leading-relaxed">
          Open to freelance projects, full-time roles, and interesting collaborations.
          The best way to reach me is by email.
        </p>
        <a
          href="mailto:hello@yourname.com"
          className="inline-block bg-accent text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          hello@yourname.com
        </a>
      </div>
      <div className="max-w-5xl mx-auto px-6 mt-24 pt-8 border-t border-stone-200">
        <p className="text-sm text-stone-400">
          &copy; {new Date().getFullYear()} Your Name
        </p>
      </div>
    </section>
  )
}
