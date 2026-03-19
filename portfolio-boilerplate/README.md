# Portfolio Boilerplate

A simple React + Tailwind CSS portfolio starter, built to use as the base project for the [AI x Design Bootcamp](../Design%20Bootcamp/README.md).

Use this if you want to skip the Lovable/Figma Make generation in Module 2 and go straight to working with Claude Code. The structure and visual style are intentionally similar to what those tools typically generate.

## Running locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Structure

```
src/
├── App.jsx               # Root component, composes sections
├── index.css             # Tailwind base styles
└── components/
    ├── Nav.jsx           # Fixed navigation bar
    ├── Hero.jsx          # Intro section with CTA
    ├── Projects.jsx      # Project cards (hardcoded — replaced with Supabase in Module 7)
    ├── About.jsx         # Bio and skills
    └── Contact.jsx       # Email link and footer
```

## What to customise first

Before diving into the bootcamp exercises, replace the placeholder text in `Hero.jsx`, `About.jsx`, and `Contact.jsx` with your own name, bio, and email. The projects in `Projects.jsx` get replaced with live Supabase data in Module 7.
