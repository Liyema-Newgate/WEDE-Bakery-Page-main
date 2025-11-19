let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price) {
    cart.push({ name, price });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(name + " added to cart!");
}

function loadCart() {
    let container = document.getElementById("cart-items");
    let total = 0;

    container.innerHTML = "";

    cart.forEach((item, index) => {
        total += item.price;

        container.innerHTML += `
            <div class="cart-item">
                <h3>${item.name}</h3>
                <p>Price: R${item.price}</p>
                <button onclick="removeItem(${index})">Remove</button>
            </div>
        `;
    });

    document.getElementById("cart-total").innerText = "Total: R" + total;
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

function openCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    document.getElementById("checkoutPopup").style.display = "block";
}

function confirmOrder() {
    let name = document.getElementById("name").value;
    let surname = document.getElementById("surname").value;
    let address = document.getElementById("address").value;
    let mobile = document.getElementById("mobile").value;

    if (!name || !surname || !address || !mobile) {
        alert("Please fill in all fields.");
        return;
    }

    alert("Thank you, " + name + "! Your order has been placed.");

    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));

    window.location.href = "index.html";
}
