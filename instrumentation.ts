// Next.js instrumentation hook (stable since Next 15, no config flag
// needed). `register()` runs exactly once when a new server instance boots
// — this is the cleanest single-initialization point for a long-running
// background job in a Next.js app: it does NOT re-run per-request, and (in
// dev) does NOT re-run on every hot-reload edit (those only re-execute
// route/page modules, not the instrumentation entrypoint). The extra
// globalThis guard inside lib/news/scheduler.ts's startNewsCron() is a
// belt-and-suspenders safeguard in case this ever gets invoked more than
// once in the same process (e.g. multiple runtimes).
export async function register() {
  // Only start the cron in the actual Node.js server runtime — this file
  // also gets evaluated for the edge runtime bundle, where node-cron
  // (which relies on Node timers/process) doesn't belong.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startNewsCron } = await import("@/lib/news/scheduler");
    startNewsCron();
  }
}
