---
{"id": "KB-0008", "title": "Revisionen und Versionierungsstrategie", "domain": "00", "sequence": 8, "document_type": "navigation", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-15", "technical_reviewed_at": null, "research_cutoff": "2026-09-15", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0001", "concepts": ["Statusmodell", "Master Index", "Register"], "needed_for": "understanding"}, {"id": "KB-0003", "concepts": ["Abhängigkeitsgraph", "Requires-Kanten", "Verbraucher"], "needed_for": "understanding"}, {"id": "KB-0007", "concepts": ["Lernwellen", "Recheck-Trigger", "Evidenzstatus"], "needed_for": "understanding"}], "related": ["KB-0002", "KB-0004", "KB-0005", "KB-0006", "KB-0009", "KB-0011", "KB-0350", "KB-0400", "KB-0464", "KB-0500", "KB-0572", "KB-0618", "KB-0720"], "applies": ["KB-0011", "KB-0350", "KB-0400", "KB-0464", "KB-0500", "KB-0572", "KB-0618", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Labrevisionen erfassen Umgebung, Versionen, Ausführungsstatus, Gegenprobe, Ergebnis und Cleanup als reproduzierbaren Kontext.", "rationale": "Ein nicht versioniertes Testergebnis kann bei neuer Runtime, SDK oder Konfiguration nicht zuverlässig interpretiert werden."}, "ARCHITECT-TARGET": {"active": true, "scope": "Architekturentscheidungen besitzen Annahmen, Auslöser für Neubewertung, Alternativen, Migrations- und Rollbackfolgen.", "rationale": "Eine Architekturentscheidung bleibt nur so lange tragfähig wie ihre belegten Randbedingungen."}, "STAFF-TARGET": {"active": true, "scope": "Staff-Arbeit etabliert wiederholbare Change- und Revalidationpfade für Referenzimplementierungen und geteilte Standards.", "rationale": "Mehrere Teams brauchen sichere Updates statt impliziter Wissensweitergabe oder unkontrollierter Varianten."}, "CHIEF-TARGET": {"active": true, "scope": "Chief-Entscheidungen steuern Technologieportfolio, Ausnahme, Lieferantenrisiko und Erneuerungsinvestition über explizite Versions- und Exitkriterien.", "rationale": "Technische Schulden und Bindungskosten werden sichtbar, bevor eine überholte Annahme strategisch teuer wird."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Spezialisten prüfen versionssensitive Details wie Kernel-, GPU-, Routing-, Datenbank- oder Kryptographieänderungen, wenn sie eine kritische Kontrollgrenze bestimmen.", "rationale": "Die Architekturrolle bleibt für die Entscheidung verantwortlich, benötigt aber verlässliche fachliche Revalidation an tiefen Grenzen."}}, "lab_validation": [{"lab_id": "KB-0008-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-15", "environment": "Lokales, fiktives Änderungsset für einen versionierten Toolvertrag", "evidence": "Die Fallarbeit enthält Klassifikation, Quellenprüfung, Abhängigkeitsanalyse, Test- und Rollbackplan sowie Statusübergang.", "limitations": "Es wurde kein echter Produktupgrade, Cloudservicewechsel oder unabhängiger Production Change durchgeführt."}]}
---
# Revisionen und Versionierungsstrategie

## Zweck, Definition und Scope

Technische Aussagen altern unterschiedlich schnell. Ein RFC kann lange stabil bleiben, ein SDK kann in Monaten sein Verhalten ändern, ein Managed Service kann regional andere Funktionen haben und ein Modellanbieter kann Preis, Kontextfenster oder Sicherheitsgrenzen ändern. Eine Wissensbasis bleibt deshalb nur belastbar, wenn sie nicht einfach neue Informationen an alte Texte anhängt, sondern die betroffene Aussage, ihre Quelle, ihre Abhängigkeiten und ihre Tests gezielt erneut prüft.

Dieses Kapitel definiert die Versionierungsstrategie für alle 720 Lehrdateien. Es trennt redaktionelle Korrektur, materielle Fachänderung, Quellenaktualisierung, Umgebung- oder Konfigurationsänderung, Update der Selbsteinschätzungs-Evidenz und Registerpflege. Es beschreibt auch, wann ein Artikel zurück in technical_review muss und wann eine automatische Status- oder Linkaktualisierung nur eine Integritätsprüfung braucht.

Nach diesem Kapitel kann der Leser:

1. eine Änderung nach Inhalt, Risiko, Quelle, Umgebung und betroffenen Verbrauchern klassifizieren;
2. content_version, research_cutoff, Labstatus, Reviewstatus und Quellenstand ohne falsche Präzision pflegen;
3. eine materielle Fachänderung von einer redaktionellen Korrektur unterscheiden;
4. Abhängigkeits- und Cross-Reference-Folgen vor einem Update analysieren;
5. einen Upgrade, eine EOL, eine neue Standardrevision oder einen Architekturwechsel als prüfbaren Change behandeln;
6. Architektur-, Staff- und Chief-Entscheidungen mit Recheck, Migration, Ausnahme und Exit verknüpfen.

## Kompetenzmarker und Evidenzgrenzen

| Marker | Status | Aussagegrenze |
|---|---|---|
| CURRENT-EVIDENCE | offen | Eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| HANDS-ON-TARGET | aktiv | Umgebung, Version, Testdaten, Gegenprobe, Ergebnis und Cleanup werden pro Labrevision festgehalten. |
| ARCHITECT-TARGET | aktiv | Annahmen, Alternativen, Trigger, Migrations- und Rollbackfolgen werden als entscheidungsrelevante Revisionen behandelt. |
| STAFF-TARGET | aktiv | Geteilte Referenzpfade erhalten einen kontrollierten Update-, Kommunikations- und Supportweg. |
| CHIEF-TARGET | aktiv | Portfolioentscheidungen berücksichtigen EOL, Vertrags-, Souveränitäts-, Sicherheits- und Exitfolgen. |
| SPECIALIST-OPTIONAL | aktiv | Tiefe, versionssensitive Details werden mit klarer Abnahme und Übergabe durch Spezialisten revalidiert. |

## Mental Model: Aussage, Kontext, Beleg und Verbraucher

Eine technische Aussage ist nicht nur ein Satz. Sie besteht aus vier Teilen:

Aussage → Kontext und Version → Beleg → Verbraucher.

Beispiel: „Ein Toolgateway weist ein abgelaufenes Delegationstoken ab.“ Der Kontext umfasst Identity Provider, Tokenformat, Gatewayversion, Policy und Umgebung. Der Beleg ist ein dokumentierter negativer Test. Verbraucher sind die Architekturentscheidung, das Security-Runbook, die Referenzimplementierung und alle Kapitel, die diese Durchsetzungsgrenze voraussetzen.

Ändert sich die Tokenbibliothek oder das Gateway, reicht es nicht, nur die Konfigurationszeile anzupassen. Die Aussage wird erneut geprüft: Gilt sie weiter? Ist der Test noch aussagekräftig? Haben sich Fehlercodes, Logging oder Scope-Semantik verändert? Müssen Verbraucher informiert oder zurück auf technical_review gesetzt werden?

| Ebene | Was versioniert wird | Typische Änderung |
|---|---|---|
| Redaktion | Ausdruck, Linktext, Tippfehler, Tabellenlayout. | Klarere Formulierung ohne Änderung der fachlichen Aussage. |
| Inhalt | Mechanismus, Sicherheitsgrenze, Entscheidung, Konfiguration oder Fehlermodell. | Neufassung eines Retry-, Identity- oder Datenflussmodells. |
| Quelle | Herausgeber, Dokumentrevision, URL, Abrufdatum, Geltungsbereich. | Neuer Standardrelease oder korrigierte Primärquelle. |
| Umgebung | SDK, API, Runtime, Controller, Region, Hardware, Modell, Featureflag. | Neue Kubernetesversion, Modellrelease oder Provider-EOL. |
| Evidenz | Labresultat, Review, Portfolioartefakt oder Grenze eines Erfahrungsclaims. | Test erneut ausgeführt, unabhängiger Review ergänzt, Claim präzisiert. |
| Register | Status, Hash, Abhängigkeitskante oder Cross-Reference. | Kapitel wird verschoben, ein Requires-Link wird korrigiert. |

## Prerequisites und Dependencies

[KB-0001](01-master-index-und-wegweiser.md) enthält den Master Index und die Statussemantik. [KB-0003](03-vollstaendiger-abhaengigkeitsgraph.md) zeigt, welche harten Requires-Kanten bei einer Änderung analysiert werden. [KB-0007](07-lernwellen-und-fortschrittssteuerung.md) bindet Recheck-Trigger an Lern- und Evidenzfortschritt.

| Beziehung | Datei | Anwendung |
|---|---|---|
| Evidenz und Kompetenz | [KB-0004](04-cv-istbild-und-zielkompetenzen.md), [KB-0005](05-kompetenzmodell-fuer-staff-principal-und-chief.md), [KB-0006](06-praktische-und-architektonische-lerntiefe.md) | Claimgrenzen, Nachweistiefe und Wirkungskette. |
| Labstrategie | [KB-0009](01-master-index-und-wegweiser.md#kb-0009) | Reproduzierbare Ausführung, Gegenprobe und Cleanup. |
| Volatile Fachbereiche | [KB-0350](01-master-index-und-wegweiser.md#kb-0350), [KB-0400](01-master-index-und-wegweiser.md#kb-0400), [KB-0464](01-master-index-und-wegweiser.md#kb-0464), [KB-0500](01-master-index-und-wegweiser.md#kb-0500), [KB-0572](01-master-index-und-wegweiser.md#kb-0572) | Daten, GenAI, Agentik, Plattform und GPU-/Servingupdates. |
| Governance und Portfolio | [KB-0618](01-master-index-und-wegweiser.md#kb-0618), [KB-0720](01-master-index-und-wegweiser.md#kb-0720) | Rechtsraum, Compliance, Portfolioevidenz und Reife. |

## Core Concepts

### Semantische Versionen für Lehrartikel

Die content_version folgt dem Muster MAJOR.MINOR.PATCH. Sie beschreibt den Inhalt des einzelnen Artikels, nicht die Produktversion einer Technologie.

| Änderung | Beispiel | Versionsschritt | Reviewfolge |
|---|---|---|---|
| Patch | Link reparieren, Tippfehler korrigieren, missverständliche Tabelle präzisieren ohne neue Aussage. | PATCH | Integritätsprüfung, bei sicherheitsrelevantem Wortlaut zusätzlich Fachprüfung. |
| Additive fachliche Ergänzung | Neue abgesicherte Option, weiteres Lab oder zusätzliches Fehlerbild ohne alte Kernaussage zu widerrufen. | MINOR | Betroffene Quellen und Querverweise prüfen; mindestens technical_review. |
| Inkompatible oder korrigierende Fachänderung | Sicherheitsmodell, API-Vertrag, kanonische Zuständigkeit, Architekturentscheidung oder zentrale Aussage ändert sich. | MAJOR | Artikel und betroffene Verbraucher auf technical_review; Migration und Rollback dokumentieren. |

Eine Versionsnummer beweist keine Qualität. Die dazugehörigen Felder research_cutoff, Quellenrecords, Hash, Reviewprotokoll und Labstatus erklären, worauf die Nummer basiert.

### Statusmodell und Rückstufung

| Status | Bedeutung | Zulässiger Übergang |
|---|---|---|
| planned | Nur katalogisiert, noch kein vollständiger Artikel. | researching oder draft. |
| researching | Quellen und offene Fragen werden erfasst. | draft oder zurück planned. |
| draft | Text liegt vor, aber Struktur, Quellen oder Fachprüfung sind unvollständig. | technical_review oder zurück researching. |
| technical_review | Selbst- oder Fachprüfung dokumentiert; offene unabhängige Prüfung möglich. | accepted nach geeigneter unabhängiger Annahme, oder zurück draft. |
| accepted | Fachlich angenommene Revision ohne blockierende oder wesentliche offene Befunde. | packaged oder bei materieller Änderung technical_review. |
| packaged | Weiterhin accepted, zusätzlich archiviert oder verpackt. | technical_review bei materieller Änderung. |

Eine materielle Änderung hebt die alte Annahme nicht stillschweigend auf; sie setzt die neue Revision zurück auf technical_review. Reine Registeraktualisierungen benötigen mindestens eine Integritätsprüfung, solange sie keine Aussage, Anforderung oder harte Abhängigkeit verändern.

### Volatilität und Recheck-Trigger

| Klasse | Beispiele | Mindestreaktion |
|---|---|---|
| Hoch volatil | Modell- und SDK-Versionen, Managed-Service-Features, Preise, Regionen, Preview/GA, Security Advisories. | Primärquelle erneut prüfen; Konfiguration, Lab und Architekturfolgen bewerten. |
| Mittel volatil | Kubernetes- oder Datenbankrelease, Standardrevision, Toolprotokoll, Provider-Supportfenster. | Versionsmatrix und betroffene Schnittstellen prüfen; Upgradefall definieren. |
| Stabil mit Kontextpflicht | RFC-Grundprinzip, Datenstruktur, Algorithmus. | Quelle erhalten; bei neuer Interpretation oder Implementierungsänderung Kontext prüfen. |
| Persönliche Evidenz | Erfahrungsclaim der Selbsteinschätzung, Portfolioartefakt, Reviewresultat. | Neue Evidenz separat ergänzen; alte Aussage und Grenze nicht überschreiben. |

Ein Recheck-Trigger kann ein Changelog, eine EOL-Ankündigung, ein Incident, eine neue Datenklasse, ein neues Modell, eine Security-Lücke, eine überhöhte Kostenkennzahl oder eine nicht mehr erfüllte SLO sein. Der Trigger schreibt nicht selbst die Änderung vor. Er löst eine begrenzte Untersuchung aus.

## Architektur und Data Flow: Change Impact

Der Change Flow lautet:

Auslöser → Klassifikation → betroffene Aussage und Quelle → Umgebung und Verbraucher → Test- oder Reviewplan → Änderung und Gegenprobe → Status- und Registerupdate → Recheck der Folgeartikel.

### Beispiel: Änderung eines versionierten Toolvertrags

Ein Agentenservice nutzt einen Toolvertrag zur Vorbereitung einer Commerce-Reservierung. Der Vertrag erhält ein neues optionales Feld. Zunächst wirkt das wie eine additive MINOR-Änderung. Die Analyse prüft jedoch:

1. Wird das Feld von einer Policy, einem Signaturformat oder einem Consumer als verpflichtend interpretiert?
2. Ändert es die Datenklasse, Auditpflicht oder Berechtigung?
3. Akzeptieren alte Clients den Vertrag weiterhin?
4. Wie reagiert ein Consumer, der das Feld nicht kennt oder einen unzulässigen Wert erhält?
5. Welche Kapitel, Referenzimplementierungen, Tests und Runbooks verwenden die alte Semantik?
6. Welche Messung zeigt eine schrittweise Migration und wie wird sie zurückgerollt?

| Komponente | Prüffrage | Beispiel-Gegenprobe |
|---|---|---|
| Producer | Erzeugt er alte und neue Form korrekt? | Neues Feld fehlt oder hat ungültigen Wert. |
| Gateway / Policy | Erzwingt es die richtige Sicherheitsgrenze? | Feld versucht Scope oder Tenant zu überschreiben. |
| Consumer | Bleibt Abwärtskompatibilität erhalten? | Alter Consumer ignoriert Feld oder lehnt sauber ab. |
| Audit / Telemetrie | Werden Ereignisse ohne sensible Übererfassung korreliert? | Neues Feld darf nicht ungeprüft in Logs oder Labels landen. |
| Betrieb | Ist Rollback möglich? | Deployment auf alte Version bei Fehleranstieg. |
| Verbraucher | Wissen Referenzpfade und Kapitel von neuer Semantik? | Link- und Dependency-Review. |

Erst diese Analyse entscheidet, ob die Revision tatsächlich MINOR bleibt oder eine MAJOR-Migration und erneute Architekturreviews benötigt.

## Protokolle, Standards und Werkzeuge

Versionierung trennt Standard, Implementierung und Einsatzumgebung.

| Gegenstand | Zu erfassen | Häufiger Fehler |
|---|---|---|
| Norm oder Protokoll | Herausgeber, Revision, Status, relevante Abschnitte, Datum. | Aus einem Standard auf vollständige Implementierung schließen. |
| API oder SDK | Version, Kompatibilitätsversprechen, Deprecation, Auth- und Transportgrenze. | Blogpost statt maßgeblicher Referenz als Konfiguration verwenden. |
| Managed Service | Region, Tier, Feature-Status, Limits, Preise, Support- und EOL-Fenster. | Verfügbarkeit in einer Region als globale Eigenschaft behaupten. |
| Laufzeit / Plattform | Betriebssystem, Kernel, Runtime, Controller, CNI/CSI, Hardwaretreiber, Policy. | Nur Applikationsversion notieren und Umgebung ignorieren. |
| Modell / Eval | Modellkennung, Parameter, Prompt- und Datasetversion, Metrik, Schwelle, Zeitpunkt. | Ein Ergebnis ohne Modell-, Daten- oder Promptkontext vergleichen. |
| Architekturstandard | Owner, Version, Ausnahme, Migration, Support, Ablaufdatum, Exit. | Standard als dauerhafte Wahrheit ohne Verantwortlichen behandeln. |

Werkzeuge wie Git, Commit-Hashes, Release Notes, Dependency-Scanner, SBOMs, ADRs, CI-Reports, Featureflags, Configuration as Code und Observability helfen bei der Umsetzung. Sie ersetzen nicht die fachliche Wirkungskontrolle. Ein grüner Build bestätigt höchstens die abgedeckten Tests; er bestätigt weder korrekte Datenklassifikation noch wirtschaftliche Tragfähigkeit.

## Konfiguration und Implementierung

### Minimaler Revisionsrecord

| Feld | Inhalt |
|---|---|
| Artikel und Revision | ID, content_version, Autor, Änderungsdatum. |
| Auslöser | Changelog, Incident, neue Quelle, neue Evidenz, Korrektur oder periodischer Recheck. |
| Klassifikation | PATCH, MINOR oder MAJOR; fachlich, Quelle, Umgebung, Evidenz oder Register. |
| Betroffene Aussagen | Konkreter Satz, Tabelle, Konfiguration oder Entscheidung. |
| Quelle | Herausgeber, URL, Versions- oder Veröffentlichungsdatum, Abrufdatum und Aussage. |
| Wirkung | Benutzer, Datenfluss, Control, Kosten, SLO, Support, Vertrag oder Portfolio. |
| Verbraucher | Requires, verwandte Artikel, Referenzpfade, Runbooks, Tests, Owners. |
| Nachweis | Gegenprobe, Teststatus, Reviewmethode, Ergebnis und offene Grenze. |
| Migration / Rollback | Reihenfolge, Kompatibilität, Messschwelle, Rückweg und Besitzer. |
| Entscheidung | Freigegeben, weiter untersuchen, Scope reduzieren, stoppen oder abgelöst. |

### Praktische Ablaufregel

1. Lies zuerst den aktuellen Artikel und die zugehörigen Quellenrecords.
2. Formuliere die Änderung als testbare Aussage, nicht als Produktname oder vage „Upgrade“-Aufgabe.
3. Klassifiziere Volatilität und Risiko. Bei Security, Datenklasse, Identity, Vertrag, EOL oder Kostenmodell ist eine reine Patchannahme skeptisch zu behandeln.
4. Suche harte Requires-Verbraucher im Dependency Graph und prüfe offene Cross-References.
5. Aktualisiere Text, Frontmatter, Quellenregister, Lab- oder Reviewrecord gemeinsam.
6. Führe die kleinste aussagekräftige Gegenprobe aus oder markiere sie ehrlich als nicht ausgeführt.
7. Prüfe Hash, Links, Statusaggregat und zyklusfreie Kanten.
8. Kommuniziere nur die nachgewiesene Reichweite der Änderung; offene Grenzen bleiben sichtbar.

## Skalierbarkeit und Performance

Ohne Versionierungsdisziplin wächst eine Knowledge Base schneller als ihre Verlässlichkeit. Die Engpässe sind Reviewzeit, Quellensuche, Testkosten und die Zahl der abhängigen Aussagen. Skalierung gelingt durch risikobasierte Revalidation statt durch gleichzeitiges Neuprüfen aller Kapitel.

| Skalierungsproblem | Schlechte Reaktion | Besserer Mechanismus |
|---|---|---|
| Viele Quellen ändern sich | Alles manuell und vollständig erneut lesen. | Quellen nach Volatilität, Kritikalität und Verbraucherzahl priorisieren. |
| Viele Artikel verlinken auf eine Grenze | Jeden Text unabhängig kopieren. | Kanonische Hauptdatei, stabile IDs und ermittelte Verbraucher. |
| Upgrade betrifft viele Teams | Big-Bang-Update ohne Sichtbarkeit. | Kompatibilitätsfenster, Telemetrie, gestaffelte Migration und Rollback. |
| Neues Modell oder Service | Ergebnisse ohne Vergleich überschreiben. | Versionierte Evalbasis, Schwellen, Baseline und Fehlerklassen. |
| Review ist knapp | Akzeptanzschwelle senken. | Automatische Integritätschecks für Routine, menschliche Prüfung für Fach- und Risikoänderungen. |

Performance wird in dieser Disziplin als kurze Zeit bis zu einer sicheren Neubewertung gemessen: Wie schnell wird ein relevanter Trigger erkannt, die betroffene Aussage eingegrenzt, die richtige Gegenprobe ausgeführt und eine Entscheidung kommuniziert? Geschwindigkeit ohne Impactanalyse erzeugt nur schneller veraltete Standards.

## Reliability und Failure Modes

| Failure Mode | Symptom | Schutz und Recovery |
|---|---|---|
| Versionskosmetik | Nummer steigt, aber Quelle, Test und Aussage bleiben unklar. | Revisionsrecord mit Auslöser, Wirkung, Nachweis und Verbraucher verpflichtend machen. |
| Stille materielle Änderung | Accepted-Artikel ändert zentrale Entscheidung ohne Rückstufung. | MAJOR/MINOR klassifizieren und wieder technical_review setzen. |
| Quellenverfall | Link existiert, stützt aber die Aussage nicht mehr oder verweist auf alte Revision. | Herausgeber, Version, Datum und gestützte Aussage prüfen; Primärquelle bevorzugen. |
| Umgebungslücke | Test ist nicht reproduzierbar, weil SDK, Region oder Featureflag fehlen. | Versionsmatrix und Labumgebung erfassen; Unbekanntes klar markieren. |
| Breakage bei Verbrauchern | Update korrigiert Hauptartikel, Folgeartikel bleiben semantisch alt. | Requires- und related-Analyse, Graph- und Linkprüfung, gezielte Revalidation. |
| Rollbackillusion | Alte Version ist theoretisch verfügbar, Daten oder Verträge sind aber nicht kompatibel. | Rückweg, Datenmigration, Kompatibilitätsfenster und Abbruchschwelle vorab testen. |
| EOL-Überraschung | Service oder Bibliothek wird erst kurz vor Ende entdeckt. | Changelog-, Support- und EOL-Trigger mit Owner und Zeitbudget. |

## Security, Governance und Compliance

Change Management ist selbst eine Sicherheitsgrenze. Wer Quelle, Konfiguration oder Policy ändern darf, braucht minimale Rechte, nachvollziehbare Review und einen sicheren Weg zurück. Secrets und private Profil- oder Kundendaten gehören weder in Changelog noch in Beispielkonfiguration.

Für Sicherheit und Compliance zählt die Anwendbarkeit: Eine neue gesetzliche Frist, ein Standardupdate oder eine Advisories-Meldung wird nach System, Rolle, Sektor, Jurisdiktion, Datenklasse und Stichtag bewertet. Das Kapitel behauptet keine pauschale Pflicht aus einer Quelle. Es beschreibt die technische Reaktion: betroffene Entscheidung bestimmen, Control und Evidenz prüfen, Owner und Ausnahme festlegen und den tatsächlichen Geltungsbereich separat klären.

| Änderung | Governance-Mindestfrage |
|---|---|
| Security Advisory | Welche Komponenten, Konfigurationen und Datenflüsse sind betroffen; welche Mitigation gilt bis Patch oder Ersatz? |
| API- oder Vertragsbruch | Wer genehmigt Kompatibilitätsfenster, Migration und Kundenkommunikation? |
| Modell- oder Datenwechsel | Welche Qualitäts-, Privacy-, IP- und Auditannahmen ändern sich? |
| Provider-EOL | Welche Exitkosten, Datenbewegungen, Verträge und DR-Grenzen entstehen? |
| Selbsteinschätzungs- oder Portfolioartefakt | Welche Aussage ist erlaubt, welche Daten müssen redigiert bleiben und wer darf prüfen? |

## Observability und Troubleshooting

Eine Revisionsstrategie braucht beobachtbare Signale:

| Signal | Bedeutung | Diagnose |
|---|---|---|
| Quelle älter als definierte Volatilitätsgrenze | Recheck kann fällig sein. | Gilt Aussage noch, gibt es neue Revision, EOL oder Sicherheitsinfo? |
| Anteil unauflösbarer Links oder IDs | Navigation und Verbraucheranalyse sind beschädigt. | Pfad, Titel, ID-Mapping und Register neu prüfen. |
| Upgrade-Fehlerklasse oder Error Rate | Kompatibilität oder Konfiguration bricht. | Version, Featureflag, Consumer, Datenmigration und Rollback vergleichen. |
| Eval-Regression | Modell-, Prompt-, Tool- oder Datenänderung beeinflusst Qualität. | Fehlerklasse, Dataset, Schwelle und Kosten gegen Baseline prüfen. |
| Ausnahmealter | Temporäre Entscheidung wird dauerhaft. | Owner, Ablaufdatum, Migration und Rest-Risiko erneut bewerten. |
| Recheck-Backlog | Kritische Annahmen bleiben ungeprüft. | Nach Risiko und Verbraucherzahl priorisieren; Scope stoppen, wenn nötig. |

**Troubleshooting: Ein Update wirkt klein, bricht aber mehrere Tests.** Prüfe zuerst, ob das Problem Vertrag, Semantik, Umgebung, Datenmigration oder Testannahme ist. Vergleiche ein minimales Reproduktionsbeispiel mit Version und Konfiguration. Suche dann nach Verbrauchern, statt nur die Hauptdatei zu korrigieren. Wenn die zentrale Aussage unsicher ist, setze sie zurück in technical_review und dokumentiere die Grenze, bevor eine neue Freigabe behauptet wird.

## Cost und FinOps

Versionen haben Kosten: Tests, Migration, Parallelbetrieb, Support, Schulung, Telemetrie, Datenbewegung, Lizenz oder Vertragswechsel. Der billigste kurzfristige Weg – Updates aufschieben – kann die teuerste Option werden, wenn EOL, Security Debt oder Big-Bang-Migration entstehen.

| Entscheidung | Nutzen | Kostenrisiko | Kontrolle |
|---|---|---|---|
| PATCH sofort ausrollen | Kleine Korrektur schnell verfügbar. | Versehentlich materielle Änderung. | Klassifikation, Test und Hashprüfung. |
| Kompatibilitätsfenster | Verbraucher migrieren schrittweise. | Doppelbetrieb und Supportlast. | Ablaufdatum, Nutzungstelemetrie und klare Abschaltung. |
| Vollständige Revalidation | Hohe Sicherheit für kritische Grenze. | Review- und Testkosten. | Nur bei hoher Volatilität, Risiko oder vielen Verbrauchern. |
| Neuer Provider oder Modell | Verbesserte Fähigkeit oder Kosten. | Egress, Integration, Datenresidenz, Lock-in und Re-Eval. | TCO, Exitplan, Vergleichsbaseline und Pilotbudget. |
| Standard ablösen | Schulden und Sicherheitsrisiko reduzieren. | Migration und organisatorische Reibung. | Roadmap, Owner, Ausnahmeabbau und Wirkungsmessung. |

Chief-Entscheidungen budgetieren nicht nur die neue Technologie, sondern auch die Fähigkeit, sie zu aktualisieren, zu überwachen und zu verlassen. Ein Service ohne getesteten Upgrade- oder Exitpfad ist eine unvollständige Investition.

## Trade-offs und Anti-Patterns

| Wahl | Vorteil | Trade-off |
|---|---|---|
| Strenge MAJOR-Regel | Keine stille Entwertung alter Annahmen. | Mehr Review- und Kommunikationsaufwand. |
| Schnelle PATCHes | Geringe Reibung für harmlose Korrekturen. | Risiko falscher Klassifikation. |
| Langer Kompatibilitätszeitraum | Sanfter Übergang für Verbraucher. | Höhere Betriebs- und Sicherheitslast. |
| Aggressives Upgrade | Früher Nutzen neuer Fähigkeiten. | Höheres Migrations- und Incidentrisiko. |
| Breite Revalidation | Starke Konsistenz. | Hohe Kosten, kann wichtige Delivery blockieren. |
| Risikobasierte Revalidation | Fokus auf kritische Aussagen. | Weniger auffällige, aber relevante Änderungen können übersehen werden. |

Anti-Patterns sind: Versionsnummern ohne Aussage, Changelogs ohne betroffene Verbraucher, „latest“ als Konfiguration, Tests ohne Umgebung, EOL ohne Owner, ein neues Modell ohne Evalbaseline und ein akzeptierter Standard ohne Ablauf- oder Ausnahmeweg. Besonders gefährlich ist die Behauptung, ein altes Lab beweise nach einem tiefen Versionswechsel weiterhin dieselbe Aussage.

## Staff-, Principal- und Chief-Entscheidungen

**Staff.** Staff baut den sicheren Updatepfad: Versionierte Vorlagen, Contract Tests, Migration Guides, Featureflags, klare On-call- und Supportgrenzen. Die wichtigste Frage lautet: Kann ein anderes Team den Change verstehen, testen, sicher ausrollen und bei Fehlern zurücknehmen?

**Principal.** Principal harmonisiert Change- und Kompatibilitätsregeln über Teams: gemeinsame Standards, Ausnahme- und Deprecationpolitik, Canonical Ownership und geplante Migrationswellen. Die Frage lautet: Welche Varianten sind als Übergang vertretbar, und welche erzeugen untragbare Sicherheitsschuld oder Plattformkosten?

**Chief.** Chief steuert Portfolio- und Lieferantenfolgen: EOL-Risiko, Make-or-Buy, Souveränität, Erneuerungsbudget, organisationsweite Change-Kapazität und Exit. Die Frage lautet: Welche Fähigkeiten und Verträge erlauben der Organisation, kritische Systeme bewusst zu ändern oder zu verlassen?

| Entscheidung | Staff-Nachweis | Principal-Nachweis | Chief-Nachweis |
|---|---|---|---|
| API- oder Toolvertrag ändern | Kompatibilitätstest, Migration Guide, Rollback. | Gemeinsame Versionierungs- und Deprecationregel. | Portfolio-, Kunden- und Vertragsfolgen akzeptiert. |
| Modell aktualisieren | Evalregression, Featureflag, Tracevergleich. | Standardisierte Qualitätsgates und Shared Baseline. | Risiko, Kosten, Souveränität und Ausstiegsstrategie bewertet. |
| Plattformkomponente EOL | Referenzpfad und Upgrade-Automation. | Domainroadmap, Ausnahmeabbau, Ownership. | Investition, Lieferantenstrategie und strategische Capability entschieden. |

## Production Checklist

- [x] content_version, Quellenstand, Umfeld, Evidenz und Status sind getrennt definiert.
- [x] PATCH, MINOR und MAJOR enthalten nachvollziehbare Fach- und Reviewfolgen.
- [x] Material Changes stufen accepted oder packaged wieder auf technical_review zurück.
- [x] Recheck analysiert konkrete Aussagen, Umgebung, Verbraucher, Gegenprobe und Rollback.
- [x] Volatilität, EOL, Managed Services, Modelle, Standards und Rechtskontext sind getrennt betrachtet.
- [x] Register- und Linkpflege werden nicht mit fachlicher Annahme verwechselt.
- [x] Innovationsabschnitt enthält Reifegrad, Pilotkriterium und Schutzgrenze.
- [ ] Das Änderungs-Lab ist reviewed_only; es wurde keine echte Migration durchgeführt.
- [ ] Eine unabhängige technische Annahme der Datei steht aus.

## Interviewfragen mit Antwortleitfäden

1. **Wann wird aus einer Textänderung eine materielle Revision?**  
   Wenn sich ein Mechanismus, eine Sicherheitsgrenze, Konfiguration, Architekturentscheidung, Quelle mit Aussagewirkung oder harte Abhängigkeit verändert. Der betroffene Artikel und seine Verbraucher brauchen eine erneute technische Prüfung.

2. **Warum reicht ein Git-Hash nicht als Nachweis?**  
   Er sichert die Integrität eines bestimmten Artefakts, aber nicht seine fachliche Korrektheit, Umgebung, Testabdeckung, Datenklassifikation oder Betriebswirkung.

3. **Wie behandeln Sie ein Provider-EOL?**  
   Betroffene Workloads, Daten, Verträge, Schnittstellen, Betrieb und Verbraucher erfassen; Optionen mit TCO, Risiko, Migrationspfad und Exit vergleichen; dann gestaffelte Migration und Rollback mit Owner steuern.

4. **Wie versionieren Sie eine Modell- oder Promptänderung?**  
   Modellkennung, Prompt, Toolvertrag, Dataset, Metrik, Schwelle, Kosten und Zeitpunkt gehören zusammen. Eine Evalregression wird nach Fehlerklasse untersucht und nicht durch einen einzelnen Durchschnittswert verborgen.

5. **Wann kann ein PATCH direkt nach packaged bleiben?**  
   Nur wenn eindeutig keine fachliche Aussage, Sicherheitsgrenze, Konfiguration oder Abhängigkeit verändert wird und die Integritätsprüfung dokumentiert ist. Bei Zweifel wird technical_review gewählt.

6. **Wie vermeiden Sie, dass eine Standardrevision alle Teams blockiert?**  
   Mit Canonical Ownership, klarer Deprecation, Kompatibilitätsfenster, Telemetrie, Migration Guides, begrenzten Ausnahmen und eindeutiger Abschaltung. Der Übergang wird am Risiko und an realen Verbrauchern priorisiert.

7. **Was ist die Staff-Entscheidung bei einem Breaking Change?**  
   Den ausführbaren, sicheren Übergang für Nutzerteams entwerfen: Tests, Adapter oder Migration, Dashboards, Runbook und Rollback. Die Rolle kommuniziert Grenzen statt nur eine neue Version anzukündigen.

8. **Warum ist Versionierung eine Chief-Angelegenheit?**  
   Weil kumulierte EOL-, Lock-in-, Sicherheits- und Erneuerungskosten Portfolio, Lieferfähigkeit und Risikoappetit betreffen. Ohne strategisches Budget entsteht ein unfinanzierbarer Updatebacklog.

## Praktisches Lab: Änderung eines Toolvertrags revalidieren

**Fall.** Ein fiktiver B2B-Agent nutzt einen versionierten Toolvertrag, um einen Reservierungsauftrag vorzubereiten. Ein neues Feld soll die fachliche Kategorie einer Anfrage übertragen. Die Änderung kann Datenklassifikation, Policy und Consumerkompatibilität betreffen.

**Inputs.**

- Version 1.2.0 des Vertrags mit Producer, Gateway, Command Handler und Audit Event.
- Eine vorgeschlagene Version 1.3.0 mit neuem Feld.
- Synthetische Payloads: gültig, fehlendes Feld, ungültige Kategorie, falscher Tenantversuch und alter Consumer.
- Ein fiktives Kostenlimit, ein Owner pro Komponente und ein Rollbackziel.

**Durchführung.**

1. Beschreibe die konkrete Aussage, die sich durch das Feld ändern könnte.
2. Klassifiziere die Revision vorläufig als PATCH, MINOR oder MAJOR und begründe die Unsicherheit.
3. Liste Producer, Policy, Consumer, Audit, Dashboard, Runbook und Kapitelverweise als Verbraucher.
4. Erstelle Erfolgstest und Gegenproben: alter Consumer, ungültige Kategorie, Tenantüberschreibung, fehlendes Feld und Rückrolle.
5. Definiere Telemetrie: Version, Fehlerklasse, Consumeranteil und keinerlei vertrauliche Payloadwerte.
6. Entscheide nach den Ergebnissen über Kompatibilitätsfenster, Migration, Rollback und neue Reviewstufe.
7. Aktualisiere einen Revisionsrecord mit Quelle, Version, Umgebung, Teststatus und offenen Grenzen.
8. Lösche synthetische Testdaten und temporäre Tokens; dokumentiere, dass keine Produktion berührt wurde.

**Abnahme.** Ein gutes Lab liefert nicht nur eine neue Payload. Es zeigt, ob der Vertrag semantisch kompatibel bleibt, welche Sicherheitseigenschaft durchgesetzt wird, welcher Verbraucher betroffen ist und wie der alte Zustand wiederhergestellt werden kann.

**Labstatus:** reviewed_only. Die Fallarbeit wurde als Anleitung geprüft; keine echte API, kein Anbieterprodukt und keine Produktionsmigration wurden ausgeführt.

## Dependencies, Cross-References und Quellen

Die Status- und Registerbasis liegt in [KB-0001](01-master-index-und-wegweiser.md), der Impactgraph in [KB-0003](03-vollstaendiger-abhaengigkeitsgraph.md) und die Lern-Rechecks in [KB-0007](07-lernwellen-und-fortschrittssteuerung.md). Labreproduzierbarkeit wird in [KB-0009](01-master-index-und-wegweiser.md#kb-0009) vertieft. Domänen mit hoher Volatilität nutzen diese Strategie als Querschnitt.

**Verwendete Quellen, Stand 2026-09-15.**

- Masterplan: Quellenstand, Statusmodell und materielle Änderungen
- Artikelvertrag: Metadaten, Quellenvertrag und Reviewprotokoll
- Metadatenschema für Artikel-Frontmatter

## Bonus: New Tech and Innovations

**Stand: 2026-09-15.** Software Bill of Materials, automatisierte Dependency- und Changelogbeobachtung sowie KI-gestützte Impactsuche können die Revalidierung beschleunigen. Ihr Reifegrad für diese Wissensbasis ist **Adopting** für strukturierte Aufgaben: Sie können Versionsdifferenzen, betroffene IDs, alte Quellen und fehlende Metadaten finden. Sie können aber nicht ohne fachlichen Kontext entscheiden, ob eine API- oder Modelländerung eine Sicherheitsgrenze, Datenklasse, Nutzerwirkung oder Vertragsverpflichtung materiell verändert.

Ein Einführungspilot muss an einem redigierten Beispiel zeigen, dass ein Fund auf konkrete Aussage, Quelle und Verbraucher verweist, dass ein Mensch die Klassifikation PATCH, MINOR oder MAJOR bestätigt und dass keine Secrets, Kundendaten oder personenbezogenen Leistungsdaten an externe Dienste gelangen. Bei hoher Kritikalität bleibt der automatisierte Befund ein Recheck-Trigger, keine Freigabe.
