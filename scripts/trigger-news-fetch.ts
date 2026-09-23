// Manual on-demand trigger for the news fetch cycle — for local testing and
// verification only, NOT part of the running app's routes. Runs the exact
// same code path the node-cron scheduler calls every 12h
// (lib/news/fetchCycle.ts's runNewsFetchCycle), respecting FeatureFlags
// gating. Usage: `npx tsx scripts/trigger-news-fetch.ts`
import { runNewsFetchCycle } from "../lib/news/fetchCycle";
import { db } from "../lib/db";

async function main() {
  const summary = await runNewsFetchCycle();
  console.log(JSON.stringify(summary, null, 2));
  await db.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
