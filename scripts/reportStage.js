// Reports a pipeline stage's status to the dashboard's status API.
// Usage: node scripts/reportStage.js --issue SCRUM-8 --stage cert_deploy --status in_progress [--details "..."]
//
// Best-effort only: never fails the build. The dashboard is a visualization aid, not part of
// pipeline correctness — a status API outage must never break a real Cert/UAT deploy.

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--issue") args.issue = argv[++i];
    if (argv[i] === "--stage") args.stage = argv[++i];
    if (argv[i] === "--status") args.status = argv[++i];
    if (argv[i] === "--details") args.details = argv[++i];
  }
  return args;
}

async function main() {
  const { issue, stage, status, details } = parseArgs(process.argv.slice(2));
  const baseUrl = process.env.STATUS_API_URL;
  const token = process.env.STATUS_API_TOKEN;

  if (!baseUrl || !issue || !stage || !status) {
    console.log("reportStage: missing required args/env, skipping (non-fatal)");
    return;
  }

  const res = await fetch(`${baseUrl}/runs/${encodeURIComponent(issue)}/stages/${stage}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token ? { "x-status-token": token } : {}),
    },
    body: JSON.stringify({ status, ...(details ? { details } : {}) }),
  });
  console.log(`reportStage: ${issue} ${stage}=${status} -> HTTP ${res.status}`);
}

main().catch((err) => {
  console.warn("reportStage failed (non-fatal):", err.message);
});
