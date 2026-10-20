# aromedia.ro

Site de prezentare ARO Media: HTML, CSS și JavaScript simplu, fără build și fără dependențe. Se poate publica direct pe GitHub Pages.

## Structura

```
index.html              Homepage (hero → formular, cele 14 secțiuni din brief)
portofoliu.html         Portofoliu cu filtre pe nișă
black-friday.html       Landing Black Friday 2026, cu countdown; se închide singur după 30.11.2026
agentii.html            Pagină pentru agenții de performance
termeni.html, confidentialitate.html, cookies.html   Pagini legale (modele, de verificat)
404.html
assets/css/style.css    Toate stilurile
assets/js/main.js       Meniu, calculator Body × Hooks, filtre, formular, Black Friday
assets/img/             Imagini, favicon
CNAME                   Domeniul aromedia.ro pentru GitHub Pages
```

## Vezi site-ul pe calculatorul tău

Din folderul proiectului:

```
python3 -m http.server 8000
```

Apoi deschide http://localhost:8000. Linkurile pornesc de la rădăcina site-ului (`/portofoliu.html`), așa că dublu-clic pe `index.html` nu le va deschide corect. Folosește serverul.

## Urcare pe GitHub și publicare

```
git init
git add .
git commit -m "Site nou ARO Media"
git branch -M main
git remote add origin https://github.com/UTILIZATOR/aromedia.git
git push -u origin main
```

Pe GitHub, deschide **Settings → Pages**. La *Source* alege **Deploy from a branch**, apoi `main` și `/ (root)`.

Pentru domeniul aromedia.ro, fișierul `CNAME` există deja. La registrarul domeniului adaugă:
- 4 înregistrări `A` pentru `@`: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
- un `CNAME` pentru `www` → `UTILIZATOR.github.io`

Apoi bifează **Enforce HTTPS** în Settings → Pages.

Dacă vrei să testezi întâi pe adresa `UTILIZATOR.github.io/aromedia` fără domeniu, linkurile cu `/` la început nu vor merge. În cazul ăsta, publică întâi cu domeniul sau spune-mi și le fac relative.

## Formularul

Implicit, formularul deschide aplicația de email a vizitatorului cu cererea deja completată, adresată către `contact@aromedia.ro`. Ca să primești cererile direct, fără ca vizitatorul să apese Trimite în aplicația de email:

1. Creează un formular gratuit pe formspree.io (sau pe un serviciu similar).
2. În `assets/js/main.js`, la `CONFIG.formEndpoint`, pune adresa primită, de exemplu `"https://formspree.io/f/abcdwxyz"`.
3. Adaugă serviciul folosit în `confidentialitate.html`.

## De completat înainte de lansare

Tot ce e marcat pe site cu galben (`.todo`) sau între paranteze drepte:

- [ ] **Date firmă** în footer și în paginile legale: denumire SRL, CUI, Nr. Reg. Com., adresă
- [ ] **Telefon și email**: caută `07XX XXX XXX` și `contact@aromedia.ro` în toate fișierele `.html`, plus `contactEmail` în `main.js`
- [ ] **Cifra „20+ magazine”**: verifică numărul real
- [ ] **Numărul de creative livrate** din banda de social proof
- [ ] **Logo-uri clienți**: doar cu acordul lor
- [ ] **Rezultate**: pentru fiecare card, nișa, numărul de creative, bugetul, perioada și un screenshot din Ads Manager. Cardul cu CPA folosește pragul „produse de peste 200 de lei”; pe site-ul vechi apăreau și 150, și 200. Păstrează-l pe cel corect.
- [ ] **1.250.000+ lei**: nu apare pe site-ul nou. Adaug-o doar dacă poți susține cifra cu date de la clienți.
- [ ] **Testimoniale**: 2–3 reale, cu numele magazinului și acordul clientului. Nu publica testimoniale inventate.
- [ ] **Studiu de caz găini**: rezultatul campaniei
- [ ] **Portofoliu**: 13 clipuri, afișate doar cu produsul și unghiul, fără numele clienților. Pentru clipuri noi, pune video-ul în `assets/video/` și posterul în `assets/img/posters/`, apoi copiază un card `<article class="work">` din `portofoliu.html`.
- [ ] **FAQ „Câte revizii sunt incluse?”**: numărul real de runde
- [ ] **Intervale de preț**: ~2.000–5.000 lei per proiect și ~75–110 lei per creativ, deduse din cele două proiecte din brief. Ajustează-le dacă ai date mai noi.
- [ ] **Pagini legale**: verificate de un jurist; data ultimei actualizări
- [ ] **Imagine de share** `assets/img/og-image.jpg`, 1200×630, un cadru real din producție
- [ ] **Pixel Meta / TikTok / Analytics**: dacă îi adaugi, ai nevoie de banner de consimțământ și de actualizarea paginii de cookies

## Imagini și video

Regula din brief: fiecare imagine de pe site e un cadru real dintr-o producție, nu stock și nu studio.

Cadrele 9:16 cu dungi sunt locuri rezervate. Ca să pui un video, copiază fișierul în `assets/video/`, apoi, în blocul `<div class="frame">` corespunzător, înlocuiește `<div class="ph">…</div>` cu:

```html
<video src="/assets/video/gaini-hook1.mp4" poster="/assets/img/gaini-poster.jpg" playsinline preload="none"></video>
<button class="play" aria-label="Pornește video"></button>
```

Pentru o imagine statică, folosește `<img src="/assets/img/cadru.jpg" alt="Descriere scurtă">`.

Video-urile sunt la 1080p, cu cel mult 45 MB per fișier. GitHub avertizează peste 50 MB și refuză fișierele de peste 100 MB. Pe site, un video se descarcă doar când vizitatorul apasă play. Singura excepție e `hero-loop.mp4`, care e mică.

Pentru a comprima un clip nou la aceeași calitate:

```
ffmpeg -i original.mp4 -vf "scale=1080:1920:force_original_aspect_ratio=decrease,fps=30" -c:v libx264 -preset slow -crf 19 -maxrate 8000k -bufsize 16000k -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart assets/video/nume-clip.mp4
```

### Previzualizări pentru autoplay

Clipurile din portofoliu pornesc singure, fără sunet, dintr-o variantă ușoară: `assets/video/prev/`, 540p, ~2 MB. La click se încarcă varianta completă, 1080p, cu sunet, din `assets/video/`. Pentru un clip nou ai nevoie de ambele variante:

```
ffmpeg -i assets/video/nume-clip.mp4 -vf "scale=540:960,fps=30" -an -c:v libx264 -preset veryfast -crf 30 -g 60 -pix_fmt yuv420p -movflags +faststart assets/video/prev/nume-clip.mp4
```

## Black Friday

Data de final este în `assets/js/main.js` (`CONFIG.bfEnd`). După această dată, banda de sus dispare automat, iar pagina `black-friday.html` afișează „Oferta s-a încheiat”.
