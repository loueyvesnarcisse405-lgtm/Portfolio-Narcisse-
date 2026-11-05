/* ==========================================================================
   PORTFOLIO — interactions globales
   Dépendances npm : gsap (+ ScrollTrigger), lenis
   ========================================================================== */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

(function () {
  "use strict";

  var hasGsap = true;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Défilement doux (Lenis) ---------- */
  var lenis = null;
  if (!reduced) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    if (hasGsap) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
    }
    // Ancres internes
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (id.length > 1 && document.querySelector(id)) {
          e.preventDefault();
          lenis.scrollTo(id, { offset: -90 });
        }
      });
    });
  }

  /* ---------- Barre de progression + filet de la nav ---------- */
  var progress = document.querySelector(".progress");
  var navDyn = document.querySelector(".nav__border-dyn");
  function onScroll() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? window.scrollY / max : 0;
    if (progress) progress.style.transform = "scaleX(" + p + ")";
    if (navDyn) navDyn.style.width = (p * 100) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var nav = document.querySelector(".nav");
  var burger = document.querySelector(".burger");
  if (nav && burger) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll(".nav__link").forEach(function (l) {
      l.addEventListener("click", function () { nav.classList.remove("is-open"); });
    });
  }

  /* ---------- Mots qui défilent dans les titres ---------- */
  document.querySelectorAll(".rotator").forEach(function (rot) {
    var words = rot.querySelectorAll("span");
    if (words.length < 2) return;
    var i = 0;
    words[0].classList.add("is-active");
    setInterval(function () {
      var cur = words[i];
      i = (i + 1) % words.length;
      var next = words[i];
      cur.classList.remove("is-active");
      cur.classList.add("is-out");
      next.classList.remove("is-out");
      next.classList.add("is-active");
      setTimeout(function () { cur.classList.remove("is-out"); }, 750);
    }, 2400);
  });

  /* ---------- Compteurs ---------- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (reduced) { el.textContent = target; return; }
    var start = null, dur = 1800;
    function step(ts) {
      if (!start) start = ts;
      var k = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(target * eased);
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- Apparitions au scroll ---------- */
  if (hasGsap && !reduced) {
    // Titre du hero ligne par ligne
    gsap.from(".page-hero h1 .line > span", { yPercent: 110, duration: 1.1, ease: "power4.out", stagger: 0.12, delay: 0.1 });
    gsap.from(".page-hero .breadcrumb, .page-hero__lead", { opacity: 0, y: 20, duration: 0.9, ease: "power3.out", stagger: 0.1, delay: 0.4 });
    gsap.from(".hero__title .line > span", { yPercent: 110, duration: 1.1, ease: "power4.out", stagger: 0.12, delay: 0.15 });
    gsap.from(".hero__visual", { opacity: 0, scale: 0.94, duration: 1.2, ease: "power3.out", delay: 0.3 });

    gsap.utils.toArray(".reveal").forEach(function (el) {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" }
      });
    });
    gsap.utils.toArray(".reveal-mask").forEach(function (el) {
      gsap.to(el.children, {
        yPercent: 0, y: 0, duration: 1, ease: "power4.out", stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 88%" }
      });
    });
    // Parallaxe douce des images "à propos"
    gsap.utils.toArray("[data-parallax]").forEach(function (el) {
      var amt = parseFloat(el.getAttribute("data-parallax")) || 60;
      gsap.fromTo(el, { y: amt }, {
        y: -amt, ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true }
      });
    });
  } else {
    document.querySelectorAll(".reveal, .reveal-mask > *").forEach(function (el) {
      el.style.opacity = 1; el.style.transform = "none";
    });
  }

  /* ---------- Projets : caméra 3D qui traverse les cartes ---------- */
  var section3d = document.querySelector(".projects3d");
  if (section3d) {
    var items = Array.prototype.slice.call(section3d.querySelectorAll(".projects3d__item"));
    var GAP = 650;                       // distance entre deux cartes sur l'axe Z
    var spots = [                        // positions X/Y (px) autour du centre
      [-170, -150], [210, -40], [-330, 60], [120, -200], [330, 100],
      [-240, -40], [40, 20], [-100, -190], [260, -150]
    ];
    var total = (items.length + 0.6) * GAP;

    function place(p) {
      var travel = p * total;
      items.forEach(function (it, i) {
        var z = -300 - i * GAP + travel;
        var s = spots[i % spots.length];
        var op;
        if (z > 250) op = Math.max(0, 1 - (z - 250) / 250);       // passe derrière la caméra
        else if (z < -2600) op = Math.max(0, 1 - (-2600 - z) / 900); // trop loin
        else op = 1;
        it.style.transform = "translate3d(" + (s[0] - 170) + "px," + (s[1] - 150) + "px," + z + "px)";
        it.style.opacity = op.toFixed(3);
        it.style.pointerEvents = op > 0.6 && z < 200 ? "auto" : "none";
        it.style.zIndex = String(1000 + Math.round(z));
      });
    }
    place(0);

    var mq = window.matchMedia("(min-width: 992px)");
    if (hasGsap) {
      ScrollTrigger.create({
        trigger: section3d, start: "top top", end: "bottom bottom", scrub: true,
        onUpdate: function (self) { if (mq.matches) place(self.progress); }
      });
    } else {
      window.addEventListener("scroll", function () {
        if (!mq.matches) return;
        var r = section3d.getBoundingClientRect();
        var p = Math.min(Math.max(-r.top / (r.height - window.innerHeight), 0), 1);
        place(p);
      }, { passive: true });
    }
  }

  /* ---------- Méthode : étape active ---------- */
  var steps = document.querySelectorAll(".step");
  var stepNum = document.querySelector("[data-step-current]");
  var stepBar = document.querySelector(".process__bar span");
  if (steps.length && "IntersectionObserver" in window) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        steps.forEach(function (s) { s.classList.remove("is-active"); });
        e.target.classList.add("is-active");
        var idx = Array.prototype.indexOf.call(steps, e.target) + 1;
        if (stepNum) stepNum.textContent = idx;
        if (stepBar) stepBar.style.transform = "scaleX(" + idx / steps.length + ")";
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    steps.forEach(function (s) { sio.observe(s); });
    steps[0].classList.add("is-active");
  }

  /* ---------- FAQ accordéon ---------- */
  document.querySelectorAll(".faq__item").forEach(function (item) {
    var q = item.querySelector(".faq__q");
    q.addEventListener("click", function () {
      var open = item.classList.contains("is-open");
      document.querySelectorAll(".faq__item.is-open").forEach(function (o) {
        o.classList.remove("is-open");
        o.querySelector(".faq__q").setAttribute("aria-expanded", "false");
      });
      if (!open) { item.classList.add("is-open"); q.setAttribute("aria-expanded", "true"); }
      if (hasGsap) setTimeout(function () { ScrollTrigger.refresh(); }, 500);
    });
  });

  /* ---------- Page active dans le menu ---------- */
  var page = document.body.getAttribute("data-page");
  if (page) {
    document.querySelectorAll('[data-nav="' + page + '"]').forEach(function (a) {
      a.classList.add("is-current");
      a.setAttribute("aria-current", "page");
    });
  }

  /* ---------- Réalisations : filtres ---------- */
  var filterBar = document.querySelector("[data-filters]");
  if (filterBar) {
    var works = document.querySelectorAll("[data-cat]");
    var emptyMsg = document.querySelector("[data-works-empty]");
    function applyFilter(cat) {
      var shown = 0;
      filterBar.querySelectorAll("button").forEach(function (b) {
        var on = b.getAttribute("data-filter") === cat;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      works.forEach(function (w) {
        var match = cat === "tous" || w.getAttribute("data-cat") === cat;
        w.classList.toggle("is-hidden", !match);
        if (match) shown++;
      });
      if (emptyMsg) emptyMsg.hidden = shown > 0;
      if (hasGsap) ScrollTrigger.refresh();
    }
    filterBar.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-filter]");
      if (!b) return;
      applyFilter(b.getAttribute("data-filter"));
      if (history.replaceState) history.replaceState(null, "", "#" + b.getAttribute("data-filter"));
    });
    var initial = location.hash.slice(1);
    if (initial && filterBar.querySelector('[data-filter="' + initial + '"]')) applyFilter(initial);
  }

  /* ---------- Lecteur vidéo (modale) ----------
     Sur un élément : data-video="https://www.youtube.com/embed/ID" (ou Vimeo) */
  var modal = document.querySelector(".vmodal");
  if (modal) {
    var frame = modal.querySelector(".vmodal__frame");
    var lastFocus = null;
    function closeModal() {
      modal.classList.remove("is-open");
      frame.innerHTML = "";
      if (lenis) lenis.start();
      if (lastFocus) lastFocus.focus();
    }
    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-video]");
      if (t) {
        e.preventDefault();
        var src = t.getAttribute("data-video");
        lastFocus = t;
        frame.innerHTML = src
          ? '<iframe src="' + src + (src.indexOf("?") > -1 ? "&" : "?") + 'autoplay=1" title="Lecteur vidéo" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>'
          : '<p class="vmodal__empty">Vidéo à venir : ajoutez le lien YouTube ou Vimeo dans l\'attribut <code>data-video</code>.</p>';
        modal.classList.add("is-open");
        if (lenis) lenis.stop();
        modal.querySelector(".vmodal__close").focus();
        return;
      }
      if (e.target === modal || e.target.closest(".vmodal__close")) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });
  }

  /* ---------- Formulaire de contact ----------
     data-endpoint vide → ouvre la messagerie (mailto).
     Avec un service type Formspree : renseigner data-endpoint="https://formspree.io/f/XXXX" */
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    var status = form.querySelector("[data-form-status]");
    function setStatus(msg, ok) {
      status.textContent = msg;
      status.className = "form__status " + (ok ? "is-ok" : "is-error");
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var data = new FormData(form);
      var endpoint = form.getAttribute("data-endpoint");
      if (!endpoint) {
        var to = form.getAttribute("data-mailto");
        var body = "Nom : " + data.get("nom") + "\nE-mail : " + data.get("email") +
          (data.get("type") ? "\nType de projet : " + data.get("type") : "") + "\n\n" + data.get("message");
        window.location.href = "mailto:" + to + "?subject=" + encodeURIComponent(data.get("objet")) + "&body=" + encodeURIComponent(body);
        setStatus("Votre messagerie va s'ouvrir avec le message prêt à envoyer.", true);
        return;
      }
      var btn = form.querySelector("[type=submit]");
      btn.disabled = true;
      fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
        .then(function (r) {
          if (!r.ok) throw new Error();
          form.reset();
          setStatus("Merci ! Votre message a bien été envoyé. Je vous réponds rapidement.", true);
        })
        .catch(function () { setStatus("L'envoi a échoué. Écrivez-moi directement par e-mail ou WhatsApp.", false); })
        .then(function () { btn.disabled = false; });
    });
  }

  /* ---------- Année du footer ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* Recalcule les déclencheurs une fois les polices / images chargées */
  window.addEventListener("load", function () { if (hasGsap) ScrollTrigger.refresh(); });})();
