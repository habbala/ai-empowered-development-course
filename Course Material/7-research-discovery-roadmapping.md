# Module 8: Research, Discovery and Roadmapping

## What You'll Learn
- Understand why code-connected agents produce more useful research output than disconnected ones
- Use Claude Code to analyse user feedback against the actual codebase
- Generate actionable GitHub issues and a revised spec from research insights

---

## Sub-Module 1: Code-connected agents vs disconnected agents

### The limitation of disconnected AI tools

When you paste user feedback into ChatGPT or Claude.ai's web interface, you get output. It is often well-structured, thoughtful, and useful as a starting point. But it has a fundamental limitation: the model has no idea what your product actually looks like, how it is built, or what changing it would involve.

The output is generic. It could apply to any product. It cannot tell you:
- Which file contains the navigation that users are complaining about
- Whether the reported bug is in a 15-line component or a 300-line one
- What the downstream impact of a proposed change would be
- What a realistic implementation looks like given your current stack

This matters because vague research output creates vague roadmaps. "Improve navigation" is not a ticket. It is a wish.

### What changes when the agent knows the codebase

Claude Code, running inside your project, has a different starting point. When you give it user feedback, it can:

- Map complaints to specific files and components
- Assess effort based on the actual code, not assumptions
- Identify which changes are isolated and which have ripple effects
- Generate GitHub issues with file references and implementation sketches
- Draft a revised spec in the exact format you used in Module 2

The difference is not just speed. It is relevance. An agent that knows your codebase is reasoning about your actual product, not a hypothetical one.

### A concrete comparison

**Disconnected agent output** (same feedback, no codebase context):

```
Issue: Navigation usability
Priority: High
Description: Users are struggling with navigation. Consider simplifying the
menu structure and improving visual hierarchy.
Effort: Unknown
```

**Claude Code output** (same feedback, with your repo):

```
Issue: Navigation link contrast fails WCAG AA at mobile viewport
File: src/components/Nav.jsx (line 8-18)
Priority: High
Effort: Low (single CSS change, no logic affected)
Description: The nav links use `text-stone-600` on a `bg-stone-50/90` background.
At small sizes this fails 4.5:1 contrast. Changing to `text-stone-700` resolves it
without touching the layout.
Suggested change: Update className on line 12 from `text-stone-600` to `text-stone-700`.
```

One is a direction. The other is a ticket.

### Closing the loop to Module 2

The output of this module feeds directly back to where you started. Research insights, once structured, become a revised specification. That spec becomes the input for the next iteration, whether in Claude Code or in Lovable for a more substantial redesign.

The full cycle:

```
Spec (Module 2)
  --> Build (Modules 2-7)
  --> Ship
  --> Research feedback (Module 8)
  --> Revised spec (Module 8)
  --> Next iteration
```

This is the design engineer workflow. AI does not replace the cycle. It makes each step faster and more precise.

---

## Key takeaways

| Concept | Remember |
|---------|----------|
| **Disconnected limit** | No codebase context means generic, effort-unknown output |
| **Code-connected advantage** | File references, effort estimates, and actionable tickets from the same session |
| **Research as input** | Feedback structured by Claude Code maps directly to your actual product |
| **Closing the loop** | Revised spec from Module 8 feeds the next iteration in Module 2 |

---

## Exercise: Compare and act

| | |
|---|---|
| **Goal** | Experience the difference between disconnected and code-connected research analysis |
| **Concepts** | Code-connected reasoning, actionable ticket generation, spec revision |

### Sample feedback

Use this set of user feedback for the exercise. It is written about a portfolio site, so it will map to your actual components.

```
Feedback 1 (usability session, participant 1):
"The navigation links are hard to read on my laptop screen. I had to lean in to
see them. Also I couldn't tell which section I was in as I scrolled."

Feedback 2 (support message):
"I clicked the contact email link and nothing happened on my phone. Turns out
my default mail app wasn't set up, but I had no idea the link was going to
open an app. I just wanted a form."

Feedback 3 (usability session, participant 2):
"The project cards are hard to compare side by side. I didn't notice the tags
at first. I kept wanting to sort by something but there was no way to do that."

Feedback 4 (usability session, participant 3):
"I couldn't find a CV or resume anywhere. I assumed there would be one. The
about section was good but I wanted more professional background detail."

Feedback 5 (usability session, participant 4):
"The site loaded really fast. I liked the clean look. The only thing was that
I wasn't sure the project links were clickable -- they didn't look like links."
```

### Steps

1. **Run the feedback through a disconnected tool first**:

   Open [claude.ai](https://claude.ai) or ChatGPT (not Claude Code). Paste the 5 feedback items and ask:
   ```
   Analyse this user feedback for a portfolio site. Categorise each item,
   assign a priority, estimate effort, and suggest a fix.
   ```

   Save the output. Note what is missing: file references, specific estimates, codebase-specific suggestions.

2. **Run the same feedback through Claude Code**:

   Open a Claude Code session with your portfolio project. Paste the same 5 feedback items and ask:
   ```
   Analyse this user feedback for this portfolio site. For each item:
   - Map it to the relevant file and component in this repo
   - Categorise it (accessibility, usability, missing feature, performance, copy)
   - Assign a priority (High / Medium / Low)
   - Estimate effort based on what you can see in the code (Low / Medium / High)
   - Suggest a specific fix with file and line references where possible
   ```

3. **Compare the outputs side by side**:

   - Which output references actual files?
   - Which gives meaningful effort estimates?
   - Which suggestions could you hand directly to a developer (or Claude Code) as a ticket?
   - Which output would you trust more for prioritisation decisions?

4. **Generate GitHub issues**:

   Ask Claude Code to turn the top 2 priority items into GitHub issues:
   ```
   Take the top 2 priority items from the analysis and create GitHub issues for them.
   Each issue should include: a clear title, description of the problem, the affected
   file and component, a suggested implementation approach, and acceptance criteria.
   ```

   Create the issues on GitHub (Claude Code can do this if the GitHub MCP is installed,
   or copy the content into GitHub manually).

5. **Draft a revised spec section**:

   Ask Claude Code to update one section of your `SPEC.md` based on the research:
   ```
   Based on the feedback analysis, update the Contact section of SPEC.md to
   reflect what users actually need. The current spec says [paste your current
   contact section]. Revise it to address the feedback about the email link
   and the lack of a contact form.
   ```

   This revised spec section is the input for the next iteration.

### Acceptance criteria
- [ ] Same feedback run through both a disconnected tool and Claude Code
- [ ] Outputs documented side by side with notes on what differs
- [ ] You can articulate why the code-connected output is more actionable
- [ ] At least 2 GitHub issues created with file references and acceptance criteria
- [ ] One section of SPEC.md revised based on the research findings
- [ ] You understand how this output feeds back into Module 2's workflow

### Reflection questions

After completing this exercise, consider:

- How long would it take to manually map these 5 feedback items to specific files in the codebase?
- If you had 50 feedback items instead of 5, which approach scales better?
- What would you do differently in the spec if you ran this exercise before building instead of after?
- How would you bring the revised spec back into Lovable or a new Claude Code session for the next iteration?

---

[Previous: Working with Context](6-working-with-context.md) | [Next: Supabase CMS](8-supabase-cms.md)
