document.addEventListener('DOMContentLoaded', async () => {
    const role = getRole();

    if (role === ROLES.MANAGER) {
        const btn = document.getElementById("add-product-btn");
        btn.classList.remove("hidden");

        btn.addEventListener("click", () => {
            window.location.href = "add-product.html";
        });
    }
    
    await loadCatalog();
});

// === Каталог ===
async function loadCatalog() {
    const list = document.getElementById('catalog-container');
    list.innerHTML = '<p>Загрузка товаров...</p>';

    try {
        const products = await getProducts();
        list.innerHTML = '';

        products.forEach((p) => {
            const card = document.createElement("div");
            card.className = "product-card";

            // содержит описание
            // card.innerHTML = `
            //     <img src="${p.image}" alt="${p.title}" class="product-image">
            //     <h3 class="product-title">${p.title}</h3>
            //     <p class="product-desc">${p.description}</p>
            //     <p class="product-price">${p.price} ₽</p>
            //     `;

            card.innerHTML = `
                <img src="${decodePossiblyEncodedString(p.image)}" alt="${p.title}" class="product-image">
                <h3 class="product-title">${p.title}</h3>
                <p class="product-price">${p.price} ₽</p>
                `;

            // обработчик клика на названии
            card.querySelector(".product-title").addEventListener("click", () => {
                window.location.href = `product.html?id=${p.id}`;
            });

            list.appendChild(card);
        });
    } catch (err) {
        list.innerHTML = `<p class="error">Ошибка загрузки каталога</p>`;
    }
}
