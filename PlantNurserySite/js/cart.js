document.addEventListener("DOMContentLoaded", async () => {
    const role = getRole();
    const accountId = getAccountId();

    if (role !== ROLES.CUSTOMER) {
        showNotification("Доступ разрешён только покупателям");
        window.location.href = "catalog.html";
        return;
    }

    const cartContainer = document.getElementById("cart-container");

    try {
        const products = await getCart(accountId);

        if (!products || products.length === 0) {
            cartContainer.innerHTML = "Ваша корзина пуста!";
            return;
        }

        let totalSum = 0; // итоговая сумма к заказу
        products.forEach((p) => {
            const itemTotal = p.price * p.count;
            totalSum += itemTotal;

            const item = document.createElement("div");
            item.classList.add("cart-item");
            item.innerHTML = `
                <div class="cart-item-info">
                <div class="cart-item-title">
                    <a 
                    href="product.html?id=${p.id}" 
                    class="cart-item-title cart-item-link"
                    >
                    ${p.title}
                    </a>
                </div>
                <div class="cart-item-price">${p.price} ₽</div>
                </div>
                <span class="cart-count">Количество: ${p.count} шт.</span>
                <button class="delete-btn" data-id="${p.id}">Удалить</button>
            `;
            cartContainer.appendChild(item);
        });

        cartContainer.innerHTML += `<h3 id="cart-total">Итого: ${totalSum} ₽</h3>`; //итоговая цена

        // обработчик удаления, где итого считается автоматически
        cartContainer.addEventListener("click", async (e) => {
            if (e.target.classList.contains("delete-btn")) {
                const productId = Number(e.target.dataset.id);

                try {
                    await removeFromCart(accountId, productId);

                    const cartItem = e.target.closest(".cart-item");

                    const price = Number(
                        cartItem.querySelector(".cart-item-price")
                            .innerText.replace(/\D/g, "")
                    );

                    const count = Number(
                        cartItem.querySelector(".cart-count")
                            .innerText.replace(/\D/g, "")
                    );

                    const itemSum = price * count;

                    totalSum -= itemSum;

                    cartItem.remove();

                    document.getElementById("cart-total").innerHTML =
                        `Итого: ${totalSum} ₽`;

                    if (!cartContainer.querySelector(".cart-item")) {
                        cartContainer.innerHTML = "Ваша корзина пуста!";
                        document.getElementById("cart-total").remove();
                    }

                } catch (err) {
                    console.error(err);
                    showNotification("Ошибка при удалении товара");
                }
            }
        });



        // обработчик удаления
        // cartContainer.addEventListener("click", async (e) => {
        //     if (e.target.classList.contains("delete-btn")) {
        //         const productId = e.target.dataset.id;
        //         await removeFromCart(accountId, productId); //await - window.location.href дожидается выполнения removeFromCart 
        //         window.location.href = "cart.html";
        //         return;
        //     }
        // });

        // // обработчик удаления - с доп окном подтверждения удаления
        // cartContainer.addEventListener("click", async (e) => {
        //     if (e.target.classList.contains("delete-btn")) {
        //         const productId = e.target.dataset.id;
        //         const confirmDelete = confirm("Удалить товар из корзины?");
        //         if (!confirmDelete) return;

        //         const res = removeFromCart(accountId, productId);

        //         if (res.ok) {
        //             showNotification("Товар удален");
        //             e.target.closest(".cart-item").remove();
        //             if (!cartContainer.querySelector(".cart-item")) {
        //                 emptyCart.classList.remove("hidden");
        //             }
        //         } else {
        //             showNotification("Ошибка при удалении товара");
        //         }
        //     }
        // });
    } catch (err) {
        alert("Ошибка загрузки каталога! Попробуйте позже")
        // cartContainer.innerHTML = `<p class="error">Ошибка загрузки каталога</p>`;
    }
});