@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #0a0e1a;
  --surface: #111827;
  --surface2: #1a2235;
  --border: #1f2d45;
  --accent: #00d4aa;
  --accent2: #3b82f6;
  --text: #e2e8f0;
  --muted: #64748b;
  --invest: #10b981;
  --watch: #f59e0b;
  --pass: #ef4444;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', -apple-system, sans-serif;
  min-height: 100vh;
}

.prose h2 { font-size: 1.4rem; font-weight: 700; color: var(--accent); margin: 1.5rem 0 0.75rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; }
.prose h3 { font-size: 1.1rem; font-weight: 600; color: #93c5fd; margin: 1.2rem 0 0.5rem; }
.prose p { margin-bottom: 0.75rem; line-height: 1.7; color: var(--text); }
.prose ul { margin: 0.5rem 0 0.75rem 1.5rem; }
.prose li { margin-bottom: 0.4rem; line-height: 1.6; }
.prose strong { color: #f1f5f9; font-weight: 600; }
.prose blockquote { border-left: 3px solid var(--accent); padding: 0.75rem 1rem; background: rgba(0,212,170,0.08); border-radius: 0 8px 8px 0; margin: 1rem 0; font-size: 1.05rem; }
.prose hr { border: none; border-top: 1px solid var(--border); margin: 1.5rem 0; }
.prose table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
.prose th { background: var(--surface2); padding: 0.5rem 0.75rem; text-align: left; font-size: 0.85rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
.prose td { padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--border); font-size: 0.9rem; }
