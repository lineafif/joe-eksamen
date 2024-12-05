console.log("menu.js loaded");

let cart = []; // Handlekurv

// Henter produkter fra serveren
async function fetchProducts() {
    try {
        const response = await fetch('/products');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const productList = await response.json();
        return productList;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}



// Viser produkter på siden
async function displayProducts() {
    const productList = await fetchProducts();
    console.log("Displaying Products:", productList);
    const productContainer = document.getElementById("product-list");

    productContainer.innerHTML = "";

    if (productList.length === 0) {
        productContainer.innerHTML = "<p>No products available. Please check back later!</p>";
        return;
    }

    productList.forEach(product => {
        const productItem = document.createElement("div");
        productItem.classList.add("product-item");
    
        const img = document.createElement("img");
        img.src = product.imgsrc;
        img.alt = product.productName || "Product image";
    
        // Fallback for image if not available
        img.onerror = () => {
            img.src = '/static/img/placeholder.png'; // Fallback image
        };
    
        const productName = document.createElement("h3");
        productName.innerText = product.productName || "Unnamed Product"; // Fallback if name is missing
    
        // Ensure price is always a valid number
        const productPrice = document.createElement("p");
        const price = product.price !== undefined && product.price !== null ? product.price.toFixed(2) : "5.99"; // Default to $5.99 if price is missing
        productPrice.innerText = `$${price}`;
    
        const addToCartButton = document.createElement("button");
        addToCartButton.innerText = "Add to Cart";
        addToCartButton.onclick = () => addToCart(product);
    
        // Append elements to product item
        productItem.appendChild(img);
        productItem.appendChild(productName);
        productItem.appendChild(productPrice);
        productItem.appendChild(addToCartButton);
    
        // Append the product item to the container
        productContainer.appendChild(productItem);
    });
    
}


// Legger til et produkt i handlekurven
function addToCart(product) {
    const existingProduct = cart.find(item => item.productName === product.productName);

    if (existingProduct) {
        existingProduct.quantity += 1; // Øker antall
    } else {
        cart.push({ ...product, quantity: 1 }); // Legger til nytt produkt
    }

    updateCart();
}

// Fjerner et produkt fra handlekurven
function removeFromCart(productName) {
    const productIndex = cart.findIndex(item => item.productName === productName);

    if (productIndex !== -1) {
        cart[productIndex].quantity -= 1;

        if (cart[productIndex].quantity === 0) {
            cart.splice(productIndex, 1); // Fjern produktet helt hvis antall er 0
        }
    }

    updateCart();
}

// Oppdaterer handlekurven
function updateCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotalContainer = document.getElementById("cart-total");

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        cartTotalContainer.innerText = "Total: $0";
        return;
    }

    let total = 0;

    cart.forEach(item => {
        const cartItem = document.createElement("li");

        const productText = document.createElement("span");
        productText.innerText = `${item.productName} x ${item.quantity} - $${(item.quantity * item.price).toFixed(2)}`;

        const removeButton = document.createElement("button");
        removeButton.innerText = "Remove";
        removeButton.onclick = () => removeFromCart(item.productName);

        cartItem.appendChild(productText);
        cartItem.appendChild(removeButton);
        cartItemsContainer.appendChild(cartItem);

        total += item.quantity * item.price;
    });

    cartTotalContainer.innerText = `Total: $${total.toFixed(2)}`;
}



// Initialiserer siden
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    updateCart(); // Viser tom handlekurv ved oppstart
});

// Redirect to checkout page with cart data
document.querySelector('.checkout-button').onclick = () => {
    localStorage.setItem("cart", JSON.stringify(cart)); // Lagre handlekurvdata i localStorage
    window.location.href = "/checkout"; // Gå til checkout-siden
  };
  