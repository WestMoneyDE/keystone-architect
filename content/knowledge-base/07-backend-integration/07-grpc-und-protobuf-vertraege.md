---
{"id": "KB-0159", "title": "GRPC und Protobuf-Verträge", "domain": "07", "sequence": 7, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "STAFF", "PRINCIPAL"], "requires": [{"id": "KB-0069", "concepts": ["HTTP/2"], "needed_for": "both"}, {"id": "KB-0141", "concepts": ["Schema Evolution"], "needed_for": "both"}, {"id": "KB-0115", "concepts": ["Deadline"], "needed_for": "both"}], "related": ["KB-0160", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Protobuf-Schema mit Field Numbers definieren und eine rückwärtskompatible Erweiterung demonstrieren.", "rationale": "Kein echter gRPC-Server nötig, um Wire-Kompatibilität zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Protobuf-Verträge so gestalten, dass Field-Number-Änderungen niemals Wire-Kompatibilität brechen.", "rationale": "Eine falsch geänderte Field Number zerstört Kompatibilität ohne offensichtlichen Compile-Fehler auf der anderen Seite."}, "STAFF-TARGET": {"active": true, "scope": "Einen stillen Datenverlust nach Protobuf-Schema-Änderung auf eine wiederverwendete Field Number zurückführen.", "rationale": "Das ist ein bekannter, schwer zu diagnostizierender gRPC-Fehler."}, "CHIEF-TARGET": {"active": true, "scope": "gRPC/Protobuf als Standard für interne, latenzsensitive Dienstschnittstellen gegenüber REST/JSON positionieren.", "rationale": "Die Effizienzvorteile rechtfertigen den zusätzlichen Codegenerierungs-Workflow nur für bestimmte Einsatzfälle."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "gRPC-Streaming-Modi (Server/Client/Bidi-Streaming) im Detail sind Vertiefung.", "rationale": "Kern ist Wire-Kompatibilität und Deadline-Propagation, nicht jeder Streaming-Modus."}}, "lab_validation": [{"lab_id": "KB-0159-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Protobuf-Field-Number-Wiederverwendung", "evidence": "Die Wiederverwendung einer zuvor entfernten Field Number für ein semantisch anderes Feld führt zu stiller Fehlinterpretation alter, noch nicht migrierter Nachrichten.", "limitations": "Kein echter gRPC-Server, keine Produktion."}]}
---
# GRPC und Protobuf-Verträge

> **Ziel:** gRPC nutzt Protocol Buffers (Protobuf) als binäres, kompaktes Interface Definition Language (IDL) mit Codegenerierung für mehrere Sprachen. Der kritischste Betriebsfehler ist die Wiederverwendung einer Field Number für ein semantisch anderes Feld — das bricht Wire-Kompatibilität still, ohne einen offensichtlichen Fehler zu erzeugen, weil das Binärformat auf Field Numbers, nicht auf Namen basiert.

## Zweck, Mental Model und Dependencies

Ein Protobuf-Feld wird durch seine Field Number im Binärformat identifiziert, nicht durch seinen Namen — `string name = 1;` bedeutet, dass Feld 1 im Wire-Format als String-Typ interpretiert wird. Wird Feld 1 später entfernt und eine neue, semantisch andere Bedeutung erhält eine wiederverwendete Nummer 1, interpretiert ein alter Client/Server, der noch das alte Schema kennt, die neuen Daten fälschlich nach der alten Semantik — ein stiller Datenfehler, kein Absturz. gRPC läuft über HTTP/2 und unterstützt eingebaute Deadlines, die (anders als bei manueller REST-Implementierung) direkt im Protokoll propagiert werden. Lies [KB-0069](../03-network-foundations/21-http-2-und-multiplexing.md), [KB-0141](../06-software-architecture/13-schema-evolution-und-kompatibilitaet.md) und [KB-0115](../05-distributed-systems/15-timeouts-und-deadline-budgets.md).

~~~text
message Order {
  string id = 1;
  double amount = 2;  // NEVER reuse field number 2 for a different meaning after removing amount
}
Wire format encodes field NUMBER + type, not field NAME - renaming is safe, renumbering/reusing is not
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Field Number | wird sie nach Entfernung jemals wiederverwendet? | stille Fehlinterpretation alter/neuer Daten ohne Fehler |
| Feldtyp-Änderung | kompatibler Typwechsel (z. B. int32 zu int64) beachtet? | inkompatibler Typwechsel korrumpiert Daten beim Parsen |
| Deadline-Propagation | wird die gRPC-Deadline über verschachtelte Aufrufe weitergegeben? | innerer Aufruf ignoriert das äußere Zeitbudget |
| Codegenerierung | wird generierter Code bei Schema-Änderung konsistent neu erzeugt? | veralteter generierter Code weicht vom aktuellen .proto-Schema ab |

Implementierung: entfernte Field Numbers werden explizit als `reserved` markiert, damit sie nie versehentlich wiederverwendet werden. Feldtyp-Änderungen folgen der von Protobuf dokumentierten Kompatibilitätsmatrix (welche Typwechsel wire-kompatibel sind, welche nicht). Deadlines werden bei jedem gRPC-Aufruf explizit gesetzt und an nachgelagerte Aufrufe weitergegeben, da gRPC dies nativ unterstützt (anders als bei REST, wo das manuell implementiert werden muss). Generierter Code wird bei jeder Schema-Änderung als Teil des Build-Prozesses neu erzeugt, nie manuell nachbearbeitet.

## Scalability, Reliability, Security und Observability

gRPC/Protobuf skaliert durch kompakte Binärkodierung und HTTP/2-Multiplexing effizienter als textbasiertes JSON/REST für hochfrequente interne Dienstkommunikation. Reliability-Grenze: eine wiederverwendete Field Number ist ein besonders gefährlicher Fehlerklasse, weil sie keinen offensichtlichen Fehler erzeugt — die Daten werden „erfolgreich" geparst, nur mit falscher Bedeutung, was zu stillem, schwer zu diagnostizierendem Datenfehler führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Daten werden nach Schema-Änderung fälschlich interpretiert, kein Fehler sichtbar | wiederverwendete Field Number für semantisch anderes Feld | .proto-Historie auf `reserved`-Markierungen und Field-Number-Wiederverwendung prüfen |
| Parsing-Fehler nach Feldtyp-Änderung | inkompatibler Typwechsel gegen Protobuf-Kompatibilitätsmatrix | Typwechsel gegen dokumentierte kompatible Übergänge prüfen |
| verschachtelter gRPC-Aufruf läuft trotz abgelaufener äußerer Deadline weiter | Deadline nicht explizit an inneren Aufruf weitergegeben | Deadline-Parameter des inneren Aufrufs auf Propagation prüfen |
| generierter Client-Code verhält sich anders als erwartet | generierter Code nicht aktuell zum .proto-Schema | Build-Prozess auf automatische Codegenerierung bei Schema-Änderung prüfen |

Security: Protobuf selbst bietet keine eingebaute Verschlüsselung — gRPC-Verbindungen sollten über TLS abgesichert werden, da sonst der kompakte Binärverkehr im Klartext über das Netzwerk läuft. Observability: gRPC-Interceptors sind der natürliche Ort für strukturiertes Logging, Tracing und Metriken über alle Aufrufe hinweg.

## Trade-offs und Entscheidungen

**Staff** markiert entfernte Field Numbers konsequent als `reserved`, um versehentliche Wiederverwendung zu verhindern. **Principal** definiert Deadline-Propagation als Standard für alle internen gRPC-Aufrufketten. **Chief** positioniert gRPC/Protobuf als Standard für interne, latenzsensitive Dienstschnittstellen, REST/JSON für öffentliche, breiter konsumierte APIs.

Anti-Patterns: entfernte Field Numbers ohne `reserved`-Markierung später wiederverwenden; Feldtypen ohne Prüfung der Wire-Kompatibilität ändern; generierten Code manuell nachbearbeiten statt bei Schema-Änderung neu zu generieren.

## Production Checklist

- [ ] Entfernte Field Numbers sind als `reserved` markiert, nie wiederverwendet.
- [ ] Feldtyp-Änderungen sind gegen die dokumentierte Wire-Kompatibilitätsmatrix geprüft.
- [ ] Deadlines werden bei jedem gRPC-Aufruf gesetzt und an verschachtelte Aufrufe weitergegeben.
- [ ] Generierter Code wird automatisiert bei jeder Schema-Änderung neu erzeugt.

## Interviewfragen

### 1. Warum ist die Wiederverwendung einer Protobuf-Field-Number so gefährlich?

**Antwort:** Das Wire-Format identifiziert Felder über ihre Nummer, nicht ihren Namen; eine wiederverwendete Nummer mit neuer Bedeutung wird von älterem Code, der die alte Semantik erwartet, fälschlich interpretiert — ohne sichtbaren Fehler.

### 2. Was bewirkt die `reserved`-Markierung in einem Protobuf-Schema?

**Antwort:** Sie verhindert, dass eine entfernte Field Number (oder ein entfernter Feldname) versehentlich für ein neues Feld wiederverwendet wird, indem der Compiler bei einem Verstoß einen Fehler meldet.

### 3. Warum ist Deadline-Propagation in gRPC einfacher als bei manuell implementiertem REST?

**Antwort:** gRPC unterstützt Deadlines nativ im Protokoll; sie werden automatisch mit jedem Aufruf übertragen, statt dass jeder Dienst sie manuell in Metadaten oder Headern weiterreichen muss.

### 4. Wann ist gRPC/Protobuf gegenüber REST/JSON vorzuziehen?

**Antwort:** Für interne, latenzsensitive Dienst-zu-Dienst-Kommunikation mit hoher Frequenz, wo die kompakte Binärkodierung und HTTP/2-Multiplexing einen messbaren Effizienzvorteil bringen — für öffentliche, breit konsumierte APIs ist REST/JSON oft zugänglicher.

### 5. Was passiert, wenn generierter Code nicht bei jeder Schema-Änderung neu erzeugt wird?

**Antwort:** Der Client- oder Server-Code weicht vom aktuellen .proto-Schema ab, was zu Inkonsistenzen zwischen tatsächlichem Vertrag und implementiertem Verhalten führen kann.

### 6. Widersprüchliche Anforderung: Team will schnelle, häufige Schema-Iterationen UND absolute Wire-Kompatibilität mit älteren Clients — wie gehst du vor?

**Antwort:** Ich würde additive Schema-Änderungen (neue Field Numbers für neue Felder) als Standardpraxis etablieren und jede Entfernung konsequent als `reserved` markieren, statt Field Numbers je wiederzuverwenden — das erlaubt schnelle Iteration ohne die Wire-Kompatibilität zu gefährden.

## Praktische Labs

~~~python
old_schema = {1: "id", 2: "amount"}
# amount (field 2) removed, later field 2 wrongly reused for a new "status" field
new_schema_bad = {1: "id", 2: "status"}  # DANGEROUS: reused field number

old_client_data = {1: "order-1", 2: 99.5}  # old client still sends "amount" semantics on field 2

def interpret(schema, data):
    return {schema[k]: v for k, v in data.items()}

result = interpret(new_schema_bad, old_client_data)
assert result["status"] == 99.5  # silently wrong: a float amount interpreted as a "status" string field
print("Reused field number caused silent misinterpretation:", result)
~~~

## Dependencies, Cross-References und Quellen

1. Google: [Protocol Buffers - Updating A Message Type](https://protobuf.dev/programming-guides/proto3/#updating), abgerufen 2026-09-17.
2. gRPC: [Core concepts, architecture and lifecycle](https://grpc.io/docs/what-is-grpc/core-concepts/), abgerufen 2026-09-17.

Protobuf-/gRPC-Versionsdetails vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| gRPC-Web für Browser-Clients ohne vollen HTTP/2-Trailer-Support | Established | Kompatibilität mit Ziel-Browser-Umgebung vor Einsatz prüfen. |
| Automatisierte Wire-Kompatibilitätsprüfung in CI (Buf-artige Tools) | Adopting | Regelabdeckung gegen bekannte Kompatibilitätsfallen (Field-Number-Reuse) verifizieren. |

Ein Team akzeptiert eine Protobuf-Schema-Änderung erst, wenn eine automatisierte Kompatibilitätsprüfung gegen Field-Number-Wiederverwendung und Typinkompatibilität bestanden ist.
