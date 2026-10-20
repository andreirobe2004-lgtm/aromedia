/* ARO Media — Google Analytics 4 + Microsoft Clarity, cu consimțământ (GDPR)
   ------------------------------------------------------------------
   Completează cele două coduri de mai jos. Cât timp sunt goale, nimic nu se încarcă
   și bannerul de cookies nu apare.

   - GA4: Google Analytics → Admin → Data streams → Web → „Measurement ID” (G-XXXXXXXXXX)
   - Clarity: clarity.microsoft.com → proiectul tău → Settings → Overview → „Project ID”

   Scripturile se încarcă DOAR după ce vizitatorul apasă „Accept”. La refuz nu se încarcă nimic.
   ------------------------------------------------------------------ */
const ANALYTICS = {
  ga4Id: "",      // ex: "G-AB12CD34EF"
  clarityId: "",  // ex: "abcd1234ef"
  storageKey: "aro_consent_v1",
};

(function () {
  const enabled = Boolean(ANALYTICS.ga4Id || ANALYTICS.clarityId);
  const queue = [];
  let loaded = false;

  /* ---------- Stocarea alegerii ---------- */
  const getChoice = () => { try { return localStorage.getItem(ANALYTICS.storageKey); } catch { return null; } };
  const setChoice = v => { try { localStorage.setItem(ANALYTICS.storageKey, v); } catch {} };

  /* ---------- Încărcare scripturi ---------- */
  function loadGA() {
    if (!ANALYTICS.ga4Id) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag("consent", "default", {
      ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
      analytics_storage: "granted",
    });
    gtag("js", new Date());
    gtag("config", ANALYTICS.ga4Id, { anonymize_ip: true });
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ANALYTICS.ga4Id);
    document.head.appendChild(s);
  }

  function loadClarity() {
    if (!ANALYTICS.clarityId) return;
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", ANALYTICS.clarityId);
    window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" });
  }

  function loadAll() {
    if (loaded) return;
    loaded = true;
    loadGA();
    loadClarity();
    queue.splice(0).forEach(([n, p]) => send(n, p));
  }

  /* ---------- Evenimente ---------- */
  function send(name, params) {
    if (window.gtag && ANALYTICS.ga4Id) window.gtag("event", name, params || {});
    if (window.clarity && ANALYTICS.clarityId) {
      window.clarity("event", name);
      if (params) Object.entries(params).forEach(([k, v]) => window.clarity("set", k, String(v)));
    }
  }
  // Folosit de main.js: aroTrack("generate_lead", { form: "oferta" })
  window.aroTrack = function (name, params) {
    if (!enabled || getChoice() !== "granted") return;
    if (!loaded) { queue.push([name, params]); return; }
    send(name, params);
  };

  /* ---------- Revocare ---------- */
  function revoke() {
    if (window.gtag) window.gtag("consent", "update", { analytics_storage: "denied" });
    if (window.clarity) {
      window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "denied" });
      window.clarity("consent", false);
    }
    // ștergem cookie-urile GA
    document.cookie.split(";").map(c => c.trim().split("=")[0])
      .filter(n => /^_ga|^_gid|^_gat|^_clck|^_clsk/.test(n))
      .forEach(n => {
        const host = location.hostname.replace(/^www\./, "");
        [location.hostname, "." + host, ""].forEach(d => {
          document.cookie = `${n}=; Max-Age=0; path=/${d ? "; domain=" + d : ""}`;
        });
      });
  }

  /* ---------- Banner ---------- */
  function banner() {
    if (document.getElementById("cookie-banner")) return;
    const el = document.createElement("div");
    el.id = "cookie-banner";
    el.className = "cookie-banner";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", "Setări cookies");
    el.innerHTML = `
      <p><b>Cookies pentru statistici.</b> Folosim Google Analytics și Microsoft Clarity ca să înțelegem cum e folosit site-ul: ce pagini se văd, unde se dă click, unde se oprește lumea. Nu folosim cookies de publicitate. <a href="/cookies.html">Detalii</a></p>
      <div class="cookie-actions">
        <button type="button" class="btn" data-c="denied">Refuz</button>
        <button type="button" class="btn btn-primary" data-c="granted">Accept</button>
      </div>`;
    document.body.appendChild(el);
    el.querySelectorAll("[data-c]").forEach(b => b.addEventListener("click", () => {
      const v = b.dataset.c;
      const before = getChoice();
      setChoice(v);
      el.remove();
      if (v === "granted") loadAll();
      else if (before === "granted") { revoke(); location.reload(); }
    }));
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Link „Setări cookies” din footer
    document.querySelectorAll("[data-cookie-settings]").forEach(a => a.addEventListener("click", e => {
      e.preventDefault();
      if (enabled) banner();
    }));
    if (!enabled) {
      document.querySelectorAll("[data-cookie-settings]").forEach(a => a.closest("li")?.remove());
      return;
    }
    const c = getChoice();
    if (c === "granted") loadAll();
    else if (c !== "denied") banner();
  });
})();
