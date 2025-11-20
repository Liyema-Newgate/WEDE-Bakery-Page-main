// script.js - final site script for wendy's sweet treats
document.addEventListener("DOMContentLoaded", () => {
  /* utilities */
  const parsePrice = (priceStr) => {
    // convert "R120" or "R 120" to number 120
    if (!priceStr) return 0;
    const num = Number(priceStr.replace(/[^0-9.-]+/g, ""));
    return Number.isFinite(num) ? num : 0;
  };

  const showToast = (msg, timeout = 1400) => {
    const t = document.createElement("div");
    t.textContent = msg;
    Object.assign(t.style, {
      position: "fixed",
      right: "18px",
      bottom: "18px",
      background: "rgba(0,0,0,0.85)",
      color: "#fff",
      padding: "10px 14px",
      borderRadius: "8px",
      zIndex: 14000,
      opacity: 0,
      transition: "opacity .18s ease, transform .18s ease"
    });
    document.body.appendChild(t);
    requestAnimationFrame(() => {
      t.style.opacity = "1";
      t.style.transform = "translateY(-6px)";
    });
    setTimeout(() => {
      t.style.opacity = "0";
      t.style.transform = "translateY(0)";
      setTimeout(() => t.remove(), 250);
    }, timeout);
  };

  /* product search & tag filtering */
  const searchInput = document.getElementById("searchInput");
  const tagButtons = document.querySelectorAll(".tag");
  const products = document.querySelectorAll(".product");

  const applyFilterAndSearch = () => {
    const q = (searchInput && searchInput.value.trim().toLowerCase()) || "";
    const activeTag = document.querySelector(".tag.active")?.dataset.tag || "all";

    products.forEach((p) => {
      const nameAttr = (p.dataset.name || p.querySelector(".product-title")?.innerText || "").toLowerCase();
      const matchesSearch = q === "" ? true : nameAttr.includes(q);
      const matchesTag = activeTag === "all" ? true : (p.dataset.tag === activeTag);
      p.style.display = (matchesSearch && matchesTag) ? "block" : "none";
    });
  };

  if (searchInput) {
    searchInput.addEventListener("input", applyFilterAndSearch);
  }

  if (tagButtons && tagButtons.length) {
    tagButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        tagButtons.forEach(t => t.classList.remove("active"));
        btn.classList.add("active");
        applyFilterAndSearch();
      });
    });
  }

  /* cart functionality */
  let cart = []; // {name, price}

  const cartModal = document.getElementById("cartModal");
  const checkoutModal = document.getElementById("checkoutModal");
  const cartItemsList = document.getElementById("cartItems");
  const cartTotalEl = document.getElementById("cartTotal");
  const openCartBtn = document.getElementById("openCartBtn");
  const closeCartBtn = document.getElementById("closeCart");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const closeCheckoutBtn = document.getElementById("closeCheckout");
  const checkoutForm = document.getElementById("checkoutForm");

  const updateCartUI = () => {
    if (!cartItemsList) return;
    cartItemsList.innerHTML = "";
    let total = 0;
    cart.forEach((item, idx) => {
      const li = document.createElement("li");
      li.textContent = `${item.name} - R${item.price}`;
      // remove button
      const rem = document.createElement("button");
      rem.textContent = "remove";
      Object.assign(rem.style, {
        marginLeft: "10px",
        padding: "4px 7px",
        borderRadius: "6px",
        cursor: "pointer",
        border: "1px solid #ccc",
        background: "transparent"
      });
      rem.addEventListener("click", () => {
        cart.splice(idx, 1);
        updateCartUI();
      });
      li.appendChild(rem);
      cartItemsList.appendChild(li);
      total += Number(item.price);
    });
    if (cartTotalEl) cartTotalEl.textContent = `total: R${total}`;
  };

  // add to cart click delegation
  document.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("addToCart")) {
      const card = e.target.closest(".product");
      const name = (card.querySelector(".product-title")?.innerText || card.dataset.name || "item").trim();
      const priceText = card.querySelector(".product-price")?.innerText || "R0";
      const price = parsePrice(priceText);
      cart.push({ name, price });
      showToast(`${name} added to cart`);
      updateCartUI();
    }
  });

  // open cart
  if (openCartBtn && cartModal) {
    openCartBtn.addEventListener("click", () => {
      updateCartUI();
      cartModal.style.display = "flex";
      cartModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  }
  if (closeCartBtn) {
    closeCartBtn.addEventListener("click", () => {
      cartModal.style.display = "none";
      cartModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    });
  }

  // open checkout
  if (checkoutBtn && checkoutModal) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Your cart is empty");
        return;
      }
      updateCartUI();
      checkoutModal.style.display = "flex";
      checkoutModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  }
  if (closeCheckoutBtn) {
    closeCheckoutBtn.addEventListener("click", () => {
      checkoutModal.style.display = "none";
      checkoutModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    });
  }

  // checkout submit
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // simple validation: rely on HTML required and pattern, but double-check
      const formElements = Array.from(checkoutForm.elements).filter(el => el.tagName === "INPUT");
      const invalid = formElements.some(el => !el.checkValidity());
      if (invalid) {
        alert("Please complete the checkout form correctly.");
        return;
      }
      alert("Thank you — your order is confirmed.");
      cart = [];
      updateCartUI();
      // close modals
      if (checkoutModal) { checkoutModal.style.display = "none"; checkoutModal.setAttribute("aria-hidden", "true"); }
      if (cartModal) { cartModal.style.display = "none"; cartModal.setAttribute("aria-hidden", "true"); }
      document.body.style.overflow = "";
    });
  }

  /* enquiry form handling */
  const enquiryForm = document.getElementById("enquiryForm");
  const enqResponse = document.getElementById("enqResponse") || document.getElementById("enquiryResponse");

  if (enquiryForm) {
    enquiryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // prefer explicit ids if available
      const name = (document.getElementById("enqName")?.value || document.getElementById("name")?.value || "").trim();
      const email = (document.getElementById("enqEmail")?.value || "").trim();
      const phone = (document.getElementById("enqPhone")?.value || "").trim();
      const type = (document.getElementById("enqType")?.value || document.getElementById("product")?.value || "");
      const message = (document.getElementById("enqQuestion")?.value || document.getElementById("question")?.value || "").trim();

      if (!name || !email || !message || !type) {
        if (enqResponse) enqResponse.innerHTML = `<p class="error">please fill in all fields.</p>`;
        return;
      }

      // create a helpful automatic reply
      let reply = "";
      const qLower = message.toLowerCase();
      if (qLower.includes("price") || qLower.includes("cost")) {
        reply = `Hi ${name}, thanks for asking. Pricing for <strong>${type}</strong> depends on size and custom options. Typical prices range from R20–R150.`;
      } else if (qLower.includes("available") || qLower.includes("stock")) {
        reply = `Hi ${name}, <strong>${type}</strong> is generally available. For bulk orders please order 24 hours ahead.`;
      } else if (qLower.includes("custom") || qLower.includes("special")) {
        reply = `Hi ${name}, we accept custom orders. A baker will contact you to discuss details and pricing.`;
      } else {
        reply = `Thanks ${name}! We received your enquiry about <strong>${type}</strong>. We'll reply to ${email} shortly.`;
      }

      if (enqResponse) {
        enqResponse.innerHTML = `<div class="success-msg">${reply}</div>`;
      }
      enquiryForm.reset();
    });
  }

  /* contact form handling (mailto compile)
     purpose: compile message, then open user's mail client to send */
  const contactForm = document.getElementById("contactForm");
  const contactResponse = document.getElementById("contactResponse");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = (document.getElementById("cname")?.value || "").trim();
      const email = (document.getElementById("cemail")?.value || "").trim();
      const phone = (document.getElementById("cphone")?.value || "").trim();
      const msgType = (document.getElementById("cmsgtype")?.value || "").trim();
      const message = (document.getElementById("cmessage")?.value || "").trim();

      if (!name || !email || !msgType || !message) {
        if (contactResponse) contactResponse.innerHTML = `<p class="error">please complete all required fields.</p>`;
        return;
      }

      // compile email body
      const recipient = "orders@wendyssweettreats.example"; // change to real recipient if needed
      const subject = encodeURIComponent(`Website message: ${msgType}`);
      const bodyLines = [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Message Type: ${msgType}`,
        "",
        "Message:",
        message
      ];
      const body = encodeURIComponent(bodyLines.join("\n"));

      const mailto = `mailto:${recipient}?subject=${subject}&body=${body}`;
      // show a confirmation then open mailto
      if (contactResponse) contactResponse.innerHTML = `<div class="success-msg">Your message is ready to send. Opening your email client...</div>`;
      // open mail client
      window.location.href = mailto;
      contactForm.reset();
    });
  }

  /* gallery lightbox */
  const setupLightbox = () => {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.querySelectorAll(".lightbox-close");

    if (!lightbox || !lightboxImg) return;

    document.querySelectorAll(".gallery-img").forEach(img => {
      // ensure cursor style even if css missing
      img.style.cursor = "zoom-in";
      img.addEventListener("click", () => {
        lightbox.style.display = "flex";
        lightbox.setAttribute("aria-hidden", "false");
        lightboxImg.src = img.src;
        // optional: caption could be set from alt text
        // document.getElementById('lightboxCaption').textContent = img.alt || '';
        document.body.style.overflow = "hidden";
      });
    });

    closeBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        lightbox.style.display = "none";
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      });
    });

    lightbox.addEventListener("click", (ev) => {
      if (ev.target === lightbox) {
        lightbox.style.display = "none";
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      }
    });
  };
  setupLightbox();

  /* accordions */
  document.querySelectorAll(".accordion-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const content = btn.nextElementSibling;
      if (!content) return;
      const isOpen = content.style.display === "block";
      // close all siblings (optional) - commented out so multiple can be open
      // document.querySelectorAll('.accordion-content').forEach(c=> c.style.display='none');
      content.style.display = isOpen ? "none" : "block";
    });
  });

  /* keyboard & window handlers */
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (cartModal) { cartModal.style.display = "none"; cartModal.setAttribute("aria-hidden", "true"); }
      if (checkoutModal) { checkoutModal.style.display = "none"; checkoutModal.setAttribute("aria-hidden", "true"); }
      const lightbox = document.getElementById("lightbox");
      if (lightbox) { lightbox.style.display = "none"; lightbox.setAttribute("aria-hidden", "true"); }
      document.body.style.overflow = "";
    }
  });

  // click outside modal to close (covers cart / checkout / lightbox)
  window.addEventListener("click", (e) => {
    const lightbox = document.getElementById("lightbox");
    if (e.target === cartModal) { cartModal.style.display = "none"; cartModal.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }
    if (e.target === checkoutModal) { checkoutModal.style.display = "none"; checkoutModal.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }
    if (lightbox && e.target === lightbox) { lightbox.style.display = "none"; lightbox.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }
  });

  // initial UI sync
  updateCartUI();
  applyFilterAndSearch();
});
