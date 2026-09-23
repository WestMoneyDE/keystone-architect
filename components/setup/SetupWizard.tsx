"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DisplayNameStep } from "./DisplayNameStep";
import { ProviderWizard } from "./ProviderWizard";
import { RoleSelectionStep } from "./RoleSelectionStep";
import { NewsToggleStep } from "./NewsToggleStep";
import type { NewsMode, RoleCardData } from "./types";

interface SetupWizardProps {
  roles: RoleCardData[];
}

type Step = "name" | "provider" | "roles" | "news";

const STEPS: { id: Step; label: string }[] = [
  { id: "name", label: "Name" },
  { id: "provider", label: "LLM-Anbieter" },
  { id: "roles", label: "Rollen" },
  { id: "news", label: "News" },
];

export function SetupWizard({ roles }: SetupWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("name");
  const [displayName, setDisplayName] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [newsMode, setNewsMode] = useState<NewsMode>("off");
  const [newsRoleIds, setNewsRoleIds] = useState<string[]>([]);
  const [finishing, setFinishing] = useState(false);

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  function toggleRole(roleId: string) {
    setSelectedRoles((prev) => (prev.includes(roleId) ? prev.filter((r) => r !== roleId) : [...prev, roleId]));
  }

  function toggleNewsRole(roleId: string) {
    setNewsRoleIds((prev) => (prev.includes(roleId) ? prev.filter((r) => r !== roleId) : [...prev, roleId]));
  }

  async function finish() {
    setFinishing(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim() || undefined,
          roleIds: selectedRoles,
          newsMode,
          newsRoleIds: newsMode === "roles" ? (newsRoleIds.length > 0 ? newsRoleIds : selectedRoles) : [],
        }),
      });
      router.push("/");
    } finally {
      setFinishing(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Willkommen bei Keystone</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ein paar kurze Schritte, um Keystone auf deine Bedürfnisse einzurichten. Du kannst alles später in den
          Einstellungen ändern.
        </p>
        <div className="mt-4 flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div
                className={`h-2 w-8 rounded-full transition-colors ${
                  i <= stepIndex ? "bg-accent" : "bg-border"
                }`}
              />
              <span className={`text-xs ${i === stepIndex ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}
        >
          {step === "name" && (
            <div className="space-y-6">
              <DisplayNameStep value={displayName} onChange={setDisplayName} />
              <div className="flex items-center justify-end">
                <Button variant="primary" onClick={() => setStep("provider")}>
                  Weiter
                </Button>
              </div>
            </div>
          )}

          {step === "provider" && <ProviderWizard onComplete={() => setStep("roles")} />}

          {step === "roles" && (
            <div className="space-y-6">
              <RoleSelectionStep roles={roles} selected={selectedRoles} onToggle={toggleRole} />
              <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => setStep("provider")}>
                  Zurück
                </Button>
                <Button variant="primary" onClick={() => setStep("news")}>
                  Weiter
                </Button>
              </div>
            </div>
          )}

          {step === "news" && (
            <div className="space-y-6">
              <NewsToggleStep
                roles={roles}
                selectedRoles={selectedRoles}
                mode={newsMode}
                onModeChange={setNewsMode}
                newsRoleIds={newsRoleIds}
                onNewsRoleToggle={toggleNewsRole}
              />
              <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => setStep("roles")}>
                  Zurück
                </Button>
                <Button variant="primary" onClick={finish} disabled={finishing}>
                  {finishing && <Loader2 className="h-4 w-4 animate-spin" />}
                  Fertigstellen
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
