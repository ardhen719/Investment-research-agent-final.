# AI Investment Research Agent

**Author:** Ardhendu Shekhar | **Reg No:** 12322876  
**Assignment:** InsideIIM × Altuni AI Labs — AI Product Intern  
**Stack:** Next.js 14 · React · LangChain.js · LangGraph.js · OpenAI GPT-4o

> 🚀 **Live Demo:** [Deploy to Vercel — see steps below]

---

## Overview — What It Does

An autonomous AI agent that takes a company name, independently researches it using real data tools, and delivers a structured 8-section investment report with a clear **INVEST ✅ / WATCH 👀 / PASS ❌** verdict.

Given a company like `"Tesla"` or `"Infosys"`, the agent autonomously:
1. Fetches real financial data (market cap, PE ratio, margins, beta) via Yahoo Finance API
2. Searches the web for business model, strategy, and competitive landscape
3. Retrieves recent news and developments
4. Synthesizes a full SWOT analysis
5. Delivers a final verdict with confidence level and risk rating

The UI includes a live **Agent Log tab** showing every LangGraph tool call and result — the full execution trace.

---

## How to Run It

### Option 1: Local Development

**Prerequisites:** Node.js 18+, OpenAI API key

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local:
# OPENAI_API_KEY=sk-your-key-here
# SERPAPI_KEY=your-key-here  (optional)

# 3. Start dev server
npm run dev

# 4. Open http://localhost:3000
```

### Option 2: Deploy to Vercel (Recommended)

```bash
# Step 1: Push to GitHub
git init
git add .
git commit -m "AI Investment Research Agent"
git remote add origin https://github.com/YOUR_USERNAME/investment-research-agent.git
git push -u origin main

# Step 2: Go to https://vercel.com
# Click "New Project" → Import your GitHub repo

# Step 3: Add environment variables in Vercel dashboard:
# OPENAI_API_KEY = sk-your-openai-key
# SERPAPI_KEY = your-serpapi-key (optional)

# Step 4: Click Deploy → Get your live URL!
```

**API Keys needed:**

| Key | Required | Where to get |
|-----|----------|-------------|
| `OPENAI_API_KEY` | ✅ Yes | platform.openai.com |
| `SERPAPI_KEY` | Optional | serpapi.com (100 free searches/month) |

> Without `SERPAPI_KEY`, the agent uses Yahoo Finance for financials and returns simulated search results. Core functionality still works.

---

## How It Works — Architecture

```
User enters company name
         │
         ▼
   React UI (page.tsx)
   POST /api/research
         │
         ▼
   Next.js API Route (route.ts)
   → calls runResearchAgent(company)
         │
         ▼
┌──────────────────────────────────────┐
│          LangGraph Agent             │
│                                      │
│  START                               │
│    ↓                                 │
│  [agent node] ← GPT-4o + tools      │
│    ↓ (has tool_calls?)               │
│  yes → [tools node]                  │
│           ├─ get_financials()        │ ← Yahoo Finance
│           ├─ search_web()           │ ← SerpAPI / Google  
│           └─ get_news()             │ ← SerpAPI News
│    ↓ (back to agent)                │
│  no → END → final report            │
└──────────────────────────────────────┘
         │
         ▓ { report, log }
         ▼
   React renders:
   ├─ Verdict banner (INVEST/WATCH/PASS)
   ├─ Full 8-section markdown report
   └─ Agent Log tab (tool call trace)
```

### LangGraph StateGraph Pattern

```typescript
const workflow = new StateGraph(AgentState)
  .addNode("agent", callModel)      // GPT-4o reasons + decides tools
  .addNode("tools", toolNode)       // Executes real tool functions
  .addEdge(START, "agent")
  .addConditionalEdges("agent", shouldContinue)  // loop or END
  .addEdge("tools", "agent");       // always return to agent
```

The agent loops until GPT-4o returns a response with **no tool calls** — that's the final report.

### Tools

| Tool | Data Source | What it fetches |
|------|-------------|-----------------|
| `get_financials` | Yahoo Finance (free, no key) | Market cap, PE, revenue, margins, beta |
| `search_web` | SerpAPI → Google | Business model, competitors, strategy |
| `get_news` | SerpAPI News | Latest news, earnings, developments |

---

## Key Decisions & Trade-offs

### 1. LangGraph over a plain while loop
**Chose LangGraph** — typed state management via `Annotation.Root`, built-in `ToolNode` handling parallel calls and errors cleanly, conditional edges make the graph inspectable and extensible. Matches the production stack required by InsideIIM.

**Trade-off:** Tied to LangGraph's API. A plain loop would be simpler for a 3-tool agent but doesn't scale when adding supervisor nodes, memory, or streaming.

### 2. Yahoo Finance (no API key) for financials
**Chose Yahoo Finance** — structured numeric data (market cap as a number, not vague text), no cost, no signup. Results in cleaner tables in the report.

**Trade-off:** Rate-limited; occasionally returns empty data for smaller or private companies. Production alternative: Polygon.io or Alpha Vantage.

### 3. SerpAPI made optional
**Made SerpAPI optional** — the agent degrades gracefully without it. Evaluators without a SerpAPI key can still run the agent and see financial data + AI synthesis.

### 4. Custom markdown parser (no library)
**Chose regex parser** — keeps bundle small, zero extra dependency. Works for ~85% of markdown cases.

**Trade-off:** Doesn't handle nested lists or complex tables perfectly. Production fix: use `react-markdown`.

### What I left out (and why)
- **Streaming responses** — needs `ReadableStream` + `EventSource`; significant complexity for demo
- **Vercel Postgres persistence** — would enable report history and comparison
- **LangGraph supervisor node** — self-critique pass before final verdict
- **PDF export** — `@react-pdf/renderer` integration
- **Private company support** — Crunchbase API for startups

---

## Example Runs

Full reports in `outputs/` folder. Summary:

| Company | Verdict | Confidence | Key Reasoning |
|---------|---------|------------|---------------|
| **Tesla** | WATCH 👀 | Medium | 65x PE + BYD margin pressure; wait for Robotaxi revenue confirmation |
| **Infosys** | INVEST ✅ | High | 24x PE, $3B FCF, record $4.5B deal wins, Topaz GenAI traction |
| **Zomato** | INVEST ✅ | Medium | Profitability inflection + Blinkit 100%+ GOV growth; best India internet bet |

---

## What I Would Improve With More Time

1. **Streaming output** — Show report generating token-by-token via OpenAI streaming API
2. **Vercel Postgres** — Persist report history; compare "Tesla today vs last week"
3. **LangGraph supervisor node** — Agent critiques its own verdict before finalizing
4. **Sentiment scoring** — FinBERT NLP on news headlines → Bullish/Neutral/Bearish score
5. **Private company support** — Crunchbase API for startups and unicorns
6. **PDF download** — Export polished report as PDF
7. **Multi-company compare** — Side-by-side INVEST/PASS analysis
8. **Automated tests** — Jest unit tests for tool functions and API route

---

## BONUS: LLM Chat Session Transcript

`logs/llm_build_transcript.json` contains the **actual conversation with Claude (Anthropic)** used to:
- Design the LangGraph architecture
- Choose LangGraph over a plain while loop
- Decide Yahoo Finance vs web search for financials
- Structure the React UI and verdict display
- Plan trade-offs and future improvements

This transcript gives full insight into the thought process and architectural decisions behind every file.

---

## Project Structure

```
investment-research-agent/
├── src/
│   └── app/
│       ├── api/research/route.ts   ← Next.js API route (POST /api/research)
│       ├── page.tsx                ← React UI with verdict banner + agent log
│       ├── layout.tsx
│       └── globals.css
├── lib/
│   └── agent.ts                   ← LangGraph agent: StateGraph + 3 tools + GPT-4o
├── outputs/
│   ├── Tesla_report.md            ← Example: WATCH verdict
│   ├── Infosys_report.md          ← Example: INVEST verdict
│   └── Zomato_report.md           ← Example: INVEST verdict
├── logs/
│   └── llm_build_transcript.json  ← BONUS: Full LLM build session
├── vercel.json                    ← Vercel deployment config
├── package.json
├── next.config.js
├── tsconfig.json
├── tailwind.config.ts
├── .env.example
└── README.md
```
