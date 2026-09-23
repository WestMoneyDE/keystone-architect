---
{"id": "KB-0238", "title": "Microsoft Purview und Metadatengovernance", "domain": "10", "sequence": 20, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["ENTERPRISE", "GENAI", "MLOPS"], "requires": [{"id": "KB-0237", "concepts": ["Datenkataloge"], "needed_for": "understanding"}, {"id": "KB-0236", "concepts": ["Data Lineage"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Modell zur Unterscheidung von Katalog-Metadaten-Berechtigungen und tatsächlicher Datenzugriffskontrolle lokal implementieren.", "rationale": "Der Unterschied zwischen 'Wissen, dass ein Datensatz existiert' und 'Zugriff auf den Datensatz haben' wird erst durch konkrete Modellierung beider Ebenen greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Scanning- und Klassifikationsstrategie für eine konkrete Metadatengovernance-Einführung begründet gestalten.", "rationale": "Automatisiertes Scanning und Klassifikation müssen gegen tatsächliche Datenquellen-Abdeckung und Klassifikationsgenauigkeit geplant werden."}, "STAFF-TARGET": {"active": true, "scope": "Ein missverstandenes Sicherheitsversprechen (Katalogsichtbarkeit gleich Datenzugriff) auf eine falsche Governance-Annahme statt auf ein technisches Leck zurückführen können.", "rationale": "Metadatenkatalog-Berechtigungen (wer sieht, dass ein Datensatz existiert) und tatsächliche Datenzugriffskontrolle sind unterschiedliche Ebenen, die leicht verwechselt werden."}, "CHIEF-TARGET": {"active": true, "scope": "Purview als Metadatengovernance-Schicht positionieren, die organisatorische Ownership und Klassifikation sichtbar macht, aber tatsächliche Zugriffskontrolle nicht ersetzt.", "rationale": "Metadatengovernance und operative Zugriffskontrolle sind komplementäre, aber getrennte Verantwortungsebenen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Produktspezifische Scanning-Connector-Konfiguration und Klassifikationsregeln sind Vertiefung.", "rationale": "Kern ist das konzeptionelle Verständnis von Metadatengovernance versus Zugriffskontrolle, nicht die Werkzeugkonfiguration."}}, "lab_validation": [{"lab_id": "KB-0238-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell zur Unterscheidung von Katalog-Sichtbarkeit und tatsächlicher Datenzugriffsberechtigung", "evidence": "Ein Nutzer kann Berechtigung haben, einen Katalogeintrag (Metadaten über einen Datensatz) zu sehen, ohne tatsächliche Leseberechtigung auf die zugrunde liegenden Daten selbst zu besitzen — beide Berechtigungsebenen sind unabhängig.", "limitations": "Kein echtes Purview-System, keine reale Datenquelle, keine Produktion."}]}
---
# Microsoft Purview und Metadatengovernance

> **Ziel:** Microsoft Purview scannt Datenquellen, klassifiziert Daten und macht Lineage sichtbar (siehe [KB-0237](19-datenkataloge-und-auffindbarkeit.md), [KB-0236](18-data-lineage.md) für die zugrunde liegenden Prinzipien) — aber Katalog-Metadaten-Berechtigungen (wer sieht, dass ein Datensatz existiert und was er bedeutet) und tatsächliche Datenzugriffskontrolle (wer tatsächlich auf die zugrunde liegenden Daten zugreifen kann) sind zwei getrennte Ebenen, die klar unterschieden werden müssen.

## Zweck, Mental Model und Dependencies

Scanning ist der automatisierte Prozess, bei dem Purview Datenquellen (Datenbanken, Data Lakes, Data Warehouses) durchsucht, um Schema-Informationen, Datenstichproben und Strukturmetadaten zu erfassen — das bildet die technische Grundlage für den Katalog, ersetzt aber nicht die fachliche Anreicherung (Glossarverknüpfung, Geschäftskontext), die häufig manuell oder halbautomatisiert erfolgt. Klassifikation identifiziert automatisch potenziell sensible Datentypen (z. B. Kreditkartennummern, Sozialversicherungsnummern) basierend auf Mustern und macht diese Klassifikation im Katalog sichtbar — diese automatische Erkennung ist ein Hinweis, keine Garantie vollständiger Abdeckung, und sollte durch fachliche Prüfung ergänzt werden. Der zentrale, häufig missverstandene Punkt ist die Trennung zwischen Metadatenkatalog-Berechtigungen und tatsächlicher Datenzugriffskontrolle: ein Nutzer mit Berechtigung, einen Katalogeintrag zu sehen (Metadaten wie Schema, Beschreibung, Klassifikation), hat dadurch nicht automatisch Leseberechtigung auf die zugrunde liegenden Daten selbst — diese wird separat über das jeweilige Datenquellensystem (Datenbank-Berechtigungen, Objektspeicher-Zugriffskontrolle) durchgesetzt. Organisatorische Ownership (wer fachlich/technisch verantwortlich ist) wird im Katalog dokumentiert, ist aber ebenfalls von der technischen Durchsetzung der Zugriffskontrolle getrennt. Lies [KB-0237](19-datenkataloge-und-auffindbarkeit.md) und [KB-0236](18-data-lineage.md).

~~~text
Purview catalog permission:  "can see that this dataset EXISTS and what it MEANS" (metadata visibility)
Actual data access control:  "can actually READ the underlying data" (enforced by the source system, e.g. database/storage)
These are SEPARATE layers - catalog visibility does NOT imply data access
Scanning + classification: automated discovery -> flags likely sensitive data -> requires human verification, not a guarantee
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Trennung Metadaten-/Datenzugriff | ist bekannt und kommuniziert, dass Katalogsichtbarkeit keine Datenzugriffsberechtigung impliziert? | Nutzer oder Governance-Team nimmt fälschlich an, Katalogeinschränkung reiche für Datenschutz aus |
| Scanning-Abdeckung | ist bekannt, welche Datenquellen tatsächlich vom Scanning erfasst werden und welche nicht? | unerfasste Datenquellen erzeugen blinde Flecken in der Governance-Sichtbarkeit |
| Klassifikationsverifikation | wird automatische Klassifikation durch fachliche Prüfung ergänzt statt blind vertraut? | automatische Klassifikationsmuster können sensible Daten übersehen oder falsch klassifizieren |
| Ownership-Dokumentation vs. Durchsetzung | ist klar, dass dokumentierte Ownership organisatorisch, nicht technisch durchgesetzt ist? | dokumentierte Verantwortlichkeit wird fälschlich als technische Zugriffskontrolle missverstanden |

Implementierung: die Trennung zwischen Metadatenkatalog-Berechtigungen und tatsächlicher Datenzugriffskontrolle wird explizit im Governance-Modell dokumentiert und kommuniziert, damit Teams nicht fälschlich annehmen, eine Katalog-Zugriffsbeschränkung schütze die zugrunde liegenden Daten. Scanning-Abdeckung wird explizit dokumentiert (welche Datenquellen sind erfasst, welche bewusst oder unbewusst nicht), um blinde Flecken sichtbar zu machen statt zu verbergen. Automatische Klassifikationsergebnisse werden als Ausgangspunkt für fachliche Verifikation genutzt, nicht als abschließende, vollständig verlässliche Aussage über Datensensitivität. Organisatorische Ownership wird im Katalog dokumentiert und mit einem klaren Verständnis geführt, dass sie eine Governance-Verantwortungszuordnung ist, keine technische Zugriffskontrollmaßnahme.

## Scalability, Reliability, Security und Observability

Purview skaliert Metadatengovernance über große, heterogene Datenlandschaften durch automatisiertes Scanning, das manuelle Katalogisierung für jede einzelne Datenquelle vermeidet. Reliability-Grenze: die Verwechslung von Katalog-Metadaten-Berechtigungen mit tatsächlicher Datenzugriffskontrolle ist ein besonders gefährliches Missverständnis, weil es zu einem falschen Sicherheitsgefühl führen kann — ein Team könnte annehmen, sensible Daten seien geschützt, weil der Katalogeintrag eingeschränkt ist, während die zugrunde liegenden Daten weiterhin unzureichend geschützt zugänglich sind.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Nutzer greift auf sensible Daten zu, obwohl der Katalogeintrag eingeschränkt war | Katalog-Metadaten-Berechtigung wurde fälschlich mit tatsächlicher Datenzugriffskontrolle gleichgesetzt | tatsächliche Zugriffskontrolle des zugrunde liegenden Datenquellensystems unabhängig vom Katalog prüfen |
| bestimmte Datenquellen erscheinen nicht im Governance-Überblick | Scanning-Abdeckung ist unvollständig, diese Quellen sind nicht erfasst | vollständige Liste tatsächlicher Datenquellen gegen die tatsächlich gescannten Quellen im Katalog vergleichen |
| sensible Daten wurden nicht als solche klassifiziert | automatische Klassifikationsmuster haben diese Datenart nicht erkannt, keine fachliche Nachprüfung erfolgt | Klassifikationsergebnis der betroffenen Daten gegen eine manuelle fachliche Prüfung verifizieren |
| Governance-Verantwortliche wissen nicht, dass ihre Ownership-Dokumentation keine technische Zugriffskontrolle bewirkt | fehlendes Verständnis der Trennung zwischen Governance-Dokumentation und technischer Durchsetzung | Governance-Schulungsunterlagen auf explizite Klärung dieser Trennung prüfen |

Security: die Trennung zwischen Katalog-Metadaten-Sichtbarkeit und tatsächlicher Datenzugriffskontrolle ist selbst eine kritische Sicherheitsüberlegung — eine Organisation, die diese Trennung nicht versteht, riskiert, sich auf Katalog-Einschränkungen als (unzureichenden) Schutzmechanismus zu verlassen, während die eigentliche Zugriffskontrolle am Datenquellensystem unzureichend konfiguriert bleibt. Observability: Scanning-Abdeckungsgrad, Klassifikationsverifikationsrate und Diskrepanzen zwischen Katalog-Berechtigungen und tatsächlicher Datenquellen-Zugriffskontrolle sind zentrale Metriken für Governance-Gesundheit.

## Trade-offs und Entscheidungen

**Staff** dokumentiert und kommuniziert die Trennung zwischen Katalog-Metadaten-Berechtigungen und tatsächlicher Datenzugriffskontrolle explizit. **Principal** macht Scanning-Abdeckungslücken für das Governance-Team transparent sichtbar, statt sie zu verbergen. **Chief** positioniert Purview als Metadatengovernance-Schicht, die organisatorische Sichtbarkeit schafft, aber tatsächliche Zugriffskontrolle nicht ersetzt.

Anti-Patterns: Katalog-Zugriffsbeschränkungen fälschlich als ausreichenden Schutz für zugrunde liegende sensible Daten behandeln; automatische Klassifikationsergebnisse ohne fachliche Verifikation als abschließend vertrauen; Scanning-Abdeckungslücken unkommuniziert lassen, wodurch ein falsches Gefühl vollständiger Governance-Sichtbarkeit entsteht.

## Production Checklist

- [ ] Trennung zwischen Katalog-Metadaten-Berechtigungen und tatsächlicher Datenzugriffskontrolle ist dokumentiert und kommuniziert.
- [ ] Scanning-Abdeckung (erfasste versus nicht erfasste Datenquellen) ist explizit dokumentiert.
- [ ] Automatische Klassifikation wird durch fachliche Verifikation ergänzt.
- [ ] Tatsächliche Datenzugriffskontrolle wird unabhängig vom Katalog am Datenquellensystem durchgesetzt und geprüft.

## Interviewfragen

### 1. Was ist der kritische Unterschied zwischen Katalog-Metadaten-Berechtigungen und tatsächlicher Datenzugriffskontrolle?

**Antwort:** Katalog-Berechtigungen bestimmen, wer sehen kann, dass ein Datensatz existiert und was er bedeutet (Metadaten); tatsächliche Datenzugriffskontrolle bestimmt, wer die zugrunde liegenden Daten tatsächlich lesen kann — beide Ebenen sind unabhängig, eine Katalog-Beschränkung schützt nicht automatisch die Daten selbst.

### 2. Warum ist automatische Klassifikation kein Ersatz für fachliche Verifikation?

**Antwort:** Automatische Klassifikation erkennt Muster (z. B. Kreditkartennummern-Formate), kann aber sensible Daten übersehen, die nicht einem bekannten Muster entsprechen, oder falsch klassifizieren — sie ist ein Hinweis, keine garantiert vollständige oder korrekte Aussage.

### 3. Wie diagnostizierst du einen unautorisierten Datenzugriff trotz eingeschränktem Katalogeintrag?

**Antwort:** Ich prüfe die tatsächliche Zugriffskontrolle des zugrunde liegenden Datenquellensystems unabhängig vom Katalog — das Symptom deutet meist darauf hin, dass die Katalog-Beschränkung fälschlich als ausreichender Schutz angenommen wurde, während die eigentliche Datenzugriffskontrolle am Quellsystem unzureichend konfiguriert war.

### 4. Warum ist Scanning-Abdeckung eine kritische Größe für Governance-Vertrauen?

**Antwort:** Datenquellen, die nicht vom Scanning erfasst werden, erzeugen blinde Flecken in der Governance-Sichtbarkeit — ein Governance-Überblick, der diese Lücken nicht explizit dokumentiert, kann fälschlich als vollständig interpretiert werden.

### 5. Was bedeutet organisatorische Ownership im Kontext eines Metadatenkatalogs, und was bewirkt sie nicht?

**Antwort:** Organisatorische Ownership dokumentiert, wer fachlich/technisch für einen Datensatz verantwortlich ist — sie ist eine Governance-Zuordnung, bewirkt aber selbst keine technische Zugriffskontrolle; diese muss separat am Datenquellensystem durchgesetzt werden.

### 6. Widersprüchliche Anforderung: Compliance-Team will vollständige Governance-Transparenz über alle Datenquellen UND minimalen Aufwand für die Integration neuer, heterogener Datenquellen in Purview — wie gehst du vor?

**Antwort:** Ich würde erklären, dass vollständige Transparenz proportionalen Integrationsaufwand für jede neue heterogene Quelle erfordert; ich würde vorschlagen, Scanning-Priorität nach Datensensitivität und Geschäftskritikalität zu staffeln, kritische Quellen zuerst vollständig zu integrieren und bekannte Lücken bei weniger kritischen Quellen explizit zu dokumentieren, statt vollständige Abdeckung ohne entsprechenden Integrationsaufwand zu versprechen.

## Praktische Labs

~~~python
# Separation of catalog metadata permission and actual data access control
catalog_permissions = {"user_a": {"can_view_metadata": ["dataset_1", "dataset_2"]}}
data_access_permissions = {"user_a": {"can_read_data": ["dataset_1"]}}  # NOT dataset_2

def check_actual_access(user, dataset):
    can_see_metadata = dataset in catalog_permissions.get(user, {}).get("can_view_metadata", [])
    can_read_data = dataset in data_access_permissions.get(user, {}).get("can_read_data", [])
    return can_see_metadata, can_read_data

for dataset in ["dataset_1", "dataset_2"]:
    metadata_access, data_access = check_actual_access("user_a", dataset)
    print(f"{dataset}: can see metadata={metadata_access}, can read actual data={data_access}")

_, data_access_ds2 = check_actual_access("user_a", "dataset_2")
assert data_access_ds2 is False
print("user_a can SEE dataset_2 exists in the catalog, but CANNOT actually read its data - the two permission layers are independent.")
~~~

## Dependencies, Cross-References und Quellen

1. Microsoft: [Microsoft Purview — Data Catalog Overview](https://learn.microsoft.com/en-us/purview/purview-data-catalog-overview), abgerufen 2026-09-17.
2. Microsoft: [Microsoft Purview — Data Scanning and Classification](https://learn.microsoft.com/en-us/purview/concept-scans-and-ingestion), abgerufen 2026-09-17.
3. Microsoft: [Microsoft Purview — Access Management](https://learn.microsoft.com/en-us/purview/catalog-permissions), abgerufen 2026-09-17.

Datenkatalog- und Lineage-Grundlagen sind kanonisch in [KB-0237](19-datenkataloge-und-auffindbarkeit.md) und [KB-0236](18-data-lineage.md) behandelt. Purview entwickelt sich kontinuierlich weiter — Feature- und Berechtigungsdetails vor Einsatz zwingend an aktueller Microsoft-Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Vereinheitlichte Governance über mehrere Cloud-Anbieter und On-Premises-Quellen hinweg | Adopting | Für heterogene Multi-Cloud-Umgebungen gegen einzelne, anbieterspezifische Governance-Werkzeuge evaluieren. |
| KI-gestützte, kontextsensitive Klassifikationsvorschläge über Musterabgleich hinaus | Adopting | Als Ergänzung zu, nicht Ersatz für fachliche Klassifikationsverifikation nutzen. |

Ein Team akzeptiert eine Purview-Governance-Einführung erst, wenn die Trennung zwischen Katalog-Metadaten-Berechtigungen und tatsächlicher Datenzugriffskontrolle nachweisbar dokumentiert und kommuniziert ist.
