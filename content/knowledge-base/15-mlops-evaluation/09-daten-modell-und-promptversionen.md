---
{"id": "KB-0359", "title": "Daten-, Modell- und Promptversionen", "domain": "15", "sequence": 9, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0358", "concepts": ["AI-Lineage und Abhängigkeiten"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein gemeinsames Release-Set aus Daten-, Modell- und Promptversion definieren und einen simulierten Rollback auf ein vorheriges Release-Set durchführen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Release-Set-Struktur gestalten, die Daten-, Modell- und Promptversionen als atomare Einheit versioniert, um reproduzierbare Evaluation über veränderte Retrieval- oder Providerstände hinweg zu ermöglichen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Ein Team davon überzeugen, Daten-, Modell- und Promptversionen als gemeinsames, atomares Release-Set statt unabhängig voneinander zu versionieren, um Rollbackfähigkeit zu erhalten.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Atomare Release-Sets über Daten-, Modell- und Promptversionen als Standard für reproduzierbare, rollbackfähige GenAI-Systeme im Unternehmen etablieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die Versionierung externer, nicht selbst kontrollierter LLM-Provider-Modellstände ist Vertiefung.", "rationale": "Kern ist das Verständnis von Release-Sets als atomarer Einheit, nicht die Behandlung jedes einzelnen Providertyps."}}, "lab_validation": [{"lab_id": "KB-0359-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simuliertes Release-Set-Modell mit unabhängiger Versionierung gegenüber atomarer Release-Set-Versionierung", "evidence": "Eine unabhängige Versionierung von Daten-, Modell- und Promptversion führt bei einem simulierten Rollback nur der Modellversion zu einer inkonsistenten Kombination mit einer inzwischen geänderten Promptversion, während ein atomares Release-Set bei einem Rollback konsistent alle drei Versionen gemeinsam zurücksetzt.", "limitations": "Kein produktives Release-System, kein realer Geschäftsdatensatz, kleine simulierte Versionshistorie."}]}
---
# Daten-, Modell- und Promptversionen

> **Ziel:** Ein Release-Set fasst Daten-, Modell- und Promptversion zu einer gemeinsamen, atomaren Versionseinheit zusammen, aufbauend auf der Lineage-Verkettung aus [KB-0358](08-ai-lineage-und-abhaengigkeiten.md). Der zentrale Punkt ist, dass Rollbackfähigkeit und reproduzierbare Evaluation nur dann zuverlässig funktionieren, wenn diese drei Versionsarten gemeinsam statt unabhängig voneinander versioniert werden — insbesondere wenn zusätzlich externe, nicht selbst kontrollierte Faktoren wie veränderte Retrieval-Indexstände oder LLM-Provider-Modellstände hinzukommen.

## Zweck, Mental Model und Dependencies

Werden Daten-, Modell- und Promptversion unabhängig voneinander versioniert (jede mit ihrer eigenen Versionshistorie), entsteht ein konkretes Konsistenzrisiko: ein Rollback der Modellversion allein kann zu einer Kombination mit einer inzwischen weiterentwickelten Promptversion führen, die mit dieser älteren Modellversion nie gemeinsam getestet wurde — das System befindet sich dann in einem Zustand, der so nie evaluiert wurde, obwohl jede einzelne Komponente für sich eine "gültige, frühere Version" ist. Ein Release-Set löst dieses Problem, indem es Daten-, Modell- und Promptversion als eine gemeinsame, atomare Einheit definiert: ein Rollback betrifft immer das gesamte Release-Set, sodass stets eine tatsächlich gemeinsam getestete Kombination aktiv ist. Dies wird zusätzlich dadurch erschwert, dass bei GenAI-Systemen oft externe, nicht selbst kontrollierte Faktoren hinzukommen — ein Retrieval-Index kann sich unabhängig ändern (siehe Retrieval-Grundlagen), oder ein extern gehosteter LLM-Provider kann sein zugrunde liegendes Modell ohne explizite Versionsänderung auf Nutzerseite austauschen. Ein Release-Set muss daher auch dokumentieren, welcher Retrieval-Indexstand und welcher (soweit feststellbar) Provider-Modellstand zum Zeitpunkt einer Evaluation aktiv war, auch wenn diese nicht vollständig unter eigener Kontrolle versioniert werden können.

~~~text
Independent versioning (data v_x, model v_y, prompt v_z each with own history):
  RISK: rolling back model alone -> combines with a CURRENT prompt version never tested together with that model
  -> system enters a state that was NEVER actually evaluated, despite each component being individually "valid"
Release Set: data + model + prompt versioned as ONE ATOMIC UNIT
  -> rollback always reverts the WHOLE set -> always an actually-tested combination
ADDITIONAL COMPLICATION (GenAI-specific): external, not self-controlled factors
  retrieval index can change independently
  LLM provider can swap underlying model WITHOUT an explicit version change visible to the user
  -> release set must document the observed retrieval/provider state AT evaluation time, even if not fully controllable
~~~

## Core Concepts, Architektur und Implementierung

| Element | Rolle im Release-Set | Risiko bei unabhängiger Versionierung |
|---|---|---|
| Datenversion | Teil der atomaren Einheit | ein Rollback anderer Komponenten kann mit einer inkompatiblen Datenversion kombiniert werden |
| Modellversion | Teil der atomaren Einheit | ein Modell-Rollback kann mit einer nie gemeinsam getesteten Promptversion kombiniert werden |
| Promptversion | Teil der atomaren Einheit | eine Prompt-Änderung kann unbemerkt mit einer älteren, inkompatiblen Modellversion kombiniert bleiben |
| Beobachteter Retrieval-/Provider-Stand | dokumentiert, aber nicht immer vollständig kontrollierbar | Evaluationsergebnisse können durch unbemerkte externe Änderungen nicht mehr reproduzierbar sein |

Implementierung: Daten-, Modell- und Promptversion werden gemeinsam unter einer einzigen Release-Set-Kennung verwaltet, die bei jeder Änderung einer der drei Komponenten inkrementiert wird. Ein Rollback erfolgt stets auf ein vollständiges, zuvor tatsächlich getestetes Release-Set, nie auf eine einzelne Komponente isoliert. Bei jeder Evaluation wird zusätzlich der zum Zeitpunkt beobachtete Retrieval-Indexstand und, soweit feststellbar, der Provider-Modellstand dokumentiert, um spätere Reproduzierbarkeitsprobleme durch externe Änderungen erklärbar zu machen.

## Scalability, Reliability, Security und Observability

Atomare Release-Sets skalieren Rollbackfähigkeit unabhängig von der Anzahl unabhängig veränderlicher Komponenten; die Reliability-Grenze liegt darin, dass externe, nicht selbst kontrollierte Faktoren (Provider-Modelländerungen) die Reproduzierbarkeit auch bei perfekt verwaltetem eigenem Release-Set einschränken können.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| nach einem Rollback der Modellversion verhält sich das System unerwartet anders als bei der ursprünglichen getesteten Kombination | die aktuelle Promptversion wurde nie gemeinsam mit der zurückgesetzten Modellversion getestet | auf ein vollständiges, zuvor getestetes Release-Set statt nur der Modellversion zurücksetzen |
| eine frühere Evaluation lässt sich nicht mehr reproduzieren, obwohl Daten-, Modell- und Promptversion unverändert scheinen | ein externer LLM-Provider hat sein zugrunde liegendes Modell ohne sichtbare Versionsänderung ausgetauscht | den dokumentierten Provider-Modellstand zum ursprünglichen Evaluationszeitpunkt prüfen und mit dem aktuellen Stand vergleichen |
| ein Retrieval-basiertes System liefert nach einer Indexaktualisierung unerwartet andere Antworten bei identischem Prompt und Modell | der Retrieval-Indexstand wurde nicht als Teil der Evaluationsbedingungen dokumentiert | den dokumentierten Indexstand zum Evaluationszeitpunkt mit dem aktuellen Stand vergleichen |

Security: Ein inkonsistentes Release-Set (z. B. eine zurückgesetzte Modellversion kombiniert mit einer neueren, ungetesteten Promptversion) kann zu unvorhergesehenem, potenziell unsicherem Verhalten führen, das durch keine der Einzelkomponenten-Evaluationen abgedeckt war. Observability: Die Release-Set-Kennung jeder produktiven Konfiguration, der dokumentierte Retrieval-/Provider-Stand zum Evaluationszeitpunkt und die Häufigkeit inkonsistenter (nicht als atomares Set verwalteter) Rollbacks sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert Daten-, Modell- und Promptversionierung als gemeinsames, atomares Release-Set. **Principal** macht die aktive Release-Set-Kennung und dokumentierte externe Stände für das Team nachvollziehbar. **Chief** etabliert atomare Release-Sets als Standard für reproduzierbare, rollbackfähige GenAI-Systeme im Unternehmen.

Anti-Patterns: Daten-, Modell- und Promptversion unabhängig voneinander versionieren und isoliert zurücksetzen; Evaluationsergebnisse ohne Dokumentation des beobachteten Retrieval-/Provider-Stands als reproduzierbar annehmen; einen Rollback ohne Prüfung durchführen, ob die zurückgesetzte Komponente jemals mit den aktuell aktiven anderen Komponenten getestet wurde.

## Production Checklist

- [ ] Daten-, Modell- und Promptversion sind unter einer gemeinsamen Release-Set-Kennung verwaltet.
- [ ] Ein Rollback erfolgt stets auf ein vollständiges, zuvor getestetes Release-Set.
- [ ] Der beobachtete Retrieval-Indexstand ist bei jeder Evaluation dokumentiert.
- [ ] Der beobachtete Provider-Modellstand ist bei jeder Evaluation dokumentiert, soweit feststellbar.

## Interviewfragen

### 1. Welches Risiko entsteht bei unabhängiger Versionierung von Daten-, Modell- und Promptversion?

**Antwort:** Ein Rollback einer einzelnen Komponente kann zu einer Kombination mit einer anderen, inzwischen weiterentwickelten Komponente führen, die nie gemeinsam getestet wurde, obwohl jede Komponente für sich eine gültige frühere Version ist.

### 2. Was ist ein Release-Set, und welches Problem löst es?

**Antwort:** Eine gemeinsame, atomare Versionseinheit aus Daten-, Modell- und Promptversion; ein Rollback betrifft immer das gesamte Set, sodass stets eine tatsächlich gemeinsam getestete Kombination aktiv ist.

### 3. Warum ist die Versionierung bei GenAI-Systemen besonders komplex?

**Antwort:** Zusätzlich zu selbst kontrollierten Daten-, Modell- und Promptversionen können externe, nicht vollständig kontrollierbare Faktoren wie ein sich ändernder Retrieval-Index oder ein vom Provider ausgetauschtes zugrunde liegendes Modell hinzukommen.

### 4. Wie gehst du mit der Tatsache um, dass ein LLM-Provider sein Modell ohne sichtbare Versionsänderung austauschen kann?

**Antwort:** Ich dokumentiere den beobachteten Provider-Modellstand zum Zeitpunkt jeder Evaluation, auch wenn er nicht vollständig kontrollierbar ist, um spätere Reproduzierbarkeitsprobleme erklärbar zu machen.

### 5. Wie diagnostizierst du unerwartetes Verhalten nach einem Rollback der Modellversion allein?

**Antwort:** Ich prüfe, ob die aktuell aktive Promptversion jemals gemeinsam mit der zurückgesetzten Modellversion getestet wurde, und setze bei Bedarf auf ein vollständiges, zuvor getestetes Release-Set zurück.

### 6. Widersprüchliche Anforderung: Team will unabhängige, schnelle Änderungen an Prompts UND garantiert konsistente, rollbackfähige Release-Sets — wie gehst du vor?

**Antwort:** Ich würde jede Prompt-Änderung automatisch ein neues Release-Set erzeugen lassen, das die zu diesem Zeitpunkt aktiven Daten- und Modellversionen einschließt, sodass Prompt-Änderungen weiterhin schnell und unabhängig vorgenommen werden können, während jedes entstehende Release-Set als konsistente, rollbackfähige Einheit erhalten bleibt.

## Praktische Labs

~~~python
release_sets = []

def create_release_set(data_version, model_version, prompt_version, retrieval_index_state, provider_state):
    release_id = f"rs_{len(release_sets) + 1}"
    release_sets.append({
        "release_id": release_id,
        "data_version": data_version,
        "model_version": model_version,
        "prompt_version": prompt_version,
        "retrieval_index_state": retrieval_index_state,
        "provider_state": provider_state,
    })
    return release_id

rs1 = create_release_set("data_v1", "model_v1", "prompt_v1", "index_2026_08", "provider_snapshot_A")
rs2 = create_release_set("data_v1", "model_v1", "prompt_v2", "index_2026_09", "provider_snapshot_A")

# Risky pattern: independent rollback of ONLY the model, leaving prompt at its current (v2) version
independent_rollback_state = {"model_version": "model_v0", "prompt_version": "prompt_v2"}
tested_combinations = {(r["model_version"], r["prompt_version"]) for r in release_sets}
is_tested = (independent_rollback_state["model_version"], independent_rollback_state["prompt_version"]) in tested_combinations
print(f"Independent rollback combination ever tested together? {is_tested}")

# Safe pattern: rollback to a full, previously tested release set
def rollback_to_release_set(release_id):
    return next(r for r in release_sets if r["release_id"] == release_id)

print(f"Safe rollback restores fully-tested combination: {rollback_to_release_set('rs1')}")
~~~

## Dependencies, Cross-References und Quellen

1. Sculley et al.: [Hidden Technical Debt in Machine Learning Systems](https://papers.nips.cc/paper_files/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html), abgerufen 2026-09-17.
2. OpenLineage-Dokumentation: [Concepts — Lineage Metadata](https://openlineage.io/docs/spec/facets/), abgerufen 2026-09-17.

AI-Lineage und Abhängigkeiten sind kanonisch in [KB-0358](08-ai-lineage-und-abhaengigkeiten.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Release-Set-Verwaltungswerkzeuge, die Daten-, Modell- und Promptversion als eine Einheit orchestrieren | Adopting | Gegenüber manuell koordinierter, getrennter Versionierung für konsistentere, weniger fehleranfällige Rollbacks bevorzugen. |
| Provider-Modelländerungs-Erkennung durch automatisierte Antwortverhalten-Sondierung (Canary-Prompts) | Evaluating | Gegenüber reinem Vertrauen auf Provider-Versionsangaben abwägen, sobald ein zuverlässiges Sondierungsverfahren für den konkreten Provider verfügbar ist. |

Ein Team akzeptiert eine produktive Konfigurationsänderung erst, wenn sie als vollständiges, konsistentes Release-Set mit dokumentiertem Retrieval-/Provider-Stand vorliegt.
