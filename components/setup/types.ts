export interface RoleCardData {
  roleId: string;
  label: string;
  shortDescription: string;
  tier: "executive" | "core" | "emerging-specialist";
  indicativeRateMinUsd: number;
  indicativeRateMaxUsd: number;
  rateDisclaimer: string;
}

export type NewsMode = "off" | "global" | "roles";

export type ProviderId = "openai" | "anthropic" | "claude-cli" | "codex-cli";
