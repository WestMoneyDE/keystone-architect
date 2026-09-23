---
{"id": "KB-0154", "title": "FastAPI und Request-Lebenszyklen", "domain": "07", "sequence": 2, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "STAFF", "PRINCIPAL"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0153", "concepts": ["Ressourcenverwaltung"], "needed_for": "both"}, {"id": "KB-0108", "concepts": ["Transaktion"], "needed_for": "understanding"}], "related": ["KB-0156", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen FastAPI-Endpunkt mit Dependency Injection, Lifespan und korrekter Transaktionsgrenze lokal implementieren.", "rationale": "Kein echter Produktionsserver nötig, um Request-Lebenszyklus und Session-Grenzen zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Validierung, Dependencies und Datenbank-Session-Scope so entwerfen, dass jede Anfrage eine korrekt begrenzte Transaktion erhält.", "rationale": "Falsch gescopte Sessions erzeugen entweder geteilte Zustände zwischen Anfragen oder Ressourcenlecks."}, "STAFF-TARGET": {"active": true, "scope": "Einen blockierenden synchronen Aufruf in einem asynchronen Endpunkt als Ursache für Event-Loop-Stau diagnostizieren.", "rationale": "Das ist ein häufiger, schwer zu findender Performance-Fehler in FastAPI-Anwendungen."}, "CHIEF-TARGET": {"active": true, "scope": "Standardmuster für Dependency Injection und Transaktionsgrenzen als Team-Konvention für FastAPI-Services festlegen.", "rationale": "Uneinheitliche Session-Handhabung erzeugt schwer reproduzierbare Datenintegritätsfehler."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Fortgeschrittene Dependency-Override-Muster für Tests und komplexe Middleware-Ketten sind Vertiefung.", "rationale": "Kern ist der korrekte Request-Lebenszyklus mit sauberer Transaktionsgrenze."}}, "lab_validation": [{"lab_id": "KB-0154-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Request-Scope-Dependency mit simulierter Session", "evidence": "Zwei parallele simulierte Anfragen erhalten jeweils eine eigene, isolierte Session-Instanz statt einer geteilten globalen Session.", "limitations": "Kein echter FastAPI-Server, keine echte Datenbank, keine Produktion."}]}
---
# FastAPI und Request-Lebenszyklen

> **Ziel:** FastAPI strukturiert Validierung über Pydantic, Abhängigkeiten über ein Dependency-Injection-System und Anwendungsstart/-stopp über Lifespan-Events. Der kritischste praktische Punkt ist die korrekte Transaktionsgrenze: eine Datenbank-Session muss pro Anfrage (Request-Scope) erzeugt und sauber geschlossen werden — eine geteilte globale Session zwischen Anfragen erzeugt Datenintegritätsfehler.

## Zweck, Mental Model und Dependencies

FastAPI ist asynchron (async/await) aufgebaut; ein blockierender synchroner Aufruf (z. B. eine synchrone Datenbankbibliothek) innerhalb eines `async def`-Endpunkts blockiert den gesamten Event Loop und damit alle anderen gleichzeitig bearbeiteten Anfragen — nicht nur die eine, die den blockierenden Aufruf macht. Das Dependency-Injection-System (`Depends`) erzeugt pro Anfrage neue Instanzen (Request-Scope), was für Datenbank-Sessions essenziell ist: jede Anfrage braucht ihre eigene Session mit klarer Transaktionsgrenze (öffnen bei Anfragebeginn, committen/rollbacken und schließen bei Anfrageende). Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0153](01-python-fuer-robuste-backends.md) und [KB-0108](../05-distributed-systems/08-verteilte-transaktionen.md).

~~~text
Request arrives -> Depends(get_session) creates NEW session for THIS request
                 -> endpoint logic uses session -> commit or rollback -> session closed
Next request -> gets a DIFFERENT, isolated session instance (never shared/reused across requests)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Pydantic-Validierung | validiert Eingaben an der Systemgrenze vor Verarbeitung? | ungeprüfte Eingaben erreichen Geschäftslogik |
| Dependency-Scope | wird eine Session pro Anfrage neu erzeugt? | geteilte globale Session erzeugt Cross-Request-Datenlecks |
| Lifespan-Events | Startup/Shutdown für Verbindungspools korrekt genutzt? | Connection Pool wird pro Anfrage neu aufgebaut statt einmalig |
| Sync in Async | blockiert ein synchroner Aufruf den Event Loop? | ein langsamer synchroner Call verzögert alle gleichzeitigen Anfragen |

Implementierung: Datenbank-Sessions werden über eine `Depends`-Funktion mit Request-Scope erzeugt, die die Session am Ende der Anfrage garantiert schließt (über einen Generator mit `yield` und Cleanup danach). Connection Pools werden über Lifespan-Events einmalig beim Anwendungsstart aufgebaut, nicht pro Anfrage. Synchrone, blockierende Bibliotheken werden entweder durch asynchrone Alternativen ersetzt oder explizit in einem Thread-Pool ausgeführt (`run_in_executor`), um den Event Loop nicht zu blockieren.

## Scalability, Reliability, Security und Observability

FastAPIs asynchrones Modell skaliert gut für I/O-gebundene Last (viele gleichzeitige, wartende Anfragen), aber ein einzelner blockierender synchroner Aufruf kann diesen Vorteil für alle gleichzeitigen Anfragen zunichtemachen. Reliability-Grenze: eine falsch gescopte (z. B. global geteilte) Datenbank-Session kann Daten zwischen unabhängigen Anfragen vermischen — ein subtiler, unter Last verstärkter Fehler, der in Einzelanfragen-Tests oft nicht sichtbar wird.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| alle Anfragen werden langsam, sobald eine bestimmte Route aufgerufen wird | blockierender synchroner Aufruf in einem async-Endpunkt | Latenzverteilung anderer Routen während der Ausführung dieser Route messen |
| Daten aus einer Anfrage erscheinen unerwartet in einer anderen | Session global geteilt statt pro Anfrage erzeugt | Dependency-Funktion auf Request-Scope statt Singleton prüfen |
| Verbindungsaufbau bei jeder Anfrage sichtbar in Latenz-Traces | Connection Pool nicht über Lifespan, sondern pro Anfrage erzeugt | Pool-Initialisierungscode auf Lifespan- versus Request-Scope prüfen |
| ungültige Eingabe erreicht Geschäftslogik trotz Pydantic-Modell | Validierung umgangen oder Modell unvollständig | Pydantic-Modell-Definition gegen tatsächlich akzeptierte Feldtypen prüfen |

Security: Pydantic-Validierung an der Systemgrenze ist die erste Verteidigungslinie gegen fehlerhafte oder böswillige Eingaben, ersetzt aber keine fachliche Autorisierungsprüfung innerhalb der Geschäftslogik. Observability: Request-ID-Propagation durch Dependencies und Middleware erleichtert das Nachverfolgen einer einzelnen Anfrage durch alle Schichten.

## Trade-offs und Entscheidungen

**Staff** prüft bei plötzlichen Latenzspitzen zuerst auf blockierende synchrone Aufrufe innerhalb async-Endpunkte. **Principal** definiert ein Standardmuster für Request-Scope-Sessions und Lifespan-basierte Connection Pools. **Chief** verlangt konsistente Transaktionsgrenzen-Konventionen über alle FastAPI-Services eines Teams.

Anti-Patterns: eine globale Datenbank-Session für alle Anfragen wiederverwenden; synchrone, blockierende Bibliotheksaufrufe direkt in async-Endpunkten ohne Executor; Connection Pool bei jeder Anfrage neu aufbauen statt über Lifespan einmalig.

## Production Checklist

- [ ] Datenbank-Sessions werden über Request-Scope-Dependencies pro Anfrage erzeugt und garantiert geschlossen.
- [ ] Connection Pools werden über Lifespan-Events einmalig beim Start aufgebaut.
- [ ] Keine blockierenden synchronen Aufrufe ungeschützt in async-Endpunkten.
- [ ] Pydantic-Validierung deckt alle Eingabefelder an der Systemgrenze ab.

## Interviewfragen

### 1. Warum blockiert ein synchroner Aufruf in einem async-Endpunkt den gesamten Server?

**Antwort:** FastAPI läuft auf einem einzelnen Event Loop; ein blockierender synchroner Aufruf hält diesen Loop an, wodurch auch andere gleichzeitig bearbeitete Anfragen nicht weiterlaufen können, bis der blockierende Aufruf fertig ist.

### 2. Warum muss eine Datenbank-Session pro Anfrage neu erzeugt werden?

**Antwort:** Eine geteilte globale Session zwischen Anfragen kann Transaktionszustände vermischen und zu Datenlecks zwischen unabhängigen, gleichzeitigen Anfragen führen.

### 3. Wozu dienen Lifespan-Events?

**Antwort:** Sie erlauben, teure Ressourcen wie Connection Pools einmalig beim Anwendungsstart aufzubauen und beim Shutdown sauber freizugeben, statt sie bei jeder einzelnen Anfrage neu zu erzeugen.

### 4. Wie behandelst du eine notwendige synchrone, blockierende Bibliothek in FastAPI?

**Antwort:** Über explizites Ausführen in einem Thread-Pool-Executor, damit der Event Loop während des blockierenden Aufrufs weiterhin andere Anfragen bearbeiten kann.

### 5. Was leistet Pydantic-Validierung und was nicht?

**Antwort:** Sie prüft Struktur und Typ eingehender Daten an der Systemgrenze, ersetzt aber nicht die fachliche Autorisierungsprüfung innerhalb der Geschäftslogik.

### 6. Widersprüchliche Anforderung: Team will maximale Nebenläufigkeit UND eine bestehende, nur synchron verfügbare Bibliothek unverändert nutzen — wie gehst du vor?

**Antwort:** Ich würde die synchrone Bibliothek gezielt über einen Thread-Pool-Executor einbinden, statt sie direkt im Event Loop aufzurufen — das erhält die Nebenläufigkeit für alle anderen Anfragen, auch wenn der einzelne blockierende Aufruf selbst nicht beschleunigt wird.

## Praktische Labs

~~~python
sessions_created = []

def get_session():  # simulates a FastAPI Depends() with request scope
    session = {"id": len(sessions_created) + 1, "open": True}
    sessions_created.append(session)
    try:
        yield session
    finally:
        session["open"] = False

def handle_request():
    gen = get_session()
    session = next(gen)
    try:
        pass  # endpoint logic would use session here
    finally:
        try:
            next(gen)
        except StopIteration:
            pass
    return session

r1 = handle_request()
r2 = handle_request()
assert r1["id"] != r2["id"]
assert r1["open"] is False and r2["open"] is False
print("Each request got its own isolated session, correctly closed after use.")
~~~

## Dependencies, Cross-References und Quellen

1. FastAPI: [Dependencies](https://fastapi.tiangolo.com/tutorial/dependencies/), abgerufen 2026-09-17.
2. FastAPI: [Lifespan Events](https://fastapi.tiangolo.com/advanced/events/), abgerufen 2026-09-17.
3. SQLAlchemy: [Session Basics](https://docs.sqlalchemy.org/en/20/orm/session_basics.html), abgerufen 2026-09-17.

FastAPI-/SQLAlchemy-Versionsdetails vor Einsatz an aktueller Release-Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| SQLAlchemy 2.0 asynchrone Session-API als Standard für async FastAPI-Anwendungen | Established | Migrationsaufwand von synchroner zu asynchroner Session-API prüfen. |
| Automatisierte Erkennung blockierender Aufrufe in async-Code (Linting) | Adopting | Falsch-Positiv-Rate vor Durchsetzung als hartes CI-Gate validieren. |

Ein Team akzeptiert eine FastAPI-Service-Implementierung erst, wenn Request-Scope-Sessions, Lifespan-basierte Pools und Freiheit von blockierenden Aufrufen im Event Loop nachgewiesen sind.
