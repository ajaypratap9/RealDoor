# RealDoor
**Built by Team Unfoldd** for the Hack-Nation RealPage Challenge.

![RealDoor Banner](https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)

## The Problem
Affordable housing applications (like LIHTC) are a nightmare for both applicants and property managers. Renters are handed massive packets and expected to prove complex income compliance using manual pay stubs and confusing HUD math. One simple mathematical error on an application means losing the apartment. This system treats people like suspects, strips away their dignity, and overwhelms leasing offices with paperwork.

## The Solution
RealDoor flips the model. We empower the renter *before* they apply.
Our platform acts as a secure, deterministic compliance engine that helps renters build a verified, bulletproof application packet that property managers can instantly trust.

### Key Features
1. **AI Document Extraction (Zero Hallucination)**: Renters simply snap a photo of their pay stub. Our Vision AI reads it strictly against an allowlist.
2. **Human-in-the-Loop Trust Center**: AI is never the final word. Renters must explicitly verify the extracted data, giving them control and ensuring absolute compliance.
3. **Deterministic Math Engine**: Income annualization and HUD MTSP Limit comparisons are calculated using **pure, deterministic JavaScript math** based exactly on HUD Handbook 4350.3 Chapter 5 formulas. We *never* use AI to do compliance math.
4. **Instant PDF Dossiers**: With one click, generate a beautiful, print-ready "Application Readiness Packet" containing verified data and mathematical proofs.
5. **AI Rules Engine**: A built-in assistant strictly sandboxed to the HUD MTSP JSON corpus. It answers complex housing rule questions factually without guessing or giving unauthorized legal advice.
6. **Enterprise-Grade Security**: Fully secured backend API routes using Supabase JWT Bearer token authentication to prevent unauthorized data manipulation and API abuse.

## Tech Stack
* **Frontend**: Next.js 16 (App Router), React, TailwindCSS, Framer Motion
* **Backend**: Next.js API Routes, Supabase (Auth, Postgres, Storage)
* **AI Models**: Groq Cloud (Qwen Vision for OCR, LLaMA 3 70B for Rules RAG)
* **PDF Engine**: `pdf-lib`

## Team Unfoldd
* **Ajay Pratap Singh** (Team Leader)
* **Dev Kumar** (Core Member)

## Getting Started
\`\`\`bash
# Install dependencies
npm install

# Setup environment variables
# Requires SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, GROQ_API_KEY

# Run development server
npm run dev
\`\`\`

## License
MIT License. Built for Hack-Nation.
