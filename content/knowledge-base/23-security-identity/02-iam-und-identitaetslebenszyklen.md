---
{"id": "KB-0538", "title": "IAM und Identitätslebenszyklen", "domain": "23", "sequence": 2, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0537", "concepts": ["Threat Modeling und Vertrauensgrenzen"], "needed_for": "understanding"}, {"id": "KB-0444", "concepts": ["Cloud-IAM-Grundarchitektur"], "needed_for": "context"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Principals, Credentials und Zugriffsentscheidungen anhand offizieller IAM-Praktiken korrekt verbinden und User- von Service-Identitäten sauber trennen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit einen Joiner-Mover-Leaver-Prozess gestalten, der Zugriffsrechte über den gesamten Identitätslebenszyklus konsistent mit der tatsächlichen Rolle einer Person hält.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unautorisierte Zugriffsberechtigung auf einen fehlenden oder verzögerten Mover- oder Leaver-Prozessschritt zurückführen können, der Berechtigungen nicht an eine Rollenänderung oder ein Ausscheiden angepasst hat.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für verbindliche Joiner-Mover-Leaver-Prozesse und strikte User-/Service-Identitätstrennung festlegen, statt informeller, ad hoc verwalteter Zugriffsrechte.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die Detailimplementierung spezifischer Identity-Provider-Protokolle im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Principal-/Credential-/Zugriffsverbindung und Lebenszyklus-Konsistenz, nicht die Protokoll-Interna."}}, "lab_validation": [{"lab_id": "KB-0538-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation verzögerter Leaver-Prozesse und daraus resultierender unautorisierter Zugriffsfenster, kein produktives IAM-System verwendet", "evidence": "Ein lokales Skript simuliert, wie eine Person, die eine Organisation verlässt, aber deren Zugriffsrechte nicht unmittelbar beim Ausscheiden, sondern erst mit Verzögerung entzogen werden, für die Dauer dieser Verzögerung ein unautorisiertes, aber technisch funktionsfähiges Zugriffsfenster behält, und zeigt damit die Notwendigkeit eines unmittelbaren, nicht verzögerten Leaver-Prozesses.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales IAM-System mit tatsächlicher organisatorischer Prozessdynamik."}]}
---
# IAM und Identitätslebenszyklen

> **Ziel:** IAM verbindet drei Kernkonzepte: **Principals** (die Entität, der Zugriff gewährt wird — eine Person, ein Dienst, eine Maschine), **Credentials** (der Nachweis, dass ein Principal tatsächlich der ist, für den er sich ausgibt — Passwort, Zertifikat, Token), und **Zugriffsentscheidungen** (basierend auf der verifizierten Identität, welche Aktionen tatsächlich erlaubt sind). Der zentrale Punkt dieses Kapitels ist, dass statische Zugriffsrechte, die einmal bei Eintritt einer Person gewährt und danach nicht mehr aktiv gepflegt werden, systematisch von der tatsächlichen organisatorischen Realität abweichen — ein **Joiner-Mover-Leaver**-Prozess (Eintritt, Rollenwechsel, Austritt) muss Zugriffsrechte kontinuierlich an die tatsächliche, aktuelle Rolle einer Person anpassen, wobei der Leaver-Schritt (unmittelbarer Entzug bei Ausscheiden) besonders kritisch ist: Jede Verzögerung zwischen dem tatsächlichen Ausscheiden einer Person und dem Entzug ihrer Zugriffsrechte erzeugt ein konkretes, unautorisiertes Zugriffsfenster. Ebenso zentral ist die strikte Trennung zwischen User-Identitäten (Personen, die sich interaktiv authentifizieren) und Service-Identitäten (Maschinen/Dienste, die programmatisch auf Ressourcen zugreifen) — eine Vermischung, etwa die Nutzung persönlicher Credentials für automatisierte Dienste, führt zu unklarer Verantwortlichkeit und macht Zugriffsprüfungen unzuverlässig.

## Zweck, Mental Model und Dependencies

Ein Principal ist die grundlegende Entität, um die sich IAM organisiert — jede Zugriffsentscheidung bezieht sich letztlich darauf, was ein bestimmter Principal tun darf. Credentials sind der Mechanismus, über den ein Principal seine Identität nachweist, bevor eine Zugriffsentscheidung getroffen wird — die Stärke und Handhabung dieser Credentials (Passwort versus Zertifikat versus kurzlebiges Token, siehe die in Domain 21/22 behandelten schlüssellosen Signaturmuster als verwandtes Konzept) bestimmt direkt, wie zuverlässig die zugrunde liegende Identitätsverifikation tatsächlich ist. Die Zugriffsentscheidung selbst muss auf dieser verifizierten Identität und den ihr aktuell zugeordneten Berechtigungen basieren — der entscheidende Punkt ist "aktuell": Berechtigungen, die bei Eintritt einer Person granted, aber nie wieder überprüft oder angepasst werden, driften unweigerlich von der tatsächlichen, aktuellen Rolle dieser Person ab. Der Joiner-Mover-Leaver-Prozess formalisiert die notwendige, kontinuierliche Pflege: Beim Joiner-Schritt (Eintritt) werden initiale Berechtigungen entsprechend der Rolle gewährt; beim Mover-Schritt (Rollenwechsel, etwa eine interne Versetzung) müssen alte, nicht mehr relevante Berechtigungen entzogen und neue, der neuen Rolle entsprechende Berechtigungen gewährt werden — ein häufiger, subtiler Fehler ist, beim Mover-Schritt nur neue Berechtigungen hinzuzufügen, ohne alte zu entfernen, wodurch sich über mehrere Rollenwechsel hinweg unbeabsichtigt breite, nicht mehr der aktuellen Rolle entsprechende Berechtigungen akkumulieren; beim Leaver-Schritt (Ausscheiden) müssen alle Berechtigungen unmittelbar, nicht verzögert, entzogen werden, da jede Verzögerung ein konkretes, unautorisiertes Zugriffsfenster erzeugt. Die Trennung zwischen User- und Service-Identitäten ist strukturell notwendig, da beide fundamental unterschiedliche Lebenszyklus- und Sicherheitsanforderungen haben: User-Identitäten sind an eine Person mit organisatorischer Rolle gebunden und folgen dem Joiner-Mover-Leaver-Prozess, während Service-Identitäten an eine spezifische, technische Funktion gebunden sind, typischerweise kurzlebigere Credentials nutzen sollten (analog zu den bereits in Domain 20/21 behandelten Workload-Identity-Mustern), und einen eigenen Lebenszyklus haben, der an die Existenz des zugehörigen Dienstes, nicht an eine Person, gebunden ist.

~~~text
IAM core concepts: Principal (entity granted access) + Credential (identity proof) + Access Decision (based on verified identity + CURRENT permissions)
  KEY WORD: "current" -- permissions granted at join-time but never reviewed drift from actual role
Joiner-Mover-Leaver process: continuous permission maintenance across identity lifecycle
  Joiner: initial permissions per role
  Mover (role change): OLD permissions REMOVED + NEW permissions granted
    -> common subtle bug: only ADDING new permissions, never removing old ones
       -> permissions accumulate BEYOND current role across multiple role changes
  Leaver: ALL permissions revoked IMMEDIATELY, not delayed
    -> ANY delay between actual departure and revocation = concrete UNAUTHORIZED ACCESS WINDOW
User vs Service Identity: STRUCTURALLY DIFFERENT lifecycle/security needs
  User identity: bound to a person + org role, follows Joiner-Mover-Leaver
  Service identity: bound to a technical function, shorter-lived creds preferred (Workload Identity patterns),
    lifecycle tied to the SERVICE's existence, NOT a person
  mixing both (e.g. personal creds used for automation) -> unclear ownership, unreliable access review
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Principal | Entität, der Zugriff gewährt wird | Grundlage jeder Zugriffsentscheidung |
| Credential | Identitätsnachweis eines Principals | Stärke bestimmt Verlässlichkeit der Verifikation |
| Joiner-Mover-Leaver | kontinuierliche Berechtigungspflege über Lebenszyklus | verhindert Rechte-Drift und unautorisierte Zugriffsfenster |
| User-/Service-Identitätstrennung | unterschiedliche Lebenszyklus-/Sicherheitsanforderungen | Vermischung erzeugt unklare Verantwortlichkeit |

Implementierung: Für jede Rollenänderung wird explizit geprüft, welche zuvor gewährten Berechtigungen nicht mehr der neuen Rolle entsprechen und entzogen werden müssen, statt nur neue Berechtigungen hinzuzufügen. Der Leaver-Prozess erfolgt unmittelbar bei tatsächlichem Ausscheiden, ohne administrative Verzögerung. Service-Identitäten werden strikt von User-Identitäten getrennt, mit eigenem, an die Dienst-Existenz gebundenem Lebenszyklus und bevorzugt kurzlebigen Credentials.

## Scalability, Reliability, Security und Observability

IAM-Identitätslebenszyklusmanagement skaliert die tatsächliche Zugriffsgenauigkeit proportional zur Konsequenz des Joiner-Mover-Leaver-Prozesses; die Reliability-Grenze liegt darin, dass eine Verzögerung im Leaver- oder eine Unvollständigkeit im Mover-Schritt proportional zur Verzögerungsdauer beziehungsweise Akkumulationszeit zu unautorisierten Zugriffsfenstern beziehungsweise übermäßig breiten Berechtigungen führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Person hat Zugriff auf Ressourcen, die nicht ihrer aktuellen Rolle entsprechen | der Mover-Prozess hat bei einer früheren Rollenänderung nur neue Berechtigungen hinzugefügt, ohne alte zu entfernen | die tatsächlichen Berechtigungen gegen die aktuelle Rolle prüfen und nicht mehr relevante Berechtigungen entziehen |
| eine ausgeschiedene Person kann sich noch erfolgreich authentifizieren | der Leaver-Prozess wurde verzögert oder unvollständig durchgeführt | den Zeitpunkt des tatsächlichen Ausscheidens gegen den Zeitpunkt des Berechtigungsentzugs prüfen und den Prozess beschleunigen |
| unklar, wer für einen automatisierten Zugriff verantwortlich ist | eine persönliche User-Identität wird für einen automatisierten Dienst statt einer dedizierten Service-Identität genutzt | den automatisierten Zugriff auf eine dedizierte Service-Identität mit eigenem Lebenszyklus umstellen |

Security: Der Leaver-Prozess sollte automatisiert und unmittelbar an das tatsächliche Ausscheiden einer Person gekoppelt sein, ohne manuelle, verzögerungsanfällige Zwischenschritte. Observability: Die tatsächliche Zeit zwischen Ausscheiden und Berechtigungsentzug, die Häufigkeit akkumulierter, nicht der aktuellen Rolle entsprechender Berechtigungen, und die Konsistenz der User-/Service-Identitätstrennung sind zentrale Sicherheitssignale.

## Trade-offs und Entscheidungen

**Staff** führt einen einzelnen Joiner-, Mover- oder Leaver-Prozessschritt korrekt durch. **Principal** entwirft den vollständigen Joiner-Mover-Leaver-Prozess und die User-/Service-Identitätstrennung für eine Organisation. **Chief** legt unternehmensweite Standards für verbindliche, unmittelbare Lebenszyklus-Prozesse fest, statt informeller, ad hoc verwalteter Zugriffsrechte.

Anti-Patterns: beim Mover-Prozess nur neue Berechtigungen hinzufügen, ohne alte zu entfernen; den Leaver-Prozess mit administrativer Verzögerung statt unmittelbar durchführen; persönliche User-Credentials für automatisierte Dienste statt dedizierter Service-Identitäten nutzen.

## Production Checklist

- [ ] Der Mover-Prozess entzieht explizit nicht mehr relevante Berechtigungen, nicht nur Hinzufügung neuer.
- [ ] Der Leaver-Prozess erfolgt unmittelbar, automatisiert, ohne administrative Verzögerung.
- [ ] Service-Identitäten sind strikt von User-Identitäten getrennt, mit eigenem Lebenszyklus.
- [ ] Berechtigungen werden regelmäßig gegen die tatsächliche, aktuelle Rolle jeder Person geprüft.

## Interviewfragen

### 1. Was sind die drei Kernkonzepte, die IAM verbindet?

**Antwort:** Principals (Entitäten, denen Zugriff gewährt wird), Credentials (Identitätsnachweis) und Zugriffsentscheidungen (basierend auf verifizierter Identität und aktuellen Berechtigungen).

### 2. Was ist der häufige, subtile Fehler beim Mover-Schritt des Joiner-Mover-Leaver-Prozesses?

**Antwort:** Nur neue Berechtigungen für die neue Rolle hinzuzufügen, ohne alte, nicht mehr relevante Berechtigungen zu entfernen, wodurch sich über mehrere Rollenwechsel hinweg übermäßig breite Berechtigungen akkumulieren.

### 3. Warum ist der Leaver-Schritt besonders kritisch?

**Antwort:** Weil jede Verzögerung zwischen dem tatsächlichen Ausscheiden einer Person und dem Entzug ihrer Zugriffsrechte ein konkretes, unautorisiertes Zugriffsfenster erzeugt.

### 4. Warum sollten User- und Service-Identitäten strikt getrennt werden?

**Antwort:** Weil sie fundamental unterschiedliche Lebenszyklus- und Sicherheitsanforderungen haben — eine Vermischung führt zu unklarer Verantwortlichkeit und macht Zugriffsprüfungen unzuverlässig.

### 5. Wie gehst du vor, wenn eine Person Zugriff auf Ressourcen hat, die nicht ihrer aktuellen Rolle entsprechen?

**Antwort:** Ich prüfe, ob ein früherer Mover-Prozess nur neue Berechtigungen hinzugefügt hat, ohne alte zu entfernen, und entziehe die nicht mehr relevanten Berechtigungen entsprechend der aktuellen Rolle.

### 6. Widersprüchliche Anforderung: Organisation will minimalen administrativen Aufwand bei häufigen internen Rollenwechseln UND garantiert, dass Berechtigungen stets exakt der aktuellen Rolle entsprechen — wie gehst du vor?

**Antwort:** Ich würde eine automatisierte, rollenbasierte Berechtigungszuordnung vorschlagen, bei der Berechtigungen direkt an eine definierte Rolle statt an eine individuelle Person gebunden sind — bei einem Rollenwechsel wird die Person einfach der neuen Rolle zugeordnet, und alle damit verbundenen Berechtigungsänderungen (Entzug alter, Gewährung neuer) erfolgen automatisch, ohne manuellen administrativen Einzelschritt pro Wechsel.

## Praktische Labs

~~~python
# Local, deterministic simulation of unauthorized access window from a delayed leaver process (executed locally, no real IAM system):

def unauthorized_access_window(departure_day, revocation_day):
    window_days = revocation_day - departure_day
    return max(window_days, 0)

print(f"immediate revocation: {unauthorized_access_window(departure_day=10, revocation_day=10)} days unauthorized window")
print(f"delayed revocation: {unauthorized_access_window(departure_day=10, revocation_day=17)} days unauthorized window")
~~~

## Dependencies, Cross-References und Quellen

1. NIST-Dokumentation: [Digital Identity Guidelines — SP 800-63](https://pages.nist.gov/800-63-3/), abgerufen 2026-09-18.
2. Microsoft-Dokumentation: [Identity Lifecycle Management](https://learn.microsoft.com/en-us/entra/id-governance/identity-governance-overview), abgerufen 2026-09-18.

Threat Modeling und Vertrauensgrenzen sind kanonisch in [KB-0537](01-threat-modeling-und-vertrauensgrenzen.md) behandelt; Cloud-IAM-Grundarchitektur in [KB-0444](../18-cloud-foundations/04-cloud-iam-grundarchitektur.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, automatisierte Anomalieerkennung für ungewöhnliche Zugriffsmuster nach einem Rollenwechsel, die auf unvollständige Mover-Prozesse hinweisen können | Evaluating | Gegenüber rein periodischer, manueller Berechtigungsüberprüfung erst nach Prüfung der tatsächlichen Erkennungsgenauigkeit für den konkreten Organisationskontext bevorzugen. |

Ein Team akzeptiert eine IAM-Konfiguration erst, wenn der Joiner-Mover-Leaver-Prozess nachweislich Berechtigungen konsistent mit der aktuellen Rolle hält und User-/Service-Identitäten strikt getrennt sind.
