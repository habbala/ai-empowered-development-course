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

## Sub-Module 2: Design QA skills

### What a Skill is

In Claude Code, a Skill is a custom slash command you define yourself. It lives in a markdown file and is invoked with `/skill-name`. You can use it to encapsulate a repeatable workflow so you do not have to re-type the same instructions each time.

Skills are stored in your project's `.claude/skills/` directory. Claude Code loads them automatically at startup.

In this sub-module you will write two skills that together form a design QA checklist you run before every PR:

- `/figma-review`: checks design fidelity against the Figma source file
- `/a11y-check`: audits a component for WCAG 2.1 AA accessibility issues

Running both before opening a PR is the equivalent of a design review and an accessibility audit, without a separate meeting.

---

### Skill 1: /figma-review

**Requires**: Figma MCP from Module 4 must be installed and connected.

The skill reads a Figma frame via MCP and compares it against a component file. It focuses on what the Figma MCP can reliably return: named colour styles, text styles, and variant/state definitions. It does not attempt to pixel-match spacing values, which the MCP cannot return with enough precision to be useful.

Create `.claude/skills/figma-review.md`:

```markdown
# figma-review

Check a component against its Figma source for design token and state drift.

## Usage
/figma-review <figma-frame-url> <component-file-path>

## Instructions

1. Use the Figma MCP to read the frame at the provided URL.
   Retrieve: named fill styles, named text styles, and any component variants
   or interactive states (hover, focus, disabled, active) defined in the frame.
   If a property cannot be retrieved, note it as "unverifiable via MCP" rather
   than skipping it.

2. Read the component file at the provided path.

3. Compare what the MCP returned against the code. Flag:
   - Colour values in the code that are raw hex, rgb, or hsl instead of a
     named Tailwind token. List the Figma style name alongside the raw value found.
   - Font size, weight, or line height values in the code that do not match
     a named text style from the Figma frame.
   - Interactive states present in Figma (hover, focus, disabled) that have no
     corresponding CSS or className in the code.
   - Interactive elements in the frame that are missing aria-label, aria-expanded,
     or other ARIA attributes in the code.

4. Return a structured report with three sections:
   - Matching: properties correctly implemented
   - Discrepancies: properties that differ, showing the Figma style name and
     the current code value side by side
   - Unverifiable: properties the MCP could not return (note what to check manually)

Do not make any changes. Only report.
```

---

### Skill 2: /a11y-check

This skill audits a component file for WCAG 2.1 AA issues. It does two things: automatic checks it can run by reading the code, and a structured manual checklist it outputs for you to complete in the browser.

The split matters. Automated checks catch what is visible in code (missing labels, wrong elements, outline removed). Manual checks catch what only a browser can reveal (focus order, contrast ratios, screen reader announcements).

Create `.claude/skills/a11y-check.md`:

```markdown
# a11y-check

Audit a component for WCAG 2.1 AA accessibility issues.

## Usage
/a11y-check <component-file-path>

## Instructions

Read the component file. Run all automatic checks below, then output the
manual checklist.

### Automatic checks

**Semantic HTML**
- Flag any div or span with an onClick handler that is missing a role attribute
  and keyboard event handlers (onKeyDown or onKeyUp).
- Flag any `<a>` tag used as a button (no href, or href="#"). It should be a
  `<button>` element.
- Flag any `<button>` used as a link (navigates to a URL). It should be an `<a>`.
- Flag any `<img>` missing an alt attribute.
- Flag any `<img>` with a non-empty alt that appears decorative (e.g. icons,
  background illustrations). These should use alt="" or aria-hidden="true".
- Flag any `<input>` or `<textarea>` that has no associated label (via htmlFor/id,
  aria-label, or aria-labelledby).
- Flag any heading level skip (e.g. h2 followed by h4 with no h3).

**ARIA**
- Flag any icon-only button (text content is only an icon or empty) that is
  missing an aria-label.
- Flag any button that toggles visibility (show/hide, open/close) that is
  missing aria-expanded.
- Flag any tabIndex value greater than 0.

**Focus**
- Flag any instance of `outline: none`, `outline: 0`, or `outlineStyle: none`
  that is not accompanied by a custom :focus-visible replacement style.

**Colour and motion**
- List every hardcoded colour value found (hex, rgb, hsl, or named colours
  other than inherit, transparent, or currentColor). These cannot be
  contrast-checked automatically but must be verified manually.
- Flag any CSS animation or transition defined without a corresponding
  @media (prefers-reduced-motion) rule.

### Manual checklist

After the automatic findings, output this checklist exactly:

---
**Manual checks — complete these in the browser:**

Keyboard navigation:
- [ ] Tab through the component from top to bottom. Does focus move in a
      logical, predictable order?
- [ ] Can every interactive element (links, buttons, inputs) be activated
      with Enter or Space?
- [ ] Is focus always visible? Does it disappear at any point?
- [ ] If the component has a modal, dropdown, or popover: can you open,
      navigate, and close it using only the keyboard?

Colour contrast (use browser DevTools > Accessibility, or the free
Colour Contrast Analyser app):
- [ ] Normal text (below 18pt regular / 14pt bold): minimum ratio 4.5:1
- [ ] Large text (18pt+ regular / 14pt+ bold): minimum ratio 3:1
- [ ] UI components and focus indicators against adjacent colours: minimum 3:1
- [ ] Check each hardcoded colour listed in the automatic report above.

Zoom and reflow:
- [ ] Set browser zoom to 200%. Is all content readable and usable without
      horizontal scrolling?
- [ ] Set browser zoom to 400%. Does the layout reflow without loss of content?

Screen reader (VoiceOver on Mac: Cmd + F5 to toggle):
- [ ] Navigate through the component with VoiceOver. Is every interactive
      element announced with a meaningful name and role?
- [ ] Are decorative images skipped (silent when navigating past them)?
- [ ] If the component has loading or error states: are they announced when
      they appear?

Motion:
- [ ] Enable Reduce Motion (System Settings > Accessibility > Motion).
      Do animations and transitions stop or simplify?
---

### Report format
Return findings in three sections:
- Passed: checks the component passes
- Failures: issues found, with the line reference and a suggested fix
- Manual checklist: the checklist above for the participant to complete
```

---

### Exercise: Write both skills and run them

1. Create `.claude/skills/figma-review.md` and `.claude/skills/a11y-check.md` with the content above.

2. Restart Claude Code and verify both skills load:
   ```bash
   /skills
   ```
   Both `figma-review` and `a11y-check` should appear.

3. Introduce a deliberate accessibility issue in `Hero.jsx`: remove the `aria-label` from the CTA link and remove the focus outline from the button.

4. Run `/a11y-check` on Hero.jsx:
   ```bash
   /a11y-check src/components/Hero.jsx
   ```
   Verify it catches both issues in the automatic section. Work through the manual checklist in your browser.

5. Fix the issues Claude Code flagged, then run `/a11y-check` again. Confirm the automatic failures are resolved.

6. Run `/figma-review` on the same component:
   ```bash
   /figma-review [figma-frame-url] src/components/Hero.jsx
   ```
   Note what it can verify automatically vs what is listed as unverifiable.

### Acceptance criteria
- [ ] Both skill files created and listed by `/skills`
- [ ] `/a11y-check` correctly flags the missing aria-label and removed focus outline
- [ ] Manual checklist is completed in the browser for at least one component
- [ ] `/figma-review` runs and returns a structured report (matching / discrepancies / unverifiable)
- [ ] You understand which checks are automatic and which require a browser
- [ ] You understand why running both before a PR is more reliable than a manual review alone

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
