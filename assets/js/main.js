/* ARO Media — scripturi site
   Toate setările de modificat sunt în CONFIG.
   ------------------------------------------------------------------ */
const CONFIG = {
  // Unde ajung cererile de ofertă. Lasă gol ca formularul să deschidă clientul de email.
  // Exemplu Formspree: "https://formspree.io/f/abcdwxyz"
  formEndpoint: "",
  contactEmail: "contact@aromedia.ro",
  // Finalul ofertei Black Friday (ora României)
  bfEnd: "2026-11-30T23:59:59+02:00",
};

const track = (n, p) => { if (window.aroTrack) window.aroTrack(n, p); };

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- An curent în footer ---------- */
  document.querySelectorAll("[data-year]").forEach(el => (el.textContent = new Date().getFullYear()));

  /* ---------- Meniu mobil ---------- */
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "Închide" : "Meniu";
    });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "Meniu";
    }));
  }

  /* ---------- Reveal la scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("in"));
  }

  /* ---------- Black Friday: bandă, countdown, expirare ---------- */
  const end = new Date(CONFIG.bfEnd).getTime();
  const expired = () => Date.now() > end;
  document.querySelectorAll("[data-bf]").forEach(el => { if (expired()) el.remove(); });
  const bfPage = document.querySelector("[data-bf-page]");
  const cd = document.querySelector("[data-countdown]");
  if (bfPage && expired()) bfPage.classList.add("is-expired");
  if (cd && !expired()) {
    const parts = { d: cd.querySelector("[data-d]"), h: cd.querySelector("[data-h]"), m: cd.querySelector("[data-m]"), s: cd.querySelector("[data-s]") };
    const tick = () => {
      let t = Math.max(0, end - Date.now());
      if (t === 0) { bfPage && bfPage.classList.add("is-expired"); return; }
      const d = Math.floor(t / 864e5); t -= d * 864e5;
      const h = Math.floor(t / 36e5); t -= h * 36e5;
      const m = Math.floor(t / 6e4); t -= m * 6e4;
      const s = Math.floor(t / 1e3);
      parts.d.textContent = d; parts.h.textContent = String(h).padStart(2, "0");
      parts.m.textContent = String(m).padStart(2, "0"); parts.s.textContent = String(s).padStart(2, "0");
    };
    tick(); setInterval(tick, 1000);
  }

  /* ---------- Studio BODY × HOOKS ---------- */
  const studio = document.querySelector("[data-studio]");
  if (studio) {
    const HOOKS = [
      "Știi că mașina ta are un portbagaj în față?",
      "Cablul de încărcare, iar printre bagaje?",
      "Cel mai ignorat spațiu din mașina electrică.",
      "Ce ții tu în frunk?",
      "Nu mai muta tot portbagajul ca să scoți cablul.",
      "Am găsit locul perfect pentru cablu.",
      "Dacă ai mașină electrică, uită-te aici.",
      "Frunk-ul tău arată așa?",
      "5 secunde și e montat.",
      "Ce nu-ți spune nimeni despre frunk.",
    ];
    const BODIES = ["Demonstrație", "Problemă", "Înainte / după"];
    const $ = sel => studio.querySelector(sel);
    const elBodies = $("[data-bodies]"), elHooks = $("[data-hooks]"), elOut = $("[data-output]");
    const elText = $("[data-hook-text]"), elTag = $("[data-tag]"), elK = $("[data-k]"), elN = $("[data-n]");
    const elSegBody = $("[data-seg-body]"), elPlay = $("[data-playhead]"), elOutLabel = $("[data-out-label]");
    const elB = $("[data-b]"), elH = $("[data-h]"), elTotal = $("[data-total]");
    const vid = $("[data-studio-video]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let nb = 3, nh = 10, bi = 0, hi = 0, timer = null, holdUntil = 0, interacted = false;
    const STEP = 2600; // ms per creativ
    const pad = n => String(n).padStart(2, "0");
    const hookText = i => i < HOOKS.length ? HOOKS[i] : `Hook ${i + 1}: încă o deschidere de testat`;
    const bodyName = i => i < BODIES.length ? BODIES[i] : `Body ${i + 1}`;

    function build() {
      elBodies.innerHTML = Array.from({ length: Math.min(nb, 4) }, (_, i) =>
        `<button type="button" data-bi="${i}"><b>B${i + 1}</b>${bodyName(i)}</button>`).join("") +
        (nb > 4 ? `<span class="more">+${nb - 4}</span>` : "");
      const shown = Math.min(nh, 10);
      elHooks.innerHTML = Array.from({ length: shown }, (_, i) =>
        `<li><button type="button" data-hi="${i}"><span class="hn">H${pad(i + 1)}</span><span class="ht">${hookText(i)}</span></button></li>`).join("") +
        (nh > shown ? `<li class="more">+ încă ${nh - shown} hook-uri</li>` : "");
      elOut.innerHTML = Array.from({ length: nb * nh }, (_, i) => `<i data-c="${i}"></i>`).join("");
      elB.textContent = nb; elH.textContent = nh; elTotal.textContent = nb * nh;
      elN.textContent = pad(nb * nh); elOutLabel.textContent = `${nb} × ${nh}`;
      bi = Math.min(bi, nb - 1); hi = Math.min(hi, nh - 1);
      paint(true);
    }

    function paint(instant) {
      const k = bi * nh + hi;
      elBodies.querySelectorAll("[data-bi]").forEach(b => b.classList.toggle("on", +b.dataset.bi === bi));
      elHooks.querySelectorAll("[data-hi]").forEach(b => b.classList.toggle("on", +b.dataset.hi === hi));
      elOut.querySelectorAll("i").forEach((c, i) => { c.classList.toggle("done", i < k); c.classList.toggle("now", i === k); });
      elK.textContent = pad(k + 1);
      elSegBody.textContent = `BODY ${bi + 1}`;
      // animăm hook-ul nou: intră textul, apoi trece pe body
      elText.classList.remove("in"); elTag.textContent = `HOOK ${pad(hi + 1)}`; elTag.classList.remove("body");
      void elText.offsetWidth;
      elText.textContent = hookText(hi);
      elText.classList.add("in");
      elPlay.style.animation = "none"; void elPlay.offsetWidth;
      if (!reduce) elPlay.style.animation = `playhead ${STEP}ms linear forwards`;
      clearTimeout(paint.t);
      paint.t = setTimeout(() => { elTag.textContent = `BODY ${bi + 1}`; elTag.classList.add("body"); elText.classList.remove("in"); }, reduce ? 99999 : STEP * 0.55);
      // derulăm lista de hook-uri ca să se vadă cel activ
      const on = elHooks.querySelector(".on");
      if (on) {
        const li = on.closest("li"), list = elHooks;
        const top = li.offsetTop - list.clientHeight / 2 + li.clientHeight / 2;
        list.scrollTo({ top: Math.max(0, top), behavior: instant ? "auto" : "smooth" });
      }
    }

    function next() {
      if (Date.now() < holdUntil) return;
      hi++;
      if (hi >= nh) { hi = 0; bi = (bi + 1) % nb; }
      paint();
    }
    const hold = () => { holdUntil = Date.now() + 6000; if (!interacted) { interacted = true; track("calculator_use"); } };

    studio.addEventListener("click", e => {
      const b = e.target.closest("[data-bi]"), h = e.target.closest("[data-hi]"), st = e.target.closest("[data-step]");
      if (b) { bi = +b.dataset.bi; hi = 0; hold(); paint(); }
      if (h) { hi = +h.dataset.hi; hold(); paint(); }
      if (st) {
        const d = +st.dataset.d;
        if (st.dataset.step === "b") nb = Math.max(1, Math.min(12, nb + d));
        else nh = Math.max(1, Math.min(15, nh + d));
        hold(); build();
      }
    });

    // pornește doar când secțiunea e pe ecran
    const start = () => { if (!timer && !reduce) timer = setInterval(next, STEP); vid && vid.play().catch(() => {}); };
    const stop = () => { clearInterval(timer); timer = null; vid && vid.pause(); };
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(es => es.forEach(e => (e.isIntersecting ? start() : stop())), { threshold: 0.25 }).observe(studio);
    } else start();

    build();

    const toForm = studio.querySelector("[data-calc-cta]");
    if (toForm) toForm.addEventListener("click", () => {
      track("calculator_to_form", { creative: nb * nh });
      const n = document.querySelector("#f-numar");
      const s = document.querySelector("#f-structura-hooks");
      if (n) n.value = `${nb} body × ${nh} hook-uri = ${nb * nh} creative`;
      if (s) s.checked = true;
    });
  }

  /* ---------- Portofoliu: filtre + video ---------- */
  const filters = document.querySelectorAll("[data-filter]");
  if (filters.length) {
    filters.forEach(btn => btn.addEventListener("click", () => {
      const f = btn.dataset.filter;
      track("portfolio_filter", { categorie: f });
      filters.forEach(b => b.setAttribute("aria-pressed", String(b === btn)));
      document.querySelectorAll("[data-niche]").forEach(w => { w.hidden = !(f === "toate" || w.dataset.niche === f); });
    }));
  }
  /* Clipurile din portofoliu pornesc singure (fără sunet) când ajungi la ele.
     Cele care intră pe ecran în același moment pornesc împreună, de la început. */
  const vids = [...document.querySelectorAll(".work .frame video")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pauseOthersWithSound = keep => vids.forEach(o => { if (o !== keep && !o.muted) o.pause(); });

  if (vids.length && "IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(entries => {
      const starting = [];
      entries.forEach(e => {
        const v = e.target;
        if (e.isIntersecting) { if (v.muted && v.paused) starting.push(v); }
        else if (v.muted) v.pause();
      });
      if (!starting.length) return;
      // pregătim toate clipurile din lot, apoi le pornim deodată
      Promise.all(starting.map(v => new Promise(res => {
        if (!v.dataset.started) { v.dataset.started = "1"; v.preload = "auto"; v.load(); }
        if (v.readyState >= 3) return res();
        const done = () => { v.removeEventListener("canplay", done); res(); };
        v.addEventListener("canplay", done);
        setTimeout(res, 2500); // nu așteptăm la nesfârșit un clip lent
      }))).then(() => starting.forEach(v => { v.currentTime = 0; v.play().catch(() => {}); }));
    }, { threshold: 0.35 });
    vids.forEach(v => io.observe(v));
  }

  vids.forEach(v => {
    const fr = v.parentElement;
    const btn = fr.querySelector(".sound");
    const goFull = () => {
      if (!v.muted) return;
      pauseOthersWithSound(v);
      v.src = v.dataset.full; v.muted = false; v.loop = false; v.controls = true;
      v.play().catch(() => {});
      fr.classList.add("playing"); btn && btn.remove();
      track("video_play", { video: v.dataset.full.split("/").pop().replace(".mp4", "") });
    };
    btn && btn.addEventListener("click", goFull);
    v.addEventListener("click", e => { if (v.muted) { e.preventDefault(); goFull(); } });
    v.addEventListener("play", () => { if (!v.muted) pauseOthersWithSound(v); });
  });

  /* ---------- Click-uri importante ---------- */
  document.addEventListener("click", e => {
    const a = e.target.closest("a");
    if (!a) return;
    const href = a.getAttribute("href") || "";
    if (href.startsWith("tel:")) track("click_telefon");
    else if (href.startsWith("mailto:")) track("click_email");
    else if (a.classList.contains("btn")) track("cta_click", { text: a.textContent.trim().slice(0, 60), destinatie: href });
  });

  /* ---------- Formular ofertă ---------- */
  document.querySelectorAll("form[data-lead]").forEach(form => {
    const status = form.querySelector(".form-status");
    form.addEventListener("submit", async e => {
      e.preventDefault();
      status.className = "form-status";
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const data = new FormData(form);
      if (data.get("_gotcha")) return; // capcană anti-spam

      const lines = [];
      for (const [k, v] of data.entries()) if (!k.startsWith("_") && v) lines.push(`${k}: ${v}`);

      if (CONFIG.formEndpoint) {
        try {
          const r = await fetch(CONFIG.formEndpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
          if (!r.ok) throw new Error();
          form.reset();
          track("generate_lead", { formular: form.dataset.subject || "oferta", metoda: "formular" });
          status.textContent = "Am primit cererea. Ne uităm pe produs și revenim cu o propunere de structură, de obicei în 1–2 zile lucrătoare.";
          status.classList.add("ok");
        } catch {
          status.innerHTML = `Nu s-a putut trimite. Scrie-ne direct la <a href="mailto:${CONFIG.contactEmail}">${CONFIG.contactEmail}</a>.`;
          status.classList.add("err");
        }
      } else {
        const subject = encodeURIComponent(form.dataset.subject || "Cerere ofertă — ARO Media");
        const body = encodeURIComponent(lines.join("\n"));
        track("generate_lead", { formular: form.dataset.subject || "oferta", metoda: "email" });
        window.location.href = `mailto:${CONFIG.contactEmail}?subject=${subject}&body=${body}`;
        status.textContent = "Se deschide aplicația de email cu cererea completată. Apasă Trimite acolo.";
        status.classList.add("ok");
      }
    });
  });
});
