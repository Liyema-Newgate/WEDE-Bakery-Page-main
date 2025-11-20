// cart array
let cart = [];

// helper: format price string like "R120" to number 120
function parsePrice(priceStr){
  return Number(priceStr.replace(/[^0-9.-]+/g,"")) || 0;
}

// add-to-cart handler
document.addEventListener("click", function(e){
  if(e.target && e.target.classList.contains("addToCart")){
    const card = e.target.closest(".product");
    const name = card.querySelector(".product-title").innerText.trim();
    const priceText = card.querySelector(".product-price").innerText.trim();
    const price = parsePrice(priceText);

    cart.push({ name, price });
    showToast(`${name} added to cart`);
  }
});

// simple toast notification
function showToast(msg){
  // create temporary element
  const t = document.createElement("div");
  t.textContent = msg;
  t.style.position = "fixed";
  t.style.right = "18px";
  t.style.bottom = "18px";
  t.style.background = "rgba(0,0,0,0.85)";
  t.style.color = "#fff";
  t.style.padding = "10px 14px";
  t.style.borderRadius = "8px";
  t.style.zIndex = "1400";
  t.style.opacity = "0";
  t.style.transition = "opacity .25s ease, transform .25s ease";
  document.body.appendChild(t);
  requestAnimationFrame(()=>{ t.style.opacity = "1"; t.style.transform = "translateY(-6px)"; });

  setTimeout(()=>{ t.style.opacity = "0"; t.style.transform = "translateY(0)"; setTimeout(()=>t.remove(),300); }, 1600);
}

// open cart modal
const cartModal = document.getElementById("cartModal");
const openCartBtn = document.getElementById("openCartBtn");
const closeCart = document.getElementById("closeCart");
const cartItemsList = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");

if(openCartBtn){
  openCartBtn.addEventListener("click", ()=>{
    updateCartUI();
    cartModal.setAttribute("aria-hidden","false");
    cartModal.style.display = "flex";
    document.body.style.overflow = "hidden";
  });
}
if(closeCart){
  closeCart.addEventListener("click", ()=>closeModal(cartModal));
}

// update cart UI
function updateCartUI(){
  if(!cartItemsList) return;
  cartItemsList.innerHTML = "";
  let total = 0;
  cart.forEach((item, idx) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - R${item.price}`;
    // remove button
    const rem = document.createElement("button");
    rem.textContent = "remove";
    rem.style.marginLeft = "10px";
    rem.style.background = "transparent";
    rem.style.border = "1px solid #ccc";
    rem.style.padding = "4px 8px";
    rem.style.borderRadius = "6px";
    rem.style.cursor = "pointer";
    rem.addEventListener("click", ()=>{ cart.splice(idx,1); updateCartUI(); });
    li.appendChild(rem);
    cartItemsList.appendChild(li);
    total += item.price;
  });
  cartTotalEl.textContent = `total: R${total}`;
}

// checkout modal
const checkoutModal = document.getElementById("checkoutModal");
const checkoutBtn = document.getElementById("checkoutBtn");
const closeCheckout = document.getElementById("closeCheckout");
const checkoutForm = document.getElementById("checkoutForm");

if(checkoutBtn){
  checkoutBtn.addEventListener("click", ()=>{
    if(cart.length === 0){ alert("your cart is empty"); return; }
    checkoutModal.setAttribute("aria-hidden","false");
    checkoutModal.style.display = "flex";
    document.body.style.overflow = "hidden";
  });
}
if(closeCheckout){
  closeCheckout.addEventListener("click", ()=>closeModal(checkoutModal));
}
if(checkoutForm){
  checkoutForm.addEventListener("submit", function(e){
    e.preventDefault();
    // simple validation
    const fd = new FormData(checkoutForm);
    const values = Array.from(fd.values()).map(v=>v.toString().trim());
    if(values.some(v=>v === "")){ alert("please fill all fields"); return; }

    // confirmation
    alert("thank you. your order is confirmed.");
    cart = [];
    updateCartUI();
    closeModal(checkoutModal);
    closeModal(cartModal);
  });
}

// close modal helper
function closeModal(mod){
  if(!mod) return;
  mod.setAttribute("aria-hidden","true");
  mod.style.display = "none";
  document.body.style.overflow = "";
}

// click outside to close
window.addEventListener("click", function(e){
  if(e.target === cartModal) closeModal(cartModal);
  if(e.target === checkoutModal) closeModal(checkoutModal);
  if(e.target === document.getElementById("lightbox")) closeModal(document.getElementById("lightbox"));
});

// tag filtering
document.querySelectorAll(".tag").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".tag").forEach(t=>t.classList.remove("active"));
    btn.classList.add("active");
    const tag = btn.dataset.tag;
    document.querySelectorAll(".product").forEach(p=>{
      const matches = tag === "all" || p.dataset.tag === tag;
      p.style.display = matches ? "block" : "none";
    });
  });
});

// keyword search
const searchInput = document.getElementById("searchInput");
if(searchInput){
  searchInput.addEventListener("input", ()=>{
    const q = searchInput.value.trim().toLowerCase();
    document.querySelectorAll(".product").forEach(p=>{
      const name = (p.dataset.name || p.querySelector(".product-title").innerText).toLowerCase();
      const currentTagActive = document.querySelector(".tag.active")?.dataset.tag || "all";
      const tagMatches = currentTagActive === "all" || p.dataset.tag === currentTagActive;
      const nameMatches = name.includes(q);
      p.style.display = (nameMatches && tagMatches) ? "block" : "none";
    });
  });
}

// accordions
document.querySelectorAll(".accordion-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const content = btn.nextElementSibling;
    const isOpen = content.style.display === "block";
    // close any open siblings (optional)
    // document.querySelectorAll('.accordion-content').forEach(c=>c.style.display='none');
    content.style.display = isOpen ? "none" : "block";
  });
});

// lightbox feature
document.addEventListener("DOMContentLoaded", () => {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.querySelector(".lightbox-close");

    document.querySelectorAll(".gallery-img").forEach(img => {
        img.addEventListener("click", () => {
            lightbox.style.display = "flex";
            lightboxImg.src = img.src;
        });
    });

    closeBtn.addEventListener("click", () => {
        lightbox.style.display = "none";
    });

    // close lightbox when clicking background
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = "none";
        }
    });
});

// keyboard: escape to close modals
window.addEventListener("keydown", function(e){
  if(e.key === "Escape"){
    closeModal(cartModal);
    closeModal(checkoutModal);
    closeModal(document.getElementById("lightbox"));
  }
});
