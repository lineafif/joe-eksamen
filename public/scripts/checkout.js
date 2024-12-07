document.addEventListener('DOMContentLoaded', () => {
    const cartSummaryItems = document.getElementById("cart-summary-items");
    const cartSummaryTotal = document.getElementById("cart-summary-total");
    const storeDropdown = document.getElementById("store-dropdown");

    // Helper function to get the value of a cookie
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // Check if the user is logged in by looking for the "isLoggedIn" cookie
    const isLoggedIn = getCookie("isLoggedIn");

    // If the user is not logged in, redirect them to the home page (login page)
    if (!isLoggedIn) {
        alert("You must log in to confirm your order.");
        window.location.href = "/"; // Redirect to the home page (login page)
        return; // Prevent further execution
    }

    // Hardcoded list of Joe & The Juice stores in Denmark
    const stores = [
        "Joe & The Juice - Copenhagen Airport",
        "Joe & The Juice - Østerbro",
        "Joe & The Juice - Frederiksberg",
        "Joe & The Juice - Aarhus City",
        "Joe & The Juice - Odense Central",
        "Joe & The Juice - Aalborg",
        "Joe & The Juice - Vesterbro",
        "Joe & The Juice - Nyhavn",
        "Joe & The Juice - Fields",
        "Joe & The Juice - Fisketorvet",
        "Joe & The Juice - Roskilde",
        "Joe & The Juice - Lyngby",
        "Joe & The Juice - Hellerup",
        "Joe & The Juice - Kolding Storcenter",
        "Joe & The Juice - Randers",
        "Joe & The Juice - Herning",
        "Joe & The Juice - Esbjerg",
        "Joe & The Juice - Viborg",
        "Joe & The Juice - Silkeborg",
        "Joe & The Juice - Svendborg",
        "Joe & The Juice - Nørreport",
        "Joe & The Juice - Kongens Nytorv",
        "Joe & The Juice - Amager Strand",
        "Joe & The Juice - Valby",
        "Joe & The Juice - Hørsholm",
        "Joe & The Juice - Ballerup",
        "Joe & The Juice - Greve"
    ];

    // Dynamically populate dropdown menu with a placeholder
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.innerText = "Select a store...";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    storeDropdown.appendChild(placeholderOption);

    stores.forEach(store => {
        const option = document.createElement("option");
        option.value = store;
        option.innerText = store;
        storeDropdown.appendChild(option);
    });

    // Display cart contents
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        cartSummaryItems.innerHTML = "<p>Your cart is empty.</p>";
        cartSummaryTotal.innerText = "Total: $0.00";
    } else {
        let total = 0;

        cart.forEach(item => {
            const li = document.createElement("li");
            li.innerText = `${item.productName} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;
            cartSummaryItems.appendChild(li);

            total += item.price * item.quantity;
        });

        cartSummaryTotal.innerText = `Total: $${total.toFixed(2)}`;
    }

    // Handle store selection and confirm order button
    storeDropdown.addEventListener("change", () => {
        const selectedStore = storeDropdown.value;
        console.log(`Selected store: ${selectedStore}`);
    });

    // Add Confirm Order functionality
    const confirmOrderButton = document.getElementById("confirm-order-button");
    confirmOrderButton.addEventListener("click", () => {
        const selectedStore = storeDropdown.value;

        if (cart.length === 0) {
            alert("Your cart is empty. Please add items to your cart before confirming your order.");
            return;
        }

        if (!selectedStore) {
            alert("Please select a store before confirming your order.");
            return;
        }

        // Clear the cart
        localStorage.removeItem("cart");

        // Confirmation message
        alert(`Your order has been confirmed! You can pick it up at ${selectedStore}.`);
        window.location.href = "/menu"; // Redirect back to the menu
    });

    // Add Return to Menu functionality
    const returnMenuButton = document.getElementById("return-menu-button");
    returnMenuButton.addEventListener("click", () => {
        window.location.href = "/menu"; // Redirect back to the menu
    });
});
