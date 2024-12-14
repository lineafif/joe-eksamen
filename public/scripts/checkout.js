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
        "København",
        "Frederiksberg",
        "Charlottenlund",
        "Farum",
        "Gentofte",
        "Herning",
        "Holte",
        "Hørsholm",
        "Kastrup",
        "Odense",
        "Kolding",
        "Roskilde",
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

    const confirmOrderButton = document.getElementById("confirm-order-button");

    confirmOrderButton.addEventListener("click", async () => { 
        const selectedStore = storeDropdown.value;
    
        if (cart.length === 0) {
            alert("Your cart is empty. Please add items to your cart before confirming your order.");
            return;
        }
    
        if (!selectedStore) {
            alert("Please select a store before confirming your order.");
            return;
        }

        // Get the user ID from the cookie
        const userId = getCookie("userId");

        if (!userId) {
            alert("You must be logged in to place an order.");
            window.location.href = '/'; // Redirect to login page
            return;
        }

        try {
            // Send the order confirmation request to the backend
            const response = await fetch('/send-order-confirmation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, storeName: selectedStore })
            });

            const result = await response.json();

            if (result.success) {
                //  Add stamp for the user
                await addStampForUser(userId, selectedStore);
                
                //  Notify the user that the order was successful and messages were sent
                alert('Order confirmed. You have received 2 SMS messages and a new stamp has been added.');
                
                // Clear the cart
                localStorage.removeItem('cart');
                
                // Redirect back to the menu
                window.location.href = '/menu'; 
            } else {
                alert('Failed to send SMS. Please try again later.');
            }
        } catch (error) {
            console.error('Error during checkout:', error);
            alert('An error occurred.');
        }
    });

    //  Add a stamp for the user

async function addStampForUser(userId, storeName) {
  const token = await firebase.auth().currentUser.getIdToken(); // Get Firebase Auth token
  const response = await fetch("/add-stamp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Include token in header
    },
    body: JSON.stringify({ userId, storeName }),
  });

  const result = await response.json();
  if (result.success) {
    console.log(`Stamp successfully added for user: ${userId} for store: ${storeName}`);
  } else {
    console.error("Failed to add stamp:", result.error);
  }
}


    // Add Return to Menu functionality
    const returnMenuButton = document.getElementById("return-menu-button");
    returnMenuButton.addEventListener("click", () => {
        window.location.href = "/menu"; 
    });
});

