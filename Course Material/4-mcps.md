# Module 4: MCPs

## What You'll Learn
- Understand what MCPs are and why they exist
- Install the Figma MCP
- Use the Figma MCP to align your repo with a provided design file's tokens and components

---

## Sub-Module 1: What is an MCP?

### The problem

Before MCPs, connecting an AI model to an external tool required custom integration code. Want Claude Code to read your Figma file? Build a custom integration. Want it to query your Supabase database? Build another one. Want to use a different model? Build it all again.

Every model needed its own code to talk to every tool. Adding a new tool meant writing new code for every model. It did not scale.

### The solution: a universal adapter

MCP (Model Context Protocol) is a standard that lets AI models talk to external tools using a common language. Build a tool once as an MCP server, and any compatible model can use it.

The analogy: before USB, every device needed its own cable. After USB, one standard works with thousands of devices. MCP does the same thing for AI and tools.

```
Without MCP: 3 models x 5 tools = 15 custom integrations
With MCP:    3 models + 5 tools = 8 implementations
```

### How it works

When you connect Claude Code to an MCP server:

1. The server announces what it can do: "I have tools called `get_file`, `get_component`, and `list_styles`"
2. Claude Code checks what is available
3. Claude Code calls the tools it needs for your task
4. The server controls what is allowed: it validates inputs, enforces permissions, and logs actions

The server controls access, not the model. Your MCP server is the security boundary.

### MCP servers relevant to design engineers

| Server | What it provides |
|--------|-----------------|
| **Figma MCP** | Read frames, components, styles, and tokens from a Figma file |
| **Supabase MCP** | Query and update your Supabase database directly from Claude Code |
| **Context7** | Fetch live documentation for any library on demand |

You will use Figma MCP in this module and Supabase MCP in Module 7.

### Key takeaways

| Concept | Remember |
|---------|----------|
| **The problem** | Custom integrations for every model-tool pair do not scale |
| **The solution** | MCP is a standard: build once, works with any compatible model |
| **Server control** | The server enforces permissions and validates inputs |
| **Why it matters** | You can access Figma data, databases, and documentation without leaving Claude Code |

---

## Sub-Module 2: Figma MCP

### What the Figma MCP provides

The Figma MCP gives Claude Code direct access to your Figma files. It can:

- Read frames and their properties (dimensions, layout, fills, effects)
- List components and their variants
- Extract style definitions: colour styles, text styles, spacing values
- Read variable collections (design tokens)

This changes how you handle design-to-code handoff. Instead of manually translating tokens from a Figma file into your Tailwind config, you ask Claude Code to read the file and do it for you.

### Install the Figma MCP

You will need a Figma personal access token. Get one at: Figma > Account Settings > Personal access tokens > Generate new token.

Then add the MCP to Claude Code:

```bash
claude mcp add figma -- npx -y figma-developer-mcp --figma-api-key=YOUR_TOKEN
```

Restart Claude Code to load the MCP:

```bash
/exit
claude
```

Verify it loaded:

```bash
/mcp
```

You should see `figma` listed as a connected server.

### The provided design file

A Figma design file with base tokens has been prepared for this bootcamp. It contains:

- Colour palette (primary, neutral, semantic colours)
- Type scale (font sizes, line heights, font weights)
- Spacing scale
- Border radius values
- Shadow styles

**File link**: [to be added before bootcamp delivery]

Duplicate it to your own Figma account so you can inspect and reference it freely.

### Exercise: Audit and align your repo

**Goal**: Use the Figma MCP to compare the design file's tokens against your repo's Tailwind config, then fix the inconsistencies.

**Steps**:

1. Ensure the Figma MCP is installed and loaded (see above)

2. Ask Claude Code to read the design file's tokens:
   ```
   Using the Figma MCP, read the design file [paste the file URL].
   List all colour styles, text styles, and any spacing or radius variables defined there.
   ```

   Claude Code will call the Figma MCP and return the token definitions. It does not search manually or guess: the data comes directly from the file.

3. Ask Claude Code to compare those tokens against your current config:
   ```
   Compare the colour values and type scale from the Figma file against our
   current tailwind.config.js and index.css. List every inconsistency you find.
   ```

4. Ask Claude Code to fix the inconsistencies:
   ```
   Update tailwind.config.js to use the exact colour values and spacing scale
   from the Figma file. Do not change any component logic, only the token values.
   ```

5. Verify in the browser: the site should look consistent with the design file's palette and type scale.

### Acceptance criteria
- [ ] Figma MCP is installed and listed in `/mcp`
- [ ] Claude Code successfully reads the design file and returns token definitions
- [ ] At least 2 inconsistencies identified between the Figma tokens and the repo
- [ ] Tailwind config updated to match the Figma tokens
- [ ] Site renders correctly after the update with no console errors
- [ ] You understand how this replaces manual token documentation

> [!NOTE]
> **Why this matters**: Without the Figma MCP, aligning code to a design file means manually reading values from Figma, converting them to Tailwind format, and hoping nothing gets mistyped. With the MCP, Claude Code reads the source of truth directly. There is no translation step.

---

[Previous: Using Claude Code as a Designer](3-using-claude-code.md) | [Next: Safety and Guidelines](5-safety-and-guidelines.md)
