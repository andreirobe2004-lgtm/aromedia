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

  /* ---------- Calculator BODY × HOOKS ---------- */
  const calc = document.querySelector("[data-calc]");
  if (calc) {
    const bIn = calc.querySelector("#bodies");
    const hIn = calc.querySelector("#hooks");
    const bOut = calc.querySelector("#bodies-out");
    const hOut = calc.querySelector("#hooks-out");
    const total = calc.querySelector("[data-total]");
    const sentence = calc.querySelector("[data-sentence]");
    const matrix = calc.querySelector("[data-matrix]");
    const presets = calc.querySelectorAll("[data-preset]");

    const render = () => {
      const b = +bIn.value, h = +hIn.value, n = b * h;
      bOut.textContent = b; hOut.textContent = h; total.textContent = n;
      sentence.textContent =
        `${b} ${b === 1 ? "body" : "body-uri"} montate fiecare cu ${h} ${h === 1 ? "hook" : "hook-uri"} = ${n} ${n === 1 ? "creativ distinct" : "creative distincte"} pentru algoritm.`;
      const rows = Math.min(b, 6);
      let html = "";
      for (let r = 0; r < rows; r++) {
        html += `<div class="matrix-row"><span class="body-tag">Body ${r + 1}</span><div class="cells">`;
        for (let c = 0; c < h; c++) html += `<span class="cell" title="Body ${r + 1} + Hook ${c + 1}"></span>`;
        html += `</div></div>`;
      }
      if (b > rows) html += `<p class="mono" style="font-size:.8rem;color:#a39b8e;margin:6px 0 0">+ încă ${b - rows} body-uri × ${h} hook-uri</p>`;
      matrix.innerHTML = html;
      presets.forEach(p => p.setAttribute("aria-pressed", String(+p.dataset.b === b && +p.dataset.h === h)));
      const pre = document.querySelector("#f-structura");
      if (pre) pre.dataset.calc = `${b} body × ${h} hook-uri = ${n} creative`;
    };
    [bIn, hIn].forEach(i => i.addEventListener("input", render));
    presets.forEach(p => p.addEventListener("click", () => { bIn.value = p.dataset.b; hIn.value = p.dataset.h; render(); track("calculator_preset", { structura: `${p.dataset.b}x${p.dataset.h}` }); }));
    let calcTracked = false;
    [bIn, hIn].forEach(i => i.addEventListener("change", () => { if (!calcTracked) { calcTracked = true; track("calculator_use"); } }));
    render();

    const toForm = calc.querySelector("[data-calc-cta]");
    if (toForm) toForm.addEventListener("click", () => {
      track("calculator_to_form", { creative: +bIn.value * +hIn.value });
      const n = document.querySelector("#f-numar");
      const s = document.querySelector("#f-structura-hooks");
      if (n) n.value = `${bIn.value} body × ${hIn.value} hook-uri = ${+bIn.value * +hIn.value} creative`;
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
  const vids = document.querySelectorAll(".work .frame video");
  vids.forEach(v => {
    const fr = v.parentElement;
    const btn = fr.querySelector(".play");
    if (!btn) return;
    btn.addEventListener("click", () => {
      vids.forEach(o => { if (o !== v) o.pause(); });
      v.controls = true; v.play(); fr.classList.add("playing"); btn.remove();
      track("video_play", { video: (v.getAttribute("src") || "").split("/").pop().replace(".mp4", "") });
    });
    v.addEventListener("play", () => vids.forEach(o => { if (o !== v) o.pause(); }));
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
