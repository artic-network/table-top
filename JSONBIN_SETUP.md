# JSONBin.io Setup Guide

JSONBin.io is a free hosted JSON store. Frogspawn uses it as a lightweight
alternative to running `server.js`: the facilitator's control panel writes the
current day to a bin; all participant inbox tabs poll that bin and update
automatically — no custom server required.

---

## 1. Create a free JSONBin account

1. Go to <https://jsonbin.io> and click **Sign Up**.
2. Verify your email address.

---

## 2. Create a Bin

1. Log in and click **Create a Bin**.
2. Paste in the initial record:

   ```json
   { "day": 0 }
   ```

3. Give it a name, e.g. `frogspawn-artic-table-top`.
4. Click **Create**.
5. Copy the **Bin ID** from the URL — it looks like `684d2a3f...` (24 hex chars).

---

## 3. Get your API keys

In the JSONBin dashboard go to **API Keys**:

| Key | Purpose | Where to use |
|-----|---------|--------------|
| **Master Key** | Read + Write | Control panel only — never commit this to git |
| **Access Key** (optional) | Read-only | Can be stored in `settings.json` so inboxes can read the bin |

If you set the bin to **Public** (in its settings) the Access Key is not
needed for reads; polling inboxes will work without any key.

---

## 4. Add the Bin ID to your activity settings

Edit `activities/<activity-name>/settings.json` and add two fields:

```json
{
  "title": "ARTIC Table-Top exercise",
  "description": "...",
  "location": "...",
  "date": "2025-10-25",
  "serverHost": "https://tree.bio.ed.ac.uk:3000",
  "jsonbinBinId": "PASTE_YOUR_BIN_ID_HERE",
  "jsonbinAccessKey": "PASTE_READ_ONLY_ACCESS_KEY_OR_LEAVE_EMPTY_IF_PUBLIC"
}
```

> **Do not** put the Master Key in `settings.json`. It is entered by the
> facilitator at runtime in the control panel.

---

## 5. Open the control panel and enter the Master Key

1. Open `controlpanel.html?activity=artic-table-top` in your facilitator browser.
2. A **Master Key** input field is shown in the toolbar.
3. Paste your Master Key and press **Connect**.
4. The status badge will confirm the connection and show the current day.
5. Use the **◀ Day / Day ▶** buttons to advance the exercise.

The Master Key is stored only in `sessionStorage` for that tab and is never
sent to any endpoint other than `api.jsonbin.io`.

---

## 6. Open inboxes on participant devices

Participants open:

```
https://<your-host>/inbox.html?activity=artic-table-top
```

The inbox polls the bin every **10 seconds** (configurable via `?interval=`
in milliseconds). When the facilitator advances the day, participants see the
new documents appear within one poll cycle.

---

## 7. Polling interval

The default poll interval is 10 000 ms (10 s). To change it per-session:

```
inbox.html?activity=artic-table-top&interval=30000
```

JSONBin's free tier allows **10 000 requests/month**. At 10 s polling:

| Concurrent inboxes | Requests/hour | Free tier exhausted in |
|--------------------|---------------|------------------------|
| 10 | 3 600 | ~70 hours |
| 30 | 10 800 | ~23 hours |
| 50 | 18 000 | ~14 hours |

For larger groups or longer events, either increase the interval or upgrade
to a JSONBin paid plan.

---

## 8. Resetting for a new session

1. Log in to JSONBin, find your bin, and edit the record back to `{ "day": 0 }`.
2. Or use the **Reset** button in the control panel (sets day to 0 and writes to the bin).

---

## 9. Security notes

- The **Master Key** gives full read/write access to all your bins. Treat it
  like a password.
- The **Access Key** is read-only; it is safe to commit to `settings.json` in
  a private repository, but avoid public repos.
- If a bin is set to **Public**, no key is needed for reads; anyone who knows
  the Bin ID can read the current day — which is fine for a training exercise.
- JSONBin does not support real-time WebSocket push; updates arrive at the
  next poll cycle (default 10 s).
