# AutoFix AI — Intelligent Bug Detection & Code Refactoring

A production-grade, hackathon-winning developer tool dashboard built with Next.js 14, powered by Claude AI.

## Features

- **Monaco Code Editor** — Full IDE-quality editing with syntax highlighting, ligatures, and custom dark theme
- **AI-Powered Analysis** — Uses Claude claude-opus-4 to detect bugs, vulnerabilities, and code smells
- **Bug Severity Ratings** — Critical / High / Medium / Low with categorization
- **Fixed Code View** — Complete corrected code with AI explanation and optimization suggestions
- **Diff Viewer** — Side-by-side and unified diff comparison with color-coded changes
- **Code Health Score** — Performance, Readability, Security, and Maintainability metrics
- **AI Chat Panel** — Ask follow-up questions about bugs, fixes, and best practices
- **Analysis History** — Last 20 analyses stored locally with quick recall
- **Multi-Language Support** — JavaScript, TypeScript, Python, Java, Go, Rust, C++
- **File Upload** — Drag and drop or click to upload source files
- **Sample Code** — One-click sample code loader for each language

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS**
- **Monaco Editor** (`@monaco-editor/react`)
- **Framer Motion** (animations)
- **React Diff Viewer** (`react-diff-viewer-continued`)
- **Anthropic Claude API** (claude-opus-4)

## Setup

1. **Clone and install**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local and add your ANTHROPIC_API_KEY
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open** `http://localhost:3000`

## API

The app exposes two internal API routes:

### `POST /api/analyze`
Accepts `{ code: string, language: string }` and returns a full analysis including bugs, fixed code, scores, suggestions, and explanation.

### `POST /api/chat`
Accepts `{ messages, codeContext, analysisContext }` for contextual follow-up questions about the analyzed code.

## Project Structure

```
auto-bug-fixer/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts     # Main analysis endpoint
│   │   └── chat/route.ts        # Chat endpoint
│   ├── globals.css              # Global styles + custom theme
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main dashboard
├── components/
│   ├── chat/ChatPanel.tsx       # AI chat interface
│   ├── diff/DiffViewerPanel.tsx # Code diff viewer
│   ├── editor/CodeEditorPanel.tsx # Monaco editor
│   ├── results/
│   │   ├── BugList.tsx          # Bug cards with severity
│   │   ├── FixedCodePanel.tsx   # Fixed code + explanation
│   │   ├── ResultsPanel.tsx     # Tab container
│   │   └── ScorePanel.tsx       # Health score visualizations
│   └── ui/
│       ├── HistoryPanel.tsx     # Analysis history sidebar
│       └── Navbar.tsx           # Top navigation
└── lib/
    ├── types.ts                 # TypeScript interfaces
    └── utils.ts                 # Utilities + sample code
```
