# Selenium-Tests – Entwickler README

## Ziel
Wir nutzen **Selenium (E2E) Tests**, um den **Teilzeit-Ausbildungsrechner (TZR)** realistisch im Browser zu testen.  
Dabei wird die Anwendung so bedient, wie es ein echter Nutzer tun würde (Formulare ausfüllen, Buttons klicken, Ergebnisse prüfen).

---

## Architektur

Unsere Selenium-Tests liegen unter:

```
src/selenium/
├─ selenium-helpers.js         # Gemeinsame Helper-Funktionen
├─ tzr-scenario1-lisa.e2e.js   # Szenario 1
├─ tzr-scenario2-lukas.e2e.js  # Szenario 2
├─ tzr-scenario3-paul.e2e.js   # Szenario 3
├─ tzr-scenario4-marie.e2e.js  # Szenario 4
└─ tzr.test.js                # Allgemeiner TZR-Durchlauf
```

### 1) `selenium-helpers.js`
Enthält wiederverwendbare Selenium-Funktionen, z. B.:

- Erstellen des WebDrivers (lokal **oder** CI)
- Warten auf sichtbare Elemente
- Sichere Klicks (Scroll + JavaScript)
- Radio-Buttons per `name + value`


### 2) Szenario-Dateien (`tzr-scenario*.e2e.js`)
Jede Datei beschreibt ein vollständiges Nutzerszenario, z. B.:

- Alter
- Schulabschluss
- Teilzeit / Vollzeit
- Kinder oder Pflegeverantwortung
- Ergebnisanzeige

Ein Szenario entspricht einer realistischen Person mit einer klaren Ausgangslage.

---

## Lokal testen

### Voraussetzungen
- Node.js installiert
- Dependencies installiert: `npm install`

### App starten
In einem Terminal:

```
npm run dev
```

Die App läuft dann standardmäßig unter:

```
http://localhost:5173
```

### Selenium-Test starten
In einem zweiten Terminal:

```
npm run test:selenium:lisa
npm run test:selenium:lukas
npm run test:selenium:paul
npm run test:selenium:marie
```

Der Browser startet lokal sichtbar und führt das Szenario Schritt für Schritt aus.

---

## CI / Pipeline (GitLab)

In der GitLab-Pipeline laufen die Selenium-Tests headless:

- Selenium-Container: `selenium/standalone-chrome`
- Die App wird mit `vite preview` gestartet
- Verbindung erfolgt über Umgebungsvariablen:

```
SELENIUM_REMOTE_URL=http://selenium:4444/wd/hub
TZR_BASE_URL=http://app:4173
```

Der Wechsel zwischen lokalem Browser und CI-Browser passiert automatisch über die Helper:

```
if (process.env.SELENIUM_REMOTE_URL) {
  builder.usingServer(process.env.SELENIUM_REMOTE_URL);
}
```
Es ist keine Codeänderung für CI nötig.
