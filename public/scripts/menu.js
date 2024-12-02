console.log("menu.js loaded");



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
async function displayProducts() {
    const productList = await fetchProducts();
    console.log("Displaying Products:", productList);//jeg tjekker om billederne behandles korrekt, da de mangler i /menu men ikke /produkter
    const productContainer = document.getElementById("product-list");

    productContainer.innerHTML = ""; 

    productList.forEach(product => {
        const productItem = document.createElement("div");
        productItem.classList.add("product-item");

        const img = document.createElement("img");
        img.src = product.imgsrc;
        img.alt = product.productName;

        const productName = document.createElement("h3");
        productName.innerText = product.productName;

        productItem.appendChild(img);
        productItem.appendChild(productName);
        productContainer.appendChild(productItem);
    });
}

document.addEventListener('DOMContentLoaded', displayProducts);

