---
{"id": "KB-0399", "title": "Custom Resource Definitions", "domain": "16", "sequence": 21, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "CLOUD"], "requires": [{"id": "KB-0398", "concepts": ["Controller und Operatoren"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine CustomResourceDefinition mit einem validierenden Schema und einer Status-Subresource erstellen und eine benutzerdefinierte Ressource dagegen anlegen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine mehrversionige CRD mit expliziter Konvertierungslogik zwischen API-Versionen gestalten, die bestehende Ressourcen nicht bricht.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Ein fehlgeschlagenes Upgrade einer CRD-API-Version auf eine fehlende oder fehlerhafte Konvertierungslogik zwischen alten und neuen Versionen zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Versionierte CRD-Schemas mit expliziter, getesteter Konvertierungslogik als Standard für API-Evolution eigener Clusterressourcen im Unternehmen etablieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Fortgeschrittene Webhook-basierte Konvertierungsstrategien im Detail sind Vertiefung.", "rationale": "Kern ist das Verständnis von Schema-Validierung, Versionierung und Status-Subresources als Konzepte, nicht die konkrete Webhook-Implementierung."}}, "lab_validation": [{"lab_id": "KB-0399-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simuliertes CRD-Modell mit zwei API-Versionen und einer fehlenden Konvertierungslogik", "evidence": "Eine simulierte benutzerdefinierte Ressource in Version v1 kann korrekt gelesen werden, während ein Zugriff über die neuere Version v2 ohne registrierte Konvertierungslogik fehlschlägt oder unvollständige Daten liefert, was die Notwendigkeit expliziter Versionskonvertierung demonstriert.", "limitations": "Kein produktiver Kubernetes-Cluster, kein realer Geschäftsdatensatz, künstlich vereinfachtes Versionierungsmodell."}]}
---
# Custom Resource Definitions

> **Ziel:** Eine CustomResourceDefinition (CRD) erweitert die Kubernetes-API um eigene, anwendungsspezifische Ressourcentypen, die von einem Operator verwaltet werden (siehe [KB-0398](20-controller-und-operatoren.md)). Der zentrale Punkt dieses Kapitels ist die sorgfältige Gestaltung dreier Aspekte: ein validierendes Schema (das ungültige Ressourcen bereits beim API Server ablehnt), eine Status-Subresource (die den beobachteten Zustand vom deklarierten Wunschzustand trennt), und explizite Versionskonvertierung (die API-Evolution ermöglicht, ohne bestehende Ressourcen zu brechen).

## Zweck, Mental Model und Dependencies

Ein Schema definiert, welche Felder eine benutzerdefinierte Ressource enthalten darf und welche Typen/Werte gültig sind — der API Server validiert jede eingehende Ressource gegen dieses Schema und lehnt ungültige Definitionen bereits bei der Erstellung ab, statt fehlerhafte Daten erst zur Laufzeit im Operator zu entdecken. Eine Status-Subresource trennt explizit den vom Nutzer deklarierten Wunschzustand (spec) vom vom Controller beobachteten, tatsächlichen Zustand (status) — dies ist wichtig, da beide Felder von unterschiedlichen Akteuren geschrieben werden (Nutzer schreiben spec, der Controller schreibt status) und eine getrennte Subresource verhindert, dass ein Nutzer-Update versehentlich den vom Controller gepflegten Status überschreibt, oder umgekehrt. API-Evolution ist bei CRDs besonders kritisch, da eine eigene, anwendungsspezifische API im Gegensatz zu Kernressourcen (Pods, Deployments) vollständig in der eigenen Verantwortung liegt: wird das Schema einer CRD über die Zeit weiterentwickelt (neue Felder, geänderte Struktur), müssen mehrere API-Versionen (v1alpha1, v1beta1, v1, ...) parallel unterstützt werden, solange bestehende Ressourcen in einer älteren Version im Cluster existieren. Explizite Konvertierungslogik zwischen diesen Versionen (typischerweise über einen Conversion Webhook) stellt sicher, dass ein Zugriff über eine beliebige unterstützte Version stets konsistente, korrekt übersetzte Daten liefert — fehlt diese Konvertierungslogik oder ist sie fehlerhaft, können bestehende Ressourcen bei einem Versions-Upgrade unlesbar werden oder inkonsistente Daten liefern.

~~~text
Schema: defines VALID fields/types for a custom resource -> API Server VALIDATES and REJECTS invalid resources at creation time
  (not discovered later at runtime in the controller)
Status subresource: SEPARATES user-declared desired state (spec) from controller-observed actual state (status)
  different writers (user writes spec, controller writes status) -> separate subresource prevents accidental overwrite
API EVOLUTION is fully the OWNER's responsibility for custom APIs (unlike core resources like Pods)
  schema evolves over time -> MULTIPLE versions (v1alpha1, v1beta1, v1, ...) coexist while old resources still exist
  -> EXPLICIT conversion logic (typically a conversion webhook) required between versions
  -> missing/broken conversion -> existing resources become UNREADABLE or return INCONSISTENT data on version upgrade
~~~

## Core Concepts, Architektur und Implementierung

| Element | Zweck | Risiko bei Fehlkonfiguration |
|---|---|---|
| Schema-Validierung | lehnt ungültige Ressourcen bereits beim API Server ab | fehlende Validierung verschiebt Fehlererkennung auf die Laufzeit im Controller |
| Status-Subresource | trennt Nutzer- und Controller-geschriebene Felder | ohne Trennung können sich Nutzer- und Controller-Updates gegenseitig überschreiben |
| Versionskonvertierung | ermöglicht API-Evolution ohne Brechen bestehender Ressourcen | fehlende/fehlerhafte Konvertierung macht ältere Ressourcen bei Upgrade unlesbar |

Implementierung: Für jede CRD wird ein möglichst striktes, validierendes Schema definiert, das ungültige Feldwerte oder fehlende Pflichtfelder bereits bei der Erstellung ablehnt. Eine Status-Subresource wird für jede CRD aktiviert, deren Zustand vom zugehörigen Controller aktiv verwaltet wird, um eine klare Trennung zwischen Nutzer-Wunsch und Controller-Beobachtung zu erzwingen. Bei jeder Schemaänderung, die die API-Struktur betrifft, wird eine neue API-Version eingeführt, und eine explizite, getestete Konvertierungslogik zwischen der neuen und allen noch unterstützten älteren Versionen implementiert, bevor bestehende Ressourcen älterer Versionen im Cluster verbleiben dürfen.

## Scalability, Reliability, Security und Observability

Strikte Schema-Validierung skaliert Datenqualität proportional zur Vollständigkeit der definierten Constraints; die Reliability-Grenze liegt darin, dass fehlende oder fehlerhafte Versionskonvertierung proportional zur Anzahl bestehender Ressourcen älterer Versionen das Risiko unlesbarer oder inkonsistenter Daten bei einem API-Versions-Upgrade erhöht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine benutzerdefinierte Ressource wird nach einem API-Versions-Upgrade unlesbar oder liefert unvollständige Daten | die Konvertierungslogik zwischen der alten und neuen Version fehlt oder ist fehlerhaft | die registrierte Conversion-Webhook-Logik für die betroffenen Feldänderungen prüfen und korrigieren |
| eine ungültige benutzerdefinierte Ressource wird erst zur Laufzeit im Controller als fehlerhaft erkannt | das CRD-Schema validiert die betroffenen Felder nicht ausreichend streng | das Schema um die fehlende Validierungsregel für dieses Feld ergänzen |
| ein Controller-Status-Update wird von einem gleichzeitigen Nutzer-Update überschrieben oder umgekehrt | keine Status-Subresource ist aktiviert, wodurch spec und status nicht getrennt behandelt werden | die Status-Subresource für die betroffene CRD aktivieren |

Security: Ein zu locker gefasstes CRD-Schema kann ungültige oder unerwartete Daten zulassen, die nachgelagerte Controller-Logik in einen unerwarteten Zustand versetzen; strikte Schema-Validierung ist daher auch eine Sicherheitsmaßnahme gegen fehlerhafte Eingabedaten. Observability: Die Anzahl der Ressourcen pro API-Version, die Erfolgsrate von Konvertierungswebhook-Aufrufen, und die Häufigkeit von Schema-Validierungsfehlern bei Erstellungsversuchen sind zentrale CRD-Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert strikte Schema-Validierung und aktivierte Status-Subresources für jede CRD. **Principal** macht Versionierungsentscheidungen und Konvertierungslogik für das Team nachvollziehbar. **Chief** etabliert versionierte CRD-Schemas mit expliziter, getesteter Konvertierungslogik als Standard für API-Evolution eigener Clusterressourcen im Unternehmen.

Anti-Patterns: eine CRD ohne strikte Schema-Validierung einführen, wodurch ungültige Daten erst zur Laufzeit erkannt werden; eine Schemaänderung ohne neue API-Version und Konvertierungslogik vornehmen, was bestehende Ressourcen bricht; keine Status-Subresource für eine vom Controller aktiv verwaltete Ressource aktivieren.

## Production Checklist

- [ ] Jede CRD besitzt ein striktes, validierendes Schema für alle relevanten Felder.
- [ ] Eine Status-Subresource ist für jede vom Controller aktiv verwaltete Ressource aktiviert.
- [ ] Jede Schemaänderung führt zu einer neuen API-Version mit getesteter Konvertierungslogik.
- [ ] Bestehende Ressourcen älterer API-Versionen werden vor einem Upgrade auf Lesbarkeit über alle unterstützten Versionen geprüft.

## Interviewfragen

### 1. Warum ist ein striktes, validierendes Schema für eine CRD wichtig?

**Antwort:** Es lehnt ungültige Ressourcen bereits beim API Server ab, statt fehlerhafte Daten erst zur Laufzeit im Controller zu entdecken, was Fehler früher und mit klarerer Fehlermeldung sichtbar macht.

### 2. Wofür wird eine Status-Subresource verwendet?

**Antwort:** Sie trennt den vom Nutzer deklarierten Wunschzustand (spec) vom vom Controller beobachteten tatsächlichen Zustand (status), um zu verhindern, dass Updates der jeweils anderen Seite versehentlich überschrieben werden.

### 3. Warum ist API-Evolution bei CRDs besonders in der eigenen Verantwortung, im Gegensatz zu Kernressourcen?

**Antwort:** Eine eigene, anwendungsspezifische API liegt vollständig unter eigener Kontrolle; jede Schemaänderung erfordert daher eine eigene, explizite Versionierungs- und Konvertierungsstrategie, statt sich auf von Kubernetes selbst verwaltete Kompatibilität zu verlassen.

### 4. Was passiert, wenn eine Versionskonvertierung fehlt oder fehlerhaft ist?

**Antwort:** Bestehende Ressourcen in älteren API-Versionen können bei einem Upgrade unlesbar werden oder inkonsistente Daten liefern, wenn über eine andere Version darauf zugegriffen wird.

### 5. Wie gehst du vor, wenn eine benutzerdefinierte Ressource nach einem API-Versions-Upgrade unlesbar wird?

**Antwort:** Ich prüfe die registrierte Konvertierungslogik (typischerweise einen Conversion Webhook) zwischen der alten und neuen Version auf fehlende oder fehlerhafte Feldübersetzungen.

### 6. Widersprüchliche Anforderung: Team will schnelle, unkomplizierte CRD-Schemaänderungen UND garantiert keine gebrochenen bestehenden Ressourcen — wie gehst du vor?

**Antwort:** Ich würde jede strukturelle Schemaänderung als neue API-Version einführen und eine automatisiert getestete Konvertierungslogik zwischen alter und neuer Version implementieren, sodass Änderungen zügig vorgenommen werden können, während bestehende Ressourcen über die Konvertierungslogik weiterhin korrekt lesbar bleiben.

## Praktische Labs

~~~python
def validate_against_schema(resource, schema):
    for field, field_type in schema.items():
        if field not in resource:
            return False, f"Missing required field: {field}"
        if not isinstance(resource[field], field_type):
            return False, f"Field '{field}' has wrong type: expected {field_type.__name__}"
    return True, "Valid"

schema_v1 = {"replicas": int}

def convert_v1_to_v2(resource_v1):
    # Explicit conversion logic: v2 renamed 'replicas' to 'desiredReplicas'
    return {"desiredReplicas": resource_v1["replicas"]}

resource_v1 = {"replicas": 3}
valid, message = validate_against_schema(resource_v1, schema_v1)
print(f"v1 resource validation: {valid}, {message}")

resource_v2 = convert_v1_to_v2(resource_v1)
print(f"Converted to v2 for reading via the newer API version: {resource_v2}")

invalid_resource = {"replicas": "three"}  # wrong type
valid, message = validate_against_schema(invalid_resource, schema_v1)
print(f"\nInvalid resource rejected at 'API server' validation time: {valid}, {message}")
~~~

## Dependencies, Cross-References und Quellen

1. Kubernetes-Dokumentation: [Custom Resources](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/), abgerufen 2026-09-17.
2. Kubernetes-Dokumentation: [Versions in CustomResourceDefinitions](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/), abgerufen 2026-09-17.

Controller und Operatoren sind kanonisch in [KB-0398](20-controller-und-operatoren.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Schema-Kompatibilitätsprüfungswerkzeuge, die Breaking Changes zwischen CRD-Versionen vor dem Deployment erkennen | Adopting | Gegenüber manueller Versionsprüfung für zuverlässigere, frühzeitige Erkennung inkompatibler Änderungen bevorzugen. |
| Deklarative, code-generierte Conversion-Webhooks statt manuell implementierter Konvertierungslogik | Evaluating | Gegenüber manuell implementierten Webhooks abwägen, sobald das Generierungswerkzeug nachweislich korrekte Konvertierung für den konkreten Anwendungsfall liefert. |

Ein Team akzeptiert eine CRD-Schemaänderung erst, wenn eine getestete Konvertierungslogik die Lesbarkeit bestehender Ressourcen über alle unterstützten API-Versionen sicherstellt.
