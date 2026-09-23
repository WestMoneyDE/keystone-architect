---
{"id": "KB-0519", "title": "Terraform und OpenTofu", "domain": "22", "sequence": 7, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "MLOPS", "CLOUD"], "requires": [{"id": "KB-0518", "concepts": ["Pipeline-Architektur"], "needed_for": "context"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Deklarative Ressourcendefinitionen sowie Plan- und Apply-Workflows anhand offizieller Dokumentation für reproduzierbare Infrastrukturänderungen korrekt einsetzen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Infrastrukturarchitektur explizit entscheiden, ob Terraform oder OpenTofu geeigneter ist, unter expliziter Prüfung aktueller Lizenz- und Funktionsunterschiede gegen Primärquellen statt veralteter Annahmen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Unerwartete Infrastrukturänderungen bei einem Apply auf eine Diskrepanz zwischen dem tatsächlichen Cloud-Zustand und dem im State gespeicherten Zustand (Drift) zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Infrastructure-as-Code-Standards anhand einer expliziten, aktuellen Bewertung von Terraform versus OpenTofu statt einer veralteten oder pauschalen Werkzeugpräferenz festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung des Terraform-/OpenTofu-Provider-Plugin-Protokolls im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von deklarativem Zustandsmanagement, Plan/Apply und Anbieterbindung als Entscheidungsgrundlage, nicht die Provider-Protokoll-Interna."}}, "lab_validation": [{"lab_id": "KB-0519-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller Terraform- und OpenTofu-Dokumentation zu deklarativer Ressourcenverwaltung, State und Plan/Apply, kein aktives Cloud-Konto verwendet", "evidence": "Anhand offizieller Dokumentation wird nachvollzogen, wie Terraform/OpenTofu Infrastruktur deklarativ (Zielzustand statt Schrittfolge) definieren, wie der State den zuletzt bekannten tatsächlichen Zustand der verwalteten Ressourcen speichert, wie ein Plan den Unterschied zwischen State und deklariertem Zielzustand berechnet, und wie OpenTofu als 2023 nach einer Lizenzänderung von HashiCorp entstandener, quelloffener Fork von Terraform eine funktional weitgehend kompatible Alternative darstellt, deren aktueller Funktionsumfang und Lizenzstatus explizit gegen Primärquellen verifiziert werden muss, da sich beide Projekte seither unabhängig weiterentwickeln.", "limitations": "Kein aktives Cloud-Konto verwendet, keine reale Infrastruktur verwaltet. Da sich Terraform und OpenTofu seit der 2023er Abspaltung unabhängig weiterentwickeln, werden keine spezifischen, zeitpunktgebundenen Funktions- oder Lizenzaussagen über den Recherchezeitpunkt hinaus getroffen; diese müssen gegen aktuelle Primärquellen verifiziert werden."}]}
---
# Terraform und OpenTofu

> **Ziel:** Terraform (und dessen 2023 nach einer HashiCorp-Lizenzänderung entstandener, quelloffener Fork OpenTofu) verwaltet Infrastruktur **deklarativ** — statt einer Schrittfolge von Befehlen wird der gewünschte Zielzustand beschrieben, und das Werkzeug ermittelt selbst, welche Änderungen nötig sind, um diesen Zustand zu erreichen. Der **State** speichert den zuletzt bekannten, tatsächlichen Zustand der verwalteten Ressourcen. Ein **Plan** berechnet die Differenz zwischen deklariertem Zielzustand und State, bevor ein **Apply** diese Differenz tatsächlich umsetzt. Der zentrale Punkt dieses Kapitels ist, dass unerwartete Änderungen bei einem Apply typischerweise nicht auf einen Fehler im deklarierten Code hindeuten, sondern auf **Drift** — eine Diskrepanz zwischen dem im State gespeicherten und dem tatsächlichen Cloud-Zustand, entstanden etwa durch manuelle Änderungen außerhalb des Werkzeugs. Da sich Terraform und OpenTofu seit ihrer Trennung unabhängig weiterentwickeln, sind konkrete Aussagen zu Lizenzbedingungen und Funktionsunterschieden in diesem Kapitel bewusst konservativ gehalten und müssen vor jeder Werkzeugentscheidung explizit gegen aktuelle Primärquellen verifiziert werden.

## Zweck, Mental Model und Dependencies

Das deklarative Modell löst das Problem, dass imperative Infrastrukturänderungen (eine feste Abfolge von Befehlen) bei wiederholter Ausführung oder bei unterschiedlichem Ausgangszustand zu inkonsistenten Ergebnissen führen können — ein deklarierter Zielzustand ("diese Ressource soll mit diesen Eigenschaften existieren") ist dagegen idempotent: Eine wiederholte Anwendung derselben Deklaration führt, ausgehend vom selben Zustand, zuverlässig zum selben Ergebnis. Der State ist die zentrale, aber auch fragile Komponente dieses Modells — er repräsentiert die "Wahrheit" darüber, welche realen Ressourcen vom Werkzeug verwaltet werden und in welchem Zustand sie sich zuletzt befanden. Drift entsteht, wenn sich die tatsächliche Cloud-Ressource ändert, ohne dass diese Änderung über das Werkzeug erfolgte (etwa eine manuelle Änderung über die Cloud-Konsole) — der State weiß von dieser Änderung nichts, wodurch der nächste Plan eine unerwartete, potenziell überraschende Differenz zwischen dem (veralteten) State und dem tatsächlichen Cloud-Zustand anzeigt, die leicht mit einem Fehler im deklarierten Code verwechselt werden kann, obwohl die Ursache in der externen, nicht über das Werkzeug erfolgten Änderung liegt. OpenTofu entstand 2023, nachdem HashiCorp die Lizenz von Terraform von einer offenen Open-Source-Lizenz auf die restriktivere Business Source License änderte — eine Gruppe von Unternehmen und Entwicklern forkte den letzten frei lizenzierten Terraform-Codestand als OpenTofu unter einer weiterhin offenen Lizenz. Seither entwickeln sich beide Projekte unabhängig weiter, mit anfänglich weitgehender funktionaler Kompatibilität, die sich jedoch mit der Zeit auseinanderentwickeln kann — konkrete Aussagen darüber, welches Werkzeug zu einem gegebenen Zeitpunkt welche Funktionen unterstützt oder welche Lizenzbedingungen gelten, müssen daher stets gegen aktuelle Primärquellen verifiziert werden, statt sich auf den Stand zum Zeitpunkt dieser Recherche (2026-09-18) zu verlassen.

~~~text
Terraform / OpenTofu: DECLARATIVE infrastructure management
  declare TARGET state (not step sequence) -> tool determines needed changes -> IDEMPOTENT
State: stores last-known ACTUAL state of managed resources -- central but FRAGILE
Plan: computes diff between declared target state and State
Apply: actually executes that diff
DRIFT: actual cloud state changes WITHOUT going through the tool (e.g. manual console change)
  -> State doesn't know about it -> next Plan shows UNEXPECTED diff
  -> easily mistaken for a code bug, but ROOT CAUSE = external change outside the tool
OpenTofu: 2023 fork of Terraform, created after HashiCorp changed license
  (open source -> restrictive Business Source License)
  -> forked last freely-licensed Terraform codebase under a still-open license
  -> BOTH evolve INDEPENDENTLY since -- initial near-full compatibility MAY diverge over time
CAUTION: license/feature claims here deliberately conservative -> MUST verify against current primary sources
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Deklarativer Zielzustand | beschreibt gewünschtes Ergebnis, nicht Schrittfolge | ermöglicht idempotente, wiederholbare Anwendung |
| State | speichert zuletzt bekannten, tatsächlichen Ressourcenzustand | zentrale, aber fragile Komponente, Quelle von Drift-Problemen |
| Plan/Apply | berechnet und setzt Differenz zwischen Zielzustand und State um | unerwartete Plan-Ergebnisse deuten häufig auf Drift hin |
| Terraform versus OpenTofu | unabhängig weiterentwickelte, ursprünglich kompatible Werkzeuge | aktuelle Lizenz-/Funktionsunterschiede müssen verifiziert werden |

Implementierung: Vor jedem Apply wird der Plan explizit geprüft, um unerwartete Änderungen (potenzielles Drift-Signal) von beabsichtigten Änderungen zu unterscheiden. Manuelle Änderungen an über Terraform/OpenTofu verwalteten Ressourcen werden vermieden, um Drift zu verhindern; falls sie unumgänglich sind, wird der State explizit synchronisiert. Vor jeder Werkzeugentscheidung zwischen Terraform und OpenTofu wird die aktuelle Lizenz- und Funktionslage explizit gegen aktuelle Primärquellen verifiziert, statt auf einer möglicherweise veralteten Einschätzung zu basieren.

## Scalability, Reliability, Security und Observability

Terraform/OpenTofu skaliert die Infrastrukturkonsistenz proportional zur Disziplin, alle Änderungen ausschließlich über das deklarative Werkzeug vorzunehmen; die Reliability-Grenze liegt darin, dass manuelle, außerhalb des Werkzeugs vorgenommene Änderungen proportional zu ihrer Häufigkeit Drift akkumulieren und die Verlässlichkeit zukünftiger Plans untergraben.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Plan zeigt unerwartete Änderungen, obwohl der deklarative Code unverändert ist | die tatsächliche Cloud-Ressource wurde außerhalb des Werkzeugs manuell verändert (Drift) | die betroffene Ressource explizit mit dem tatsächlichen Cloud-Zustand abgleichen und den State synchronisieren |
| ein Apply schlägt mit einem Zustandskonflikt fehl | mehrere Personen oder Prozesse greifen gleichzeitig auf denselben State zu | einen State-Locking-Mechanismus einrichten, der gleichzeitigen Zugriff verhindert |
| eine Werkzeugentscheidung basiert auf veralteten Lizenz- oder Funktionsannahmen | die Annahme stammt aus einer früheren Recherche ohne aktuelle Verifikation | die aktuelle Lizenz- und Funktionslage explizit gegen Primärquellen zum Entscheidungszeitpunkt prüfen |

Security: State-Dateien enthalten häufig sensible Informationen (z. B. generierte Zugangsdaten) und sollten verschlüsselt und mit granularem Zugriffsschutz gespeichert werden, nicht im Klartext oder ungeschützt im Versionskontrollsystem. Observability: Die Häufigkeit von Drift-Erkennungen, die Zeit zwischen Plan-Erstellung und Apply, und die Konsistenz des State-Zugriffs (Locking-Konflikte) sind relevante Betriebssignale.

## Trade-offs und Entscheidungen

**Staff** erstellt und wendet deklarative Ressourcendefinitionen korrekt an. **Principal** entwirft die State-Management- und Drift-Erkennungsstrategie für eine Infrastrukturarchitektur. **Chief** legt unternehmensweite Infrastructure-as-Code-Standards fest, basierend auf einer aktuellen, verifizierten Bewertung von Terraform versus OpenTofu statt einer veralteten Annahme.

Anti-Patterns: manuelle Änderungen an über das Werkzeug verwalteten Ressourcen vornehmen und dadurch unkontrolliertes Drift akkumulieren; State-Dateien ungeschützt oder im Klartext speichern; eine Werkzeugentscheidung zwischen Terraform und OpenTofu auf veralteten Lizenz- oder Funktionsannahmen statt aktueller Verifikation treffen.

## Production Checklist

- [ ] Alle Infrastrukturänderungen erfolgen ausschließlich über das deklarative Werkzeug, keine manuellen Änderungen.
- [ ] Ein Plan wird vor jedem Apply explizit geprüft, um Drift-Signale zu erkennen.
- [ ] State-Dateien sind verschlüsselt und mit granularem Zugriffsschutz gespeichert.
- [ ] Die Terraform-versus-OpenTofu-Entscheidung basiert auf aktuell verifizierten Lizenz- und Funktionsinformationen.

## Interviewfragen

### 1. Was bedeutet "deklarativ" im Kontext von Terraform/OpenTofu?

**Antwort:** Der gewünschte Zielzustand der Infrastruktur wird beschrieben, statt einer Schrittfolge von Befehlen — das Werkzeug ermittelt selbst, welche Änderungen zum Erreichen dieses Zustands nötig sind.

### 2. Was ist Drift, und warum ist es eine häufige Ursache unerwarteter Plan-Ergebnisse?

**Antwort:** Drift ist eine Diskrepanz zwischen dem im State gespeicherten und dem tatsächlichen Cloud-Zustand, meist durch manuelle Änderungen außerhalb des Werkzeugs entstanden — der nächste Plan zeigt dann eine unerwartete Differenz.

### 3. Wie ist OpenTofu entstanden?

**Antwort:** Als 2023 entstandener, quelloffener Fork von Terraform, nachdem HashiCorp die Terraform-Lizenz von einer offenen Lizenz auf die restriktivere Business Source License änderte.

### 4. Warum sind konkrete Aussagen zu Terraform-versus-OpenTofu-Unterschieden in diesem Kapitel bewusst konservativ gehalten?

**Antwort:** Weil sich beide Projekte seit ihrer Trennung unabhängig weiterentwickeln und Lizenz- sowie Funktionsunterschiede sich über die Zeit ändern können, sodass jede konkrete Aussage gegen aktuelle Primärquellen verifiziert werden muss.

### 5. Wie gehst du vor, wenn ein Plan unerwartete Änderungen zeigt, obwohl der deklarative Code unverändert ist?

**Antwort:** Ich prüfe, ob die betroffene Cloud-Ressource außerhalb des Werkzeugs manuell verändert wurde (Drift), statt zuerst einen Fehler im deklarierten Code zu vermuten.

### 6. Widersprüchliche Anforderung: Team will schnelle, manuelle Notfalländerungen an Produktionsressourcen in dringenden Situationen UND vollständige, driftfreie Konsistenz zwischen State und tatsächlichem Cloud-Zustand — wie gehst du vor?

**Antwort:** Ich würde einen definierten Notfallprozess etablieren, der manuelle Änderungen in dringenden Situationen erlaubt, aber verbindlich vorschreibt, den State unmittelbar danach explizit mit dem tatsächlichen Zustand zu synchronisieren oder die Änderung nachträglich in den deklarativen Code zu übernehmen, statt manuelle Änderungen entweder ganz zu verbieten oder unkontrolliert Drift akkumulieren zu lassen.

## Praktische Labs

~~~python
# Conceptual drift detection between declared state and actual cloud state (not executed against a real cloud account):

def detect_drift(declared_state, stored_state, actual_cloud_state):
    drift_from_manual_change = stored_state != actual_cloud_state
    plan_diff = declared_state != actual_cloud_state
    return {
        "drift_detected": drift_from_manual_change,
        "plan_would_show_unexpected_diff": drift_from_manual_change and plan_diff,
    }

declared_state = {"instance_type": "medium"}
stored_state = {"instance_type": "medium"}
actual_cloud_state = {"instance_type": "large"}

print(detect_drift(declared_state, stored_state, actual_cloud_state))
~~~

## Dependencies, Cross-References und Quellen

1. Terraform-Dokumentation: [Terraform State](https://developer.hashicorp.com/terraform/language/state), abgerufen 2026-09-18.
2. OpenTofu-Dokumentation: [OpenTofu Overview](https://opentofu.org/docs/intro/), abgerufen 2026-09-18.

Pipeline-Architektur ist kanonisch in [KB-0518](06-pipeline-architektur.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, automatisierte Drift-Erkennung und -Behebung als kontinuierlicher Hintergrundprozess statt nur bei manuellem Plan-Aufruf | Evaluating | Gegenüber ausschließlich manuellem Plan-basiertem Drift-Check erst nach Prüfung der tatsächlichen Zuverlässigkeit und potenzieller unbeabsichtigter automatischer Korrekturen bevorzugen. |

Ein Team akzeptiert eine Terraform-/OpenTofu-Nutzung erst, wenn State-Management, Drift-Erkennung und die Werkzeugwahl nachweislich auf aktuell verifizierten, nicht veralteten Annahmen basieren.
