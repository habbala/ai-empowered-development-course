# Module 6: Working with Context

## What You'll Learn
- Manage context windows to keep agent output quality high
- Write a custom Claude Skill that automates Figma-to-code review
- Create DESIGN.md and AGENTS.md to give agents persistent design memory

---

## Sub-Module 1: Managing context windows

### Why context quality degrades

Every Claude Code session has a context window: a limit on how much information the model can hold and reason over at once. It is not just a hard cutoff. Output quality degrades as the context fills up with unrelated information, previous conversation turns, and code that is not relevant to the current task.

The pattern is predictable: early in a session, the agent is sharp. It follows your instructions precisely, produces clean code, catches edge cases. Later in the same session, after many files have been loaded and many changes discussed, the agent starts making decisions you did not ask for, misreads constraints you specified earlier, or introduces patterns inconsistent with the rest of the codebase.

That degradation is not random. The context has filled up with noise.

> [!WARNING]
> For Claude models, output quality degrades noticeably around 50% of the context window. You will notice it before you hit the hard limit. That is the signal to use /clear and start a fresh session.

### What counts as noise

Noise is anything in the context that is not directly relevant to the current task:
- Code from files that were loaded but are not needed for this change
- Earlier conversation turns from a different task in the same session
- Documentation or error output that has already been resolved
- The full file contents of components you are not currently editing

### Practical rules

**One task per session.** When one task is complete, use `/clear` before starting the next. A session should have a single, focused purpose.

**Reference only what is needed.** When iterating on the Hero component, only load `Hero.jsx` and `index.css`. Not `Projects.jsx`. Not `App.jsx`. Not the full `src/` directory.

**Use /plan before multi-file changes.** Planning upfront reduces the number of exploration steps the agent takes during execution, keeping the context cleaner.

**Recognise the degradation signal.** If the agent starts making unexplained choices or contradicting instructions you gave earlier in the session, do not keep prompting. Use `/clear`, open a fresh session, and re-state the task concisely.

### Design-specific example

You are iterating on the Hero component: adjusting the heading size, tweaking the bio copy layout, and fixing the CTA button focus state.

Session to avoid:
```
[Loaded: Hero.jsx, Projects.jsx, About.jsx, Contact.jsx, tailwind.config.js,
 index.css, App.jsx, previous conversation about the Supabase integration]

Prompt: Fix the focus state on the CTA button in Hero.
```

Session to prefer:
```
[Loaded: Hero.jsx, index.css]
/clear (from previous task)

Prompt: The CTA button in Hero.jsx is missing a visible focus state. Add one
using the accent colour as an outline, 2px offset. Do not change anything else.
```

Same task. Entirely different context quality.

---

## Sub-Module 2: Write a Claude Skill for Figma review

### What a Skill is

In Claude Code, a Skill is a custom slash command you define yourself. It lives in a markdown file and is invoked with `/skill-name`. You can use it to encapsulate a repeatable workflow so you do not have to re-type the same instructions each time.

Skills are stored in your project's `.claude/skills/` directory. Claude Code loads them automatically at startup.

### The Skill we will build: /figma-review

This Skill, when invoked, will:
1. Use the Figma MCP to read a specified frame or component from your design file
2. Read the corresponding component file in the repo
3. Compare them for discrepancies: spacing, colours, missing states, missing accessibility attributes
4. Report the findings

**Requires**: Figma MCP from Module 4 must be installed and connected.

**Suggested use**: run `/figma-review` before every PR. It catches design drift before it reaches review, which ties directly back to the PR-as-handover workflow from Module 3.

### Writing the Skill

Create the file `.claude/skills/figma-review.md`:

```markdown
# figma-review

Review a component in the repo against its Figma counterpart.

## Usage
/figma-review <figma-frame-url> <component-file-path>

## Instructions
1. Use the Figma MCP to read the frame at the provided URL.
   Retrieve: fill colours, typography, spacing values, border radii, and any
   variant or state definitions present in the frame.

2. Read the component file at the provided path.

3. Compare the two. For each property, note whether the implementation matches
   the Figma frame. Flag any of the following:
   - Colour values that differ from the Figma fills
   - Font sizes, weights, or line heights that do not match the Figma text styles
   - Spacing or padding that differs from the Figma auto-layout values
   - States present in Figma (hover, focus, disabled) that are missing in the code
   - Missing aria attributes on interactive elements visible in the Figma frame

4. Return a structured report:
   - Matching: list of properties that are correctly implemented
   - Discrepancies: list of properties that differ, with the Figma value and the
     current code value side by side
   - Missing: list of states or attributes present in Figma but absent in the code

Do not make any changes. Only report.
```

### Using the Skill

After creating the file, restart Claude Code. The skill is now available:

```bash
/figma-review https://figma.com/file/.../FrameName src/components/Hero.jsx
```

Claude Code reads the Figma frame via the MCP, reads the file, and returns the comparison report.

### Exercise: Write and run /figma-review

1. Create `.claude/skills/figma-review.md` with the content above.

2. Restart Claude Code and verify the skill loads:
   ```bash
   /skills
   ```
   You should see `figma-review` listed.

3. Introduce a deliberate discrepancy: in `Hero.jsx`, change the CTA button colour to a value that does not match the Figma design file.

4. Run the Skill:
   ```bash
   /figma-review [figma-frame-url] src/components/Hero.jsx
   ```

5. Verify: the report flags the colour discrepancy you introduced.

6. Revert the change and run the Skill again. Confirm the report shows no discrepancies.

### Acceptance criteria
- [ ] Skill file created at `.claude/skills/figma-review.md`
- [ ] Claude Code recognises `/figma-review` after restart
- [ ] Skill successfully reads the Figma frame via MCP
- [ ] Deliberate discrepancy is detected and reported
- [ ] Report distinguishes between matching properties and discrepancies
- [ ] You understand how to use this before every PR

---

## Sub-Module 3: DESIGN.md and AGENTS.md

### The memory problem

Agents have no memory between sessions. Every time you start a new Claude Code session, it starts fresh. It does not remember that you decided to use a 4px base spacing unit, that all CTAs should use the `accent` colour token (never a raw hex value), or that the mobile breakpoint for this project is 640px not 768px.

Without written documentation, every session risks the agent reverting to its own defaults. You will find yourself correcting the same decisions repeatedly.

The solution is simple: write down your decisions in files the agent reads automatically. This is not documentation for humans. It is documentation for agents.

### DESIGN.md

`DESIGN.md` codifies your design decisions for this specific project. Anything you would correct an agent for doing wrong belongs here.

Example for the portfolio site:

```markdown
# Design Guidelines

## Colour
- Primary accent: use the Tailwind `accent` class or `text-accent`/`bg-accent`. Never use raw hex values.
- Backgrounds: `bg-stone-50` for page background, `bg-white` for cards and surfaces
- Text: `text-stone-900` for primary, `text-stone-500` for secondary, `text-stone-400` for muted

## Typography
- Headings: `font-bold`, sizes from the Tailwind scale only (`text-3xl`, `text-5xl`, etc.)
- Body: `leading-relaxed` on all paragraph text
- Labels and tags: `text-sm` or `text-xs`, never smaller

## Spacing
- Section padding: `py-24` vertical, `px-6` horizontal
- Content max-width: `max-w-5xl mx-auto`
- Gap between cards: `gap-6`
- Do not use arbitrary spacing values like `mt-[18px]`

## Components
- All primary CTAs use the `<Button>` component. Never style a plain `<a>` tag to look like a button.
- All external links open in a new tab with `rel="noopener noreferrer"`

## Accessibility
- All interactive elements must have a visible focus state
- Minimum contrast ratio: 4.5:1 for normal text, 3:1 for large text
- All images must have descriptive `alt` attributes
- Icon-only buttons must have an `aria-label`
```

### AGENTS.md

`AGENTS.md` defines how agents should behave when working in this repo. Scope, workflow, and process rules.

Example:

```markdown
# Agent Guidelines

## Branch and commit
- Always create a feature branch before making changes. Never commit directly to main.
- Branch naming: `feature/short-description` or `fix/short-description`
- Commit messages: imperative mood, specific ("Add focus state to CTA button", not "Update Hero")

## Scope
- When asked to change a component, only modify that component unless you have explicit
  permission to touch others.
- Do not refactor code that is not directly related to the task.
- Do not add dependencies without asking first.

## Design tokens
- Never use raw hex, rgb, or hsl values in components. Always use Tailwind token classes.
- If a required colour is not in tailwind.config.js, stop and ask before proceeding.

## Before opening a PR
- Run /figma-review on any component you modified
- Ensure all changed components have visible focus states
```

### Connecting the files to Claude Code

Add a `CLAUDE.md` file at the root of your project that tells Claude Code to read both files at the start of every session:

```markdown
# Project context

Before starting any task in this repo, read:
- DESIGN.md: design decisions and token rules for this project
- AGENTS.md: workflow and scope rules for agents

Follow both files strictly. If a task would require violating a rule in either file,
stop and ask before proceeding.
```

### Exercise: Write DESIGN.md and test it

1. Create `DESIGN.md` with at least 4 concrete rules covering colour, typography, spacing, and accessibility.

2. Create `AGENTS.md` with at least 3 rules covering branching, scope, and tokens.

3. Create `CLAUDE.md` pointing to both files.

4. Start a new Claude Code session (use `/clear` or open a fresh terminal).

5. Without mentioning any design rules, ask Claude Code to add a new testimonial section to the page:
   ```
   Add a simple testimonials section between About and Contact. It should
   contain two short quotes with the speaker's name and role.
   ```

6. Review the output. Verify that:
   - It uses token classes, not raw hex values
   - It follows the spacing rules from DESIGN.md
   - It created a feature branch before making changes (AGENTS.md rule)

### Acceptance criteria
- [ ] DESIGN.md written with at least 4 concrete, specific rules
- [ ] AGENTS.md written with at least 3 workflow rules
- [ ] CLAUDE.md created and references both files
- [ ] New testimonials section follows DESIGN.md rules without being reminded
- [ ] Agent created a feature branch (AGENTS.md rule followed automatically)
- [ ] You can explain how this scales: a team where every agent follows the same rules

---

[Previous: Safety and Guidelines](5-safety-and-guidelines.md) | [Next: Research, Discovery and Roadmapping](7-research-discovery-roadmapping.md)
