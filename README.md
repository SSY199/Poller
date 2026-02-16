# Real-Time Poll Rooms

A full-stack web application that allows users to create polls, share them via a link, and view live results as votes are cast — without refreshing the page.

---

## 🚀 Features

### 1. Poll Creation

- Create a poll with a question and multiple options (minimum 2).
- Instantly generates a unique shareable link.

### 2. Join via Share Link

- Anyone with the link can open the poll and vote.
- No login required — frictionless participation.

### 3. Real-Time Results

- Votes update live for all connected users.
- No manual refresh needed.

### 4. Fairness / Anti-Abuse Mechanisms

I kept the fairness logic simple but it still stops basic abuse:

#### ✅ One Vote Per IP Per Poll (Server-Side)

- Every vote request hashes the IP address using SHA-256.
- The backend checks the `poll_votes` table to see if that `ip_hash` has already voted on the same poll.
- If a match is found, the API returns a `403` and the vote is rejected.

**Prevents:** Obvious repeat voting from the same IP on the same poll.  
**Limitation:** People on shared Wi‑Fi / office networks share the same IP, and someone can still vote again by switching network or VPN.

#### ✅ Browser Lock Using Local Storage (Client-Side)

- After a successful vote, the browser saves a flag like `poll_voted_{pollId}` in `localStorage`.
- When you open a poll page, the UI checks this flag and skips the voting screen, showing only the results.

**Prevents:** Casual users from voting again on the same device/browser.  
**Limitation:** Can be bypassed by clearing storage, using incognito mode, or using another device or browser.

### 5. Persistence

- Polls and votes are stored in a database.
- Refreshing or reopening the link retains all data.

### 6. Deployment

- App is deployed and publicly accessible.
- Designed to scale using serverless infrastructure.

---

## 🛠 Tech Stack

**Frontend**

- Next.js (App Router)
- React
- ShadCn UI

**Backend**

- Next.js API Routes (Serverless)

**Database**

- PostgreSQL (via Supabase)

**Realtime Updates**

- Supabase Realtime Subscriptions

**Deployment**

- Vercel

---

## 📂 Project Structure (Simple)

```
app/
 ├── page.tsx                 # Home page with "Create Poll" form
 ├── poll/[id]/page.tsx       # Vote + live results for a single poll
 ├── api/
 │   └── vote/route.ts        # Submit a vote (server-side checks)
 └── layout.tsx               # Root layout

components/
 ├── CreatePollForm.tsx       # UI to create a poll and get share link
 ├── PollUI.tsx               # Wrapper that switches between vote/results
 ├── VoteInterface.tsx        # Voting buttons
 ├── LiveResults.tsx          # Real-time results using Supabase Realtime
 ├── ShareLink.tsx            # Simple "copy current URL" box
 └── ui/*                     # Small UI helpers (button, input, card, etc.)

lib/
 ├── supabaseClient.ts        # Supabase client (browser + server)
 ├── types.ts                 # Tiny TS types for Poll / Option
 └── utils.ts                 # Small CSS helper
```

---

## ⚠️ Edge Cases Handled

- Duplicate voting attempts blocked.
- Poll with fewer than 2 options rejected.
- Invalid / expired poll links handled gracefully.
- Real-time UI sync across multiple users.
- Safe handling of rapid repeated requests.

---

## 📌 Summary

This project demonstrates:

- Full-stack system design
- Real-time data synchronization
- Abuse prevention strategies
- Persistent data modeling
- Production-ready deployment

