# 🏋️ Fitness Tracker App

Un'applicazione web moderna per il tracciamento degli allenamenti e la gestione dei programmi fitness, costruita con Next.js e TypeScript.

## 🚀 Demo Live

L'applicazione è disponibile su GitHub Pages: [https://killuazoldich.github.io/jim](https://killuazoldich.github.io/jim)

## ✨ Caratteristiche

- **Dashboard Interattiva**: Visualizza le tue statistiche di allenamento
- **Gestione Programmi**: Crea e gestisci programmi di allenamento personalizzati
- **Tracciamento Progressi**: Monitora i tuoi miglioramenti nel tempo
- **Interfaccia Responsive**: Funziona perfettamente su desktop, tablet e mobile
- **Design Moderno**: Interfaccia pulita e intuitiva con componenti UI eleganti

## 🛠️ Tecnologie Utilizzate

- **Next.js 15** - Framework React per produzione
- **TypeScript** - Linguaggio di programmazione con type safety
- **Tailwind CSS** - Framework CSS utility-first
- **Radix UI** - Componenti UI accessibili e personalizzabili
- **Recharts** - Libreria per grafici e visualizzazioni dati
- **Lucide React** - Icone moderne e personalizzabili

## 📦 Installazione Locale

### Prerequisiti

- Node.js 18+ 
- npm o pnpm

### Istruzioni

1. **Clona il repository**
   ```bash
   git clone https://github.com/tuo-username/fitness-app.git
   cd fitness-app
   ```

2. **Installa le dipendenze**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Avvia il server di sviluppo**
   ```bash
   npm run dev
   ```

4. **Apri l'applicazione**
   Vai su [http://localhost:3000](http://localhost:3000) nel tuo browser.

## 🚀 Deploy su GitHub Pages

### Setup Iniziale

1. **Crea un nuovo repository su GitHub**
   - Vai su [github.com](https://github.com)
   - Crea un nuovo repository chiamato `fitness-app`
   - Non inizializzare con README, .gitignore o licenza

2. **Connetti il progetto locale al repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/tuo-username/fitness-app.git
   git push -u origin main
   ```

3. **Configura GitHub Pages**
   - Vai alle Settings del repository su GitHub
   - Scorri fino a "Pages" nel menu laterale
   - In "Source" seleziona "Deploy from a branch"
   - Seleziona il branch `gh-pages` e la cartella `/ (root)`

### Deploy Automatico

Il progetto include GitHub Actions per il deploy automatico. Ogni push su `main` triggererà automaticamente il deploy.

Per un deploy manuale:
```bash
npm run deploy
```

### Configurazione Personalizzata

Prima di effettuare il deploy, assicurati di:

1. **Aggiornare il nome del repository** in `next.config.mjs`:
   ```javascript
   basePath: process.env.NODE_ENV === 'production' ? '/nome-del-tuo-repository' : '',
   ```

2. **Aggiornare gli URL nel README** con il tuo username GitHub

## 📁 Struttura del Progetto

```
fitness-app/
├── app/                    # App Router di Next.js
├── components/            # Componenti React
├── lib/                   # Utilità e configurazioni
├── public/               # File statici
├── styles/               # Stili globali
├── .github/workflows/    # GitHub Actions
└── README.md            # Questo file
```

## 🎯 Utilizzo

### Panoramica delle Funzionalità

- **Home**: Dashboard principale con statistiche
- **Programmi**: Gestione programmi di allenamento
- **Allenamenti**: Tracciamento allenamenti giornalieri
- **Progressi**: Visualizzazione progressi nel tempo
- **Impostazioni**: Configurazione dell'applicazione

### Personalizzazione

Puoi personalizzare l'applicazione modificando:
- **Temi**: Cambia i colori in `lib/utils.ts`
- **Componenti**: Personalizza gli stili in `components/ui/`
- **Dati**: Aggiorna i dati di esempio in `lib/data.ts`

## 🤝 Contribuire

Le contribuzioni sono benvenute! Per favore:

1. Forka il repository
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit le tue modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è open source e disponibile sotto la licenza [MIT](LICENSE).

## 🆘 Supporto

Se hai domande o problemi:
- Apri una [Issue](https://github.com/tuo-username/fitness-app/issues)
- Controlla la [documentazione](https://github.com/tuo-username/fitness-app/wiki)

## 🙏 Ringraziamenti

- [Next.js](https://nextjs.org/) per il framework
- [Vercel](https://vercel.com/) per l'ispirazione nel design
- [Radix UI](https://www.radix-ui.com/) per i componenti UI
- [Tailwind CSS](https://tailwindcss.com/) per gli stili

---

**Creato con ❤️ per la community fitness**