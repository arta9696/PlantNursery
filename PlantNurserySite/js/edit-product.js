document.addEventListener("DOMContentLoaded", async () => {
    const role = getRole();

    if (role !== ROLES.MANAGER) {
        alert("Доступ запрещён");
        window.location.href = "catalog.html";
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    const form = document.querySelector(".add-product-form");
    const successMsg = document.querySelector(".form-message.success");
    const errorMsg = document.querySelector(".form-message.error");

    // --- Загрузка текущих данных товара ---
    try {
        const product = await getProductById(null, productId); // твоя функция получения товара

        document.getElementById("title").value = product.title;
        document.getElementById("description").value = product.description;
        document.getElementById("price").value = product.price;
        document.getElementById("image").value = product.image;
        document.getElementById("isActive").checked = product.is_active;

    } catch (err) {
        showError("Ошибка загрузки данных товара!");
    }

    // --- Отправка изменений ---
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const title = document.getElementById("title").value.trim();
        const description = document.getElementById("description").value.trim();
        let priceRaw = document.getElementById("price").value.trim();
        // const price = Number(priceRaw);
        const image = document.getElementById("image").value.trim();
        const isActive = document.getElementById("isActive").checked;

        if (!title || !description || !priceRaw || !image) {
            showError("Заполните все поля корректно");
            return;
        }

        // заменяем запятую на точку: поддержка 1,2 и 1.2
        priceRaw = priceRaw.replace(",", ".");
        // проверка формата
        if (!/^\d+(\.\d{1,2})?$/.test(priceRaw)) {
            showError("Введите корректную цену (например 1200,50)");
            return;
        }
        const price = Number(priceRaw);

        if (!isValidImageUrl(image)) {
            showError("Введите корректную ссылку на изображение (jpg, png, gif)");
            return;
        }

        try {
            const resStatus = await editProduct(
                productId,
                title,
                description,
                price,
                image,
                isActive
            );

            if (resStatus === 200) {
                showSuccess("Товар успешно изменен!");
                // редирект на страницу товара через 1.5 сек
                setTimeout(() => {
                    window.location.href = `product.html?id=${productId}`;
                }, 1500);
            } else if (resStatus === 409) {
                showError("Товар с таким названием уже есть в каталоге!");
            } else if (resStatus === 500) {
                showError("Внутренняя ошибка сервера. Попробуйте позже.");
            } else {
                showError("Произошла ошибка при изменении товара.");
            }
        } catch (err) {
            showError("Ошибка при редактировании товара!");
            return;
        }
    });

    function showSuccess(text) {
        successMsg.textContent = text;
        successMsg.classList.remove("hidden");
        errorMsg.classList.add("hidden");
    }

    function showError(text) {
        errorMsg.textContent = text;
        errorMsg.classList.remove("hidden");
        successMsg.classList.add("hidden");
    }
});
