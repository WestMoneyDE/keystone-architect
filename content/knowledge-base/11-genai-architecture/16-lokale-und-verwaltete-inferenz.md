---
{"id": "KB-0256", "title": "Lokale und verwaltete Inferenz", "domain": "11", "sequence": 16, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI"], "requires": [{"id": "KB-0251", "concepts": ["Providerabstraktion"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Entscheidungsmodell für die Wahl zwischen lokaler und verwalteter Inferenz anhand Datenhoheits-, Betriebs- und Verfügbarkeitskriterien implementieren.", "rationale": "Der Trade-off zwischen Kontrolle und Betriebsaufwand wird erst durch konkrete Kriterien-Abwägung greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Lokale versus verwaltete Inferenz für einen konkreten Anwendungsfall begründet abwägen, basierend auf Datenhoheit, Betriebsaufwand und Modellverfügbarkeit.", "rationale": "Beide Optionen haben fundamentale Trade-offs, die je nach Datenschutzanforderungen und organisatorischer Betriebsfähigkeit unterschiedlich zu gewichten sind."}, "STAFF-TARGET": {"active": true, "scope": "Unerwartet hohen Betriebsaufwand nach der Wahl lokaler Inferenz auf unterschätzten GPU-Infrastrukturbedarf statt auf ein allgemeines Betriebsproblem zurückführen können.", "rationale": "Lokale Inferenz verlagert Betriebsverantwortung (GPU-Kapazität, Verfügbarkeit, Skalierung) vom Anbieter zum eigenen Team, was oft unterschätzt wird."}, "CHIEF-TARGET": {"active": true, "scope": "Die Wahl zwischen lokaler und verwalteter Inferenz als Datenhoheits- und Betriebsfähigkeits-Entscheidung positionieren, nicht als reine Kostenfrage.", "rationale": "Datenhoheit (Kontrolle über Datenverarbeitungsort) und organisatorische Betriebsfähigkeit sind oft entscheidender als reine Kostenvergleiche."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "GPU-Serving-Infrastrukturdetails sind kanonisch in Domain 17 behandelt und hier bewusst nicht vertieft.", "rationale": "Diese Datei behandelt die Architekturentscheidung zwischen lokaler und verwalteter Inferenz, nicht die technische Serving-Infrastruktur."}}, "lab_validation": [{"lab_id": "KB-0256-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Entscheidungskriterien zwischen lokaler und verwalteter Inferenz", "evidence": "Ein Entscheidungsmodell, das Datenhoheitsanforderungen, verfügbare Betriebskapazität und benötigte Modellvielfalt gewichtet, kann systematisch zwischen lokaler und verwalteter Inferenz unterscheiden, statt eine pauschale Präferenz anzunehmen.", "limitations": "Kein echtes Inferenzsystem, keine reale GPU-Infrastruktur, keine Produktion."}]}
---
# Lokale und verwaltete Inferenz

> **Ziel:** Lokale Inferenz (z. B. über Ollama, selbst betriebene Modelle) und verwaltete Inferenz (Managed APIs externer Anbieter) haben fundamentale Trade-offs bezüglich Datenhoheit, Betriebsaufwand und Modellverfügbarkeit — die Wahl ist primär eine Datenhoheits- und Betriebsfähigkeits-Entscheidung, keine reine Kostenfrage. GPU-Serving-Infrastrukturdetails werden bewusst nicht hier, sondern kanonisch in Domain 17 behandelt.

## Zweck, Mental Model und Dependencies

Datenhoheit beschreibt, wo und wie Daten während der Inferenz verarbeitet werden — bei lokaler Inferenz verlassen Daten nie die eigene Infrastruktur, was für Anwendungsfälle mit strengen Datenschutz- oder Compliance-Anforderungen (siehe verwandte Providerabstraktions-Datenschutzüberlegungen in [KB-0251](11-providerabstraktion-und-portabilitaet.md)) ein entscheidender Vorteil sein kann; bei verwalteter Inferenz werden Daten an einen externen Anbieter übermittelt, dessen Datenverarbeitungsbedingungen explizit geprüft werden müssen. Betriebsaufwand ist bei lokaler Inferenz erheblich höher: das eigene Team ist verantwortlich für GPU-Infrastrukturbeschaffung, -Kapazitätsplanung, -Skalierung und -Verfügbarkeit, während bei verwalteter Inferenz diese Verantwortung beim externen Anbieter liegt, der typischerweise auf hochskalierte, spezialisierte Infrastruktur zurückgreifen kann. Modellverfügbarkeit unterscheidet sich ebenfalls: verwaltete Anbieter bieten oft Zugriff auf die neuesten, leistungsfähigsten Modelle, während lokale Inferenz auf Modelle beschränkt ist, die tatsächlich lokal lauffähig sind (oft kleinere, weniger leistungsfähige Modelle, es sei denn, erhebliche GPU-Ressourcen sind verfügbar). Der zentrale Denkfehler ist, diese Entscheidung primär als Kostenvergleich zu betrachten — die tatsächlich entscheidenden Faktoren sind oft Datenhoheitsanforderungen (die keinen Kompromiss zulassen) und organisatorische Betriebsfähigkeit (kann das Team GPU-Infrastruktur tatsächlich zuverlässig betreiben).

~~~text
Local inference (e.g. Ollama):    data never leaves own infrastructure -> full data sovereignty, HIGH operational burden (GPU capacity, scaling)
Managed inference (external API): data sent to external provider -> data processing terms must be checked, LOW operational burden
Model availability: managed often has latest/most capable models; local limited by actually deployable model size
Decision driver: data sovereignty requirements + organizational operational capability, NOT primarily cost comparison
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Datenhoheitsanforderungen | erfordert der Anwendungsfall zwingend, dass Daten die eigene Infrastruktur nicht verlassen? | verwaltete Inferenz für Daten mit strengen Datenhoheitsanforderungen gewählt, Compliance-Risiko |
| Betriebsfähigkeitseinschätzung | ist realistisch eingeschätzt, ob das Team GPU-Infrastruktur zuverlässig selbst betreiben kann? | lokale Inferenz gewählt, ohne tatsächliche Betriebsfähigkeit für GPU-Kapazitätsmanagement zu haben |
| Modellverfügbarkeits-Anforderungen | ist geprüft, ob die für den Anwendungsfall benötigte Modellleistungsfähigkeit lokal überhaupt erreichbar ist? | lokale Inferenz für eine Aufgabe gewählt, die tatsächlich die Leistungsfähigkeit eines größeren, nur verwaltet verfügbaren Modells benötigt |
| Hybride Strategien | ist geprüft, ob eine Kombination (sensible Daten lokal, andere Anfragen verwaltet) sinnvoll ist? | pauschale Entscheidung für nur eine Option, obwohl unterschiedliche Anfrageklassen unterschiedliche Anforderungen haben |

Implementierung: Datenhoheitsanforderungen werden für jeden Anwendungsfall explizit geprüft, bevor eine Inferenzstrategie gewählt wird — bei zwingenden Anforderungen (z. B. regulatorisch bedingt) wird lokale Inferenz als nicht verhandelbare Voraussetzung behandelt, nicht als eine von mehreren gleichwertigen Optionen. Die tatsächliche organisatorische Fähigkeit, GPU-Infrastruktur zuverlässig zu betreiben, wird realistisch eingeschätzt (vorhandene Expertise, Kapazitätsplanungsprozesse), statt lokale Inferenz aus Kostengründen zu wählen, ohne die Betriebsfähigkeit sicherzustellen. Modellverfügbarkeitsanforderungen werden gegen tatsächlich lokal deploybare Modellgrößen geprüft, mit Bewusstsein dafür, dass lokale Inferenz oft mit geringerer Modellleistungsfähigkeit verbunden ist, es sei denn, erhebliche GPU-Ressourcen werden investiert. Hybride Strategien werden bewusst evaluiert, bei denen sensible Datenklassen lokal verarbeitet werden, während weniger sensible Anfragen verwaltete Inferenz nutzen können, statt eine pauschale Entscheidung für die gesamte Anwendung zu treffen.

## Scalability, Reliability, Security und Observability

Verwaltete Inferenz skaliert Modellzugriff typischerweise besser über schwankende Lastprofile, da der Anbieter Infrastruktur elastisch bereitstellt, während lokale Inferenz durch die eigene, oft statisch dimensionierte GPU-Kapazität begrenzt ist. Reliability-Grenze: lokale Inferenz verlagert die Verantwortung für Hochverfügbarkeit vollständig zum eigenen Team — ohne entsprechende Betriebsfähigkeit kann ein GPU-Infrastrukturausfall zu einer vollständigen Nichtverfügbarkeit führen, die bei verwalteter Inferenz durch die Redundanz des Anbieters oft abgefedert wird.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Betriebsaufwand für lokale Inferenz ist deutlich höher als ursprünglich geplant | GPU-Infrastrukturbedarf (Kapazitätsplanung, Skalierung, Verfügbarkeit) wurde bei der ursprünglichen Entscheidung unterschätzt | tatsächlichen Betriebsaufwand gegen die ursprüngliche Planungsannahme vergleichen |
| lokale Inferenz liefert für bestimmte Aufgaben unzureichende Qualität | benötigte Modellleistungsfähigkeit übersteigt das lokal deploybare Modell | Qualität mit einem größeren, nur verwaltet verfügbaren Modell für dieselbe Aufgabe vergleichen |
| ein Compliance-Audit deckt eine unzulässige Datenübermittlung an einen externen Anbieter auf | Datenhoheitsanforderungen wurden bei der Inferenzstrategie-Wahl nicht ausreichend geprüft | Datenklassifikation der betroffenen Anfragen gegen die tatsächlich genutzte Inferenzstrategie prüfen |
| Team wünscht sich nachträglich eine differenziertere Strategie statt einer pauschalen Entscheidung | fehlende hybride Strategie, obwohl unterschiedliche Anfrageklassen unterschiedliche Anforderungen haben | Anfrageklassen nach tatsächlichen Datenhoheits- und Qualitätsanforderungen segmentieren und Strategie neu bewerten |

Security: bei verwalteter Inferenz müssen Datenverarbeitungsbedingungen des externen Anbieters explizit geprüft werden (Speicherort, Aufbewahrungsdauer, Nutzung für Modelltraining), während bei lokaler Inferenz die vollständige Verantwortung für Infrastruktursicherheit beim eigenen Team liegt. Observability: tatsächlicher GPU-Auslastungsgrad und -Verfügbarkeit bei lokaler Inferenz, Datenhoheits-Compliance-Status pro Anfrageklasse und Qualitätsvergleich zwischen lokalen und verwalteten Optionen sind zentrale Metriken für diese Architekturentscheidung.

## Trade-offs und Entscheidungen

**Staff** prüft Datenhoheitsanforderungen explizit vor jeder Inferenzstrategie-Entscheidung. **Principal** macht die tatsächliche organisatorische Betriebsfähigkeit für GPU-Infrastruktur für das Team realistisch nachvollziehbar. **Chief** positioniert die Wahl zwischen lokaler und verwalteter Inferenz als Datenhoheits- und Betriebsfähigkeits-Entscheidung, nicht als reine Kostenfrage.

Anti-Patterns: lokale Inferenz primär aus Kostengründen wählen, ohne tatsächliche Betriebsfähigkeit für GPU-Infrastruktur sicherzustellen; Datenhoheitsanforderungen erst nach der Inferenzstrategie-Wahl prüfen, statt sie als Voraussetzung zu behandeln; eine pauschale Entscheidung für die gesamte Anwendung treffen, ohne hybride Strategien für unterschiedliche Anfrageklassen zu evaluieren.

## Production Checklist

- [ ] Datenhoheitsanforderungen sind vor der Inferenzstrategie-Wahl explizit geprüft.
- [ ] Organisatorische Betriebsfähigkeit für GPU-Infrastruktur ist realistisch eingeschätzt.
- [ ] Modellverfügbarkeitsanforderungen sind gegen tatsächlich lokal deploybare Modellgrößen geprüft.
- [ ] Hybride Strategien sind für unterschiedliche Anfrageklassen evaluiert.

## Interviewfragen

### 1. Warum ist die Wahl zwischen lokaler und verwalteter Inferenz primär eine Datenhoheits- und Betriebsfähigkeits-Entscheidung, nicht nur eine Kostenfrage?

**Antwort:** Datenhoheitsanforderungen (z. B. regulatorisch bedingt) lassen oft keinen Kompromiss zu, und organisatorische Betriebsfähigkeit (kann das Team GPU-Infrastruktur zuverlässig betreiben) bestimmt, ob lokale Inferenz überhaupt praktikabel ist — reine Kostenvergleiche übersehen diese oft entscheidenderen Faktoren.

### 2. Warum wird der Betriebsaufwand lokaler Inferenz oft unterschätzt?

**Antwort:** Lokale Inferenz verlagert die vollständige Verantwortung für GPU-Kapazitätsplanung, Skalierung und Verfügbarkeit vom externen Anbieter zum eigenen Team — dieser Aufwand wird oft unterschätzt, wenn nur die direkten Infrastrukturkosten, nicht aber der Betriebsaufwand, betrachtet werden.

### 3. Warum bietet verwaltete Inferenz oft Zugriff auf leistungsfähigere Modelle als lokale Inferenz?

**Antwort:** Verwaltete Anbieter betreiben hochskalierte, spezialisierte Infrastruktur, die größere und leistungsfähigere Modelle bereitstellen kann; lokale Inferenz ist auf tatsächlich lokal deploybare Modellgrößen beschränkt, die oft kleiner und weniger leistungsfähig sind, sofern nicht erhebliche eigene GPU-Ressourcen investiert werden.

### 4. Wie diagnostizierst du, dass GPU-Infrastrukturbedarf bei der Wahl lokaler Inferenz unterschätzt wurde?

**Antwort:** Ich vergleiche den tatsächlichen Betriebsaufwand (Kapazitätsplanung, Skalierungsvorfälle, Verfügbarkeitsprobleme) gegen die ursprüngliche Planungsannahme — eine deutliche Diskrepanz bestätigt, dass der Betriebsaufwand bei der ursprünglichen Entscheidung unterschätzt wurde.

### 5. Warum sollten hybride Strategien (lokal für sensible Daten, verwaltet für andere) bewusst evaluiert werden?

**Antwort:** Unterschiedliche Anfrageklassen können unterschiedliche Datenhoheits- und Qualitätsanforderungen haben; eine pauschale Entscheidung für nur eine Option kann entweder unnötig hohen Betriebsaufwand (alles lokal) oder unangemessene Datenhoheits-Kompromisse (alles verwaltet) für die jeweils nicht passende Anfrageklasse erzeugen.

### 6. Widersprüchliche Anforderung: Team will vollständige Datenhoheit für alle Anfragen (alles lokal) UND Zugriff auf die leistungsfähigsten verfügbaren Modelle für beste Qualität — wie gehst du vor?

**Antwort:** Ich würde erklären, dass die leistungsfähigsten verfügbaren Modelle oft nur über verwaltete Inferenz zugänglich sind, was dem Ziel vollständiger lokaler Datenhoheit strukturell entgegensteht; ich würde vorschlagen, entweder in erhebliche eigene GPU-Ressourcen zu investieren, um leistungsfähigere lokale Modelle zu ermöglichen, oder eine hybride Strategie zu evaluieren, bei der nur besonders qualitätskritische, aber nicht datenhoheitskritische Anfragen verwaltete Inferenz nutzen.

## Praktische Labs

~~~python
# Decision model for local vs managed inference
def decide_inference_strategy(data_sovereignty_required, team_gpu_operational_capability, required_model_tier):
    if data_sovereignty_required:
        if team_gpu_operational_capability == "low":
            return "BLOCKED: data sovereignty required but team cannot operate GPU infra reliably - address operational capability first"
        if required_model_tier == "frontier" and team_gpu_operational_capability != "high":
            return "PARTIAL RISK: local inference required, but frontier-tier model may not be feasible locally - reassess model requirement"
        return "LOCAL inference required and feasible"
    else:
        return "MANAGED inference (no sovereignty constraint) - evaluate on cost/quality/latency"

scenarios = [
    (True, "low", "small"),
    (True, "high", "frontier"),
    (False, "low", "frontier"),
]

for sovereignty, capability, tier in scenarios:
    result = decide_inference_strategy(sovereignty, capability, tier)
    print(f"sovereignty={sovereignty}, capability={capability}, tier={tier} -> {result}")
~~~

## Dependencies, Cross-References und Quellen

1. Ollama: [Ollama Documentation](https://ollama.com/docs), abgerufen 2026-09-17.
2. Anthropic: [Data Usage and Privacy Policy](https://www.anthropic.com/legal/privacy), abgerufen 2026-09-17.
3. Hugging Face: [Self-Hosted vs. Managed Inference Trade-offs](https://huggingface.co/docs/inference-endpoints/index), abgerufen 2026-09-17.

Providerabstraktions-Grundlagen sind kanonisch in [KB-0251](11-providerabstraktion-und-portabilitaet.md) behandelt. GPU-Serving-Infrastrukturdetails sind kanonisch in Domain 17 behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Effizientere, quantisierte Modellvarianten, die leistungsfähigere lokale Inferenz mit geringerem GPU-Bedarf ermöglichen | Adopting | Für lokale Bereitstellung gegenüber unquantisierten Modellen bei begrenzter GPU-Kapazität bevorzugen. |
| Hybride Edge-/Cloud-Inferenz-Architekturen mit dynamischem Routing zwischen lokal und verwaltet | Adopting | Für Anwendungsfälle mit gemischten Datenhoheits- und Qualitätsanforderungen evaluieren. |

Ein Team akzeptiert eine Inferenzstrategie-Entscheidung erst, wenn Datenhoheitsanforderungen und tatsächliche Betriebsfähigkeit nachweisbar geprüft sind.
