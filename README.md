# Projekt: Joe-Eksamen

## Introduktion
Dette projekt er en Node.js-applikation, der bruger Firebase til autentificering og datalagring. Projektet er sat op til at køre en server og betjene brugere via et offentligt interface.

## Indhold

Følgende filer og mapper er inkluderet i projektet:

- **`.env`**: Indeholder miljøvariabler (bør ikke uploades offentligt).
- **`app.js`**: Hovedfilen, der starter applikationen.
- **`package.json`** og **`package-lock.json`**: Node.js-projektfiler, der definerer afhængigheder.
- **`public`**: Statisk indhold som HTML, CSS og JavaScript.
- **`serviceAccountKey.json`**: Nøglefil til Firebase-tjenester (bør opbevares sikkert).
- **`.gitignore`**: Liste over filer, der skal ignoreres af Git.
- **`.gitattributes`**: Konfigurationsfil til Git-attributter.

## Forudsætninger

Før du starter, sørg for at følgende er installeret:

- [Node.js](https://nodejs.org/) (version 16 eller nyere anbefales)
- [npm](https://www.npmjs.com/) (følger med Node.js)

## Installation

1. Klon projektet:
   ```bash
   git clone <repository-url>
   ```

2. Naviger til projektmappen:
   ```bash
   cd joe-eksamen
   ```

3. Installer de nødvendige afhængigheder:
   ```bash
   npm install
   ```

4. Opret en `.env`-fil og udfyld miljøvariabler efter behov. Se eksempler i `.env.example`, hvis tilgængeligt og kør npm install env

5. Tilføj filen `serviceAccountKey.json` i roden af projektmappen. Denne fil er nødvendig for Firebase-integrationen.

## Brug

1. Start serveren:
   ```bash
   npm start
   ```

2. Åbn din browser og naviger til:
   ```
   http://localhost:3000
   ```

3. Serveren burde nu være i gang og tilgængelig.

## Firebase-integration

For at bruge Firebase skal du:

- Tilføje filen `serviceAccountKey.json` i projektmappen.
- Sikre, at dit Firebase-projekt er korrekt konfigureret.

## Scripts

Tilgængelige npm-scripts defineret i `package.json`:

- `npm start`: Starter applikationen.


## Bidrag

1. Lav en fork af dette repository.
2. Opret en ny branch til dine ændringer.
3. Send en pull request.

