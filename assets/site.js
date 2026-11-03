// HAI website: mobile menu, current page in the menu, and the parts that come
// from content/site.json (WhatsApp chat button, clients, testimonials).
(function () {
  "use strict";

  // mobile menu
  var btn = document.querySelector(".menu-btn");
  var links = document.querySelector(".links");
  if (btn && links) {
    btn.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // one page: close the phone menu after a click, and highlight the section
  // that is on screen
  var menuLinks = Array.prototype.slice.call(document.querySelectorAll(".links a"));
  menuLinks.forEach(function (a) {
    a.addEventListener("click", function () {
      if (links) links.classList.remove("open");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  });
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        menuLinks.forEach(function (a) {
          a.classList.toggle("active", !a.classList.contains("menu-cta") &&
            a.getAttribute("href") === "#" + en.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["top", "services", "products", "about", "contact"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function render(cfg) {
    // "Chat with us" opens WhatsApp with the team's number
    var number = String(cfg.whatsapp_number || "").replace(/[^\d]/g, "");
    document.querySelectorAll(".wa-chat").forEach(function (a) {
      if (!number) { a.hidden = true; return; }
      a.hidden = false;
      a.href = "https://wa.me/" + number + "?text=" + encodeURIComponent(cfg.whatsapp_message || "");
      a.target = "_blank";
      a.rel = "noopener";
    });
    document.querySelectorAll(".wa-row").forEach(function (row) {
      row.hidden = !number;
      var a = row.querySelector(".wa-num");
      if (number && a) { a.href = "https://wa.me/" + number; a.textContent = String(cfg.whatsapp_number).trim(); }
    });

    // clients (logos)
    var clients = (cfg.clients || []).filter(function (c) { return c && (c.logo || c.name); });
    var showClients = cfg.show_clients === true && clients.length > 0;
    document.querySelectorAll("[data-section='clients'], [data-nav='clients']").forEach(function (el) {
      el.hidden = !showClients;
    });
    var logos = document.querySelector("#clients .logos");
    if (showClients && logos) {
      logos.innerHTML = clients.map(function (c) {
        var img = c.logo
          ? '<img src="' + esc(c.logo) + '" alt="' + esc(c.name) + '" loading="lazy">'
          : "<b>" + esc(c.name) + "</b>";
        return c.url
          ? '<a class="logo-img" href="' + esc(c.url) + '" target="_blank" rel="noopener">' + img + "</a>"
          : '<div class="logo-img">' + img + "</div>";
      }).join("");
    }

    // testimonials (text or video)
    var items = (cfg.testimonials || []).filter(function (t) { return t && (t.quote || t.video); });
    var showT = cfg.show_testimonials === true && items.length > 0;
    document.querySelectorAll("[data-section='testimonials']").forEach(function (el) {
      el.hidden = !showT;
    });
    var grid = document.querySelector("#testimonials .grid3");
    if (showT && grid) {
      grid.innerHTML = items.map(function (t) {
        var who = '<figcaption>' +
          (t.photo ? '<img class="avatar" src="' + esc(t.photo) + '" alt="">' : '<span class="avatar"></span>') +
          "<span><b>" + esc(t.name) + "</b><br>" + esc([t.role, t.company].filter(Boolean).join(", ")) + "</span></figcaption>";
        if (t.video) {
          return '<figure class="quote video-quote"><video controls preload="none"' +
            (t.poster ? ' poster="' + esc(t.poster) + '"' : "") + ' src="' + esc(t.video) + '"></video>' + who + "</figure>";
        }
        return '<figure class="quote"><blockquote>"' + esc(t.quote) + '"</blockquote>' + who + "</figure>";
      }).join("");
    }
  }

  // demo request form: sent to info@haitech.ltd through Web3Forms (key in
  // content/site.json). Without a key (preview) it only checks the fields.
  var cfgLoaded = {};
  var form = document.getElementById("demo-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = e.target, msg = f.querySelector(".form-msg"), btn = f.querySelector("button[type=submit]");
      var bad = ["name", "phone", "email"].filter(function (n) { return !f[n].value.trim(); });
      var digits = f.phone.value.replace(/\D/g, "");
      if (f.phone.value.trim() && (digits.length < 6 || digits.length > 15)) bad.push("a valid phone number");
      if (!bad.length && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.value.trim())) bad.push("email");
      msg.hidden = false;
      if (bad.length) { msg.className = "form-msg err"; msg.textContent = "Please fill in: " + bad.join(", "); return; }
      var key = String(cfgLoaded.web3forms_key || "").trim();
      if (!key) {
        msg.className = "form-msg ok";
        msg.textContent = "Preview only: at go-live this request is sent to info@haitech.ltd.";
        return;
      }
      if (f.botcheck && f.botcheck.checked) return;
      var country = f.phone_country.options[f.phone_country.selectedIndex].text.replace(/\s+/g, " ").trim();
      var data = {
        access_key: key,
        subject: "Demo request from haitech.ltd: " + f.name.value.trim(),
        from_name: "HAI website",
        name: f.name.value.trim(),
        company: f.company.value.trim(),
        phone: country.split(" ")[0] + " " + f.phone.value.trim() + " (" + country.split(" ").slice(1).join(" ") + ")",
        email: f.email.value.trim(),
        interested_in: f.interest.value,
        message: f.message.value.trim()
      };
      btn.disabled = true;
      msg.className = "form-msg"; msg.textContent = "Sending...";
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      }).then(function (r) { return r.json().catch(function () { return {}; }); })
        .then(function (res) {
          if (res && res.success) {
            msg.className = "form-msg ok";
            msg.textContent = "Thank you! Your request was sent. Our team will contact you soon.";
            f.reset();
          } else { throw new Error((res && res.message) || "failed"); }
        })
        .catch(function () {
          msg.className = "form-msg err";
          msg.textContent = "Sorry, the request could not be sent. Please email us at info@haitech.ltd or use Chat with us.";
        })
        .then(function () { btn.disabled = false; });
    });
  }

  // back-to-top arrow after scrolling down
  var top = document.querySelector(".to-top");
  if (top) {
    var onScroll = function () { top.hidden = window.scrollY < 600; };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  fetch("content/site.json", { cache: "no-cache" })
    .then(function (r) { return r.ok ? r.json() : {}; })
    .catch(function () { return {}; })
    .then(function (cfg) { cfgLoaded = cfg || {}; render(cfgLoaded); });
})();
