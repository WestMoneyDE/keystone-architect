---
{"id": "KB-0558", "title": "WAF und DDoS-Abwehr", "domain": "23", "sequence": 22, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0557", "concepts": ["Container- und Kubernetes-Sicherheit"], "needed_for": "context"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "WAF-Anwendungsregeln, Rate Controls und vorgelagerte DDoS-Abwehrkapazität anhand etablierter Praktiken korrekt kombinieren können, mit Bewusstsein für direkte Origin-Erreichbarkeit als kritische Umgehungslücke.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Architektur explizit sicherstellen, dass der eigentliche Ursprungsserver nicht direkt erreichbar ist, sondern jeglicher Traffic zwingend durch WAF und vorgelagerte DDoS-Abwehrkapazität geleitet wird.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Einen erfolgreichen Angriff trotz vorhandener WAF- und DDoS-Abwehrkonfiguration auf eine direkte Erreichbarkeit des ungeschützten Ursprungsservers zurückführen können, statt eine Schwäche der WAF-Regeln selbst zu vermuten.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards festlegen, die verbindlich sicherstellen, dass der Ursprungsserver niemals direkt, sondern ausschließlich über WAF und vorgelagerte Abwehrkapazität erreichbar ist.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die Detailkonfiguration spezifischer WAF-Regelsätze im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis der direkten Origin-Erreichbarkeit als kritische Umgehungslücke sowie die Abwägung zwischen Rate Controls und Fehlalarmen, nicht die regelspezifische Detailkonfiguration."}}, "lab_validation": [{"lab_id": "KB-0558-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation eines direkten Origin-Bypasses trotz vorgeschalteter WAF, kein produktives WAF-System verwendet", "evidence": "Ein lokales Skript simuliert, wie ein Angreifer, der die tatsächliche IP-Adresse des Ursprungsservers ermittelt (etwa durch eine unzureichend geschützte DNS-Historie oder eine fehlerhaft konfigurierte, direkt erreichbare Netzwerkschnittstelle), die vorgeschaltete WAF und DDoS-Abwehr vollständig umgehen kann, indem er den Ursprungsserver direkt statt über die geschützte, vorgelagerte Infrastruktur anspricht, wodurch sämtliche WAF-Regeln und Rate Controls wirkungslos werden.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales WAF-/DDoS-System mit tatsächlicher Angriffsdynamik."}]}
---
# WAF und DDoS-Abwehr

> **Ziel:** Eine Web Application Firewall (WAF) prüft eingehenden Traffic anhand von **Anwendungsregeln** (Mustern, die bekannte Angriffstechniken wie SQL-Injection oder Cross-Site-Scripting erkennen) und **Rate Controls** (Begrenzung der Anfragehäufigkeit pro Client, um sowohl gezielte Missbrauchsversuche als auch verteilte Lastangriffe zu begrenzen), während **vorgelagerte Kapazität** (eine großflächig verteilte Infrastruktur, die extrem hohes Angriffsvolumen — etwa volumetrische DDoS-Angriffe — abfängt, bevor es überhaupt die Anwendungsebene erreicht) eine komplementäre, notwendige Verteidigungsebene bildet. Der zentrale Punkt dieses Kapitels, konsistent mit der bereits behandelten Erkenntnis bei Azure Application Gateway und Front Door (siehe Domain 20), ist, dass ein erfolgreicher Angriff trotz vorhandener WAF- und DDoS-Abwehrkonfiguration fast immer auf eine **direkte Erreichbarkeit des ungeschützten Ursprungsservers** zurückzuführen ist, nicht auf eine Schwäche der WAF-Regeln selbst — wenn ein Angreifer die tatsächliche IP-Adresse oder Netzwerkadresse des Ursprungsservers ermitteln und diesen direkt statt über die vorgeschaltete, geschützte Infrastruktur ansprechen kann, sind sämtliche WAF-Regeln und Rate Controls vollständig wirkungslos, da der Traffic sie gar nicht durchläuft.

## Zweck, Mental Model und Dependencies

Eine WAF adressiert anwendungsspezifische Angriffstechniken, die auf Netzwerkebene nicht erkennbar sind — sie analysiert den tatsächlichen Inhalt einer HTTP-Anfrage (Parameter, Header, Payload) und erkennt Muster, die typischen Angriffstechniken entsprechen, wodurch bösartige Anfragen abgelehnt werden können, bevor sie die eigentliche Anwendung erreichen. Rate Controls ergänzen dies um eine volumenbasierte Verteidigung: Selbst technisch "legitime" Anfragen (ohne erkennbares Angriffsmuster im Inhalt) können in übermäßiger Häufigkeit ein Missbrauchsversuch oder Teil eines verteilten Lastangriffs sein — eine Begrenzung der Anfragehäufigkeit pro Client (oder pro erkennbarer Client-Gruppierung) verhindert, dass ein einzelner oder koordinierter Akteur die Anwendung durch schiere Anfragemenge überlastet. Vorgelagerte Kapazität adressiert eine andere Größenordnung des Problems: Ein volumetrischer DDoS-Angriff kann ein Datenvolumen erzeugen, das die Kapazität einer einzelnen Anwendungsinfrastruktur (und selbst einer einzelnen WAF-Instanz) bei Weitem übersteigt — eine großflächig verteilte, auf genau diese Angriffsart spezialisierte Infrastruktur (typischerweise vom Cloud-Anbieter oder einem spezialisierten Dienst bereitgestellt) fängt dieses Volumen bereits deutlich vor der eigentlichen Anwendungsebene ab. Die entscheidende, häufig unterschätzte architektonische Voraussetzung für die Wirksamkeit all dieser Schichten ist, dass der Ursprungsserver (die eigentliche Anwendungsinfrastruktur hinter der WAF/DDoS-Abwehr) niemals direkt erreichbar sein darf — findet ein Angreifer einen Weg, den Ursprungsserver direkt anzusprechen (etwa weil dessen IP-Adresse aus einer Zeit vor der WAF-Einführung noch öffentlich bekannt ist, weil DNS-Historie sie offenlegt, oder weil eine Netzwerkschnittstelle versehentlich direkt statt nur über die vorgeschaltete Infrastruktur erreichbar konfiguriert wurde), umgeht dieser Traffic sämtliche WAF-Regeln und Rate Controls vollständig, unabhängig davon, wie robust diese konfiguriert sind — dieselbe strukturelle Lücke, die bereits bei Azure Application Gateway und Front Door behandelt wurde (Domain 20): eine vorgeschaltete Schutzschicht schützt nur, wenn sie tatsächlich der einzige Weg zum eigentlichen Ziel ist.

~~~text
WAF + DDoS Defense: WAF (app-layer, content-based rule matching -- SQL injection, XSS patterns)
                   + Rate Controls (volume-based, per-client request frequency limiting)
                   + Upstream capacity (large-scale distributed infra absorbing volumetric DDoS
                     BEFORE it reaches app layer)
CRITICAL, RECURRING ARCHITECTURAL REQUIREMENT (same as Azure App Gateway/Front Door, Domain 20):
  origin server MUST NEVER be directly reachable
  IF attacker finds direct origin path (old public IP from pre-WAF era, DNS history exposure,
     misconfigured interface bypassing the fronting infra)
  -> ALL WAF rules + rate controls COMPLETELY BYPASSED
     regardless of how robustly configured -- traffic simply doesn't pass through them
SUCCESSFUL attack DESPITE WAF/DDoS config present
  -> almost always = direct origin reachability, NOT a weakness in the WAF rules themselves
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Anwendungsregeln (WAF) | inhaltsbasierte Erkennung von Angriffsmustern | erkennt anwendungsspezifische Angriffstechniken |
| Rate Controls | volumenbasierte Begrenzung der Anfragehäufigkeit | begrenzt Missbrauch und verteilte Lastangriffe |
| Vorgelagerte DDoS-Kapazität | großflächige Absorption volumetrischer Angriffe | fängt Angriffsvolumen vor Anwendungsebene ab |
| Direkte Origin-Erreichbarkeit | kritische Umgehungslücke aller vorgelagerten Schutzschichten | macht sämtliche WAF-/DDoS-Konfiguration wirkungslos |

Implementierung: Der Ursprungsserver wird explizit und verbindlich so konfiguriert, dass er ausschließlich über die vorgeschaltete WAF-/DDoS-Infrastruktur erreichbar ist, nicht direkt über eine öffentlich bekannte oder erreichbare Adresse. WAF-Regeln werden gegen die tatsächlichen, spezifischen Angriffsmuster der Anwendung abgestimmt, mit expliziter Prüfung auf Fehlalarme, die legitimen Traffic blockieren würden. Rate Controls werden anhand der tatsächlichen, erwarteten Anfragehäufigkeit legitimer Nutzung konfiguriert, statt willkürlicher Standardwerte.

## Scalability, Reliability, Security und Observability

WAF- und DDoS-Abwehr skaliert die tatsächliche Schutzwirkung proportional zur verbindlichen Durchsetzung, dass der Ursprungsserver ausschließlich über die vorgeschaltete Infrastruktur erreichbar ist; die Reliability-Grenze liegt darin, dass jede verbleibende, direkte Origin-Erreichbarkeit unabhängig von der WAF-/DDoS-Konfigurationsqualität die gesamte Schutzwirkung vollständig aufhebt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Angriff gelingt trotz vorhandener, korrekt konfigurierter WAF- und DDoS-Abwehr | der Ursprungsserver ist direkt erreichbar und wird vom Angreifer unter Umgehung der vorgeschalteten Infrastruktur angesprochen | die tatsächliche Netzwerkkonfiguration explizit auf direkte Origin-Erreichbarkeit prüfen und beheben |
| legitime Nutzer werden fälschlich durch WAF-Regeln oder Rate Controls blockiert | die Regeln oder Grenzwerte sind nicht an das tatsächliche, legitime Nutzungsmuster angepasst | die WAF-Regeln und Rate-Control-Grenzwerte gegen tatsächliche, repräsentative legitime Nutzungsdaten kalibrieren |
| die Anwendung ist während eines volumetrischen Angriffs vollständig nicht erreichbar | keine vorgelagerte, großflächig verteilte DDoS-Abwehrkapazität ist eingerichtet | eine spezialisierte, vorgelagerte DDoS-Abwehrinfrastruktur einrichten, die das Volumen vor der Anwendungsebene abfängt |

Security: Die Erreichbarkeit des Ursprungsservers sollte regelmäßig aktiv überprüft werden (etwa durch periodische, externe Scans nach der tatsächlichen Origin-Adresse), um eine unbeabsichtigte, direkte Erreichbarkeit frühzeitig zu erkennen. Observability: Die tatsächliche Verifikation, dass keine direkte Origin-Erreichbarkeit besteht, die Fehlalarmrate von WAF-Regeln, und die tatsächliche Absorptionskapazität der vorgelagerten DDoS-Abwehr sind zentrale Sicherheitssignale.

## Trade-offs und Entscheidungen

**Staff** konfiguriert WAF-Regeln und Rate Controls für eine gegebene Anwendung korrekt. **Principal** stellt die verbindliche, architektonische Sicherstellung sicher, dass der Ursprungsserver ausschließlich über die vorgeschaltete Infrastruktur erreichbar ist. **Chief** legt unternehmensweite Standards fest, die direkte Origin-Erreichbarkeit als kritische, zu verhindernde Architekturlücke behandeln.

Anti-Patterns: einen Ursprungsserver mit einer öffentlich bekannten, direkt erreichbaren Adresse betreiben, während WAF/DDoS-Abwehr nur als optionaler, umgehbarer Vorschaltweg dient; WAF-Regeln ohne Kalibrierung gegen tatsächliches, legitimes Nutzungsverhalten konfigurieren und dadurch Fehlalarme riskieren; sich auf WAF-Konfiguration allein verlassen, ohne die direkte Origin-Erreichbarkeit regelmäßig aktiv zu prüfen.

## Production Checklist

- [ ] Der Ursprungsserver ist ausschließlich über die vorgeschaltete WAF-/DDoS-Infrastruktur erreichbar, niemals direkt.
- [ ] Die direkte Origin-Erreichbarkeit wird regelmäßig aktiv durch externe Prüfung verifiziert.
- [ ] WAF-Regeln und Rate Controls sind gegen tatsächliches, legitimes Nutzungsverhalten kalibriert.
- [ ] Eine vorgelagerte, großflächig verteilte DDoS-Abwehrkapazität ist für volumetrische Angriffe eingerichtet.

## Interviewfragen

### 1. Was ist der Unterschied zwischen WAF-Anwendungsregeln und Rate Controls?

**Antwort:** WAF-Anwendungsregeln erkennen inhaltsbasierte Angriffsmuster (etwa SQL-Injection); Rate Controls begrenzen volumenbasiert die Anfragehäufigkeit, um Missbrauch und verteilte Lastangriffe zu begrenzen, unabhängig vom Inhalt der Anfragen.

### 2. Warum wird eine vorgelagerte, großflächig verteilte Kapazität zusätzlich zur WAF benötigt?

**Antwort:** Weil ein volumetrischer DDoS-Angriff ein Datenvolumen erzeugen kann, das die Kapazität der eigentlichen Anwendungsinfrastruktur und einer einzelnen WAF-Instanz bei Weitem übersteigt, weshalb eine spezialisierte, größere Infrastruktur dieses Volumen bereits vorgelagert abfangen muss.

### 3. Warum ist ein erfolgreicher Angriff trotz vorhandener WAF- und DDoS-Abwehr fast nie eine Schwäche der WAF-Regeln selbst?

**Antwort:** Weil er fast immer auf eine direkte Erreichbarkeit des ungeschützten Ursprungsservers zurückzuführen ist — wenn ein Angreifer den Ursprungsserver direkt anspricht, wird sämtliche vorgeschaltete WAF-/DDoS-Konfiguration schlicht umgangen, unabhängig von deren Robustheit.

### 4. Wie kann ein Angreifer die vorgeschaltete WAF/DDoS-Abwehr umgehen, obwohl sie korrekt konfiguriert ist?

**Antwort:** Indem er die tatsächliche Adresse des Ursprungsservers ermittelt (etwa durch DNS-Historie oder eine fehlerhaft konfigurierte, direkt erreichbare Netzwerkschnittstelle) und diesen direkt statt über die geschützte, vorgelagerte Infrastruktur anspricht.

### 5. Wie gehst du vor, wenn ein Angriff trotz vorhandener, korrekt konfigurierter WAF- und DDoS-Abwehr gelingt?

**Antwort:** Ich prüfe zuerst, ob der Ursprungsserver direkt erreichbar ist und die vorgeschaltete Infrastruktur umgangen wurde, da dies die häufigste Ursache für einen erfolgreichen Angriff trotz vorhandener Schutzkonfiguration ist, nicht eine Schwäche der WAF-Regeln selbst.

### 6. Widersprüchliche Anforderung: Team will minimale Latenz durch möglichst direkte Netzwerkpfade zur Anwendung UND garantiert, dass der Ursprungsserver niemals ohne WAF-/DDoS-Schutz erreichbar ist — wie gehst du vor?

**Antwort:** Ich würde erklären, dass minimale Latenz und ausschließliche Erreichbarkeit über die Schutzinfrastruktur sich nicht grundsätzlich widersprechen, da moderne, vorgelagerte WAF-/DDoS-Dienste selbst oft global verteilt und latenzoptimiert sind — die tatsächliche Latenz sollte gegen eine konkret gemessene Anforderung geprüft werden, statt eine direkte, ungeschützte Origin-Erreichbarkeit als vermeintliche Latenzoptimierung zu akzeptieren, die die gesamte Schutzwirkung aufhebt.

## Praktische Labs

~~~python
# Local, deterministic simulation of complete WAF/DDoS bypass via direct origin reachability (executed locally, no real WAF system):

def evaluate_attack_path(waf_configured, ddos_defense_configured, origin_directly_reachable):
    if origin_directly_reachable:
        return "ATTACK SUCCEEDS: origin directly reachable, WAF/DDoS defenses completely bypassed"
    if waf_configured and ddos_defense_configured:
        return "ATTACK BLOCKED: traffic must pass through WAF and DDoS defense"
    return "PARTIAL PROTECTION: gaps in defense configuration"

print(evaluate_attack_path(waf_configured=True, ddos_defense_configured=True, origin_directly_reachable=True))
print(evaluate_attack_path(waf_configured=True, ddos_defense_configured=True, origin_directly_reachable=False))
~~~

## Dependencies, Cross-References und Quellen

1. OWASP-Dokumentation: [OWASP Top 10 — Web Application Firewall Concepts](https://owasp.org/www-community/Web_Application_Firewall), abgerufen 2026-09-18.
2. CISA-Dokumentation: [Understanding and Responding to Distributed Denial-of-Service Attacks](https://www.cisa.gov/resources-tools/resources/understanding-and-responding-distributed-denial-service-attacks), abgerufen 2026-09-18.

Container- und Kubernetes-Sicherheit sind kanonisch in [KB-0557](21-container-und-kubernetes-sicherheit.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, automatisierte, kontinuierliche externe Scans zur proaktiven Erkennung unbeabsichtigter direkter Origin-Erreichbarkeit als Standardbestandteil des Sicherheitsbetriebs | Evaluating | Gegenüber rein periodischer, manueller Prüfung erst nach Prüfung der tatsächlichen Erkennungsabdeckung für komplexe, verteilte Infrastrukturen bevorzugen. |

Ein Team akzeptiert eine WAF-/DDoS-Abwehrkonfiguration erst, wenn nachweislich verifiziert ist, dass der Ursprungsserver ausschließlich über die vorgeschaltete Infrastruktur erreichbar ist, nicht direkt.
