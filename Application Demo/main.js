let cart = JSON.parse(localStorage.getItem("cart")) || [];

function initialzeApp() {
    fetch("products.json")
        .then((response) => response.json())
        .then((products) => {
            let allProducts = products;
            renderCategories(allProducts);
            getProducts(products);
        })
        .catch((error) => {
            console.error("Error Fetching Products:", error);
        })
}
document.addEventListener("DOMContentLoaded", initialzeApp);

function renderCategories(products) {
    // Add Products In Variable
    const categories = [...new Set(products.map((product) => product.category))];
    const navbar = document.getElementById("navbar");

    function apdateActiveCategory(activeItem) {
        const navbarItems = navbar.querySelectorAll(".nav-item");
        navbarItems.forEach((item) => item.classList.remove("active"));
        activeItem.classList.add("active");
    }

    // Add All Products
    const allProducts = document.createElement("li");
    allProducts.textContent = "All Products";
    allProducts.className = "nav-item active";
    allProducts.addEventListener("click", (item) => {
        apdateActiveCategory(allProducts);
        getProducts(products);
    })
    navbar.appendChild(allProducts);

    // Add All Categories
    categories.forEach(category => {
        const navItem = document.createElement("li");
        navItem.textContent = category;
        navItem.className = "nav-item";
        navItem.addEventListener("click", (item) => {
        apdateActiveCategory(navItem);
        const filterProduct = products.filter((product) => product.category === category)
        getProducts(filterProduct);
    })
        navbar.appendChild(navItem);
    })

    // const allNavItem = document.querySelectorAll("#navbar li");

    // allNavItem.forEach((li) => {
    //     li.addEventListener("click", (e) => {
    //         allNavItem.forEach(li => {
    //             li.classList.remove("active")
    //         });
    //         e.target.classList.add("active")
    //     })
    // })
    
}

function getProducts(products) {
    const productList = document.getElementById("product-list")
    productList.innerHTML = ""
    products.forEach((product) => {

        const cartItem = cart.find((item) => item.id === product.id.toString());
        const inCartItem = cartItem? cartItem.quantity : 0;

        const div = document.createElement("div");
        div.className = "product";
        div.innerHTML = `
            <div class="id">#${product.id}</div>
            <img src="${product.img}" alt="Not Found">
            <h2>${product.title}</h2>
            <p>${product.description}</p>
            <div class="info-container">
                <span class="price">$${product.price}</span>
                <span class="in-cart-amount">${inCartItem > 0? `[ <span>${inCartItem}</span> In Cart]` : ""}</span>
            </div>
            <button data-id="${product.id}" data-title="${product.title}" data-price="${product.price}">
                Add To Cart
            </button>
        `;
        productList.appendChild(div)
    })

    const allButtons = document.querySelectorAll("button[data-id]");
    allButtons.forEach((button) => {
        button.addEventListener("click", addToCart)
    })
    updateCart()
    updateProductCards()
}

function addToCart(event) {
    const button = event.target;
    const id = button.getAttribute("data-id");
    const title = button.getAttribute("data-title");
    const price = button.getAttribute("data-price");

    const existingItem = cart.find((item) => item.id === id);

    if (existingItem) {
        existingItem.quantity++
    } else {
        cart.push({id, title, price, quantity: 1})
    }

    // Add To LocalStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    updateCart();
}

function updateCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.querySelector(".cart-total")

    cartItems.innerHTML = "";

    cart.forEach((item) => {
        const cartItem = document.createElement("li");
        cartItem.innerHTML = `
                <div>
                    <h4>${item.title}</h4>
                    <span>$${item.price} x ${item.quantity}</span>
                </div>
                <button class="delete-btn" data-id="${item.id}">Delete</button>
        `
        cartItems.appendChild(cartItem)
    })

    const allDeleteBtn = document.querySelectorAll(".delete-btn");
    allDeleteBtn.forEach((button) => {
        button.addEventListener("click", removeFromCart);
    })

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = total.toFixed(2);

    updateProductCards()
}

function removeFromCart(event) {
    const button = event.target;
    const id = button.getAttribute("data-id");

    cart = cart.filter((button) => button.id !== id);

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
    updateProductCards()
}

function updateProductCards() {
    const productsCards = document.querySelectorAll(".product");

    productsCards.forEach((card) => {
        const id = card.querySelector("button").getAttribute("data-id");
        const productAmount = card.querySelector(".in-cart-amount");
        const cartItem = cart.find((item) => item.id === id);

        if (cartItem) {
            productAmount.innerHTML = `[ <span>${cartItem.quantity}</span> In Cart]`;
        } else {
            productAmount.innerHTML = "";
        }
    })
}