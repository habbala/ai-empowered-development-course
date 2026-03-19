# Module 7: Supabase CMS

## What You'll Learn
- Understand why hardcoded content creates maintenance friction
- Set up a Supabase project and connect it via MCP
- Replace the hardcoded portfolio projects with live data from Supabase

---

## The problem: hardcoded content is a development dependency

Right now, the portfolio projects in `Projects.jsx` are hardcoded:

```jsx
const projects = [
  { id: 1, title: 'Design System', description: '...', tags: [...], url: '#' },
  ...
]
```

This seems simple, but it has a real cost. Every time you want to add a project, update a description, or change the order, you need to:
1. Open the code
2. Edit the array
3. Commit the change
4. Deploy

For a designer, that is too much friction for what is fundamentally a content update. It also means the separation between your content and your code is zero: they live in the same file, change for different reasons, and have completely different lifecycles.

A content management system solves this by separating the two. Your code defines how projects are displayed. Your CMS stores what projects exist. Content editors (including future you) can update content without touching code.

---

## The solution: Supabase

Supabase is a hosted Postgres database with a REST API and a browser-based dashboard. For a portfolio site, it provides everything you need:

- A table to store project data
- An auto-generated API to query that table
- A dashboard to add, edit, and delete projects without touching code
- A Supabase MCP server that lets Claude Code interact with it directly

### Supabase MCP

The Supabase MCP is the same concept as the Figma MCP from Module 4. Once connected, Claude Code can:
- Create and modify database tables
- Insert and query data
- Generate the client-side code to fetch from Supabase
- Help you manage environment variables and API keys

This means you can describe the data structure you want in plain language and let Claude Code create the table, seed it with sample data, and write the fetch logic.

---

## Setting up Supabase

### Create a project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New project**
3. Choose a name (e.g., `portfolio`) and a database password
4. Select a region close to you
5. Wait for the project to provision (about 1 minute)

### Get your credentials

In your Supabase project dashboard:
- Go to **Settings > API**
- Copy the **Project URL** (looks like `https://xxxx.supabase.co`)
- Copy the **anon public** key

### Store credentials safely

Create a `.env` file at the root of your project:

```bash
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Add `.env` to `.gitignore` immediately. Never commit API keys.

```bash
echo ".env" >> .gitignore
```

> [!WARNING]
> If you commit your Supabase key to a public GitHub repo, rotate it immediately in the Supabase dashboard under Settings > API. The anon key is lower risk than the service role key, but it is still a credential and should not be public.

---

## Installing the Supabase MCP

```bash
claude mcp add supabase -- npx -y @supabase/mcp-server-supabase \
  --supabase-url=$VITE_SUPABASE_URL \
  --supabase-anon-key=$VITE_SUPABASE_ANON_KEY
```

Restart Claude Code to load the MCP:

```bash
/exit
claude
```

Verify:

```bash
/mcp
```

You should see `supabase` listed.

---

## Key takeaways

| Concept | Remember |
|---------|----------|
| **Content vs code** | Content changes frequently. Code changes less often. Separate them. |
| **Supabase as CMS** | Postgres database + REST API + dashboard = a CMS without a CMS build step |
| **Supabase MCP** | Claude Code can create tables, seed data, and write fetch logic via MCP |
| **Environment variables** | Credentials go in `.env`, never in code, never committed |

---

## Exercise: Replace hardcoded projects with Supabase

| | |
|---|---|
| **Goal** | Move project data from a hardcoded array to a live Supabase table |
| **Concepts** | CMS architecture, MCP-assisted backend setup, environment variables |

### Steps

1. **Set up Supabase** (see above): create a project, copy credentials, create `.env`, add to `.gitignore`.

2. **Install the Supabase MCP** and verify it loads.

3. **Ask Claude Code to create the projects table**:
   ```
   Using the Supabase MCP, create a table called "projects" with these columns:
   - id: uuid, primary key, default gen_random_uuid()
   - title: text, not null
   - description: text
   - tags: text array
   - image_url: text
   - url: text
   - display_order: integer
   - created_at: timestamptz, default now()

   Then seed it with 3 sample portfolio projects that would suit a design engineer.
   ```

4. **Verify the table in the Supabase dashboard**: go to **Table Editor** and confirm the rows are there.

5. **Ask Claude Code to update Projects.jsx**:
   ```
   Update Projects.jsx to fetch projects from Supabase instead of using the
   hardcoded array. Use the Supabase JS client. Handle loading and error states.
   Order results by display_order ascending.

   Use environment variables for the Supabase URL and key.
   Install @supabase/supabase-js if it is not already installed.
   ```

6. **Test live updates**:
   - Go to the Supabase dashboard > Table Editor > projects
   - Add a fourth project directly in the dashboard
   - Refresh your local site
   - Confirm the new project appears without any code change

7. **Verify `.env` is not committed**:
   ```bash
   git status
   ```
   `.env` should not appear as a tracked file.

### Acceptance criteria
- [ ] Supabase project created and credentials stored in `.env`
- [ ] `.env` is in `.gitignore` and not tracked by git
- [ ] Supabase MCP installed and listed in `/mcp`
- [ ] `projects` table created with all required columns
- [ ] 3 sample rows seeded via MCP
- [ ] `Projects.jsx` fetches from Supabase (no hardcoded array)
- [ ] Loading and error states are handled in the UI
- [ ] Adding a row in the Supabase dashboard makes it appear in the site without a code change
- [ ] `@supabase/supabase-js` is installed and no console errors appear

> [!TIP]
> Once this is working, you can also ask Claude Code to add a `featured` boolean column to control which projects appear on the front page. Add it to the table via MCP, update the query to filter by `featured = true`, and flip the flag in the dashboard. No code changes required for new content decisions.

---

[Previous: Working with Context](6-working-with-context.md) | [Next: Research, Discovery and Roadmapping](8-research-discovery-roadmapping.md)
