---
{"id": "KB-0157", "title": "REST und Ressourcenmodellierung", "domain": "07", "sequence": 5, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "STAFF", "PRINCIPAL"], "requires": [{"id": "KB-0068", "concepts": ["HTTP/1.1"], "needed_for": "both"}, {"id": "KB-0112", "concepts": ["Zustandsautomat"], "needed_for": "understanding"}, {"id": "KB-0140", "concepts": ["API-Vertrag"], "needed_for": "both"}], "related": ["KB-0158", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Ressource mit korrekten HTTP-Methoden, Statuscodes und Pagination lokal modellieren.", "rationale": "Kein reales Backend nötig, um Ressourcenmodellierung zu üben."}, "ARCHITECT-TARGET": {"active": true, "scope": "Ressourcen, Methoden und Statuscodes so gestalten, dass sie fachliche Zustandsübergänge korrekt abbilden statt technische RPC-Aufrufe zu verstecken.", "rationale": "Eine Ressource ist mehr als ein Datenbank-Row-Wrapper; sie sollte fachliche Bedeutung tragen."}, "STAFF-TARGET": {"active": true, "scope": "Eine falsche HTTP-Methoden-/Statuscode-Wahl als Ursache für unerwartetes Client-Verhalten (z. B. Caching, Retry) diagnostizieren.", "rationale": "HTTP-Semantik hat konkrete technische Konsequenzen (Caching, Idempotenz), nicht nur stilistische."}, "CHIEF-TARGET": {"active": true, "scope": "REST-Konventionen (Statuscodes, Fehlerformat, Pagination) als organisationsweiten API-Standard festlegen.", "rationale": "Uneinheitliche API-Konventionen erschweren Client-Integration über Teams hinweg."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "HATEOAS und Richardson Maturity Model im Detail sind Vertiefung.", "rationale": "Kern ist korrekte Ressourcen-/Methoden-/Statuscode-Semantik, nicht der volle Hypermedia-Ansatz."}}, "lab_validation": [{"lab_id": "KB-0157-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Modell für Ressourcenzustandsübergang über HTTP-Methoden", "evidence": "Ein PATCH auf eine Bestellressource mit Statusfeld 'cancelled' wird gegen die erlaubte Zustandsübergangstabelle geprüft und bei illegalem Übergang mit 409 Conflict abgelehnt.", "limitations": "Kein reales Backend, keine Produktion."}]}
---
# REST und Ressourcenmodellierung

> **Ziel:** REST modelliert fachliche Entitäten als Ressourcen mit URLs, über die standardisierte HTTP-Methoden mit klarer Semantik (Idempotenz, Sicherheit, Cachefähigkeit) operieren. Der häufigste Designfehler ist, REST als reines RPC-über-HTTP zu behandeln (z. B. `/getUserOrders`) statt Ressourcen und ihre fachlichen Zustandsübergänge korrekt abzubilden.

## Zweck, Mental Model und Dependencies

HTTP-Methoden haben definierte Semantik: GET ist sicher (keine Seiteneffekte) und cachebar; PUT und DELETE sind idempotent (mehrfache identische Ausführung hat denselben Effekt wie einmalige); POST ist weder sicher noch idempotent. Diese Semantik ist nicht nur Stilkonvention — sie hat technische Konsequenzen: ein GET kann von Zwischenspeichern/Proxies gecacht werden, ein PUT kann sicher wiederholt werden (Retry, [KB-0114](../05-distributed-systems/14-retries-und-wiederholungsstuerme.md)). Ressourcenmodellierung bedeutet, fachliche Entitäten (nicht Datenbanktabellen) als URLs zu strukturieren und Statusänderungen als HTTP-Methoden-Aufrufe zu modellieren, die gegen die zugrunde liegende Zustandsautomatik ([KB-0112](../05-distributed-systems/12-zustandsautomaten-und-invarianten.md)) geprüft werden. Lies [KB-0068](../03-network-foundations/20-http-1-1-und-verbindungsnutzung.md), [KB-0112](../05-distributed-systems/12-zustandsautomaten-und-invarianten.md) und [KB-0140](../06-software-architecture/12-api-grenzen-und-fachliche-vertraege.md).

~~~text
RPC-style (avoid):  POST /getUserOrders, POST /cancelOrder
REST-style:          GET /orders/123, PATCH /orders/123 {status: "cancelled"}
                      -> checked against allowed state transitions, 409 Conflict if illegal
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Häufiger Fehler |
|---|---|---|
| Ressourcenbenennung | Substantive statt Verben (`/orders` statt `/getOrders`)? | RPC-artige Endpunktnamen statt Ressourcen-URLs |
| Methodensemantik | GET sicher/cachebar, PUT/DELETE idempotent respektiert? | POST für alles verwendet, Idempotenzgarantien ignoriert |
| Statuscodes | präzise (404 vs. 403 vs. 409) statt pauschal 200/400/500? | jeder Fehler als generisches 400/500 zurückgegeben |
| Zustandsübergang | Änderung gegen erlaubte Übergangstabelle geprüft? | jeder PATCH akzeptiert, unabhängig vom aktuellen Ressourcenzustand |
| Pagination | konsistent (Cursor/Offset) mit klaren Grenzen dokumentiert? | unbegrenzte Listen-Endpunkte ohne Pagination |

Implementierung: Ressourcen werden nach fachlichen Entitäten benannt, nicht nach technischen Operationen. Statuscodes werden präzise gewählt (404 für nicht gefunden, 403 für fehlende Berechtigung, 409 für Konflikt mit aktuellem Zustand, 422 für semantisch ungültige Eingabe). Zustandsändernde Anfragen werden gegen die erlaubte Übergangstabelle der Ressource geprüft, nicht blind ausgeführt. Listen-Endpunkte implementieren konsistente Pagination mit dokumentierten Grenzen. Fehlerantworten folgen einem einheitlichen, dokumentierten Format (z. B. RFC 7807 Problem Details).

## Scalability, Reliability, Security und Observability

Korrekte HTTP-Semantik (GET cachebar, PUT idempotent) ermöglicht Caching- und Retry-Infrastruktur, die Last reduziert und Zuverlässigkeit erhöht — eine falsch modellierte API (z. B. GET mit Seiteneffekten) verhindert diese Vorteile oder erzeugt gefährliche unbeabsichtigte Effekte durch Caching/Prefetching. Reliability-Grenze: ohne Idempotenzgarantie bei PUT/DELETE ist ein sicherer Retry bei Netzwerkfehlern nicht möglich, was Clients zu riskanten Workarounds zwingt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Proxy/CDN liefert veraltete oder falsche Daten | GET-Endpunkt mit Seiteneffekten oder falschen Cache-Headern | prüfen, ob GET tatsächlich sicher/idempotent ist |
| Retry eines PUT erzeugt Duplikate | PUT nicht tatsächlich idempotent implementiert | wiederholten identischen PUT-Aufruf auf Effektwiederholung prüfen |
| Client kann Fehler nicht unterscheiden (alles 400) | fehlende präzise Statuscode-Semantik | Statuscode-Verteilung der API gegen tatsächliche Fehlerursachen prüfen |
| illegaler Zustandsübergang wird akzeptiert | fehlende Prüfung gegen Übergangstabelle im Endpunkt | Übergang gegen erlaubte Zustandsautomatik-Definition testen |

Security: präzise Statuscodes (403 vs. 404) können Informationslecks erzeugen (z. B. verrät 404 statt 403, dass eine Ressource existiert, aber der Zugriff verweigert wird) — diese Entscheidung muss bewusst getroffen werden. Observability: konsistente, präzise Statuscodes und strukturierte Fehlerformate erleichtern automatisierte Fehlerklassifikation in Monitoring-Systemen.

## Trade-offs und Entscheidungen

**Staff** modelliert neue Endpunkte konsequent ressourcenorientiert statt RPC-artig. **Principal** definiert einen API-Styleguide mit präzisen Statuscode- und Fehlerformatkonventionen. **Chief** verlangt konsistente REST-Konventionen als organisationsweiten Standard für Client-Integrierbarkeit.

Anti-Patterns: RPC-artige Endpunktnamen (`/doSomething`) statt Ressourcen-URLs; GET-Endpunkte mit Seiteneffekten; jeder Fehler als generischer 400/500 ohne Unterscheidung; fehlende Zustandsübergangsprüfung bei PATCH/PUT-Anfragen.

## Production Checklist

- [ ] Ressourcen sind nach fachlichen Entitäten benannt, nicht nach Operationen.
- [ ] HTTP-Methodensemantik (Sicherheit, Idempotenz) wird tatsächlich eingehalten.
- [ ] Statuscodes sind präzise gewählt, nicht pauschal.
- [ ] Zustandsändernde Anfragen werden gegen erlaubte Übergänge geprüft.

## Interviewfragen

### 1. Warum ist ein GET-Endpunkt mit Seiteneffekten problematisch?

**Antwort:** GET gilt als sicher und cachebar; Proxies/Browser können GET-Anfragen wiederholen oder cachen, was bei tatsächlichen Seiteneffekten zu unbeabsichtigten mehrfachen Ausführungen führen kann.

### 2. Was bedeutet Idempotenz bei PUT und warum ist sie wichtig?

**Antwort:** Ein wiederholter identischer PUT-Aufruf führt zum selben Endzustand wie ein einmaliger; das ermöglicht sicheres Retry bei Netzwerkfehlern, ohne Duplikate oder unerwartete Effekte zu erzeugen.

### 3. Warum reicht pauschal 400/500 als Statuscode nicht aus?

**Antwort:** Clients können dann nicht automatisiert unterscheiden, ob ein Problem an der Anfrage selbst (Validierung), an fehlenden Rechten oder an einem Zustandskonflikt liegt — präzise Codes ermöglichen gezielte Client-Reaktion.

### 4. Wie sollte eine zustandsändernde Anfrage gegen die Ressource geprüft werden?

**Antwort:** Gegen die erlaubte Zustandsübergangstabelle der Ressource, mit einem 409-Conflict-Statuscode bei illegalem Übergang, statt die Änderung unabhängig vom aktuellen Zustand blind zu akzeptieren.

### 5. Was ist der Unterschied zwischen 403 und 404, und warum ist die Wahl eine Sicherheitsentscheidung?

**Antwort:** 403 zeigt, dass die Ressource existiert, aber der Zugriff verweigert wird; 404 verbirgt sogar deren Existenz — welcher Code gewählt wird, hängt davon ab, ob die Existenz der Ressource selbst als sensible Information gilt.

### 6. Widersprüchliche Anforderung: Client will eine einzelne Operation, die mehrere Ressourcen gleichzeitig fachlich ändert UND eine saubere REST-Ressourcenmodellierung — wie gehst du vor?

**Antwort:** Ich würde eine dedizierte, klar benannte Übergangsressource modellieren (z. B. `POST /orders/123/cancellation`), die diese zusammengesetzte fachliche Operation als eigene Ressource abbildet, statt sie künstlich in eine einzelne PATCH-Operation auf eine Primärressource zu zwingen.

## Praktische Labs

~~~python
allowed_transitions = {("pending", "confirmed"), ("pending", "cancelled"), ("confirmed", "shipped")}

def patch_order(current_status, new_status):
    if (current_status, new_status) not in allowed_transitions:
        return 409, "Conflict: illegal state transition"
    return 200, new_status

status_code, result = patch_order("shipped", "cancelled")
assert status_code == 409
print(f"Illegal transition correctly rejected with {status_code}: {result}")
~~~

## Dependencies, Cross-References und Quellen

1. Fielding: [Architectural Styles and the Design of Network-based Software Architectures (REST dissertation)](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm), 2000, abgerufen 2026-09-17.
2. IETF: [RFC 7807: Problem Details for HTTP APIs](https://datatracker.ietf.org/doc/html/rfc7807), abgerufen 2026-09-17.

Framework-spezifische REST-Tooling-Details vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Standardisierte Problem-Details-Fehlerformate (RFC 7807/9457) als API-Konvention | Established | Konsistenz mit bestehenden API-Fehlerformaten vor Migration prüfen. |

Ein Team akzeptiert eine REST-API-Modellierung erst, wenn Methodensemantik, präzise Statuscodes und Zustandsübergangsprüfung nachweisbar korrekt implementiert sind.
