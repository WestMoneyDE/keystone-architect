---
{"id": "KB-0328", "title": "Enterprise Search", "domain": "13", "sequence": 24, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM"], "requires": [{"id": "KB-0312", "concepts": ["Metadatenfilter und Zugriffsschranken"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen Connector implementieren, der Dokumente aus einer Quelle mit deren ACLs synchronisiert und Suchergebnisse entsprechend filtert.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Enterprise-Search-Architektur gestalten, die ACL-Synchronisation als kontinuierlichen, nicht einmaligen Prozess behandelt, um Berechtigungsänderungen in Quellsystemen zeitnah in der Suche widerzuspiegeln.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unautorisierte Informationspreisgabe über Enterprise Search auf eine veraltete ACL-Synchronisation statt auf ein allgemeines Suchproblem zurückführen können.", "rationale": "Wenn sich eine Berechtigung im Quellsystem ändert (z. B. ein Nutzer verliert Zugriff auf ein Dokument), aber die Suchindex-ACLs nicht zeitnah synchronisiert werden, kann die Suche weiterhin Zugriff auf inzwischen nicht mehr autorisierte Inhalte gewähren."}, "CHIEF-TARGET": {"active": true, "scope": "Enterprise Search als Integrationsproblem heterogener Quellsysteme mit kontinuierlicher ACL-Synchronisation positionieren, nicht als einmalige Indexierungsaufgabe.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete Connector-Implementierungsdetails für spezifische Quellsysteme sind Vertiefung.", "rationale": "Kern ist das Prinzip kontinuierlicher ACL-Synchronisation über heterogene Quellen, nicht die konkrete Connector-Technologie."}}, "lab_validation": [{"lab_id": "KB-0328-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell eines Enterprise-Search-Connectors mit ACL-Synchronisation, das eine veraltete versus aktuelle Berechtigung vergleicht", "evidence": "Eine Suche mit veralteter ACL-Synchronisation liefert ein Dokument zurück, auf das der Nutzer im Quellsystem inzwischen keinen Zugriff mehr hat; eine aktuelle ACL-Synchronisation filtert dieses Dokument korrekt heraus.", "limitations": "Kein echtes Quellsystem, kein produktives System, keine reale Enterprise-Infrastruktur."}]}
---
# Enterprise Search

> **Ziel:** Enterprise Search integriert heterogene Quellen (Dokumentensysteme, Ticketsysteme, Wissensdatenbanken) über Connectoren, aufbauend auf Metadatenfiltern und Zugriffsschranken (siehe [KB-0312](08-metadatenfilter-und-zugriffsschranken.md)). Der zentrale Punkt ist, dass ACL-Synchronisation ein kontinuierlicher, nicht einmaliger Prozess sein muss: Berechtigungsänderungen im Quellsystem (ein Nutzer verliert oder erhält Zugriff auf ein Dokument) müssen zeitnah in den Suchindex übernommen werden, da eine veraltete ACL-Synchronisation sonst zu einer Sicherheitslücke wird, unabhängig davon, wie aktuell die eigentlichen Inhalte im Suchindex sind.

## Zweck, Mental Model und Dependencies

Ein Connector ist die technische Integrationsschicht zu einem spezifischen Quellsystem (z. B. ein Dokumentenmanagementsystem, ein Ticketsystem, ein Wiki), die sowohl den Inhalt als auch die zugehörigen Zugriffsberechtigungen (ACLs) für die Indexierung bereitstellt. Der zentrale, oft übersehene architektonische Fehler ist, ACL-Synchronisation als einmaligen Schritt bei der initialen Indexierung zu behandeln, statt als fortlaufenden Prozess: Berechtigungen in Quellsystemen ändern sich kontinuierlich (ein Mitarbeiter wechselt die Abteilung, ein externer Partner verliert Zugriff, ein Dokument wird nachträglich als vertraulich markiert) — wenn diese Änderungen nicht zeitnah in die Such-ACLs übernommen werden, entsteht eine Zeitlücke, in der die Enterprise Search weiterhin Zugriff auf Inhalte gewährt, die im Quellsystem längst nicht mehr zugänglich wären. Heterogene Quellen (Dokumente, Tickets, Wissenssysteme) haben zudem unterschiedliche native Berechtigungsmodelle (z. B. rollenbasiert versus dokumentspezifisch), die bei der Integration in ein einheitliches Suchsystem konsistent abgebildet werden müssen, ohne die tatsächliche Granularität der ursprünglichen Berechtigung zu verlieren oder zu verfälschen. Aktualität der Inhalte selbst (nicht nur der Berechtigungen) ist die zweite zentrale Herausforderung: unterschiedliche Quellsysteme haben unterschiedliche Änderungsfrequenzen, und die Indexierungsfrequenz muss an diese jeweilige Änderungsfrequenz angepasst werden, statt eine einheitliche, möglicherweise unpassende Synchronisationsfrequenz für alle Quellen zu verwenden.

~~~text
Connector: integration layer to a specific source system -> provides content AND access permissions (ACLs)
CRITICAL ARCHITECTURE ERROR: treating ACL sync as a ONE-TIME step at initial indexing
  -> permissions in source systems change CONTINUOUSLY (dept transfer, partner offboarding, doc reclassification)
  -> without timely ACL sync, search grants access to content the source system no longer allows
Heterogeneous sources: different native permission models (role-based vs document-specific)
  -> must map consistently WITHOUT losing/distorting original permission granularity
Content freshness: different sources have different change frequencies -> indexing frequency must match per-source, not one uniform rate
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Kontinuierliche statt einmalige ACL-Synchronisation | wird die ACL-Synchronisation als fortlaufender Prozess betrieben, der Berechtigungsänderungen im Quellsystem zeitnah übernimmt? | eine nur einmalige Synchronisation bei Indexierung kann zu einer wachsenden Zeitlücke zwischen tatsächlicher und indexierter Berechtigung führen |
| Konsistente Abbildung heterogener Berechtigungsmodelle | werden unterschiedliche native Berechtigungsmodelle verschiedener Quellsysteme konsistent, ohne Granularitätsverlust in ein einheitliches Modell übertragen? | eine inkonsistente Abbildung kann entweder zu breiten oder zu engen Berechtigungen im Suchindex führen |
| Quellenspezifische Indexierungsfrequenz | ist die Indexierungsfrequenz an die tatsächliche Änderungsfrequenz jeder einzelnen Quelle angepasst? | eine einheitliche, unpassende Frequenz kann bei häufig geänderten Quellen zu veralteten Inhalten oder bei selten geänderten Quellen zu unnötigem Indexierungsaufwand führen |
| Nachvollziehbare Herkunft über heterogene Quellsysteme | ist für jedes Suchergebnis erkennbar, aus welchem konkreten Quellsystem es stammt? | fehlende Herkunftskennzeichnung erschwert die Einschätzung der Verlässlichkeit und Aktualität eines Suchergebnisses |

Implementierung: Jeder Connector implementiert einen kontinuierlichen ACL-Synchronisationsprozess, der Berechtigungsänderungen im Quellsystem in einem für den jeweiligen Anwendungsfall angemessenen Intervall (idealerweise ereignisgesteuert statt rein periodisch) in die Such-ACLs übernimmt. Native Berechtigungsmodelle unterschiedlicher Quellsysteme werden explizit auf ein einheitliches, aber granularitätserhaltendes Berechtigungsmodell abgebildet, statt vereinfachend zusammengefasst zu werden. Die Indexierungsfrequenz wird pro Quellsystem individuell an dessen tatsächliche Änderungsfrequenz angepasst. Jedes Suchergebnis trägt eine explizite Kennzeichnung des ursprünglichen Quellsystems, um Nutzern eine Einschätzung der Verlässlichkeit und Aktualität zu ermöglichen.

## Scalability, Reliability, Security und Observability

Enterprise Search skaliert die Auffindbarkeit von Unternehmenswissen proportional zur Anzahl integrierter, konsistent synchronisierter Quellsysteme; die Reliability-Grenze liegt in veralteter ACL-Synchronisation, die mit wachsender Anzahl an Berechtigungsänderungen im Zeitverlauf proportional mehr Sicherheitslücken zwischen tatsächlicher und indexierter Berechtigung erzeugen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Nutzer erhält über die Enterprise Search Zugriff auf ein Dokument, für das er im Quellsystem keine Berechtigung mehr hat | die ACL-Synchronisation für das betroffene Quellsystem ist veraltet oder erfolgt nicht zeitnah genug | prüfen, wann die letzte ACL-Synchronisation für das betroffene Quellsystem stattfand und ob die Berechtigungsänderung seitdem eingetreten ist |
| Suchergebnisse aus einer bestimmten Quelle sind veraltet, während andere Quellen aktuell erscheinen | die Indexierungsfrequenz für die betroffene Quelle ist nicht an deren tatsächliche Änderungsfrequenz angepasst | die konfigurierte Indexierungsfrequenz gegen die tatsächliche Änderungsfrequenz der betroffenen Quelle prüfen |
| die Berechtigung für ein Suchergebnis erscheint entweder zu breit oder zu eng im Vergleich zum Quellsystem | die Abbildung des nativen Berechtigungsmodells der Quelle auf das einheitliche Suchberechtigungsmodell ist fehlerhaft | die ursprüngliche Berechtigung im Quellsystem direkt mit der abgebildeten Berechtigung im Suchindex vergleichen |

Security: Veraltete ACL-Synchronisation ist eines der kritischsten Sicherheitsrisiken bei Enterprise Search, da sie eine Diskrepanz zwischen der tatsächlichen, aktuellen Zugriffsberechtigung im Quellsystem und der im Suchindex angewendeten Berechtigung erzeugt — diese Diskrepanz kann über die Zeit unbemerkt wachsen, wenn keine kontinuierliche Synchronisation stattfindet. Observability: Zeitspanne zwischen einer Berechtigungsänderung im Quellsystem und deren Übernahme in den Suchindex, Aktualität der indexierten Inhalte pro Quellsystem und Häufigkeit erkannter Berechtigungsdiskrepanzen zwischen Quellsystem und Suchindex sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert ACL-Synchronisation immer als kontinuierlichen, ereignisgesteuerten Prozess, nie als einmaligen Schritt. **Principal** macht die Abbildung heterogener Berechtigungsmodelle für das Team nachvollziehbar dokumentiert. **Chief** positioniert Enterprise Search als Integrationsproblem heterogener Quellsysteme mit kontinuierlicher ACL-Synchronisation, nicht als einmalige Indexierungsaufgabe.

Anti-Patterns: ACL-Synchronisation nur einmalig bei initialer Indexierung durchführen; unterschiedliche native Berechtigungsmodelle vereinfachend auf ein zu grobes gemeinsames Modell abbilden; eine einheitliche Indexierungsfrequenz für alle Quellsysteme unabhängig von deren tatsächlicher Änderungsfrequenz verwenden.

## Production Checklist

- [ ] ACL-Synchronisation erfolgt kontinuierlich, idealerweise ereignisgesteuert, für jedes integrierte Quellsystem.
- [ ] Native Berechtigungsmodelle sind konsistent und granularitätserhaltend abgebildet.
- [ ] Die Indexierungsfrequenz ist pro Quellsystem an dessen tatsächliche Änderungsfrequenz angepasst.
- [ ] Jedes Suchergebnis trägt eine erkennbare Herkunftskennzeichnung des Quellsystems.

## Interviewfragen

### 1. Warum muss ACL-Synchronisation ein kontinuierlicher, nicht einmaliger Prozess sein?

**Antwort:** Berechtigungen in Quellsystemen ändern sich kontinuierlich; ohne zeitnahe Übernahme dieser Änderungen entsteht eine wachsende Zeitlücke, in der die Suche Zugriff auf Inhalte gewährt, die im Quellsystem längst nicht mehr autorisiert sind.

### 2. Warum ist die Abbildung heterogener Berechtigungsmodelle eine spezifische Herausforderung?

**Antwort:** Unterschiedliche Quellsysteme haben unterschiedliche native Berechtigungsmodelle (z. B. rollenbasiert versus dokumentspezifisch), die konsistent und ohne Granularitätsverlust in ein einheitliches Suchberechtigungsmodell übertragen werden müssen.

### 3. Warum sollte die Indexierungsfrequenz pro Quellsystem individuell angepasst werden?

**Antwort:** Unterschiedliche Quellsysteme haben unterschiedliche Änderungsfrequenzen; eine einheitliche Frequenz kann bei häufig geänderten Quellen zu veralteten Inhalten oder bei selten geänderten Quellen zu unnötigem Aufwand führen.

### 4. Warum ist eine Herkunftskennzeichnung für Suchergebnisse wichtig?

**Antwort:** Sie ermöglicht Nutzern, die Verlässlichkeit und Aktualität eines Suchergebnisses anhand seines ursprünglichen Quellsystems einzuschätzen.

### 5. Wie diagnostizierst du eine unautorisierte Informationspreisgabe über Enterprise Search?

**Antwort:** Ich prüfe, wann die letzte ACL-Synchronisation für das betroffene Quellsystem stattfand und ob eine relevante Berechtigungsänderung seitdem im Quellsystem eingetreten ist — eine veraltete Synchronisation ist die wahrscheinlichste Ursache.

### 6. Widersprüchliche Anforderung: Team will minimale Synchronisationslast durch seltene ACL-Abgleiche UND garantiert keine Sicherheitslücke durch veraltete Berechtigungen — wie gehst du vor?

**Antwort:** Ich würde erklären, dass seltene Abgleiche das Risiko veralteter Berechtigungen proportional erhöhen; ich würde vorschlagen, wo möglich ereignisgesteuerte Synchronisation (das Quellsystem meldet aktiv Berechtigungsänderungen) statt periodischer Abgleiche einzusetzen, um Synchronisationslast zu minimieren, ohne auf zeitnahe Aktualität zu verzichten.

## Praktische Labs

~~~python
# Enterprise search connector with continuous ACL sync vs one-time sync
source_system_permissions = {"doc1": {"alice", "bob"}}  # current, authoritative permissions
search_index_acls = {"doc1": {"alice", "bob"}}  # last synced state

def revoke_access(source_system_permissions, doc_id, user):
    source_system_permissions[doc_id].discard(user)

def continuous_acl_sync(search_index_acls, source_system_permissions):
    for doc_id, perms in source_system_permissions.items():
        search_index_acls[doc_id] = set(perms)  # timely sync

def search(search_index_acls, doc_id, requesting_user):
    return requesting_user in search_index_acls.get(doc_id, set())

revoke_access(source_system_permissions, "doc1", "bob")  # bob loses access in source system

print(f"Before sync — search index still grants access: {search(search_index_acls, 'doc1', 'bob')}")
continuous_acl_sync(search_index_acls, source_system_permissions)
print(f"After continuous sync — search index correctly revokes access: {search(search_index_acls, 'doc1', 'bob')}")
~~~

## Dependencies, Cross-References und Quellen

1. Glean: [Enterprise Search Architecture and Permissions](https://www.glean.com/blog/enterprise-search-architecture), abgerufen 2026-09-17.
2. Microsoft: [Microsoft Search Content Connectors and Permissions](https://learn.microsoft.com/en-us/microsoftsearch/connectors-overview), abgerufen 2026-09-17.
3. OWASP: [OWASP Top 10 for LLM Applications — Sensitive Information Disclosure](https://genai.owasp.org/llmrisk/llm02-sensitive-information-disclosure/), abgerufen 2026-09-17.

Metadatenfilter und Zugriffsschranken sind kanonisch in [KB-0312](08-metadatenfilter-und-zugriffsschranken.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Ereignisgesteuerte ACL-Synchronisation über Webhook-Integrationen der Quellsysteme statt periodischer Voll-Abgleiche | Adopting | Gegenüber periodischer Synchronisation für zeitnähere, ressourcenschonendere Berechtigungsaktualität bevorzugen. |
| Vereinheitlichte Connector-Frameworks mit standardisierter ACL-Abbildung über heterogene Enterprise-Quellsysteme hinweg | Adopting | Gegenüber individuell entwickelten Connectoren pro Quelle für konsistentere, wartungsärmere Integration bevorzugen. |

Ein Team akzeptiert eine Enterprise-Search-Architektur erst, wenn kontinuierliche ACL-Synchronisation, konsistente Berechtigungsabbildung und quellenspezifische Aktualität dokumentiert und getestet sind.
