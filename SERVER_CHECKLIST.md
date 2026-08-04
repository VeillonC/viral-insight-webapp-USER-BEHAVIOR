# Checklist — à faire dès que l'AI-server est de nouveau accessible

Serveur : Tailscale `100.70.0.2` (user `dniit-1`), accès SSH via VSCode Remote-SSH.
Services systemd : `ai-server` (FastAPI, port 8000) et Ollama (`qwen2.5:3b`).

## 1. Vérifier que le serveur répond
```bash
# sur le serveur (attendre ~45 s après un restart avant de curl)
sudo systemctl status ai-server
curl -s http://localhost:8000/health   # ou la route de base
```

## 2. Vérifier / corriger l'endpoint /sentiment
```bash
grep -n "def sentiment" ~/USER-BEHAVIOR-SOCIAL-MEDIA/ml/server/app.py
sudo systemctl restart ai-server && sleep 45
curl -s -X POST http://localhost:8000/sentiment \
  -H "Content-Type: application/json" \
  -d '{"text":"Our new EV does 510 km on a charge."}'
```
Idem pour `/barriers` et `/greenwashing` si besoin.

## 3. Appliquer le nouveau prompt Qwen (rapports plus lisibles)
- Coller le nouveau `PROMPT_TEMPLATES` (EN + VI, structure Verdict / What's working / What to improve, sans jargon) dans
  `ml/report_ui/generate_report.py` (ou là où le prompt /report est défini dans `app.py`).
- Redémarrer : `sudo systemctl restart ai-server && sleep 45`.
- Tester `/report` en EN et VI et vérifier le rendu.

## 4. Capturer 2 VRAIS exemples pour la page d'accueil
Le composant `app/ExampleShowcase.tsx` contient actuellement 2 exemples **fabriqués à la main**
(placeholders). Les remplacer par de vraies sorties du modèle :
1. Lancer 2 analyses réelles (une "viral-likely", une "not-viral") via l'app connectée au serveur.
2. Récupérer les objets renvoyés : `prediction`, `barriers`, `greenwash`, `sentiment`, `report`
   (copier depuis l'onglet réseau du navigateur, ou logger côté serveur).
3. Remplacer les objets `full` dans `buildExamples()` — garder les 2 langues (EN + VI).
   ⚠️ Rappel : toute chaîne visible doit exister en EN **et** VI (voir `lib/i18n.ts`).

## 5. Committer les endpoints sur le repo modèle
`/barriers`, `/greenwashing`, `/sentiment` doivent être poussés sur
`raph0603/USER-BEHAVIOR-SOCIAL-MEDIA` (sujet de commit en minuscules — commitlint).

## 6. Rendre l'AI-server accessible publiquement (HTTPS)
Option A — Tailscale Funnel :
```bash
sudo tailscale funnel 8000
```
Option B — tunnel Cloudflare (`cloudflared tunnel`).
Récupérer l'URL HTTPS publique.

## 7. Brancher l'app en ligne
- Sur Vercel → Project Settings → Environment Variables :
  `NEXT_PUBLIC_API_URL = https://<url-publique-du-serveur>`
- Redéployer. Tester l'onglet **Analyze** en ligne (EN + VI).

## 8. Vérification finale
- [ ] Analyze fonctionne en ligne (prédiction + rapport async).
- [ ] Barriers / Greenwashing / Sentiment s'affichent.
- [ ] Rapports lisibles en EN et VI.
- [ ] Exemples de la page d'accueil = vraies sorties.
- [ ] Historique enregistre bien tout (localStorage).

---

## Avec Raphaël (données / modèle — non bloquant pour le web)
- Audience Reddit (karma auteur) + X (followers) capturés au crawl ; normalisation par réseau.
- Stats live de la page Insights (distribution sentiment, topics, stats barrières) au lieu des chiffres statiques.
- Distribution complète des rôles de persuasion + labels de topics lisibles.
- Lexique EV vietnamien enrichi ; à terme modèle multilingue (BERT/XLM-R).
