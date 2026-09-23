import cron, { type ScheduledTask } from "node-cron";
import { runNewsFetchCycle } from "./fetchCycle";

// Default: every 12 hours, per the plan's item 8 ("interval configurable,
// default 12h"). Override with NEWS_CRON_SCHEDULE for testing (e.g. "*/1 *
// * * *" to run every minute) without touching this file.
const DEFAULT_SCHEDULE = "0 */12 * * *";

// Singleton guard. Next.js re-executes route/module code across hot
// reloads in dev and can also import this module from multiple code paths
// in a single server process; stashing the task on `globalThis` (same
// pattern as lib/db.ts's PrismaClient singleton) ensures `node-cron`'s
// `cron.schedule` is only ever called once per running server process, so
// dev hot-reload never registers a second duplicate interval and the app
// never double-fetches.
const globalForNewsCron = globalThis as unknown as {
  __keystoneNewsCronTask?: ScheduledTask;
};

export function startNewsCron(): void {
  if (globalForNewsCron.__keystoneNewsCronTask) {
    return; // already running in this process
  }

  const schedule = process.env.NEWS_CRON_SCHEDULE || DEFAULT_SCHEDULE;

  if (!cron.validate(schedule)) {
    console.error(`[news/cron] Invalid NEWS_CRON_SCHEDULE "${schedule}" — news cron not started.`);
    return;
  }

  const task = cron.schedule(schedule, () => {
    runNewsFetchCycle().catch((err) => {
      console.error("[news/cron] Unhandled error in scheduled fetch cycle:", err);
    });
  });

  globalForNewsCron.__keystoneNewsCronTask = task;
  console.log(`[news/cron] News fetch scheduler started (schedule: "${schedule}").`);
}
