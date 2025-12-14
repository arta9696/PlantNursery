document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("favorites-container");

    const role = getRole();
    const accountId = getAccountId();

    if (role !== ROLES.CUSTOMER) {
        showNotification("Доступ разрешён только покупателям");
        window.location.href = "catalog.html";
        return;
    }

    try {
        const data = await getFavoriteProducts(accountId);
        const products = data.products;

        if (!products || products.length === 0) {
            showMessage(container, "Ваш список избранного пуст");
            return;
        }

        products.forEach(product => {
            container.appendChild(renderFavoriteProduct(product));
        });

    } catch (error) {
        console.error(error);
        showMessage(
            container,
            "Не удалось загрузить избранное. Попробуйте обновить страницу",
            true
        );
    }
});

function renderFavoriteProduct(product) {
    const div = document.createElement("div");
    div.className = "favorite-item";

    div.innerHTML = `
        <div class="favorite-info">
            <a href="product.html?id=${product.id}" class="favorite-title">
                ${product.title}
            </a>
            <p class="favorite-price">${product.price} ₽</p>
        </div>
    `;

    return div;
}

function showMessage(container, text, isError = false) {
    const message = document.createElement("p");
    message.textContent = text;
    message.className = isError ? "error-message" : "empty-message";
    container.appendChild(message);
}

