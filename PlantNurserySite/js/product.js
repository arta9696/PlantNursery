document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    const role = getRole();
    const accountId = getAccountId();

    try {
        const product = await getProductById(productId);

        // Отрисовка карточки горизонтально
        document.getElementById("item-container").innerHTML = `
            <div class="item-horizontal">
                <div class="item-image">
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <div class="item-info">
                    <h2>${product.title}</h2>
                    <p>${product.description}</p>
                    <p class="item-price"><b>Цена:</b> ${product.price} руб.</p>
                    <button id="addToCartBtn">Добавить в корзину</button>
                </div>
            </div>
        `;
        const btn = document.getElementById("addToCartBtn");

        // Проверка роли
        if (role !== ROLES.CUSTOMER) {
            btn.addEventListener("click", () => {
                alert("Необходимо выполнить вход в аккаунт.");
            });
            return;
        }

        // Если роль = Покупатель
        btn.addEventListener("click", async () => {
            try {
                const res = await addToCart(accountId, productId);
                if (res === 200) {
                    alert("Товар добавлен в корзину!");
                } else if (res === 400) { //обработка повторного добавления товара 
                    alert("Товар уже был добавлен в корзину!");
                } else {
                    alert("Товар уже добавлен в корзину или произошла ошибка.");
                }
            } catch (err) {
                console.error(err);
                alert("Ошибка при добавлении в корзину.");
            }
        });
    } catch (err) {
        list.innerHTML = `<p class="error">Ошибка загрузки товара</p>`;
    }
});
