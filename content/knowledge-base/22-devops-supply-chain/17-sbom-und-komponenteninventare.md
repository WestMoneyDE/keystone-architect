---
{"id": "KB-0529", "title": "SBOM und Komponenteninventare", "domain": "22", "sequence": 17, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "MLOPS", "CLOUD"], "requires": [{"id": "KB-0528", "concepts": ["Artifact Registries"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine SBOM anhand offizieller Standards korrekt generieren und deren Vollständigkeit sowie Aktualität von tatsächlicher Verwundbarkeitsfreiheit unterscheiden können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Lieferkette explizit einen Prozess gestalten, der SBOM-Generierung, Aktualisierung bei Abhängigkeitsänderungen, und aktiven Abgleich mit Schwachstellendatenbanken kombiniert.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine falsch als sicher eingestufte Komponente auf eine vorhandene, aber veraltete oder unvollständige SBOM zurückführen können, die eine neu entdeckte Schwachstelle in einer transitiven Abhängigkeit nicht abbildet.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Supply-Chain-Sicherheitsstandards anhand aktiver SBOM-Schwachstellenprüfung statt bloßer SBOM-Existenz als Compliance-Nachweis festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die Detailmechanik spezifischer SBOM-Formate (SPDX, CycloneDX) im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis der Unterscheidung zwischen SBOM-Vollständigkeit und tatsächlicher Sicherheitsbewertung, nicht die formatspezifische Syntax."}}, "lab_validation": [{"lab_id": "KB-0529-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation veralteter SBOM-Daten gegenüber aktueller Schwachstellendatenbank, kein produktives SBOM-System verwendet", "evidence": "Ein lokales Skript simuliert, wie eine zum Build-Zeitpunkt vollständige und korrekte SBOM eine später (nach dem Build) öffentlich bekannt gewordene Schwachstelle in einer bereits enthaltenen Komponente nicht automatisch abbildet, sofern die SBOM nicht aktiv und wiederholt gegen eine aktuelle Schwachstellendatenbank abgeglichen wird, und zeigt damit, dass SBOM-Existenz allein keine tatsächliche, fortlaufende Verwundbarkeitsfreiheit garantiert.", "limitations": "Simulation mit synthetischen, deterministischen Daten, keine reale Schwachstellendatenbank-Anbindung."}]}
---
# SBOM und Komponenteninventare

> **Ziel:** Eine Software Bill of Materials (SBOM) erfasst systematisch alle **Komponenten**, deren **Versionen** und **Abhängigkeitsbeziehungen** (direkte und transitive Abhängigkeiten) eines Software-Artefakts, das über eine Artifact Registry verwaltet wird (siehe [KB-0528](16-artifact-registries.md)). Der zentrale Punkt dieses Kapitels ist die klare Unterscheidung zwischen **SBOM-Vollständigkeit** (alle tatsächlich verwendeten Komponenten sind korrekt erfasst) und **tatsächlicher Verwundbarkeitsfreiheit oder Vertrauenswürdigkeit** (keine der erfassten Komponenten weist eine bekannte Schwachstelle auf) — eine vollständige, zum Build-Zeitpunkt korrekte SBOM garantiert keine fortlaufende Sicherheit, da neue Schwachstellen in bereits enthaltenen Komponenten jederzeit nach dem Build öffentlich bekannt werden können. Eine SBOM allein, ohne aktiven, wiederholten Abgleich gegen aktuelle Schwachstellendatenbanken, ist ein Inventar, kein Sicherheitsnachweis — eine falsch als sicher eingestufte Komponente ist häufig nicht das Ergebnis einer fehlenden SBOM, sondern einer vorhandenen, aber veralteten SBOM, die nicht erneut gegen aktuelle Schwachstellendaten geprüft wurde.

## Zweck, Mental Model und Dependencies

Eine SBOM löst das grundlegende Sichtbarkeitsproblem moderner Software-Lieferketten: Eine einzelne Anwendung besteht typischerweise aus Hunderten oder Tausenden direkter und transitiver Abhängigkeiten, deren vollständige Zusammensetzung ohne systematische Erfassung nicht überblickbar ist — ohne SBOM lässt sich die Frage "ist Komponente X in unserer Produktivumgebung enthalten?" bei bekanntwerden einer neuen, kritischen Schwachstelle nicht zuverlässig und zeitnah beantworten. Die SBOM erfasst dabei nicht nur direkte Abhängigkeiten (explizit in einer Projektkonfiguration deklariert), sondern auch transitive Abhängigkeiten (Abhängigkeiten der Abhängigkeiten), die häufig die größere und schwerer zu überblickende Angriffsfläche darstellen, da sie nicht direkt vom eigenen Entwicklungsteam ausgewählt oder aktiv überwacht werden. Die zentrale konzeptionelle Trennung ist, dass eine SBOM ein Zustandsschnappschuss zu einem bestimmten Zeitpunkt (typischerweise dem Build-Zeitpunkt) ist — sie dokumentiert korrekt, welche Komponenten zu diesem Zeitpunkt enthalten waren, sagt aber nichts über zukünftig entdeckte Schwachstellen in diesen Komponenten aus. Eine Schwachstelle, die erst Wochen nach dem Build öffentlich bekannt wird, betrifft eine Komponente, die bereits vollständig und korrekt in der SBOM erfasst war — die SBOM selbst ändert sich dadurch nicht, aber die tatsächliche Sicherheitslage der Komponente hat sich geändert. Eine belastbare Supply-Chain-Sicherheitspraxis erfordert daher zwei getrennte, aber verbundene Prozesse: die Generierung einer vollständigen, aktuellen SBOM bei jedem Build, und einen fortlaufenden, wiederholten Abgleich dieser SBOM-Daten gegen aktuelle Schwachstellendatenbanken (nicht nur einmalig zum Build-Zeitpunkt) — ohne diesen zweiten, kontinuierlichen Prozess bleibt eine SBOM ein bloßes Inventar, dessen Existenz allein keine tatsächliche, fortlaufende Sicherheitsgarantie darstellt.

~~~text
SBOM (Software Bill of Materials): systematically records COMPONENTS + VERSIONS + DEPENDENCY relationships
  (of artifacts managed via Artifact Registry, see KB-0528)
  covers DIRECT deps (explicitly declared) + TRANSITIVE deps (deps of deps)
    -> transitive deps = larger, harder-to-oversee attack surface, not directly chosen by own team
KEY CONCEPTUAL SEPARATION: SBOM is a STATE SNAPSHOT at a point in time (build time)
  correctly documents what WAS included at that time
  says NOTHING about vulnerabilities discovered LATER in those same components
  vulnerability discovered weeks after build -> affects a component ALREADY correctly in the SBOM
    -> SBOM itself doesn't change, but actual security posture of that component DID
TWO SEPARATE, CONNECTED processes needed:
  1. generate complete, current SBOM at every build
  2. CONTINUOUS, REPEATED matching of SBOM data against CURRENT vulnerability databases
     (not just once at build time)
  -> WITHOUT process 2: SBOM = mere inventory, existence alone != ongoing security guarantee
falsely "safe" classified component -> usually NOT missing SBOM
  -> usually EXISTING but STALE SBOM never re-checked against current vulnerability data
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Direkte Abhängigkeiten | explizit deklarierte Komponenten | vom Team aktiv gewählt und überwacht |
| Transitive Abhängigkeiten | Abhängigkeiten der Abhängigkeiten | größere, schwerer überblickbare Angriffsfläche |
| SBOM als Zustandsschnappschuss | korrekte Erfassung zum Build-Zeitpunkt | garantiert keine fortlaufende Sicherheit |
| Kontinuierlicher Schwachstellenabgleich | wiederholte Prüfung gegen aktuelle Datenbanken | notwendig, da Schwachstellen nach Build bekannt werden können |

Implementierung: Für jeden Build wird eine vollständige SBOM automatisiert generiert und mit dem entsprechenden Artefakt in der Artifact Registry verknüpft. Ein kontinuierlicher, automatisierter Prozess gleicht die SBOM-Daten wiederholt (nicht nur einmalig) gegen aktuelle Schwachstellendatenbanken ab, um neu entdeckte Schwachstellen in bereits deployten Artefakten zu erkennen. Transitive Abhängigkeiten werden mit derselben Sorgfalt wie direkte Abhängigkeiten in die SBOM einbezogen, statt sich nur auf explizit deklarierte Komponenten zu beschränken.

## Scalability, Reliability, Security und Observability

SBOM-basierte Supply-Chain-Sicherheit skaliert die tatsächliche Schutzwirkung proportional zur Frequenz des kontinuierlichen Schwachstellenabgleichs; die Reliability-Grenze liegt darin, dass eine nur einmalig zum Build-Zeitpunkt geprüfte SBOM proportional zur Zeit seit dem Build zunehmend veraltete Sicherheitsinformationen liefert.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Komponente wird trotz bekannter, kritischer Schwachstelle als sicher eingestuft | die SBOM existiert, wurde aber seit dem Build nicht erneut gegen aktuelle Schwachstellendaten geprüft | einen kontinuierlichen, wiederholten Abgleichsprozess statt einmaliger Build-Zeit-Prüfung einführen |
| eine kritische Schwachstelle in einer transitiven Abhängigkeit bleibt unbemerkt | die SBOM erfasst nur direkte, nicht transitive Abhängigkeiten vollständig | die SBOM-Generierung explizit auf vollständige Erfassung transitiver Abhängigkeiten prüfen |
| unklar, welche deployten Artefakte von einer neu bekanntgewordenen Schwachstelle betroffen sind | keine zentrale, durchsuchbare SBOM-Sammlung über alle deployten Artefakte existiert | eine zentrale, durchsuchbare SBOM-Sammlung mit Verknüpfung zu tatsächlich deployten Artefakten einrichten |

Security: SBOM-Daten sollten nicht nur einmalig zum Build-Zeitpunkt, sondern kontinuierlich gegen aktuelle Schwachstellendatenbanken abgeglichen werden, mit automatisierter Alarmierung bei neu entdeckten, relevanten Schwachstellen. Observability: Die tatsächliche Abdeckung der SBOM-Generierung über alle Artefakte hinweg, die Frequenz des Schwachstellenabgleichs, und die Reaktionszeit auf neu entdeckte, relevante Schwachstellen sind zentrale Sicherheitssignale.

## Trade-offs und Entscheidungen

**Staff** generiert eine vollständige SBOM für ein gegebenes Artefakt korrekt. **Principal** entwirft den kontinuierlichen SBOM-Generierungs- und Schwachstellenabgleichsprozess für eine vollständige Lieferkette. **Chief** legt unternehmensweite Supply-Chain-Sicherheitsstandards fest, die aktiven Schwachstellenabgleich statt bloßer SBOM-Existenz als Compliance-Nachweis vorschreiben.

Anti-Patterns: SBOM-Existenz als ausreichenden Sicherheitsnachweis behandeln, ohne kontinuierlichen Schwachstellenabgleich; transitive Abhängigkeiten unvollständig oder gar nicht in die SBOM einbeziehen; SBOM-Daten nur einmalig zum Build-Zeitpunkt statt fortlaufend gegen aktuelle Schwachstellendatenbanken prüfen.

## Production Checklist

- [ ] Jeder Build generiert automatisiert eine vollständige SBOM, inklusive transitiver Abhängigkeiten.
- [ ] Ein kontinuierlicher, automatisierter Prozess gleicht SBOM-Daten wiederholt gegen aktuelle Schwachstellendatenbanken ab.
- [ ] Eine zentrale, durchsuchbare SBOM-Sammlung ist mit tatsächlich deployten Artefakten verknüpft.
- [ ] Neu entdeckte, relevante Schwachstellen lösen eine automatisierte Alarmierung aus.

## Interviewfragen

### 1. Was erfasst eine SBOM?

**Antwort:** Alle Komponenten, deren Versionen und Abhängigkeitsbeziehungen (direkte und transitive) eines Software-Artefakts.

### 2. Warum garantiert eine vollständige, korrekte SBOM keine fortlaufende Sicherheit?

**Antwort:** Weil eine SBOM ein Zustandsschnappschuss zum Build-Zeitpunkt ist — sie dokumentiert korrekt, was zu diesem Zeitpunkt enthalten war, sagt aber nichts über Schwachstellen aus, die erst später in bereits enthaltenen Komponenten entdeckt werden.

### 3. Warum sind transitive Abhängigkeiten für die SBOM-Vollständigkeit besonders wichtig?

**Antwort:** Weil sie eine größere, schwerer überblickbare Angriffsfläche darstellen, da sie nicht direkt vom eigenen Team ausgewählt oder aktiv überwacht werden, aber dennoch Teil der tatsächlichen Softwarezusammensetzung sind.

### 4. Was ist notwendig, damit eine SBOM tatsächlich zur Sicherheit beiträgt, statt nur ein Inventar zu sein?

**Antwort:** Ein kontinuierlicher, wiederholter Abgleich der SBOM-Daten gegen aktuelle Schwachstellendatenbanken, nicht nur eine einmalige Prüfung zum Build-Zeitpunkt.

### 5. Wie gehst du vor, wenn eine Komponente trotz bekannter, kritischer Schwachstelle fälschlich als sicher eingestuft wird?

**Antwort:** Ich prüfe, ob die vorhandene SBOM seit dem Build erneut gegen aktuelle Schwachstellendaten abgeglichen wurde, da dies die häufigste Ursache für eine fälschlich als sicher eingestufte Komponente ist, nicht eine fehlende SBOM.

### 6. Widersprüchliche Anforderung: Compliance-Team will als Nachweis lediglich die Existenz einer SBOM pro Release UND tatsächlich reduziertes Sicherheitsrisiko durch bekannte Schwachstellen — wie gehst du vor?

**Antwort:** Ich würde erklären, dass bloße SBOM-Existenz allein keine Sicherheitsgarantie darstellt, und vorschlagen, den Compliance-Nachweis um einen dokumentierten, kontinuierlichen Schwachstellenabgleichsprozess zu erweitern — SBOM-Existenz und tatsächliche Risikoreduktion sind unterschiedliche Ziele, die beide explizit adressiert werden müssen, statt SBOM-Existenz fälschlich als hinreichenden Sicherheitsnachweis zu behandeln.

## Praktische Labs

~~~python
# Local, deterministic simulation of stale SBOM vs newly-discovered vulnerability (executed locally, no real vulnerability database):

def check_component_safety(sbom_components, vulnerability_db, last_checked_date, current_date):
    stale = current_date != last_checked_date
    vulnerable_components = [c for c in sbom_components if c in vulnerability_db]
    return {
        "sbom_is_stale": stale,
        "known_vulnerable_components_at_last_check": vulnerable_components if not stale else "UNKNOWN -- recheck needed",
    }

sbom_components = ["libfoo-1.2", "libbar-3.0"]
vulnerability_db_at_build_time = []  # no known vulnerabilities at build time
vulnerability_db_now = ["libbar-3.0"]  # vulnerability discovered AFTER build

print("at build time:", check_component_safety(sbom_components, vulnerability_db_at_build_time, "2026-09-01", "2026-09-01"))
print("weeks later, SBOM never rechecked:", check_component_safety(sbom_components, vulnerability_db_now, "2026-09-01", "2026-09-18"))
~~~

## Dependencies, Cross-References und Quellen

1. CISA-Dokumentation: [Software Bill of Materials (SBOM) Overview](https://www.cisa.gov/sbom), abgerufen 2026-09-18.
2. SPDX-Dokumentation: [SPDX Specification Overview](https://spdx.dev/learn/overview/), abgerufen 2026-09-18.

Artifact Registries sind kanonisch in [KB-0528](16-artifact-registries.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, automatisierte VEX-Dokumente (Vulnerability Exploitability eXchange) zur präzisen Angabe, ob eine bekannte Schwachstelle in einer Komponente tatsächlich im konkreten Nutzungskontext ausnutzbar ist | Evaluating | Gegenüber pauschaler Behandlung jeder gelisteten Schwachstelle als kritisch erst nach Prüfung der tatsächlichen VEX-Abdeckung und Genauigkeit für die konkrete Lieferkette bevorzugen. |

Ein Team akzeptiert eine SBOM-Praxis erst, wenn nachweislich ein kontinuierlicher, wiederholter Schwachstellenabgleich existiert, nicht nur eine einmalige SBOM-Generierung zum Build-Zeitpunkt.
