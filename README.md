<div align="center">

```
██████╗ ███████╗ █████╗ ██╗     ██████╗  ██████╗  ██████╗ ██████╗
██╔══██╗██╔════╝██╔══██╗██║     ██╔══██╗██╔═══██╗██╔═══██╗██╔══██╗
██████╔╝█████╗  ███████║██║     ██║  ██║██║   ██║██║   ██║██████╔╝
██╔══██╗██╔══╝  ██╔══██║██║     ██║  ██║██║   ██║██║   ██║██╔══██╗
██║  ██║███████╗██║  ██║███████╗██████╔╝╚██████╔╝╚██████╔╝██║  ██║
╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝╚═════╝  ╚═════╝  ╚═════╝ ╚═╝  ╚═╝
```

**The renter's copilot for affordable housing applications.**

*We read the paperwork. You keep the control.*

Built by **Team Unfoldd** —> Hack-Nation × RealPage Challenge, 6th Global AI Hackathon

&nbsp;

[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=next.js&logoColor=white)](#)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20Auth-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](#)
[![Groq](https://img.shields.io/badge/Groq-Cloud%20Inference-F55036?style=flat-square)](#)
[![License](https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square)](#)

</div>

<br/>

```
────────────────────────────────────────────────────────────────────
```

## The three-second version

A renter uploads a pay stub. RealDoor reads it, checks it against the
real HUD income rules for their area — with the exact citation and
effective date — flags what's missing, and hands back a packet the
renter owns.

It never says "approved." It never says "denied." That decision
belongs to a human, always. RealDoor's job is to make sure nobody
walks into that decision blind.

```
────────────────────────────────────────────────────────────────────
```

<br/>

## Why this exists

Somewhere right now, someone is sitting on the floor of an apartment
they're about to lose, holding three different pay stubs, trying to
figure out if their income even qualifies — because the rules are
buried in a PDF written for lawyers, not for them.

One wrong number on that application, and the wait starts over.
Weeks lost. Not because the person did anything wrong — because
nobody ever handed them a way to check their own math before it
mattered.

Affordable housing isn't short on demand. It's short on people
having a fair shot at getting through the door in the first place.

> **RealDoor is that shot.**

<br/>

```
────────────────────────────────────────────────────────────────────
```

## How it works

```
      STAGE 1                  STAGE 2                  STAGE 3
      ═══════                  ═══════                  ═══════

  ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
  │   PROFILE   │         │  UNDERSTAND │         │   PREPARE   │
  ├─────────────┤         ├─────────────┤         ├─────────────┤
  │ Upload a pay│  ──▶    │ Cited HUD  │   ──▶   │ Checklist of│
  │ stub or     │         │ rule match +│         │ missing /   │
  │ benefit     │         │deterministic│         │ expired docs│
  │ letter      │         │ calculation │         │             │
  │             │         │             │         │ Exportable, │
  │ You confirm │         │ Effective   │         │ deletable   │
  │ every field │         │ date shown  │         │ packet      │
  └─────────────┘         └─────────────┘         └─────────────┘

        ▲                                                  │
        └──────────────── renter stays in control ─────────┘
```

One rule holds the whole pipeline together:

```
   ┌──────────────────────────────────────────────────────┐
   │   The AI explains.  The code calculates.             │
   │   The renter decides what happens next.              │
   └──────────────────────────────────────────────────────┘
```

<br/>

```
────────────────────────────────────────────────────────────────────
```

## What's actually inside

**Extraction, not guessing**
Vision AI reads pay stubs and benefit letters against a strict field
allowlist. If it's not confident, it says so — it never fills a gap
with a guess.

**You confirm everything**
Every extracted field sits in front of the renter with a confidence
badge and a source snippet, before anything downstream ever uses it.

**Math the AI never touches**
Income annualization and HUD MTSP threshold comparisons run through
plain, deterministic functions — built directly off HUD Handbook
4350.3, Chapter 5. Ask it the same question twice, get the same
answer twice.

**Rules with receipts**
Ask a plain-language question, get an answer sourced only from a
frozen, versioned rule corpus — with the section and effective date
attached. No source, no answer.

**A packet you actually own**
One click generates a clean, print-ready readiness packet. It's
stored, exported, and deleted entirely on your terms — never
auto-sent anywhere.

**A live Trust Center**
See exactly what data of yours exists, when it was touched, and
delete all of it in one action. Includes a live panel where you can
try to break the AI's rules yourself and watch it hold the line.

<br/>

```
────────────────────────────────────────────────────────────────────
```

## Architecture

```
                          ┌──────────────┐
                          │   Next.js    │
                          │  (frontend)  │
                          └───────┬──────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │  Supabase Edge Functions │
                    │   (all sensitive logic)  │
                    └─────────────┬────────────┘
                                  │
                ┌─────────────────┼─────────────────┐
                ▼                                    ▼
     ┌─────────────────────┐            ┌────────────────────────┐
     │      Groq Cloud     │            │   Deterministic Engine │
     │  extraction + rules │            │   pure JS/TS · no LLM  │
     │        Q&A          │            │   frozen HUD tables    │
     └─────────────────────┘            └────────────────────────┘
                │                                    │
                └──────────────┬─────────────────────┘
                                ▼
                    ┌──────────────────────────┐
                    │        Supabase          │
                    │  Postgres · RLS · Storage│
                    └──────────────────────────┘
```

Every extracted field is untrusted input until a human confirms it.
Every eligibility number comes from code we wrote and can defend,
not a model's best guess.

<br/>

```
────────────────────────────────────────────────────────────────────
```

## Tech stack

```
  Frontend .................. Next.js 14 (App Router), Tailwind CSS
  Backend logic .............. Supabase Edge Functions (Deno)
  Database / Auth / Storage .. Supabase — Postgres, RLS, Storage
  AI — extraction ............ Groq Cloud, qwen/qwen3.6-27b
  AI — rules Q&A .............. Groq Cloud, openai/gpt-oss-120b
  Compliance math ............ Custom JS/TS, HUD Handbook 4350.3 Ch.5
  PDF generation .............. pdf-lib
```

Every service used is on a free tier. No paid keys anywhere in this
build.

<br/>

```
────────────────────────────────────────────────────────────────────
```

## Getting started

```bash
git clone <repo-url>
cd realdoor
npm install
```

Create a `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GROQ_API_KEY=
```

```bash
npm run dev
```

<br/>

```
────────────────────────────────────────────────────────────────────
```

## The line we didn't cross

It would've been faster to let the model output "eligible" or "not
eligible" directly. We built the whole calculation engine
specifically so it couldn't — because a wrong eligibility guess from
an AI doesn't just cost a demo point, it costs someone their
apartment. That tradeoff is the actual product.

<br/>

```
────────────────────────────────────────────────────────────────────
```

## Team Unfoldd

```
  Ajay Pratap Singh ..... Architecture, AI extraction pipeline, UI
  Dev Kumar .............. Deterministic compliance engine, corpus
```

<br/>

<div align="center">

```
────────────────────────────────────────────────────────────────────
```

Built in 24 hours for Hack-Nation × RealPage · 6th Global AI Hackathon

MIT License

</div>
