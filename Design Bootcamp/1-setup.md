# Module 1: Setup

## What You'll Learn
- Install the tools you need for the entire bootcamp
- Set up GitHub and fork the repo
- Confirm the portfolio boilerplate runs locally

---

## Tools you will install

### Cursor or VSCode

Cursor is a code editor built on top of VSCode with AI features baked in. Either works for this bootcamp.

- [Download Cursor](https://cursor.com)
- [Download VSCode](https://code.visualstudio.com)

### Claude Code

Claude Code is Anthropic's CLI for working with Claude inside your terminal, directly in your project. It can read your codebase, make changes across files, run commands, and reason through multi-step problems.

Install it via npm:

```bash
npm install -g @anthropic-ai/claude-code
```

Then authenticate:

```bash
claude login
```

Full documentation: [docs.anthropic.com/claude-code](https://docs.anthropic.com/en/docs/claude-code)

### Node.js

Required to run the portfolio app and install dependencies.

- [Download Node.js](https://nodejs.org/en/download) (version 18 or later)

---

## Set up GitHub

If you do not already have a GitHub account, create one at [github.com](https://github.com).

You will need either an SSH key or a personal access token to push code. GitHub's documentation covers both:
- [Generating an SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- [Creating a personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)

---

## Fork the repo

Fork this repository so you have your own copy to work in. You will push your changes, create branches, and open pull requests throughout the bootcamp.

1. Go to the repo on GitHub
2. Click **Fork** in the top right
3. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/ai-empowered-development-course
cd ai-empowered-development-course
```

---

## Accounts for later modules

You do not need these now, but set them up before starting the relevant modules:

- **Figma** account: needed for Modules 4 and 5. [figma.com](https://figma.com)
- **Supabase** account: needed for Module 7. [supabase.com](https://supabase.com)
- **Lovable or Figma Make** access: needed if you are doing Module 2 (the generation step). If you are skipping it, the boilerplate covers you.

---

## Exercise: Run the portfolio boilerplate

**Goal**: Confirm your environment works before starting the real work.

**Steps**:

1. Navigate to the boilerplate:
   ```bash
   cd portfolio-boilerplate
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Open the URL shown in the terminal (typically `http://localhost:5173`)

5. Confirm you can see: the nav, hero section, three project cards, the about section, and the contact section.

### Acceptance criteria
- [ ] App loads without errors in the browser
- [ ] All five sections are visible (Nav, Hero, Projects, About, Contact)
- [ ] No errors in the browser console

---

[Next: Project Creation](2-project-creation.md)
