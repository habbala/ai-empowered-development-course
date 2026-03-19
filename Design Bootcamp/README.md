# AI x Design Bootcamp

Welcome to the AI x Design Bootcamp. This course is built for design engineers: people who think in components, interactions, and systems, and who are comfortable enough in code to build what they design.

The bootcamp covers the full workflow, from writing a specification in plain language, to generating a first build with an AI UI tool, to refining and shipping with Claude Code. Along the way you will connect your design files directly to your codebase, manage a real content backend, and close the loop by feeding user research back into product decisions.

The default project is a portfolio site. Most designers have designed one before, which means you already have opinions about what good looks like. That makes it a good vehicle for practising AI-assisted development without getting distracted by an unfamiliar domain. You are free to use any project you like instead.

---

## Before you start

You will need:
- A GitHub account
- A Figma account (for Modules 4 and 5)
- A Supabase account (for Module 7)
- Node.js 18 or later installed locally

Module 1 covers the rest of the setup.

---

## Course structure

| Module | Title | Time |
|--------|-------|------|
| [1. Setup](1-setup.md) | Install Claude Code, Cursor, and set up GitHub | ~15 min |
| [2. Project Creation](2-project-creation.md) | Write a spec, generate your first build in Lovable or Figma Make | ~30 min |
| [3. Using Claude Code as a Designer](3-using-claude-code.md) | Migrate to Claude Code, learn the basics, introduce the PR as design handover | ~45 min |
| [4. MCPs](4-mcps.md) | Understand MCPs, install Figma MCP, align your repo with your design tokens | ~30 min |
| [5. Safety and Guidelines](5-safety-and-guidelines.md) | SafetyNet, sandboxing, and custom rules for autonomous agents | ~20 min |
| [6. Working with Context](6-working-with-context.md) | Context window management, write a Figma review skill, create DESIGN.md | ~45 min |
| [7. Research, Discovery and Roadmapping](7-research-discovery-roadmapping.md) | Use Claude Code for user research analysis and roadmapping | ~30 min |
| [8. Supabase CMS](8-supabase-cms.md) | Replace hardcoded content with a live Supabase backend | ~30 min |

---

## Skipping the generation step

If you want to jump straight to Claude Code without going through Lovable or Figma Make, use the included [portfolio-boilerplate](../portfolio-boilerplate/). It is a React + Tailwind CSS starter that looks similar to what those tools generate. Clone it, run it locally, and pick up at Module 3.

---

## Narrative arc

Each module builds on the previous one. The arc looks like this:

```
Spec (Module 2) --> First build (Module 2) --> Claude Code (Module 3)
     |                                               |
     |                                         Design tokens (Module 4)
     |                                               |
     |                                         Safety rules (Module 5)
     |                                               |
     |                                         Context habits (Module 6)
     |                                               |
     |                                         Live content (Module 7)
     |                                               |
     +--- Revised spec <-- Research insights (Module 8)
```

Module 8 closes the loop: research insights become a revised spec, which feeds the next iteration. That cycle is the core of the design engineer workflow.
