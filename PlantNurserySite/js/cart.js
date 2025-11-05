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

        products.forEach((p) => {
            const item = document.createElement("div");
            item.classList.add("cart-item");
            item.innerHTML = `
                <div class="cart-item-info">
                <div class="cart-item-title">${p.title}</div>
                <div class="cart-item-price">${p.price} ₽</div>
                </div>
                <button class="delete-btn" data-id="${p.id}">Удалить</button>
            `;
            cartContainer.appendChild(item);
        });

        // обработчик удаления
        cartContainer.addEventListener("click", async (e) => {
            if (e.target.classList.contains("delete-btn")) {
                const productId = e.target.dataset.id;
                await removeFromCart(accountId, productId); //await - window.location.href дожидается выполнения removeFromCart 
                window.location.href = "cart.html";
                return;
            }
        });

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