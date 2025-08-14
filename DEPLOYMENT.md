# Guida al Deploy su GitHub Pages

## 🚀 Deploy Rapido

### 1. Setup Repository GitHub

```bash
# Assicurati di essere nella directory del progetto
cd /Volumes/SSD/progetto/Scheda/fitness-app

# Inizializza git (se non già fatto)
git init

# Aggiungi tutti i file
git add .
git commit -m "Initial commit: Fitness App ready for GitHub"

# Aggiungi il repository esistente
git remote add origin https://github.com/KilluaZoldich/jim.git

# Push del codice
git push -u origin main
```

### 2. Configurazione Automatica GitHub Actions

Il file `.github/workflows/deploy.yml` è già configurato per:
- ✅ Build automatica su ogni push a `main`
- ✅ Deploy automatico su GitHub Pages
- ✅ Cache per migliorare le performance
- ✅ Supporto per Next.js static export

### 3. Abilitare GitHub Pages

1. Vai al tuo repository su GitHub
2. Clicca su **Settings** → **Pages**
3. In **Source** seleziona **GitHub Actions**

### 4. Configurazione Personalizzata

#### Se usi un repository con nome diverso:

Modifica `next.config.mjs`:
```javascript
basePath: process.env.NODE_ENV === 'production' ? '/nome-tuo-repo' : '',
```

#### Se usi un dominio personalizzato:

1. Crea il file `public/CNAME`:
```
tuodominio.com
```

2. Modifica le impostazioni DNS del tuo dominio per puntare a GitHub Pages

### 5. Deploy Manuale (Opzionale)

Se preferisci deploy manuale:

```bash
# Build e export
npm run build

# Crea branch gh-pages
git checkout --orphan gh-pages
git rm -rf .

# Copia i file buildati
cp -r out/* .
rm -rf out

# Aggiungi .nojekyll
touch .nojekyll

# Commit e push
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages --force

# Torna al branch main
git checkout main
```

## 🔄 Flusso di Lavoro

1. **Sviluppo locale**: `npm run dev`
2. **Test**: `npm run build` (assicurati che non ci siano errori)
3. **Commit**: `git commit -m "descrizione modifiche"`
4. **Push**: `git push origin main`
5. **Deploy automatico**: GitHub Actions si occuperà del resto

## 📋 Risoluzione Problemi

### Build fallisce

```bash
# Pulisci cache e reinstalla
del node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

### Percorsi non funzionano

Assicurati che:
1. Il nome del repository in `next.config.mjs` sia corretto
2. Hai fatto il push del codice
3. GitHub Actions ha completato con successo

### Errori di routing

GitHub Pages usa routing lato client. Il file `public/404.html` gestisce automaticamente il reindirizzamento.

## 📊 Monitoraggio

- **Build Status**: Controlla la scheda **Actions** nel repository
- **Deploy Status**: Controlla la scheda **Environments** nel repository
- **Live URL**: Disponibile in **Settings** → **Pages**

## 🎯 Ottimizzazioni

### Performance
- Le immagini sono ottimizzate automaticamente
- Il CSS è minificato
- Il JavaScript è code-split

### SEO
- Meta tag configurati in `app/layout.tsx`
- Sitemap generata automaticamente
- Robots.txt incluso

## 🔄 Aggiornamenti Futuri

Quando Next.js rilascia nuove versioni:

1. Aggiorna le dipendenze: `npm update`
2. Testa il build: `npm run build`
3. Se tutto funziona, fai il push

## 📞 Supporto

Se hai problemi:
1. Controlla i log in **Actions**
2. Apri una **Issue** nel repository
3. Controlla la [documentazione Next.js](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports)

---

**URL Live**: `https://tuo-username.github.io/fitness-app`