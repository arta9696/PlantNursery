document.addEventListener("DOMContentLoaded", async () => {
    const role = getRole();
    const accountId = getAccountId();

    if (role !== ROLES.CUSTOMER) {
        showNotification("Доступ разрешён только покупателям");
        window.location.href = "catalog.html";
        return;
    }

    const cartContainer = document.getElementById("add-order-cart-container");

    try {
        const products = await getCart(accountId);

        if (!products || products.length === 0) {
            cartContainer.innerHTML = `
                <div class="add-order-cart-empty">
                    <h2>Ваша корзина пуста!</h2>
                    <p>Добавьте товары из каталога, чтобы сделать заказ</p>
                    <a href="catalog.html" class="add-order-btn-primary">Перейти в каталог</a>
                </div>
            `;
            return;
        }

        let totalSum = 0;
        const orderItems = [];

        products.forEach((p) => {
            const itemTotal = p.price * p.count;
            totalSum += itemTotal;

            orderItems.push({
                productId: p.id,
                priceAtMoment: p.price,
                count: p.count
            });

            const item = document.createElement("div");
            item.classList.add("add-order-cart-item");
            item.innerHTML = `
                <div class="add-order-cart-item-info">
                    <div class="add-order-cart-item-title">
                        <a href="product.html?id=${p.id}" class="add-order-cart-item-link">
                            ${p.title}
                        </a>
                    </div>
                    <div class="add-order-cart-item-price">${p.price} ₽</div>
                </div>
                <span class="add-order-cart-count">Количество: ${p.count} шт.</span>
                <button class="add-order-delete-btn" data-id="${p.id}">Удалить</button>
            `;
            cartContainer.appendChild(item);
        });

        // Добавляем итоговую сумму и кнопку оформления
        const totalElement = document.createElement("div");
        totalElement.className = "add-order-cart-total";
        totalElement.innerHTML = `
            <h3 id="add-order-cart-total">Итого: ${totalSum} ₽</h3>
            <button id="add-order-checkout-btn" class="add-order-btn-primary">Оформить заказ</button>
        `;
        cartContainer.appendChild(totalElement);

        // Обработчик удаления товара
        cartContainer.addEventListener("click", async (e) => {
            if (e.target.classList.contains("add-order-delete-btn")) {
                const productId = Number(e.target.dataset.id);

                try {
                    await removeFromCart(accountId, productId);

                    const cartItem = e.target.closest(".add-order-cart-item");
                    const price = Number(
                        cartItem.querySelector(".add-order-cart-item-price")
                            .innerText.replace(/\D/g, "")
                    );
                    const count = Number(
                        cartItem.querySelector(".add-order-cart-count")
                            .innerText.replace(/\D/g, "")
                    );
                    const itemSum = price * count;

                    totalSum -= itemSum;
                    cartItem.remove();

                    document.getElementById("add-order-cart-total").innerHTML = `Итого: ${totalSum} ₽`;

                    // Если корзина пуста, показываем сообщение
                    if (!cartContainer.querySelector(".add-order-cart-item")) {
                        cartContainer.innerHTML = `
                            <div class="add-order-cart-empty">
                                <h2>Ваша корзина пуста!</h2>
                                <p>Добавьте товары из каталога, чтобы сделать заказ</p>
                                <a href="catalog.html" class="add-order-btn-primary">Перейти в каталог</a>
                            </div>
                        `;
                    }

                } catch (err) {
                    console.error(err);
                    showNotification("Ошибка при удалении товара");
                }
            }
        });

        // Инициализация модальных окон
        initAddOrderCheckoutModal(accountId, orderItems, totalSum);

    } catch (err) {
        console.error(err);
        cartContainer.innerHTML = `
            <div class="add-order-cart-error">
                <p>Ошибка загрузки корзины</p>
                <button onclick="location.reload()" class="add-order-btn-secondary">Попробовать снова</button>
            </div>
        `;
    }
});

// Инициализация модального окна оформления заказа
function initAddOrderCheckoutModal(accountId, orderItems, totalSum) {
    const checkoutModal = document.getElementById("add-order-checkout-modal");
    const profileConfirmModal = document.getElementById("add-order-profile-confirm-modal");
    const successModal = document.getElementById("add-order-success-modal");
    const checkoutForm = document.getElementById("add-order-checkout-form");

    let currentProfileData = null;
    let checkoutData = null;

    // Функции для управления модальными окнами
    function showAddOrderModal(modal) {
        if (!modal) {
            console.error("showAddOrderModal: modal is null!");
            return;
        }

        modal.classList.remove('add-order-modal-hidden');
        modal.classList.add('add-order-modal-active');
        document.body.style.overflow = 'hidden';
    }

    function hideAddOrderModal(modal) {
        if (!modal) return;

        modal.classList.remove('add-order-modal-active');
        modal.classList.add('add-order-modal-hidden');
        document.body.style.overflow = 'auto';
    }

    function hideAllAddOrderModals() {
        [checkoutModal, profileConfirmModal, successModal].forEach(hideAddOrderModal);
    }

    // Закрытие модальных окон
    document.querySelectorAll('.add-order-modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            hideAllAddOrderModals();
        });
    });

    // Клик вне модального окна
    document.querySelectorAll('.add-order-modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                hideAllAddOrderModals();
            }
        });
    });

    // Обработчик кнопки оформления заказа
    document.addEventListener('click', async (e) => {
        if (e.target && e.target.id === 'add-order-checkout-btn') {
            e.preventDefault();

            try {
                // Получаем данные профиля
                currentProfileData = await getProfile(accountId);

                // Заполняем форму данными из профиля
                document.getElementById('add-order-full-name').value = currentProfileData.fullName || '';
                document.getElementById('add-order-address').value = currentProfileData.address || '';

                showAddOrderModal(checkoutModal);
            } catch (error) {
                console.error('Ошибка загрузки профиля:', error);
                showNotification('Не удалось загрузить данные профиля');
            }
        }
    });

    // Обработка формы оформления заказа
    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Валидация формы
        const fullName = document.getElementById('add-order-full-name').value.trim();
        const address = document.getElementById('add-order-address').value.trim();
        let isValid = true;

        // Очистка предыдущих ошибок
        document.getElementById('add-order-full-name-error').textContent = '';
        document.getElementById('add-order-address-error').textContent = '';

        // Проверка ФИО
        if (!fullName) {
            document.getElementById('add-order-full-name-error').textContent = 'Поле ФИО обязательно для заполнения';
            isValid = false;
        } else if (fullName.length < 2) {
            document.getElementById('add-order-full-name-error').textContent = 'ФИО должно содержать минимум 2 символа';
            isValid = false;
        }

        // Проверка адреса
        if (!address) {
            document.getElementById('add-order-address-error').textContent = 'Поле адреса обязательно для заполнения';
            isValid = false;
        } else if (address.length < 10) {
            document.getElementById('add-order-address-error').textContent = 'Адрес должен содержать минимум 10 символов';
            isValid = false;
        }

        if (!isValid) return;

        // Сохраняем данные для оформления заказа
        checkoutData = {
            accountId,
            fullName,
            address,
            items: orderItems,
            totalSum
        };

        // Проверяем, изменились ли данные профиля
        const isProfileChanged = (
            fullName !== (currentProfileData?.fullName || '') ||
            address !== (currentProfileData?.address || '')
        );

        if (isProfileChanged) {
            // Показываем окно подтверждения обновления профиля
            hideAddOrderModal(checkoutModal);
            showAddOrderModal(profileConfirmModal);
        } else {
            // Данные не изменились, сразу оформляем заказ
            hideAddOrderModal(checkoutModal);
            await createAddOrderOrder(checkoutData, false);
        }
    });

    // Обработка кнопок отклонение обновления профиля - обновить профиль
    document.getElementById('add-order-cancel-profile-update').addEventListener('click', async () => {
        hideAddOrderModal(profileConfirmModal);
        await createAddOrderOrder(checkoutData, false);
    });

    // Обработка кнопок подтверждения обновления профиля - не обновлять профиль
    document.getElementById('add-order-confirm-profile-update').addEventListener('click', async () => {
        hideAddOrderModal(profileConfirmModal);
        await createAddOrderOrder(checkoutData, true);
    });

    // Обработка успешного завершения
    document.getElementById('add-order-success-ok-btn').addEventListener('click', () => {
        hideAllAddOrderModals();
        window.location.href = 'orders.html';
    });

    // Функция создания заказа
    async function createAddOrderOrder(orderData, editProfile) {
        try {
            // Если нужно обновить профиль
            if (editProfile && currentProfileData) { 
                try {
                    await updateProfile(accountId, currentProfileData.email, orderData.fullName, orderData.address, currentProfileData.password);
                } catch (profileError) {
                    alert('Ошибка обновления профиля!');
                    return;
                }
            }
            // Создаем заказ
            // alert(JSON.stringify(orderData));
            const response_status = await createOrder(orderData);

            if (response_status === 200) {
                // Очищаем корзину после успешного оформления
                try {
                    await clearAddOrderCart(accountId);
                } catch (cartError) {
                    alert('Ошибка очистки корзины!');
                }

                // Показываем окно успеха
                showAddOrderModal(successModal);
            } else {
                alert('Ошибка создания заказа. Попробуйте позже.');
            }

        } catch (error) {
            console.error('Ошибка создания заказа:', error);
            showNotification('Не удалось оформить заказ. Попробуйте позже.');
            hideAllAddOrderModals();
        }
    }
}

// Функция очистки корзины
async function clearAddOrderCart(accountId) {
    const cartItems = await getCart(accountId);

    for (const item of cartItems) {
        await removeFromCart(accountId, item.id);
    }
}

// Функция показа уведомлений
function showNotification(message, type = 'error') {
    // Удаляем старое уведомление
    const oldNotification = document.querySelector('.add-order-notification');
    if (oldNotification) {
        oldNotification.remove();
    }

    // Создаем новое уведомление
    const notification = document.createElement('div');
    notification.className = `add-order-notification add-order-notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Автоматическое удаление через 5 секунд
    setTimeout(() => {
        notification.remove();
    }, 5000);
}