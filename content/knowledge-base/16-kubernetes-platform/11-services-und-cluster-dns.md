---
{"id": "KB-0389", "title": "Services und Cluster-DNS", "domain": "16", "sequence": 11, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "CLOUD"], "requires": [{"id": "KB-0381", "concepts": ["CNI und Pod-Netzwerke"], "needed_for": "understanding"}, {"id": "KB-0058", "concepts": ["DNS-Auflösung und Caches"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen Service mit mehreren Pod-Endpoints erstellen und die Namensauflösung über Cluster-DNS bis zur tatsächlichen Verbindungsweitergabe an einen Endpoint nachvollziehen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Den geeigneten Service-Typ (ClusterIP, NodePort, LoadBalancer, Headless) basierend auf dem tatsächlichen Zugriffsbedarf auswählen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Ein Verbindungsproblem entlang des konkreten Pfads (DNS-Auflösung, Service-zu-Endpoint-Weiterleitung, CNI-Erreichbarkeit) diagnostizieren statt pauschal 'der Service funktioniert nicht' zu vermuten.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Strukturierte Pfad-Diagnose (DNS vs. Endpoint vs. Netzwerk) als Standard für Service-Konnektivitätsprobleme im Unternehmen etablieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung von kube-proxy-Modi (iptables vs. IPVS) im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis des konzeptionellen Pfads von DNS über Service zu Endpoint, nicht die interne kube-proxy-Implementierung."}}, "lab_validation": [{"lab_id": "KB-0389-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simuliertes Diagnoseszenario mit drei unterschiedlichen Verbindungsfehlern (DNS, Endpoint, Netzwerk)", "evidence": "Drei simulierte Fehlerfälle mit identischer oberflächlicher Symptomatik ('Verbindung zum Service schlägt fehl') werden anhand unterschiedlicher Diagnosepunkte (DNS-Auflösung liefert keine IP, Service hat keine passenden Endpoints, oder Endpoint ist über CNI nicht erreichbar) korrekt drei unterschiedlichen Ursachen zugeordnet.", "limitations": "Kein produktiver Kubernetes-Cluster, kein realer Geschäftsdatensatz, künstlich konstruierte Fehlerszenarien."}]}
---
# Services und Cluster-DNS

> **Ziel:** Ein Kubernetes Service bietet eine stabile, DNS-basierte Adressierung (siehe die allgemeinen DNS-Grundlagen in [KB-0058](../03-network-foundations/10-dns-aufloesung-und-caches.md)) für eine Gruppe von Pods, deren individuelle IP-Adressen sich über die Zeit ändern können, aufbauend auf der CNI-Ebene (siehe [KB-0381](03-cni-und-pod-netzwerke.md)). Der zentrale Punkt dieses Kapitels ist die klare Unterscheidung von drei getrennten Diagnosepunkten entlang des tatsächlichen Verbindungspfads — Namensauflösung, Service-zu-Endpoint-Weiterleitung, und Netzwerkerreichbarkeit —, die jeweils unabhängig fehlschlagen können.

## Zweck, Mental Model und Dependencies

Ein Service definiert einen stabilen DNS-Namen (über Cluster-DNS, z. B. "my-service.my-namespace.svc.cluster.local") und eine stabile virtuelle IP-Adresse, die intern auf eine dynamische Menge von Endpoints (die tatsächlichen, sich ändernden IP-Adressen der zugehörigen Pods) abgebildet wird. Der vollständige Verbindungspfad einer Anfrage an einen Service durchläuft drei unabhängige Schritte: erstens die Namensauflösung, bei der Cluster-DNS den Service-Namen in seine virtuelle IP-Adresse auflöst; zweitens die Service-zu-Endpoint-Weiterleitung, bei der die virtuelle IP-Adresse (durch kube-proxy oder eine vergleichbare Komponente) auf eine der tatsächlichen Pod-IP-Adressen (Endpoints) umgeleitet wird; und drittens die tatsächliche Netzwerkerreichbarkeit dieser Pod-IP-Adresse über die CNI-Ebene (siehe [KB-0381](03-cni-und-pod-netzwerke.md)). Jeder dieser drei Schritte kann unabhängig fehlschlagen und erzeugt dieselbe oberflächliche Symptomatik ("Verbindung zum Service schlägt fehl"), erfordert aber eine grundlegend andere Diagnose: schlägt bereits die DNS-Auflösung fehl, liegt das Problem bei Cluster-DNS selbst oder einer fehlerhaften Service-Namensreferenz; funktioniert die DNS-Auflösung, aber der Service hat keine passenden Endpoints (z. B. weil kein Pod die Selector-Kriterien des Service erfüllt oder kein Pod die Readiness-Probe besteht, siehe [KB-0384](06-pods-und-lebenszyklen.md)), schlägt die Verbindung auf der Service-Ebene fehl; funktioniert sowohl DNS-Auflösung als auch Endpoint-Zuordnung, aber die eigentliche Netzwerkverbindung zum Pod schlägt fehl, liegt das Problem auf der CNI-Ebene.

~~~text
Service: stable DNS name + stable virtual IP -> maps internally to a DYNAMIC set of endpoints (actual, changing pod IPs)
THREE INDEPENDENT STEPS along the connection path, EACH can fail SEPARATELY, ALL produce the SAME surface symptom:
  1. DNS resolution: Cluster-DNS resolves service name -> virtual IP
     fails -> Cluster-DNS problem or wrong service name reference
  2. Service-to-endpoint forwarding: virtual IP -> one of the actual pod IPs (endpoints), via kube-proxy or similar
     fails -> service has NO matching endpoints (selector mismatch, or no pod passes readiness -- cf. KB-0384)
  3. Network reachability: actual connection to that pod IP, via the CNI layer (cf. KB-0381)
     fails -> CNI-level routing/connectivity problem
~~~

## Core Concepts, Architektur und Implementierung

| Diagnoseschritt | Was er prüft | Werkzeug/Symptom |
|---|---|---|
| DNS-Auflösung | löst Cluster-DNS den Service-Namen in eine IP auf? | DNS-Lookup vom Pod aus liefert keine oder eine unerwartete Antwort |
| Service-zu-Endpoint | hat der Service passende, bereite Endpoints? | Prüfung des Service-Endpoint-Objekts zeigt eine leere Liste |
| Netzwerkerreichbarkeit | ist die konkrete Pod-IP tatsächlich erreichbar? | direkter Verbindungsversuch zur Pod-IP (unter Umgehung des Service) schlägt fehl |

Implementierung: Bei einem gemeldeten Service-Verbindungsproblem wird zunächst die DNS-Auflösung des Service-Namens explizit geprüft (löst er überhaupt auf, und zu welcher IP?). Anschließend wird geprüft, ob der Service tatsächlich passende, bereite Endpoints besitzt (dies kann fehlschlagen, wenn kein Pod die Selector-Labels erfüllt, oder wenn zwar Pods existieren, aber keiner die Readiness-Probe besteht). Erst wenn sowohl DNS-Auflösung als auch Endpoint-Zuordnung korrekt funktionieren, aber die eigentliche Verbindung weiterhin fehlschlägt, wird die CNI-Ebene (Netzwerkerreichbarkeit der konkreten Pod-IP) untersucht. Diese schrittweise Eingrenzung verhindert, dass ein DNS-Problem fälschlich als Netzwerkproblem behandelt wird oder umgekehrt.

## Scalability, Reliability, Security und Observability

Die dreistufige Diagnosepfad-Trennung skaliert Fehlerbehebungsgeschwindigkeit proportional zur Genauigkeit der Zuordnung eines Symptoms zum tatsächlich betroffenen Schritt; die Reliability-Grenze liegt darin, dass eine undifferenzierte "Service funktioniert nicht"-Diagnose proportional zur Häufigkeit unterschiedlicher zugrunde liegender Ursachen zu wiederholten, wirkungslosen Korrekturversuchen führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Anwendung erhält bei einem Verbindungsversuch zu einem Service einen "Name not found"-Fehler | die DNS-Auflösung des Service-Namens schlägt fehl | einen direkten DNS-Lookup des Service-Namens vom betroffenen Pod aus durchführen |
| die DNS-Auflösung liefert eine gültige Service-IP, die Verbindung schlägt aber trotzdem fehl | der Service hat keine passenden, bereiten Endpoints | das Endpoint-Objekt des Service auf eine leere oder unerwartete Liste prüfen |
| Service-IP und Endpoints sind korrekt, die Verbindung zur konkreten Pod-IP schlägt aber fehl | ein Netzwerkproblem auf der CNI-Ebene liegt vor | eine direkte Verbindung zur konkreten Pod-IP unter Umgehung des Service testen, um die CNI-Ebene isoliert zu prüfen |

Security: Cluster-DNS ist ein zentraler, kritischer Dienst — eine Kompromittierung von Cluster-DNS könnte Verbindungen zu bösartigen Endpoints umleiten, weshalb Zugriffskontrollen und Integrität von Cluster-DNS besonders geschützt werden müssen. Observability: Die DNS-Auflösungslatenz und -Erfolgsrate, die Anzahl der Endpoints pro Service über die Zeit, und die Netzwerkerreichbarkeit zwischen Pods sind zentrale, getrennt zu überwachende Metriken entlang der drei Diagnoseschritte.

## Trade-offs und Entscheidungen

**Staff** implementiert eine strukturierte, dreistufige Diagnose bei jedem gemeldeten Service-Verbindungsproblem. **Principal** macht den identifizierten Diagnoseschritt und die Ursache für das Team nachvollziehbar. **Chief** etabliert strukturierte Pfad-Diagnose (DNS vs. Endpoint vs. Netzwerk) als Standard für Service-Konnektivitätsprobleme im Unternehmen.

Anti-Patterns: ein Service-Verbindungsproblem pauschal als "Netzwerkproblem" behandeln, ohne DNS-Auflösung und Endpoint-Zuordnung getrennt zu prüfen; einen Service ohne Prüfung der tatsächlich passenden, bereiten Endpoints als funktionsfähig annehmen; DNS-Auflösungsprobleme und Netzwerkerreichbarkeitsprobleme miteinander verwechseln.

## Production Checklist

- [ ] Bei Verbindungsproblemen wird zunächst die DNS-Auflösung des Service-Namens geprüft.
- [ ] Die Endpoint-Zuordnung des Service wird auf passende, bereite Pods geprüft.
- [ ] Erst danach wird die Netzwerkerreichbarkeit auf der CNI-Ebene untersucht.
- [ ] Cluster-DNS wird als kritischer, besonders geschützter Dienst behandelt.

## Interviewfragen

### 1. Welche drei unabhängigen Schritte durchläuft eine Anfrage an einen Kubernetes Service?

**Antwort:** DNS-Auflösung des Service-Namens zur virtuellen IP, Weiterleitung von der virtuellen IP zu einem konkreten Pod-Endpoint, und die tatsächliche Netzwerkerreichbarkeit dieses Pod-Endpoints über die CNI-Ebene.

### 2. Warum können alle drei Schritte dieselbe oberflächliche Symptomatik erzeugen?

**Antwort:** In allen drei Fällen erscheint die Verbindung zum Service als fehlgeschlagen, obwohl die tatsächliche Ursache jeweils auf einer anderen, unabhängigen Ebene liegt.

### 3. Wie diagnostizierst du, dass ein Service keine passenden Endpoints hat?

**Antwort:** Ich prüfe das Endpoint-Objekt des Service direkt, um festzustellen, ob es eine leere Liste zeigt, was auf fehlende Selector-Übereinstimmung oder fehlgeschlagene Readiness-Probes hindeutet.

### 4. Warum sollte eine Diagnose bei Service-Verbindungsproblemen strukturiert in der Reihenfolge DNS → Endpoint → Netzwerk erfolgen?

**Antwort:** Diese Reihenfolge folgt dem tatsächlichen Verbindungspfad und verhindert, dass ein Problem auf einer früheren Ebene (z. B. DNS) fälschlich einer späteren Ebene (z. B. Netzwerk) zugeschrieben wird.

### 5. Wie gehst du vor, wenn DNS-Auflösung und Endpoint-Zuordnung korrekt erscheinen, aber die Verbindung dennoch fehlschlägt?

**Antwort:** Ich teste eine direkte Verbindung zur konkreten Pod-IP unter Umgehung des Service, um die CNI-Ebene isoliert zu prüfen und ein Netzwerk-Routingproblem zu identifizieren.

### 6. Widersprüchliche Anforderung: Team will schnelle Diagnose von Service-Problemen UND garantiert die tatsächlich richtige Ursache identifizieren — wie gehst du vor?

**Antwort:** Ich würde ein standardisiertes, schnelles Diagnose-Runbook etablieren, das die drei Schritte (DNS, Endpoint, Netzwerk) in fester Reihenfolge und mit klaren, schnell ausführbaren Prüfbefehlen für jeden Schritt durchläuft, sodass die tatsächliche Ursache innerhalb kurzer Zeit strukturiert statt geraten identifiziert wird.

## Praktische Labs

~~~python
def diagnose_service_connection(dns_resolves, has_ready_endpoints, network_reachable):
    if not dns_resolves:
        return "DNS resolution failed -- check Cluster-DNS and the service name reference."
    if not has_ready_endpoints:
        return "DNS resolved, but no ready endpoints -- check pod selector labels and readiness probes."
    if not network_reachable:
        return "Service and endpoints look correct, but network unreachable -- check CNI-level routing."
    return "Connection path fully healthy."

scenarios = [
    {"dns_resolves": False, "has_ready_endpoints": True, "network_reachable": True},
    {"dns_resolves": True, "has_ready_endpoints": False, "network_reachable": True},
    {"dns_resolves": True, "has_ready_endpoints": True, "network_reachable": False},
    {"dns_resolves": True, "has_ready_endpoints": True, "network_reachable": True},
]

for i, scenario in enumerate(scenarios, 1):
    print(f"Scenario {i}: {diagnose_service_connection(**scenario)}")
~~~

## Dependencies, Cross-References und Quellen

1. Kubernetes-Dokumentation: [Service](https://kubernetes.io/docs/concepts/services-networking/service/), abgerufen 2026-09-17.
2. Kubernetes-Dokumentation: [DNS for Services and Pods](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/), abgerufen 2026-09-17.

CNI und Pod-Netzwerke sind kanonisch in [KB-0381](03-cni-und-pod-netzwerke.md) behandelt; DNS-Auflösung und Caches in [KB-0058](../03-network-foundations/10-dns-aufloesung-und-caches.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| eBPF-basierte Service-Weiterleitung (z. B. über Cilium) als effizientere Alternative zu iptables-basiertem kube-proxy | Adopting | Gegenüber traditionellem kube-proxy für bessere Performance bei großen Clustern bevorzugen. |
| Automatisierte, mehrstufige Diagnosewerkzeuge, die den vollständigen Service-Verbindungspfad in einem Schritt prüfen | Adopting | Gegenüber manueller schrittweiser Diagnose für schnellere Fehlerbehebung bevorzugen. |

Ein Team akzeptiert eine Service-Verbindungsproblem-Diagnose erst, wenn eindeutig geklärt ist, welcher der drei Pfadschritte (DNS, Endpoint, Netzwerk) tatsächlich betroffen ist.
