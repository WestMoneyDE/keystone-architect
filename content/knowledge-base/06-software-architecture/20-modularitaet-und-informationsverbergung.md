---
{"id": "KB-0148", "title": "Modularität und Informationsverbergung", "domain": "06", "sequence": 20, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0136", "concepts": ["Modularer Monolith"], "needed_for": "both"}], "related": ["KB-0149", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Modul mit gekapselter, veränderlicher Implementierungsentscheidung lokal implementieren und eine Implementierungsänderung ohne Auswirkung auf Konsumenten zeigen.", "rationale": "Kein reales System nötig, um das Prinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Modulgrenzen so ziehen, dass wahrscheinlich veränderliche Entscheidungen hinter stabilen Schnittstellen verborgen sind.", "rationale": "Die Kernfrage guter Modularität ist nicht Größe, sondern welche Änderungen die Grenze abfängt."}, "STAFF-TARGET": {"active": true, "scope": "Eine ungeplante Implementierungsänderung, die dennoch viele Konsumenten betraf, auf mangelnde Informationsverbergung zurückführen.", "rationale": "Das zeigt, wo eine Modulgrenze fälschlich als stabil angenommen wurde."}, "CHIEF-TARGET": {"active": true, "scope": "Modulgrößen-Diskussionen von der eigentlichen Frage der Informationsverbergung trennen und entsprechend priorisieren.", "rationale": "Modulgröße allein ist kein verlässlicher Qualitätsindikator."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Parnas' ursprüngliche Kriterien zur Modulzerlegung im Detail sind Vertiefung.", "rationale": "Kern ist das Prinzip: verberge, was sich wahrscheinlich ändert."}}, "lab_validation": [{"lab_id": "KB-0148-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für ein Modul mit verborgener Implementierungsentscheidung", "evidence": "Ein Wechsel des internen Sortieralgorithmus innerhalb eines Moduls ändert dessen öffentliche Schnittstelle nicht, Konsumenten bleiben unberührt.", "limitations": "Kein reales System, keine Produktion."}]}
---
# Modularität und Informationsverbergung

> **Ziel:** Gute Modularität bemisst sich nicht an Modulgröße, sondern daran, ob wahrscheinlich veränderliche Implementierungsentscheidungen hinter stabilen Schnittstellen verborgen sind (Information Hiding nach Parnas). Ein Modul ist gut geschnitten, wenn eine interne Änderung keine Auswirkung auf Konsumenten hat — nicht, weil es eine bestimmte Zeilenzahl hat.

## Zweck, Mental Model und Dependencies

David Parnas' klassisches Kriterium für Modulzerlegung: zerlege ein System nicht nach Ablaufschritten, sondern nach „Design-Entscheidungen, die sich wahrscheinlich ändern werden" — jede solche Entscheidung wird in genau einem Modul verborgen, dessen öffentliche Schnittstelle stabil bleibt, auch wenn sich die interne Implementierung ändert. Das ist eine tiefere Frage als „wie groß sollte ein Modul sein" — ein kleines Modul mit durchsickernden Implementierungsdetails ist schlechter modularisiert als ein größeres mit sauber verborgenen Entscheidungen. Dies ist dieselbe Grundidee wie die Datenhoheit im modularen Monolithen ([KB-0136](08-modularer-monolith.md)), hier als allgemeines Prinzip. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0136](08-modularer-monolith.md).

~~~text
Good hiding:  Module.sort(list) -> internal algorithm (quicksort/mergesort) can change freely, interface unchanged
Poor hiding:  Consumer directly checks Module.internal_pivot_choice -> internal change now breaks the consumer
~~~

## Core Concepts, Architektur und Implementierung

| Kriterium | Frage | Risiko bei Fehlen |
|---|---|---|
| Veränderlichkeitsvorhersage | welche Entscheidungen sind wahrscheinlich künftig zu ändern? | stabile Entscheidungen werden unnötig versteckt, volatile bleiben exponiert |
| Schnittstellenstabilität | bleibt die öffentliche Schnittstelle bei interner Änderung unverändert? | jede interne Änderung wird zum Breaking Change für Konsumenten |
| Geteilte Infrastruktur | nutzen mehrere Module dieselbe, implizit geteilte Ressource? | eine Änderung an geteilter Infrastruktur betrifft alle Nutzer gleichzeitig |
| Modulgröße | ist die Größe eine Folge der Kapselung oder ein Selbstzweck? | künstlich kleine Module ohne echte Kapselungslogik bringen keinen Vorteil |

Implementierung: bei der Modulzerlegung wird explizit gefragt, welche Design-Entscheidungen sich wahrscheinlich ändern werden (Algorithmus, Datenspeicherformat, externe Bibliothek), und genau diese werden in einem Modul mit stabiler Schnittstelle gekapselt. Geteilte Infrastruktur (z. B. eine gemeinsame Utility-Bibliothek, die von vielen Modulen genutzt wird) wird kritisch geprüft, da eine Änderung daran implizit alle nutzenden Module gleichzeitig betrifft — das ist ein Kopplungspunkt, der oft übersehen wird.

## Scalability, Reliability, Security und Observability

Gute Informationsverbergung skaliert Teamautonomie: ein Team kann seine interne Implementierung frei weiterentwickeln, solange die öffentliche Schnittstelle stabil bleibt, ohne andere Teams zu koordinieren. Reliability-Grenze: eine Modulgrenze, die zwar existiert, aber eine wahrscheinlich veränderliche Entscheidung nicht tatsächlich verbirgt (z. B. weil Konsumenten interne Implementierungsdetails über einen Umweg beobachten können), bietet nur scheinbare Stabilität — die Änderung bricht Konsumenten trotzdem.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine interne Implementierungsänderung bricht viele Konsumenten | Modulgrenze verbirgt die geänderte Entscheidung nicht tatsächlich | prüfen, ob Konsumenten interne Details direkt oder indirekt beobachten konnten |
| Änderung an einer geteilten Utility-Bibliothek betrifft unerwartet viele Module | implizite, ungeplante Kopplung über geteilte Infrastruktur | Abhängigkeiten von der geteilten Ressource explizit auflisten |
| ein Team fühlt sich durch künstlich kleine Module ausgebremst | Modulzerlegung nach Größe statt nach Kapselungslogik | prüfen, ob die Modulgrenzen tatsächlich veränderliche Entscheidungen verbergen |
| dieselbe Design-Entscheidung ist über mehrere Module verstreut implementiert | fehlende Kapselung, Entscheidung nicht in einem Modul zentralisiert | Vorkommen derselben Entscheidungslogik über Module hinweg suchen |

Security: sicherheitsrelevante Entscheidungen (z. B. Verschlüsselungsalgorithmus) sollten in einem Modul gekapselt sein, dessen Austausch (z. B. bei einer Sicherheitslücke im Algorithmus) keine Änderung an allen Konsumenten erfordert. Observability: die Häufigkeit, mit der eine interne Änderung Konsumenten bricht, ist ein direktes Messsignal für die Qualität der Informationsverbergung.

## Trade-offs und Entscheidungen

**Staff** fragt bei jeder Modulzerlegung explizit, welche Entscheidungen sich wahrscheinlich ändern werden, statt nur auf Modulgröße zu achten. **Principal** identifiziert implizite Kopplung über geteilte Infrastruktur und macht sie explizit sichtbar. **Chief** trennt Diskussionen über Modulgröße von der eigentlichen Frage der Informationsverbergung und priorisiert Letzteres.

Anti-Patterns: Module ausschließlich nach Größe/Zeilenzahl zerlegen, ohne zu fragen, welche Entscheidung tatsächlich verborgen wird; öffentliche Schnittstellen, die interne Implementierungsdetails durchsickern lassen (z. B. interne Datenstrukturen direkt exponieren); geteilte Infrastruktur ohne explizite Kopplungsanalyse einführen.

## Production Checklist

- [ ] Modulzerlegung basiert auf identifizierten, wahrscheinlich veränderlichen Design-Entscheidungen.
- [ ] Öffentliche Schnittstellen bleiben bei interner Implementierungsänderung stabil (verifiziert, nicht nur angenommen).
- [ ] Geteilte Infrastruktur und ihre impliziten Kopplungseffekte explizit dokumentiert.
- [ ] Modulgröße ist Ergebnis der Kapselungslogik, nicht ein selbstständiges Ziel.

## Interviewfragen

### 1. Was ist Parnas' Kriterium für gute Modulzerlegung?

**Antwort:** Zerlege ein System nach Design-Entscheidungen, die sich wahrscheinlich ändern werden — jede solche Entscheidung wird in einem Modul mit stabiler Schnittstelle verborgen, statt nach Ablaufschritten oder willkürlicher Größe zu zerlegen.

### 2. Warum ist Modulgröße kein verlässlicher Qualitätsindikator?

**Antwort:** Ein kleines Modul kann trotzdem interne Implementierungsdetails durchsickern lassen und damit schlecht kapseln, während ein größeres Modul mit sauberer Kapselung stabiler gegenüber internen Änderungen sein kann.

### 3. Wie erkennst du, dass eine Modulgrenze eine Entscheidung nicht tatsächlich verbirgt?

**Antwort:** Wenn eine interne Implementierungsänderung trotz unveränderter öffentlicher Schnittstelle Konsumenten bricht — das zeigt, dass Konsumenten interne Details direkt oder indirekt beobachten konnten.

### 4. Warum ist geteilte Infrastruktur ein oft übersehener Kopplungspunkt?

**Antwort:** Mehrere Module, die implizit dieselbe geteilte Ressource (z. B. eine gemeinsame Bibliothek) nutzen, sind dadurch gekoppelt, auch wenn ihre offiziellen Modulgrenzen sauber getrennt erscheinen.

### 5. Wie wählst du, welche Entscheidung in einem Modul verborgen werden sollte?

**Antwort:** Anhand der Wahrscheinlichkeit künftiger Änderung — Entscheidungen, die sich voraussichtlich ändern werden (Algorithmus, Speicherformat, externe Abhängigkeit), verdienen Kapselung; stabile, unveränderliche Entscheidungen brauchen das weniger dringend.

### 6. Widersprüchliche Anforderung: Team will maximale Kapselung für jede Entscheidung UND minimalen Abstraktionsaufwand — wie gehst du vor?

**Antwort:** Ich würde Kapselungsaufwand gezielt für Entscheidungen mit tatsächlich hoher Änderungswahrscheinlichkeit investieren und stabile, unwahrscheinlich zu ändernde Entscheidungen bewusst direkter belassen, statt pauschal jede Entscheidung gleich stark zu kapseln.

## Praktische Labs

~~~python
class SortModule:
    def sort(self, data):
        return self._quicksort(data)  # hidden implementation decision
    def _quicksort(self, data):
        return sorted(data)  # simplified for demonstration

module = SortModule()
result1 = module.sort([3, 1, 2])

class SortModule:  # internal algorithm changed
    def sort(self, data):
        return self._mergesort(data)
    def _mergesort(self, data):
        return sorted(data)  # different internal approach, same interface

module2 = SortModule()
result2 = module2.sort([3, 1, 2])
assert result1 == result2 == [1, 2, 3]
print("Internal algorithm changed freely; the public interface and consumer behavior stayed identical.")
~~~

## Dependencies, Cross-References und Quellen

1. Parnas: [On the Criteria to Be Used in Decomposing Systems into Modules](https://prl.ccs.neu.edu/img/p-tr-1971.pdf), Communications of the ACM 1972, abgerufen 2026-09-17.

Diese Methodik ist zeitstabil; ein grundlegendes, seit 1972 gültiges Prinzip ohne wesentlichen Aktualisierungsbedarf.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Statische Analyse zur Erkennung von Schnittstellenlecks (interne Details in öffentlichen APIs) | Adopting | Ergebnis gegen manuelle Architekturbewertung validieren. |

Dieses Prinzip ist seit über fünf Jahrzehnten stabil und grundlegend; der Bonus betrifft primär automatisierte Erkennungswerkzeuge, nicht das Prinzip selbst.
