(function () {
  "use strict";

  var d = document;
  var w = window;

  function ready(fn) {
    if (d.readyState !== "loading") {
      fn();
    } else {
      d.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var navToggle = d.getElementById("nav-toggle");
    var mobileMenu = d.getElementById("mobile-menu");

    /* ---------- Mobile menu ---------- */
    if (navToggle && mobileMenu) {
      function closeMenu() {
        mobileMenu.classList.remove("is-open");
        navToggle.classList.remove("is-active");
        navToggle.setAttribute("aria-expanded", "false");
        d.body.style.overflow = "";
      }

      navToggle.addEventListener("click", function () {
        var open = mobileMenu.classList.toggle("is-open");
        navToggle.classList.toggle("is-active", open);
        navToggle.setAttribute("aria-expanded", String(open));
        d.body.style.overflow = open ? "hidden" : "";
      });

      mobileMenu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeMenu);
      });

      d.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          closeMenu();
        }
      });
    }

    /* ---------- Reveal on scroll ---------- */
    var revealEls = d.querySelectorAll(".reveal");
    if ("IntersectionObserver" in w) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      revealEls.forEach(function (el) {
        io.observe(el);
      });
    } else {
      revealEls.forEach(function (el) {
        el.classList.add("in-view");
      });
    }

    /* ---------- Gallery filter ---------- */
    var filterBtns = d.querySelectorAll(".gallery__filter");
    var galleryItems = d.querySelectorAll(".gallery__item");

    function applyFilter(filter) {
      galleryItems.forEach(function (item) {
        var cat = item.getAttribute("data-cat");
        var show = filter === "all" || cat === filter;
        item.classList.remove("is-showing");
        if (show) {
          item.classList.remove("is-hidden");
          item.style.display = "";
          item.classList.add("is-showing");
        } else {
          item.classList.add("is-hidden");
          item.style.display = "none";
        }
      });
    }

    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) {
          b.classList.remove("is-active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
        applyFilter(btn.getAttribute("data-filter"));
      });
    });

    /* ---------- Lightbox ---------- */
    var lightbox = d.getElementById("lightbox");
    var lightboxImg = d.getElementById("lightbox-img");
    var galleryButtons = d.querySelectorAll(".gallery__btn");

    if (lightbox && lightboxImg) {
      function openLightbox(src) {
        lightboxImg.src = src;
        lightboxImg.alt = "Enlarged view of the creation";
        lightbox.hidden = false;
        d.body.style.overflow = "hidden";
        lightbox.querySelector(".lightbox__close").focus();
      }
      function closeLightbox() {
        lightbox.hidden = true;
        lightboxImg.src = "";
        d.body.style.overflow = "";
      }

      galleryButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          var full = btn.getAttribute("data-full");
          if (full) {
            openLightbox(full);
          }
        });
      });

      lightbox.querySelector(".lightbox__close").addEventListener("click", closeLightbox);
      lightbox.addEventListener("click", function (e) {
        if (e.target === lightbox) {
          closeLightbox();
        }
      });
      d.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && !lightbox.hidden) {
          closeLightbox();
        }
      });
    }

    /* ---------- FAQ accordion ---------- */
    var faqItems = d.querySelectorAll(".faq__item");
    faqItems.forEach(function (item) {
      var btn = item.querySelector(".faq__question");
      var panelId = btn.getAttribute("aria-controls");
      var panel = d.getElementById(panelId);

      function setOpen(open) {
        item.classList.toggle("is-open", open);
        btn.setAttribute("aria-expanded", String(open));
        if (panel) {
          panel.hidden = !open;
        }
      }

      btn.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-open");
        faqItems.forEach(function (other) {
          if (other !== item) {
            other.classList.remove("is-open");
            var ob = other.querySelector(".faq__question");
            ob.setAttribute("aria-expanded", "false");
            var op = d.getElementById(ob.getAttribute("aria-controls"));
            if (op) {
              op.hidden = true;
            }
          }
        });
        setOpen(!isOpen);
      });
    });

    /* ---------- Booking form ---------- */
    var form = d.getElementById("booking-form");
    var success = d.getElementById("booking-success");
    var resetBtn = d.getElementById("booking-reset");

    if (form) {
      var str = function (v) {
        return (v || "").trim();
      };

      var validators = {
        service: function (v) {
          return str(v).length > 0;
        },
        date: function (v) {
          return str(v).length > 0;
        },
        time: function (v) {
          return str(v).length > 0;
        },
        name: function (v) {
          return str(v).length >= 2;
        },
        phone: function (v) {
          return /^[0-9()+\-.\s]{7,}$/.test(str(v));
        },
        email: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str(v));
        }
      };

      function errorFor(field) {
        var p = field.parentNode.querySelector(".field__error");
        if (!p) {
          p = d.createElement("p");
          p.className = "field__error";
          field.parentNode.appendChild(p);
        }
        return p;
      }
      function clearError(field) {
        field.classList.remove("invalid");
        field.removeAttribute("aria-invalid");
        var p = field.parentNode.querySelector(".field__error");
        if (p) {
          p.remove();
        }
      }
      function reject(field, msg) {
        field.classList.add("invalid");
        field.setAttribute("aria-invalid", "true");
        errorFor(field).textContent = msg;
      }

      form.querySelectorAll("input, select").forEach(function (field) {
        field.addEventListener("input", function () {
          if (field.classList.contains("invalid")) {
            clearError(field);
          }
        });
        field.addEventListener("change", function () {
          if (field.classList.contains("invalid")) {
            clearError(field);
          }
        });
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var firstInvalid = null;

        var rules = [
          { name: "service", check: validators.service, msg: "Please choose a treatment." },
          { name: "date", check: validators.date, msg: "Please choose a date." },
          { name: "time", check: validators.time, msg: "Please choose a time slot." },
          { name: "name", check: validators.name, msg: "Please provide your name." },
          { name: "phone", check: validators.phone, msg: "Please enter a valid phone number." },
          { name: "email", check: validators.email, msg: "Please enter a valid email address." }
        ];

        rules.forEach(function (rule) {
          var field = form.querySelector('[name="' + rule.name + '"]');
          if (!field) {
            return;
          }
          clearError(field);
          if (!rule.check(field.value)) {
            reject(field, rule.msg);
            if (!firstInvalid) {
              firstInvalid = field;
            }
          }
        });

        if (firstInvalid) {
          firstInvalid.focus();
          return;
        }

        // No real booking backend: show a clear, honest confirmation that we
        // will confirm by phone, and never claim a booking has been finalized.
        form.hidden = true;
        if (success) {
          success.hidden = false;
          success.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });

      if (resetBtn) {
        resetBtn.addEventListener("click", function () {
          form.reset();
          form.hidden = false;
          if (success) {
            success.hidden = true;
          }
        });
      }
    }

    /* ---------- Footer year ---------- */
    var yearEl = d.querySelector(".year");
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  });
})();