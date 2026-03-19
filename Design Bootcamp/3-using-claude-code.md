# Module 3: Using Claude Code as a Designer

## What You'll Learn
- Clone your repo and open it with Claude Code
- Understand what Claude Code can do that Lovable cannot
- Use /plan mode and basic prompts to start working effectively
- Understand why the pull request is now the design handover

---

## Sub-Module 1: Clone the repo and open in Cursor

### Get the code locally

Clone your GitHub repo from Module 2. If you skipped Module 2, clone the portfolio boilerplate instead:

```bash
# Your generated project
git clone https://github.com/YOUR_USERNAME/YOUR_REPO
cd YOUR_REPO

# Or the boilerplate
git clone https://github.com/YOUR_USERNAME/ai-empowered-development-course
cd ai-empowered-development-course/portfolio-boilerplate
```

Open the folder in Cursor or VSCode:

```bash
cursor .
# or
code .
```

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

### Start Claude Code

Open the integrated terminal in Cursor and start Claude Code:

```bash
claude
```

You will see a prompt. Claude Code is now running inside your project and can see the entire codebase.

### What Claude Code sees that Lovable does not

Lovable operates on a sandboxed copy of your code with no access to external tools or systems. Claude Code has access to:

- Every file in your repo
- Your terminal (it can run commands, install packages, run tests)
- Any MCP servers you have connected (Figma, Supabase, and others covered in later modules)
- The ability to create branches, commit, and open pull requests

The trade-off: Lovable shows you a live preview as you prompt. Claude Code does not. You verify changes by checking the browser yourself. That shift in workflow is worth getting used to: it means you are working directly with the real code, not an abstraction over it.

---

## Sub-Module 2: Claude Code introduction

### Agents vs chat

When you use Claude in a chat interface, it suggests. When you use Claude Code, it acts. It reads files, makes changes, runs commands, and iterates until the task is done.

| Chat | Claude Code |
|------|-------------|
| Suggests a change | Makes the change |
| Single turn | Multi-step reasoning |
| No file access | Reads and writes files |
| No terminal | Runs commands |

Think of Claude Code as a capable frontend engineer you can brief with precision. The more specific your instructions, the more predictable the output. Vague briefs produce generic results, just like in Lovable.

### First prompts to try

Start with orientation. Ask Claude Code to understand the project before you ask it to change anything:

```
Tell me about this project. What are the main components, how do they relate,
and what technologies are being used?
```

Then try a targeted change:

```
Change the primary button colour to #3D5AFE and update every instance across
the codebase. Do not change anything else.
```

Notice: you are being explicit about scope ("do not change anything else"). This matters. Without a clear boundary, agents sometimes "improve" adjacent code that you did not ask them to touch.

### Using /plan mode

Before any change that touches more than one file, use /plan mode. It forces the agent to map out the approach before executing.

```bash
/plan Add a dark mode toggle to the navigation bar. It should persist the user's preference in localStorage. Update all components to respect the dark/light mode.
```

When you use /plan, Claude Code will:
1. Explore the relevant parts of the codebase
2. Propose a step-by-step implementation plan
3. Wait for your approval before making any changes

> [!TIP]
> Spend more time on the plan than on reviewing the implementation. A clear plan produces a clean result. A vague plan produces debugging loops. If the plan looks wrong, fix the plan before approving it.

Review the plan carefully:
- Does it touch the right files?
- Does it miss any component that uses the affected styles?
- Does it match your design intent?

Only approve when the plan is correct. If something is off, tell Claude Code what to change in the plan before proceeding.

### Context window management

Claude Code has a context window: a limit on how much information it can hold at once. Working within that limit keeps output quality high.

Practical rules for now (expanded in Module 6):
- One task per session. Do not pile multiple unrelated changes into a single conversation.
- Use `/clear` between tasks to reset the context.
- When iterating on a specific component, only reference that component and its direct dependencies. Not the whole codebase.

> [!WARNING]
> When the context window fills up with unrelated code and previous conversation history, output quality degrades. You will notice the agent making mistakes it would not have made earlier in the session. That is the signal to use /clear and start fresh.

### Exercise: First prompts and a planned change

1. Run the orientation prompt above. Read what Claude Code tells you about the project structure.

2. Run the button colour change prompt. Verify the change in the browser.

3. Pick one item from your "things to refine" list from Module 2. Use /plan to implement it. Review the plan before approving.

### Acceptance criteria
- [ ] You have run an orientation prompt and can describe the component structure
- [ ] You have made one targeted change with a specific, scoped prompt
- [ ] You have used /plan at least once and reviewed the plan before approving
- [ ] The change from Module 2's list is implemented and visible in the browser

---

## Sub-Module 3: The PR is the new design handover

### The old workflow

The traditional design handover looks like this:
1. Designer creates a Figma file with specs and redlines
2. Developer reads the file and interprets it
3. Some details survive, some get lost, some get misread
4. Designer reviews the implementation and catches regressions
5. Back and forth until it is close enough

The friction point is translation. Design intent lives in Figma. Implementation lives in code. They are separate, and keeping them in sync requires manual effort from both sides.

### The new workflow

When you use Claude Code, design intent lives directly in the code changes. A pull request (PR) is a diff: it shows exactly what changed, line by line. Colours are exact hex values. Spacing is exact pixel values. Accessible markup is either there or it is not.

The PR is not just a code review. It is the handover. Anyone reviewing it can see precisely what was implemented without referring back to a separate Figma file.

Claude Code handles the entire PR workflow automatically:

```
create branch --> make changes --> commit --> push --> open PR
```

You do not run these steps manually. Ask Claude Code to handle them:

```
Implement the hero section refinements we discussed. When done, create a branch
called feature/hero-refinements, commit the changes with a clear message,
and open a pull request.
```

### Automated design QA

The PR workflow becomes even more powerful with automated review. Tools like [CodeRabbit](https://coderabbit.ai) and [Greptile](https://greptile.com) integrate with GitHub and post review comments automatically when a PR is opened.

For design engineers, this is automated design QA. These tools catch:
- Missing `aria-label` attributes on interactive elements
- Colour contrast issues
- Inconsistent spacing or class names
- Patterns that contradict the rest of the codebase

They do not replace your judgment. They surface issues before you have to find them manually.

### Setting up CodeRabbit

1. Go to [coderabbit.ai](https://coderabbit.ai)
2. Click **Add Repository**
3. Authenticate with GitHub and select your portfolio repo
4. Configure: security on, code style on, documentation optional

From this point on, every PR gets an automated review within minutes of opening.

### Exercise: Agent-created PR with automated review

1. Ask Claude Code to implement a feature and open a PR:
   ```
   Add a subtle scroll-to-top button that appears after the user scrolls
   past the hero section. Style it to match the existing button styles.
   Create a branch called feature/scroll-to-top and open a PR when done.
   ```

2. Set up CodeRabbit on the repo (see above).

3. Open the PR on GitHub and wait for the automated review (usually under 2 minutes).

4. Read the review comments. Note what it caught and whether you agree.

5. If it flagged a real issue, ask Claude Code to fix it:
   ```
   The review flagged [specific issue]. Fix it and push an update to the branch.
   ```

### Acceptance criteria
- [ ] Agent creates the branch, commits, and opens a PR without manual git commands
- [ ] CodeRabbit or Greptile is connected to the repo
- [ ] Automated review comments appear on the PR
- [ ] You can describe at least one issue the review raised
- [ ] You understand why the PR replaces Figma redlines as the handover artefact

---

[Previous: Project Creation](2-project-creation.md) | [Next: MCPs](4-mcps.md)
