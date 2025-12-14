document.addEventListener("DOMContentLoaded", () => {
    const role = getRole();

    // если роль - не менеджер, то доступ запрещен
    if (role !== ROLES.MANAGER) {
        alert("Доступ запрещён");
        window.location.href = "catalog.html";
        return;
    }

    const form = document.querySelector(".add-product-form");
    const successMsg = document.querySelector(".form-message.success");
    const errorMsg = document.querySelector(".form-message.error");

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // чтобы страница не перезагружалась

        // --- получаем значения ---
        const title = document.getElementById("title").value.trim();
        const description = document.getElementById("description").value.trim();
        const image = document.getElementById("image").value.trim();
        const isActive = document.getElementById("isActive").checked;

        let priceRaw = document.getElementById("price").value.trim();

        // --- валидация ---
        if (!title || !description || !priceRaw || !image) {
            showError("Заполните все поля!")
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
            const resStatus = await addProduct(title, description, price, image, isActive);
            // form.reset();
            if (resStatus === 200) {
                showSuccess("Товар добавлен в каталог!");
                // редирект в каталог через 1.5 сек
                setTimeout(() => {
                    window.location.href = "catalog.html";
                }, 1500);
            } else if (resStatus === 409) {
                showError("Товар с таким названием уже есть в каталоге!");
            } else if (resStatus === 500) {
                showError("Внутренняя ошибка сервера. Попробуйте позже.");
            } else {
                showError("Произошла ошибка при добавлении товара.");
            }
        } catch (err) {
            showError("Ошибка при добавлении товара");
            return;
        }
    });
});