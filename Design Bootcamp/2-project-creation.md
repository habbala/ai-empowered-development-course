# Module 2: Project Creation

## What You'll Learn
- Write an AI-executable specification for your portfolio site
- Use that spec as the initial prompt in Lovable or Figma Make
- Connect your generated project to GitHub

---

## Sub-Module 1: Write your specification

### Why you start with language, not a tool

Every AI generation tool, whether Lovable, Figma Make, or Claude Code, produces output proportional to the quality of its input. A vague prompt gets a generic result. A specific, well-structured prompt gets something you can actually build on.

The specification is the source of truth. Before you open any tool, write down exactly what you want to build. This document will serve three purposes:

1. It forces you to make decisions before they get made for you
2. It becomes the first prompt you paste into Lovable or Figma Make
3. It is the document you return to in Module 8 when you close the loop with research

### What makes a spec AI-executable

| Vague | Specific |
|-------|----------|
| "A portfolio site" | "A single-page portfolio for a product designer, targeting recruiters and design leads at tech companies" |
| "Nice design" | "Minimal, high contrast, generous whitespace. References: Linear.app, stripe.com/jobs" |
| "Show my work" | "Three featured case studies: each has a title, 2-sentence summary, tags, and a link to the full case study" |
| "A contact section" | "A contact section with my email as a mailto link and links to LinkedIn and GitHub" |

The test: could someone else hand this spec to a capable frontend engineer and get back something close to what you imagined? If yes, it is specific enough.

### Spec template

Use this structure. Fill in every section before moving on.

```
## Project
[One sentence: what is this and who is it for]

## Audience
[Who will view this site and what action do you want them to take]

## Sections
[List each section of the page. For each one, describe what it contains and any key interactions]

## Design intent
[Tone, mood, visual references. Include at least one URL reference if you have one.]

## Key interactions
[Any animations, hover states, scroll behaviour, or transitions worth specifying]

## Constraints
[What to exclude. What must remain simple. Any technical requirements.]
```

### Exercise: Write your spec

Fill in the template above for your portfolio site (or your chosen project).

Your spec must include at minimum:
- A clear purpose and audience
- At least four named sections with descriptions
- One visual reference or design intent statement
- One described interaction (not just "hover effects")
- At least one constraint ("no parallax", "single page only", etc.)

Save this as `SPEC.md` in your project root. You will reference it throughout the bootcamp.

### Acceptance criteria
- [ ] Spec covers all six template sections
- [ ] Each section description is specific enough that a developer could implement it without follow-up questions
- [ ] At least one design reference is included
- [ ] Saved as `SPEC.md`

---

## Sub-Module 2: First build in Figma Make or Lovable

### What these tools do

Lovable and Figma Make are natural language-to-UI generators. You describe what you want, and they produce a working frontend. The output is real code (React + Tailwind in most cases), not a mockup.

They are good at:
- Generating a working structure quickly from a description
- Producing clean, readable component code
- Giving you something to react to instead of starting from blank

They are not good at:
- Fine-grained design decisions (spacing, typography details, interaction states)
- Following your existing design system
- Maintaining consistency across many iterations

This is exactly why you migrate to Claude Code. The generator gets you to 60%. Claude Code gets you the rest, with your design intent intact.

### Generate your first build

**Option A: Lovable**

1. Go to [lovable.dev](https://lovable.dev) and create a new project
2. Paste your `SPEC.md` content as the initial prompt
3. Let Lovable generate a first version
4. Review the output. Do not iterate heavily here. Note what to refine later.

**Option B: Figma Make**

1. Open Figma and create a new file
2. Use the Figma Make panel to start a new generation
3. Paste your spec as the initial prompt
4. Review the output

### What to look for in the output

When the first build appears, resist the urge to immediately fix everything in the tool. Instead, note:

- What structure did it choose? Does the section order make sense?
- What did it get right? What is close enough to keep?
- What is clearly wrong or missing? List 2-3 things to address in Claude Code.

These notes become your first Claude Code task list.

### Connect to GitHub

Before you can work on the code locally, the project needs to live in a GitHub repo.

**Lovable**: Settings > GitHub > Connect Repository. Lovable will push the generated code to a new repo under your account.

**Figma Make**: Use the export option to download the project, then create a GitHub repo manually and push:
```bash
git init
git add .
git commit -m "Initial generation from Figma Make"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO
git push -u origin main
```

### Exercise: Generate and connect

1. Paste your spec into Lovable or Figma Make
2. Review the output and note 2-3 things to refine
3. Connect the project to a GitHub repo
4. Confirm commits appear on GitHub

### Acceptance criteria
- [ ] First version of the site is generated and renders correctly in the tool's preview
- [ ] Project is connected to a GitHub repo with at least one commit
- [ ] You have a written list of 2-3 things to refine when you reach Claude Code

---

[Previous: Setup](1-setup.md) | [Next: Using Claude Code as a Designer](3-using-claude-code.md)
