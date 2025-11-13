document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ cart.js connected");

  // ===== Update Cart Count =====
  updateCartCount();

  // ===== Add to Cart Buttons =====
  const addButtons = document.querySelectorAll(".add-cart");
  addButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const product = btn.closest(".product-box");
      if (!product) return;

      const name = product.querySelector(".product-name")?.textContent.trim();
      const price = product.querySelector(".price")?.textContent.trim();
      const img = product.querySelector("img")?.getAttribute("src");

      addToCart({ name, price, img });
    });
  });

  // ===== Add Item Function =====
  function addToCart(item) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    showNotification(`${item.name} added to cart 🛍️`);
  }

  // ===== Notification Popup =====
  function showNotification(message) {
    const note = document.createElement("div");
    note.textContent = message;
    Object.assign(note.style, {
      position: "fixed",
      bottom: "25px",
      right: "25px",
      background: "#febd68",
      color: "#111",
      padding: "12px 18px",
      borderRadius: "8px",
      fontWeight: "600",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      opacity: "0",
      transition: "opacity 0.3s",
      zIndex: "9999"
    });
    document.body.appendChild(note);
    setTimeout(() => (note.style.opacity = "1"), 100);
    setTimeout(() => {
      note.style.opacity = "0";
      setTimeout(() => note.remove(), 400);
    }, 2500);
  }

  // ===== Update Cart Count =====
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartCount = document.querySelector("#cart-count");
    if (!cartCount) {
      const navCart = document.querySelector(".nav-cart");
      if (navCart) {
        const span = document.createElement("span");
        span.id = "cart-count";
        span.style.marginLeft = "6px";
        span.style.color = "yellow";
        span.style.fontWeight = "bold";
        span.textContent = cart.length;
        navCart.appendChild(span);
      }
    } else {
      cartCount.textContent = cart.length;
    }
  }

  // ===== Show Cart Popup =====
  const navCart = document.querySelector(".nav-cart");
  if (navCart) {
    navCart.addEventListener("click", showCartDetails);
  }

  function showCartDetails() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = document.querySelector(".cart-popup");
    if (existing) existing.remove();

    const popup = document.createElement("div");
    popup.className = "cart-popup";
    Object.assign(popup.style, {
      position: "fixed",
      top: "80px",
      right: "20px",
      width: "380px",
      maxHeight: "520px",
      overflowY: "auto",
      background: "#fff",
      border: "2px solid #febd68",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      padding: "15px",
      zIndex: "9999"
    });

    if (cart.length === 0) {
      popup.innerHTML = "<h3>Your cart is empty 🛒</h3>";
    } else {
      popup.innerHTML = `
        <h3 style="margin-bottom:10px;">🛍️ Your Cart (${cart.length})</h3>
        ${cart
          .map(
            (item) => `
          <div class="cart-item" style="display:flex; align-items:center; margin-bottom:10px; border-bottom:1px solid #ddd; padding-bottom:8px; cursor:pointer;">
            <img src="${item.img}" style="width:60px; height:60px; border-radius:6px; object-fit:cover; margin-right:10px;">
            <div>
              <p class="cart-name" style="margin:0; font-weight:bold;">${item.name}</p>
              <p class="cart-price" style="margin:0; color:#007185;">${item.price}</p>
            </div>
          </div>`
          )
          .join("")}
        <button id="clear-cart" style="width:100%; background:#f3a847; border:none; padding:10px; border-radius:8px; font-weight:bold; cursor:pointer;">🧹 Clear Cart</button>
      `;
    }

    document.body.appendChild(popup);
    

    // Click item → open order form
    popup.querySelectorAll(".cart-item").forEach((item) => {
      item.addEventListener("click", () => {
        document.getElementById("order-popup").style.display = "flex";
        document.getElementById("order-name").textContent =
          item.querySelector(".cart-name").textContent;
        document.getElementById("order-price").textContent =
          item.querySelector(".cart-price").textContent;
        document.getElementById("order-img").src =
          item.querySelector("img").src;
      });
    });

    // Clear cart
    const clearBtn = popup.querySelector("#clear-cart");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        localStorage.removeItem("cart");
        popup.remove();
        updateCartCount();
        showNotification("🧹 Cart cleared");
      });
    }

    // Close if clicked outside
    document.addEventListener("click", (e) => {
      if (!popup.contains(e.target) && !e.target.closest(".nav-cart"))
        popup.remove();
    });
  }
});

// ===== SIGN-IN POPUP =====
document.addEventListener("DOMContentLoaded", () => {
  const signIn = document.querySelector(".nav-signin");
  if (!signIn) return;

  // Create sign-in box dynamically
  let popup = document.createElement("div");
  popup.id = "signin-box";
  Object.assign(popup.style, {
    display: "none",
    position: "fixed",
    top: "90px",
    right: "25px",
    background: "#fff",
    border: "2px solid #febd68",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    padding: "15px",
    width: "300px",
    zIndex: "9999"
  });
  popup.innerHTML = `
    <h3>Create / Sign In</h3>
    <input id="signin-name" placeholder="Your Name" style="width:100%; padding:8px; margin:5px 0;">
    <input id="signin-email" placeholder="Your Email" style="width:100%; padding:8px; margin:5px 0;">
    <button id="signin-btn" style="width:100%; background:#f3a847; border:none; padding:8px; border-radius:5px; cursor:pointer; font-weight:bold;">Sign In</button>
  `;
  document.body.appendChild(popup);

  signIn.addEventListener("click", () => {
    popup.style.display = popup.style.display === "block" ? "none" : "block";
  });

  document.getElementById("signin-btn").addEventListener("click", () => {
    const name = document.getElementById("signin-name").value.trim();
    const email = document.getElementById("signin-email").value.trim();
    if (!name || !email) return alert("⚠️ Please enter both name and email");

    localStorage.setItem("username", name);
    localStorage.setItem("useremail", email);

    document.querySelector(".nav-signin p span").textContent = `Hello, ${name}`;
    document.querySelector(".nav-signin .nav-second").textContent =
      "Your Account";
    popup.style.display = "none";
  });

  document.addEventListener("click", (e) => {
    if (!popup.contains(e.target) && !signIn.contains(e.target))
      popup.style.display = "none";
  });

  // Show saved name on load
  const savedName = localStorage.getItem("username");
  if (savedName)
    document.querySelector(".nav-signin p span").textContent = `Hello, ${savedName}`;
});



document.addEventListener("DOMContentLoaded", () => {
  const ordersBtn = document.querySelector(".nav-returns");
  const ordersPopup = document.getElementById("orders-popup");
  const ordersList = document.getElementById("orders-list");
  const closeOrders = document.getElementById("close-orders");

  // 🧾 Load and show orders
  ordersBtn.addEventListener("click", () => {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    if (orders.length === 0) {
      ordersList.innerHTML = "<p>No orders placed yet 🛍️</p>";
    } else {
      ordersList.innerHTML = orders.map(order => `
        <div style="border-bottom:1px solid #ddd; padding:10px 0;">
          <p style="margin:0;"><b>${order.product}</b></p>
          <p style="margin:0;">Price: ${order.price}</p>
          <p style="margin:0;">To: ${order.name}</p>
          <p style="margin:0;">Address: ${order.address}</p>
          <p style="margin:0;">Payment: ${order.payment}</p>
        </div>
      `).join("");
    }

    ordersPopup.style.display = "flex";
  });

  // ❌ Close Orders Popup
  closeOrders.addEventListener("click", () => {
    ordersPopup.style.display = "none";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const signInBtn = document.querySelector(".nav-signin");
  const headerName = document.querySelector(".nav-signin p span");

  // create popup dynamically
  const popup = document.createElement("div");
  popup.id = "signin-popup";
  popup.style.cssText = `
    display:none;
    position:fixed;
    top:90px;
    right:25px;
    background:#fff;
    border:2px solid #febd68;
    border-radius:10px;
    box-shadow:0 4px 10px rgba(0,0,0,0.3);
    padding:15px;
    width:300px;
    z-index:9999;
  `;
  popup.innerHTML = `
    <h3>👤 Sign In / Create Account</h3>
    <input id="user-name" placeholder="Your Name" style="width:100%;padding:8px;margin:5px 0;">
    <input id="user-email" type="email" placeholder="Your Email" style="width:100%;padding:8px;margin:5px 0;">
    <button id="submit-signin" style="width:100%;background:#f3a847;border:none;padding:8px;border-radius:5px;cursor:pointer;font-weight:bold;">Sign In</button>
  `;
  document.body.appendChild(popup);

  // toggle popup
  signInBtn.addEventListener("click", () => {
    popup.style.display = popup.style.display === "block" ? "none" : "block";
  });

  // sign in button click
  document.getElementById("submit-signin").addEventListener("click", () => {
    const name = document.getElementById("user-name").value.trim();
    const email = document.getElementById("user-email").value.trim();

    if (!name || !email) {
      alert("⚠️ Please fill in both fields!");
      return;
    }

    // save info
    localStorage.setItem("username", name);
    localStorage.setItem("useremail", email);

    // update header text
    headerName.textContent = `Hello, ${name}`;
    popup.style.display = "none";
  });

  // load saved user
  const savedName = localStorage.getItem("username");
  if (savedName) headerName.textContent = `Hello, ${savedName}`;

  // close if clicked outside
  document.addEventListener("click", (e) => {
    if (!popup.contains(e.target) && !signInBtn.contains(e.target)) {
      popup.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const translations = {
    ur: {
      "Deliver to": "ترسیل کے لیے",
      "Pakistan": "پاکستان",
      "Hello, sign in": "ہیلو، سائن ان کریں",
      "Account & Lists": "اکاؤنٹ اور فہرستیں",
      "Returns": "واپسی",
      "& Orders": "آرڈرز",
      "Cart": "کارٹ",
      "Today's Deals": "آج کی آفرز",
      "Prime Video": "پرائم ویڈیو",
      "Customer Service": "کسٹمر سروس",
      "Registry": "رجسٹری",
      "Gift Cards": "تحفہ کارڈز",
      "Sell": "بیچیں",
      "Shop deals in Clothes": "کپڑوں پر آفرز دیکھیں",
      "Back to Top": "اوپر واپس جائیں",
    },
    sd: {
      "Deliver to": "پُهچائڻ لاءِ",
      "Pakistan": "پاڪستان",
      "Hello, sign in": "هيلو، سائن اِن ڪريو",
      "Account & Lists": "اڪائونٽ ۽ لسٽون",
      "Returns": "واپسيون",
      "& Orders": "آرڊر",
      "Cart": "ڪارٽ",
      "Today's Deals": "اڄ جا آفر",
      "Prime Video": "پرائم وڊيو",
      "Customer Service": "ڪسٽمر سروس",
      "Registry": "رجسٽري",
      "Gift Cards": "تحفو ڪارڊ",
      "Sell": "وڪرو ڪريو",
      "Shop deals in Clothes": "ڪپڙن تي آفر ڏسو",
      "Back to Top": "مٿي وڃو",
    },
  };

  const languageSelect = document.getElementById("language-select");

  languageSelect.addEventListener("change", () => {
    const lang = languageSelect.value;
    const dict = translations[lang];
    document.body.dir = lang === "ur" || lang === "sd" ? "rtl" : "ltr"; // 🔄 auto text direction

    if (!dict) return;

    document.querySelectorAll("p, a, span, h2, h3, button, div").forEach((el) => {
      const text = el.textContent.trim();
      if (dict[text]) el.textContent = dict[text];
    });
  });
});

