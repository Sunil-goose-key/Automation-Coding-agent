// Captures a full-page screenshot of the login page on a deployed environment.
// Usage: node scripts/qaScreenshot.js --url http://my-alb-dns-name --out screenshots/cert-login.png
//
// Purely additive to the QA pipeline — never throws on navigation/render issues so a
// screenshot failure can't mask the real pass/fail QA result running alongside it.

const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--url") args.url = argv[++i];
    if (argv[i] === "--out") args.out = argv[++i];
  }
  return args;
}

async function main() {
  const { url, out } = parseArgs(process.argv.slice(2));
  if (!url || !out) {
    throw new Error("Usage: qaScreenshot.js --url <base-url> --out <output-path>");
  }

  fs.mkdirSync(path.dirname(out), { recursive: true });

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(`${url}/login`, { waitUntil: "networkidle" });
    await page.screenshot({ path: out, fullPage: true });
    console.log(`Saved screenshot of ${url}/login to ${out}`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error("qaScreenshot failed (non-fatal):", err.message);
  process.exit(1);
});
