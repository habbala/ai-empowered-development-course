# Module 5: Safety and Guidelines

## What You'll Learn
- Understand why autonomous agents need guardrails
- Install SafetyNet to prevent destructive operations
- Configure custom rules for your project

---

## The problem: autonomous agents can cause real damage

You have been using Claude Code in a relatively supervised way: reviewing plans before approving, watching changes happen in real time. But agents can also run in fully autonomous mode, executing a sequence of commands without pausing for confirmation.

Consider what happens if an agent in autonomous mode runs `git push --force` to main, or `git reset --hard` to undo three hours of work, or `rm -rf` on a directory it misidentified. The damage happens before you notice. There is no undo.

For design engineers, there is an additional dimension of risk. A shared component like a `Button` used in 40 places across a design system is not just a file. It is a dependency for every screen that references it. An agent that modifies it incorrectly during an autonomous refactor can silently break every UI that depends on it, without a single test failing if you do not have visual regression coverage.

> [!WARNING]
> Autonomous agents execute commands immediately. Without guardrails, a single bad decision can destroy a codebase or corrupt a design system. Guardrails are not optional for production workflows.

---

## The solution: two layers of protection

### Layer 1: Sandboxing

```bash
/sandbox
```

Sandboxing is the basic layer. It restricts file access and limits which commands can run. Better than nothing, but it does not understand command intent. An agent can bypass pattern-based restrictions with slightly different syntax.

Full documentation: [Sandbox Documentation](https://docs.anthropic.com/en/docs/claude-code/sandbox)

### Layer 2: SafetyNet

SafetyNet is the recommended approach. The key difference from sandboxing: SafetyNet understands what a command *does*, not just what it looks like.

A pattern-based system looks for `git reset --hard` and blocks it. But an agent (or a prompt injection) could use `git reset --hard HEAD~3` or `git reset --hard $(git rev-parse HEAD~3)`. Pattern matching fails.

SafetyNet analyses command intent semantically. It understands that both forms are doing a hard reset and blocks them regardless of phrasing.

### What SafetyNet blocks

| Command type | Examples | Why it matters |
|---|---|---|
| Destructive git | `git reset --hard`, `git push --force`, `git checkout --` | Prevents losing work permanently |
| File deletion | `rm -rf` outside temp directories | Prevents data loss |
| Hidden commands | Destructive commands inside `bash -c` or `python -c` | Blocks obfuscated attempts |

### Installation

```bash
/plugin marketplace add kenryu42/cc-marketplace
/plugin install safety-net@cc-marketplace
```

Restart Claude Code after installation.

### Verify

```bash
npx cc-safety-net doctor
```

### When SafetyNet blocks a command

```
BLOCKED by Safety Net

Reason: git checkout -- discards uncommitted changes permanently.
        Use 'git stash' first.

Command: git checkout -- src/components/Hero.jsx
```

It does not just block. It explains why and suggests the safer alternative. This is useful: the agent learns the right approach for next time.

Full documentation: [SafetyNet Repository](https://github.com/kenryu42/claude-code-safety-net)

---

## Custom rules: project-specific safety

Different projects need different rules. SafetyNet lets you define rules specific to your project:

```json
{
  "version": 1,
  "rules": [
    {
      "name": "block-git-add-all",
      "command": "git",
      "subcommand": "add",
      "block_args": ["-A", "--all", "."],
      "reason": "Use 'git add <specific-files>' instead. Be explicit about what gets committed."
    }
  ]
}
```

For design engineers, a useful additional rule:

```json
{
  "name": "block-design-token-overwrites",
  "command": "rm",
  "block_args": ["tailwind.config.js", "tokens.json"],
  "reason": "Design token files must not be deleted. Edit them instead."
}
```

Use `/set-custom-rules` to configure rules interactively:

```bash
/set-custom-rules
```

> [!TIP]
> Custom rules turn your safety requirements into enforceable policy. Every agent session follows the same rules without you needing to remind it.

> [!NOTE]
> For more complex validation logic, see [Claude Code Hooks](https://docs.anthropic.com/en/docs/claude-code/hooks).

---

## Key takeaways

| Concept | Remember |
|---------|----------|
| **The risk** | Autonomous agents execute immediately. One bad command can be catastrophic. |
| **Layered safety** | Sandboxing (basic) + SafetyNet (semantic) + Custom rules (project-specific) |
| **Semantic analysis** | Pattern matching can be bypassed. Semantic analysis understands intent. |
| **Design system risk** | Shared components are high-stakes targets. Protect them with custom rules. |

---

## Exercise: Experience SafetyNet protection

| | |
|---|---|
| **Goal** | See SafetyNet block a dangerous command and configure a custom rule |
| **Concepts** | Autonomous agent safety, semantic analysis, custom rules |

### Steps

1. Install SafetyNet:
   ```bash
   /plugin marketplace add kenryu42/cc-marketplace
   /plugin install safety-net@cc-marketplace
   ```

2. Restart Claude Code and verify:
   ```bash
   npx cc-safety-net doctor
   ```

3. Trigger a dangerous operation:
   ```
   Create a backup branch, then hard reset main to 3 commits ago.
   ```

   SafetyNet should block the `git reset --hard` before it executes.

4. Observe the block:
   - What command was blocked?
   - What reason did it give?
   - What safer alternative did it suggest?

5. Ask Claude Code to use the safer approach:
   ```
   Use the safer approach to revert those commits instead of hard resetting.
   ```

6. Add a custom rule that blocks `git add .` and `git add -A`:
   ```bash
   /set-custom-rules
   ```
   Reason: "Be explicit about what gets committed. Use git add <specific files>."

7. Test the custom rule:
   ```
   Stage all changed files with git add .
   ```

   Your custom rule should block it.

### Acceptance criteria
- [ ] SafetyNet is installed and verified
- [ ] SafetyNet blocks the dangerous git reset
- [ ] SafetyNet provides a reason and a safer alternative
- [ ] Custom rule is created and blocks `git add .`
- [ ] You can explain the difference between pattern matching and semantic analysis

> [!NOTE]
> **Why this matters**: Without SafetyNet, the hard reset would have executed immediately. With it, the operation was caught, explained, and you were directed to a safer approach. That is the difference between a supervised agent and an unsafe one.

---

[Previous: MCPs](4-mcps.md) | [Next: Working with Context](6-working-with-context.md)
