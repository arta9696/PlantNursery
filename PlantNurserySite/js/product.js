document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    const role = getRole();
    const accountId = getAccountId();

    try {
        const product = await getProductById(ROLES.CUSTOMER ? getAccountId() : null, productId);

        const isInStock = product.isActive === true;                    // в наличии или нет
        const maxCount =                                                // максимальное число, которе можно добавить в корзину
            product.allowedCount && product.allowedCount > 0
            ? product.allowedCount 
            : 1;

            document.getElementById("item-container").innerHTML = `
                <div class="item-horizontal">
                    <div class="item-image">
                        <img src="${product.image?.url || product.image}" alt="${product.title}">
                    </div>

                    <div class="item-info">
                        <h2>${product.title}</h2>
                        <p>${product.description}</p>
                        <p class="item-price"><b>Цена:</b> ${product.price} руб.</p>

                        ${
                            isInStock
                                ? `
                                    <div class="quantity-wrapper">
                                        <span class="quantity-label">Количество товара</span>
                                        <div class="quantity-control">
                                            <button id="minusBtn">−</button>
                                            <input
                                                id="quantityInput"
                                                type="number"
                                                value="1"
                                                min="1"
                                                max="${maxCount}"
                                                readonly
                                            >
                                            <button id="plusBtn">+</button>
                                        </div>
                                    </div>
                                    <button id="addToCartBtn">Добавить в корзину</button>
                                `
                                : `
                                    <p class="out-of-stock">Нет в наличии</p>
                                    <button id="notifyBtn">Уведомить о поступлении</button>
                                `
                        }
                    </div>
                </div>
            `;

        // Если товара нет в наличии
        if (!isInStock) {
            const notifyBtn = document.getElementById("notifyBtn");

            notifyBtn.addEventListener("click", async () => {
                if (role !== ROLES.CUSTOMER) {
                    alert("Войдите в аккаунт, чтобы получать уведомления");
                    return;
                }
                
                try {
                    await notifyWhenInStock(accountId, productId);
                } catch (error) {
                    console.error("Ошибка при подписке на уведомление:", error);
                    alert("Не удалось подписаться на уведомление. Попробуйте позже.");
                }
            });

            return; // важно! дальше код для корзины не выполняется
        }

        // Если товар есть в наличии
        const btn = document.getElementById("addToCartBtn"); //кнопка "Добавить в корзину"
        const minusBtn = document.getElementById("minusBtn"); //кнопка уменьшения кол-ва товара
        const plusBtn = document.getElementById("plusBtn"); //кнопка увеличения кол-ва товара
        const quantityInput = document.getElementById("quantityInput"); //поле с числом товара

        // Проверка значения, которое Пользователи вручную вводят в числовой инпут quantityInput - нельзя ввести отрицаиельное или 0
        quantityInput.addEventListener("input", () => {
            let value = Number(quantityInput.value);

            if (isNaN(value) || value < 1) {
                quantityInput.value = 1;
                return;
            }

            if (value > maxCount) {
                quantityInput.value = maxCount;
            }
        });


        // Проверка роли
        if (role !== ROLES.CUSTOMER) {
            btn.addEventListener("click", () => {
                alert("Необходимо выполнить вход в аккаунт.");
            });
            return;
        }

        // Если роль = Покупатель
        plusBtn.addEventListener("click", () => {
            let value = Number(quantityInput.value);
            if (value < maxCount) {
                quantityInput.value = value + 1;
            }
        });

        minusBtn.addEventListener("click", () => {
            let value = Number(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
            }
        });

        btn.addEventListener("click", async () => {
            const count = Number(quantityInput.value);
            try {
                const res = await addToCart(accountId, productId, count);
            } catch (err) {
                console.error(err);
                alert("Ошибка при добавлении в корзину.");
            }
        });
    } catch (err) {
        list.innerHTML = `<p class="error">Ошибка загрузки товара</p>`;
    }
});
