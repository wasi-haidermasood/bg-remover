# Background Remover (remove.bg + Node/Express)

This is a minimal, ready-to-run project that lets you upload an image, remove its background using the remove.bg API, and download the result as a PNG.

## Prerequisites
- Install **Node.js LTS** from https://nodejs.org/en/download
- Create a free remove.bg account and get your **API key** from your account settings.

## Setup (Windows/macOS/Linux)

```bash
# 1) Unzip this project and open a terminal inside the folder
npm install

# 2) Copy .env.example to .env and paste your API key
#    On Windows PowerShell:
copy .env.example .env
#    macOS/Linux:
cp .env.example .env

# 3) Edit .env and set REMOVEBG_KEY=your_key_here

# 4) Start the server
npm start
```

Now open http://localhost:3000 in your browser.
Choose an image, click **Remove Background**, and then **Download**.

## Notes
- Your API key stays **secure** on the server. The browser only talks to `/api/removebg`.
- Free remove.bg accounts include limited free previews via API each month and 1 bonus high‑res credit (see remove.bg help for details).
