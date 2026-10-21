# Mana Skill Telangana SSC Result Checker

A mobile-friendly, secure web application built with **React**, **TypeScript**, **Tailwind CSS**, and **Node.js (Express)** for students and parents to check Telangana State Secondary School Certificate (SSC / Class 10) examination results.

---

## 🌟 Key Features

1. **Mana Skill Branding & Clean Academic UI**:
   - Palette: Clean blue (`#1D4ED8`), crisp white, and soft light grey (`#F8FAFC`).
   - Anti-slop design: zero pills, crisp typography (`Plus Jakarta Sans`), and tabular numerals (`JetBrains Mono`).

2. **Verified Live Result Retrieval**:
   - Queries verified public data handlers hosted by **Eenadu Results** (`results.eenadu.net/handlers/...`).
   - Retrieves real student data: Student Name, Hall Ticket Number, District/Division, Subject-wise internal (20) and external board theory (80) marks, Subject totals (100), Grades (A1 through E), Grand Total Marks (e.g. 524/600), Percentage (87.3%), 10-point GPA equivalent (e.g. 9.17/10), and Final Result (`PASS` / `COMPARTMENTAL` / `FAIL`).

3. **Year-Specific Source Configuration & Candidate Probes (`src/config/sources.ts`)**:
   - Candidate endpoints configured for every examination year (2026 Regular & Supplementary, 2025, 2024, 2023, 2022).
   - Real network probes are dispatched to candidate sources upon student request instead of static short-circuiting.
   - **Zero Fabrication Guarantee**: Never returns fabricated marks or hardcoded records.

4. **Strict Year & Cache Isolation**:
   - Changing the examination year dropdown immediately clears any prior result or alert from the screen.
   - The backend validates that the returned examination session matches the requested session before normalization.
   - All result API responses are served with `Cache-Control: no-store, no-cache, must-revalidate`.

5. **Distinct Error Handling**:
   - **Invalid Hall Ticket Format**: Dedicated alert for non-10 digit numbers.
   - **Record Not Found**: Verification checklist with school contact advice.
   - **Historical Archive Verification Required**: Displays real HTTP status and provides working links to the official BSE Telangana portal and TG SSC Results server.
   - **Connection Error / Timeout**: Actionable retry options with links to official portals.

6. **Android Phone & Mobile Touch First**:
   - Ergonomic touch targets ($\ge 44\text{px}$).
   - Responsive presentation: desktop marks memo with print styling (`@media print`), and mobile switcher between full table and clean stacked Subject Cards.
   - Quick sample button (`2601100001`) for 1-tap testing and live demonstration.

7. **Security & Privacy First**:
   - **Zero Persistence**: Student hall tickets and marks are never stored in databases or server logs.
   - **Privacy Diagnostic Logging**: Server logs record the query session, requested source, HTTP status code, request duration, and parsing status with masked roll numbers (`***0001`) — never exposing student names or full hall tickets.
   - **Rate Limiting**: In-memory rate limiting (max 30 requests per minute per IP) to prevent spam and provider overload.
   - **Timeouts**: 7-second abort controller prevents hanging requests.

---

## 📊 Year-Specific Source Testing Status

Each examination session was independently tested against public endpoints:

| Examination Session | Configured Sources Probed | HTTP / Source Status | Automated Retrieval | User Experience |
| :--- | :--- | :--- | :--- | :--- |
| **2026 Regular** | Eenadu `tg_2026_resulthandler_tenth.ashx` | `HTTP 200 OK` | **Supported (Live Verified)** | Displays complete marks memo with subject marks, grades, and GPA. |
| **2026 Supplementary** | Eenadu `tg_2026_resulthandler_tenth_supply.ashx` | `HTTP 200 OK` | **Supported (Live Verified)** | Online for 2026 supplementary candidates. |
| **2025 Regular** | Eenadu `tg_2025_resulthandler_tenth.ashx` & TG Results Server | `HTTP 404 (Retired)` | **Official Portal Required** | Dispatches real probe, detects 404, and connects student to official state board archive (`bse.telangana.gov.in`). |
| **2024 Regular** | Eenadu `tg_2024_resulthandler_tenth.ashx` & TG Results Server | `HTTP 404 (Retired)` | **Official Portal Required** | Dispatches real probe, detects 404, and connects student to official state board archive (`bse.telangana.gov.in`). |
| **2023 Regular** | State Board Archive Server | Historical Archive | **Official Portal Required** | Directs student to official state board archive. |
| **2022 Regular** | State Board Archive Server | Historical Archive | **Official Portal Required** | Directs student to official state board archive. |

---

## 📁 Architecture

```
├── server.ts                       # Express backend server (candidate probing, diagnostics, rate limiter, Vite dev middleware)
├── src/
│   ├── App.tsx                     # Main React application & year isolation coordinator
│   ├── main.tsx                    # React DOM root entry
│   ├── index.css                   # Global styles & print media rules
│   ├── config/
│   │   └── sources.ts              # Year-specific candidate endpoint configurations & portal mappings
│   ├── components/
│   │   ├── Header.tsx              # Top bar adhering to 3-zone contract
│   │   ├── ResultSearchForm.tsx    # Hall ticket input, year select, sample trigger
│   │   ├── MarksMemo.tsx           # Marks memorandum (Table & Mobile Cards view, Print)
│   │   ├── StatusAlerts.tsx        # Distinct alert states (Loading, Invalid, NotFound, Historical, Error)
│   │   ├── GradingGuide.tsx        # Telangana SSC 10-point GPA modal guide
│   │   ├── OfficialLinksBanner.tsx # BSE Telangana & Eenadu Results links
│   │   └── Footer.tsx              # Educational disclaimer & copyright
│   ├── types/
│   │   └── result.ts               # TypeScript data models and diagnostic interfaces
│   └── utils/
│       ├── sscLogic.ts             # Decoupled validation, grade calculations, year isolation parsing
│       └── sscLogic.test.ts        # Unit tests using node:test
├── index.html                      # HTML entry with metadata & fonts
├── metadata.json                   # Applet metadata & permissions
└── package.json                    # Scripts and dependencies
```

---

## 🚀 Running & Deploying

### Prerequisites
- Node.js (v20+ or v22+)
- npm

### 1. Development Mode
Runs the Express backend with Vite middleware on port 3000:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Running Unit Tests
Tests pure business logic (validation, GPA calculation, Eenadu JSON parsing, year isolation) using Node's built-in test runner:
```bash
npm test
```

### 3. Production Build & Start
Compile the React bundle and run the production server:
```bash
npm run build
npm start
```

---

## 🔗 Official Verification Portals

- **Board of Secondary Education, Telangana (BSET)**: [https://bse.telangana.gov.in/](https://bse.telangana.gov.in/)
- **Telangana SSC Results Server**: [https://results.bsetelangana.org/](https://results.bsetelangana.org/)
- **Eenadu Results Portal**: [https://results.eenadu.net/](https://results.eenadu.net/)
