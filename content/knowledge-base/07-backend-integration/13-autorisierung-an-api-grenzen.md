---
{"id": "KB-0165", "title": "Autorisierung an API-Grenzen", "domain": "07", "sequence": 13, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "STAFF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0164", "concepts": ["Authentifizierung"], "needed_for": "both"}], "related": ["KB-0166", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Objekt- und feldebenen Autorisierungsprüfung lokal implementieren und einen Fall zeigen, in dem eine Clientangabe nicht vertraut wird.", "rationale": "Kein echtes IAM-System nötig, um Enforcement-Logik zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Zentralen Policy-Entscheid von lokaler Enforcement-Logik trennen und Mandantenrechte konsequent durchsetzen.", "rationale": "Vermischte Policy-Entscheidung und Durchsetzung erschwert Audit und Konsistenz über Dienste hinweg."}, "STAFF-TARGET": {"active": true, "scope": "Eine Datenlecks-Ursache auf vertraute, aber manipulierbare Clientangaben (z. B. eine mandanten-ID im Request-Body) zurückführen.", "rationale": "Das ist ein häufiger, kritischer Autorisierungsfehler (Broken Object Level Authorization)."}, "CHIEF-TARGET": {"active": true, "scope": "Zentrale Policy-Entscheidung (statt verstreuter Ad-hoc-Prüfungen) als Standard für Mandanten-/Objektautorisierung festlegen.", "rationale": "Verstreute Autorisierungslogik ist schwer auditierbar und fehleranfällig."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Policy-Engines (z. B. attributbasierte Zugriffskontrolle im Detail) sind Vertiefung.", "rationale": "Kern ist die Trennung Policy-Entscheid/Enforcement und Nicht-Vertrauen in Clientangaben."}}, "lab_validation": [{"lab_id": "KB-0165-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Objektautorisierung mit manipulierter Clientangabe", "evidence": "Eine Anfrage mit clientseitig manipulierter Mandanten-ID wird korrekt abgelehnt, da die tatsächliche Zuordnung server-seitig aus dem authentifizierten Kontext, nicht aus der Clientangabe, abgeleitet wird.", "limitations": "Kein echtes IAM-System, keine Produktion."}]}
---
# Autorisierung an API-Grenzen

> **Ziel:** Autorisierung entscheidet, ob eine authentifizierte Identität eine bestimmte Aktion auf einer bestimmten Ressource ausführen darf — auf Objekt-, Feld- und Mandantenebene. Der kritischste Fehler (Broken Object Level Authorization) entsteht, wenn eine vom Client mitgelieferte Angabe (z. B. eine Mandanten- oder Objekt-ID im Request) unkritisch als Autorisierungsgrundlage vertraut wird, statt server-seitig aus dem authentifizierten Kontext abgeleitet zu werden.

## Zweck, Mental Model und Dependencies

Authentifizierung ([KB-0164](12-authentifizierung-in-backend-diensten.md)) beantwortet „wer ist das"; Autorisierung beantwortet „darf diese Identität das tun". Eine zentrale Policy-Entscheidung (die eigentliche Regel: „Mandant X darf nur auf eigene Ressourcen zugreifen") sollte von der lokalen Enforcement-Logik (wo/wie diese Regel im jeweiligen Endpunkt durchgesetzt wird) getrennt sein — verstreute Ad-hoc-Prüfungen in jedem einzelnen Endpunkt sind fehleranfällig und schwer konsistent zu halten. Entscheidend: die für die Prüfung genutzte Mandanten-/Objekt-Zuordnung muss aus dem server-seitig authentifizierten Kontext stammen, niemals aus einer vom Client kontrollierbaren Angabe. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0164](12-authentifizierung-in-backend-diensten.md).

~~~text
DANGEROUS: GET /orders/{id}?tenant_id=X  -- client controls tenant_id, can simply change it
SAFE:      GET /orders/{id}  -- server derives tenant_id from authenticated session, then checks order.tenant_id == session.tenant_id
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Objektebenen-Autorisierung | wird pro einzelnem Objekt geprüft, nicht nur pro Endpunkt? | Zugriff auf fremde Objekte über bloße ID-Manipulation möglich (BOLA) |
| Feldebenen-Autorisierung | dürfen alle authentifizierten Nutzer alle Felder eines Objekts sehen/ändern? | sensible Felder ohne feingranulare Prüfung exponiert |
| Mandantenrechte | wird Mandantenzugehörigkeit aus vertrauenswürdiger Quelle abgeleitet? | Mandanten-ID aus Clientangabe statt Server-Kontext übernommen |
| Policy vs. Enforcement | ist die Regel zentral definiert, die Durchsetzung lokal angewendet? | verstreute, inkonsistente Ad-hoc-Prüfungen pro Endpunkt |

Implementierung: jede Ressourcenzugriffsprüfung leitet die relevante Mandanten-/Eigentümer-Zuordnung aus dem server-seitig authentifizierten Kontext ab (Session, validiertes Token), niemals aus einem vom Client übergebenen Parameter. Eine zentrale Policy-Definition (z. B. eine Autorisierungs-Policy-Engine oder zentrale Middleware-Funktion) wird von allen Endpunkten konsistent genutzt, statt dass jeder Endpunkt eine eigene, potenziell inkonsistente Prüfung implementiert. Feldebenen-Autorisierung wird für besonders sensible Felder (z. B. Gehaltsdaten, interne Notizen) explizit zusätzlich zur Objektebene geprüft.

## Scalability, Reliability, Security und Observability

Zentrale Policy-Definition skaliert Autorisierungslogik konsistent über wachsende API-Oberflächen, während verstreute Ad-hoc-Prüfungen mit jedem neuen Endpunkt das Risiko einer vergessenen oder inkonsistenten Prüfung erhöhen. Reliability-Grenze: Broken Object Level Authorization ist laut OWASP API Security Top 10 die häufigste API-Sicherheitslücke — sie ist funktional oft unauffällig (die API „funktioniert"), aber sicherheitskritisch, da sie unautorisierten Zugriff auf fremde Daten ermöglicht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Nutzer kann auf Daten eines anderen Mandanten zugreifen, indem er eine ID ändert | Objektautorisierung fehlt oder vertraut Clientangabe | prüfen, ob die Zugriffsprüfung serverseitige oder clientseitige Mandanten-ID nutzt |
| sensibles Feld ist für Nutzer sichtbar, die es nicht sehen sollten | fehlende Feldebenen-Autorisierung | Feldsichtbarkeit gegen definierte Berechtigungsrollen prüfen |
| unterschiedliche Endpunkte wenden die Mandantenregel unterschiedlich streng an | verstreute statt zentrale Policy-Durchsetzung | Autorisierungslogik über mehrere Endpunkte auf Konsistenz vergleichen |
| Autorisierungsänderung erfordert Anpassung an vielen Stellen im Code | fehlende zentrale Policy-Definition | Anzahl der Stellen zählen, die dieselbe Regel unabhängig implementieren |

Security: dies ist der Kern von Security-Governance an API-Grenzen — konsistente, server-seitig verankerte Autorisierung ist die Grundvoraussetzung für Mandantentrennung und Datenisolation. Observability: fehlgeschlagene Autorisierungsversuche (403-Antworten) sollten geloggt und auf Muster geprüft werden, die auf gezielte Erkundung fremder Objekt-IDs hindeuten könnten.

## Trade-offs und Entscheidungen

**Staff** prüft bei jedem neuen Endpunkt explizit, ob die Autorisierungsprüfung aus server-seitigem Kontext oder Clientangabe abgeleitet wird. **Principal** etabliert eine zentrale Policy-Definition/Middleware, die konsistent über alle Endpunkte genutzt wird. **Chief** verlangt zentrale Autorisierungs-Governance als Pflichtstandard, um Broken Object Level Authorization systematisch zu verhindern.

Anti-Patterns: Mandanten-/Objekt-ID aus einem vom Client kontrollierten Parameter statt server-seitigem Kontext übernehmen; Autorisierungslogik in jedem Endpunkt einzeln und inkonsistent neu implementieren; Feldebenen-Sichtbarkeit ignorieren und alle authentifizierten Nutzer alle Felder sehen lassen.

## Production Checklist

- [ ] Mandanten-/Eigentümer-Zuordnung wird aus server-seitigem authentifiziertem Kontext abgeleitet, nie aus Clientangabe.
- [ ] Zentrale Policy-Definition wird konsistent über alle Endpunkte genutzt.
- [ ] Feldebenen-Autorisierung für besonders sensible Felder implementiert.
- [ ] Fehlgeschlagene Autorisierungsversuche werden geloggt und auf Muster geprüft.

## Interviewfragen

### 1. Was ist Broken Object Level Authorization?

**Antwort:** Eine Sicherheitslücke, bei der ein Client durch bloße Manipulation einer Objekt-ID (z. B. in der URL) auf fremde, eigentlich geschützte Ressourcen zugreifen kann, weil die Autorisierungsprüfung fehlt oder unzureichend ist.

### 2. Warum darf die Mandanten-ID nicht aus einer Clientangabe stammen?

**Antwort:** Ein Client kann jeden Wert, den er selbst mitliefert, beliebig manipulieren; die tatsächliche Mandantenzugehörigkeit muss aus einer server-seitig vertrauenswürdigen Quelle (authentifizierte Session/Token) abgeleitet werden.

### 3. Was ist der Unterschied zwischen zentraler Policy-Entscheidung und lokaler Enforcement-Logik?

**Antwort:** Die Policy definiert die eigentliche Regel (z. B. „Mandant X darf nur eigene Ressourcen sehen") zentral und konsistent; die Enforcement-Logik wendet diese Regel im jeweiligen Endpunkt an — beide sollten getrennt, aber die Policy zentral definiert sein, um Konsistenz zu sichern.

### 4. Warum ist Feldebenen-Autorisierung zusätzlich zur Objektebene nötig?

**Antwort:** Ein Nutzer kann berechtigt sein, ein Objekt grundsätzlich zu sehen, aber nicht jedes einzelne Feld darin (z. B. interne Notizen oder Gehaltsdaten) — Objektebene allein deckt diese Feingranularität nicht ab.

### 5. Wie erkennst du verstreute, inkonsistente Autorisierungslogik im Code?

**Antwort:** Indem geprüft wird, ob dieselbe Autorisierungsregel an mehreren Stellen unabhängig implementiert ist, statt eine zentrale, wiederverwendete Prüfung zu nutzen.

### 6. Widersprüchliche Anforderung: Team will maximale API-Flexibilität für Clients (z. B. beliebige Filter-Parameter) UND garantierte Mandantenisolation — wie gehst du vor?

**Antwort:** Ich würde Client-Filter-Parameter als reine Suchkriterien innerhalb der bereits server-seitig festgelegten Mandantengrenze behandeln, nie als Grundlage für die Mandantenzuordnung selbst — Flexibilität bei der Datenfilterung und garantierte Isolation schließen sich nicht aus, solange die Isolationsgrenze serverseitig verankert bleibt.

## Praktische Labs

~~~python
sessions = {"token-abc": {"tenant_id": "tenant1"}}
orders = {1: {"tenant_id": "tenant1"}, 2: {"tenant_id": "tenant2"}}

def get_order(token, order_id, claimed_tenant_id_from_client):
    session = sessions[token]
    real_tenant_id = session["tenant_id"]  # server-derived, NEVER the client-supplied value
    order = orders[order_id]
    if order["tenant_id"] != real_tenant_id:
        raise PermissionError("access denied: object belongs to a different tenant")
    return order

try:
    get_order("token-abc", 2, claimed_tenant_id_from_client="tenant1")  # client lies about tenant
    raise AssertionError("expected denial")
except PermissionError as e:
    print("Server-derived tenant check correctly denied cross-tenant access:", e)
~~~

## Dependencies, Cross-References und Quellen

1. OWASP: [API Security Top 10 - Broken Object Level Authorization](https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/), abgerufen 2026-09-17.

Framework-spezifische Autorisierungs-Middleware-Details vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Zentrale Policy-as-Code-Engines (attributbasierte Zugriffskontrolle) | Established | Latenzkosten der externen Policy-Auswertung gegen Konsistenzgewinn abwägen. |

Ein Team akzeptiert eine Autorisierungsimplementierung erst, wenn server-seitige Ableitung der Zugriffsgrenze und zentrale, konsistente Policy-Durchsetzung nachweisbar getestet sind.
