// Load cart or create empty one
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
