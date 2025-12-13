document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Очистка ошибок
        emailError.textContent = "";
        passwordError.textContent = "";

        // Проверка e-mail
        if (!email.includes("@")) {
            emailError.textContent = "Некорректный адрес почты";
            return;
        }

        // Проверка пароля (латинские буквы и цифры, длина 7-10)
        const passwordRegex = /^[A-Za-z0-9]{7,10}$/;
        if (!passwordRegex.test(password)) {
            passwordError.textContent = "Пароль должен содержать 7–10 латинских символов или цифр";
            return;
        }

        // Отправка на сервер
        try {
            const data = await login(email, password);

            setAccountid(data.accountId); // сохранение account_id
            
            // Сохраняем wait_products в localStorage - для показа уведомлений
            if (data.wait_products && Array.isArray(data.wait_products)) {
                setWaitProducts(JSON.stringify(data.wait_products));
            }

            //проверка роли
            const role = data.role; 
            localStorage.setItem("role", role); //сохранение роли

            alert("Вы вошли в аккаунт");

            // Редирект по роли
            window.location.href = "catalog.html";
        } catch (err) {
            console.error("Ошибка:", err);
            alert("Ошибка сервиса! Вернитесь позже!")
        }
    });
});
