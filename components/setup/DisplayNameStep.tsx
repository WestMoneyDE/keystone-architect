"use client";

import { Avatar } from "@/components/ui/Avatar";

interface DisplayNameStepProps {
  value: string;
  onChange: (value: string) => void;
}

const PLACEHOLDER = "Architect";

export function DisplayNameStep({ value, onChange }: DisplayNameStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Wie sollen wir dich nennen?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Das ist nur ein lokaler Anzeigename — kein Account, keine E-Mail-Adresse. Er personalisiert die
          Oberfläche und erzeugt deinen Avatar (ein deterministisches, rein clientseitig gerendertes
          &bdquo;Blobatar&ldquo;: derselbe Name ergibt immer denselben Avatar, ohne Bild-Upload oder Netzwerkaufruf).
          Du kannst dieses Feld leer lassen — es blockiert den Fortschritt nicht.
        </p>
      </div>

      <div className="flex items-center gap-5 rounded-xl border border-border bg-surface p-5">
        {/* Bound directly to `value` with no debounce and no confirm step —
            the avatar must visibly change on every keystroke. */}
        <Avatar name={value} size={64} className="rounded-full shrink-0" />
        <div className="flex-1">
          <label htmlFor="display-name" className="mb-1.5 block text-sm font-medium text-foreground">
            Anzeigename
          </label>
          <input
            id="display-name"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={PLACEHOLDER}
            autoComplete="off"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Leer gelassen verwenden wir &bdquo;{PLACEHOLDER}&ldquo; als Platzhalter in der Oberfläche.
          </p>
        </div>
      </div>
    </div>
  );
}
