document.addEventListener('DOMContentLoaded', async () => {
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
                <img src="${p.image}" alt="${p.title}" class="product-image">
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

// async function loadCatalog() {
//     const list = document.getElementById('product-list');
//     list.innerHTML = '<p>Загрузка товаров...</p>';

//     try {
//         const products = await getProducts();
//         list.innerHTML = '';

//         const total = products.length;
//         let cols = Math.ceil(Math.sqrt(total)); // примерно квадратная сетка
//         if (cols > 5) cols = 5; // максимум 5 столбцов

//         // создаём сетку
//         list.style.display = "grid";
//         list.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
//         list.style.gap = "20px";
//         list.style.justifyItems = "center";

//         products.forEach((p) => {
//             const card = document.createElement("div");
//             card.className = "product-card";

//             card.innerHTML = `
//                 <img src="${p.image}" alt="${p.title}" class="product-image">
//                 <h3 class="product-title">${p.title}</h3>
//                 <p class="product-desc">${p.description}</p>
//                 <p class="product-price">${p.price} ₽</p>
//                 `;

//             // обработчик клика на названии
//             card.querySelector(".product-title").addEventListener("click", () => {
//                 window.location.href = `product.html?id=${p.id}`;
//             });

//             list.appendChild(card);
//         });

//     } catch (err) {
//         list.innerHTML = `<p class="error">Ошибка загрузки каталога</p>`;
//     }
// }
