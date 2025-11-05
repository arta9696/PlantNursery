document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("edit-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const fullnameInput = document.getElementById("fullname");
  const addressInput = document.getElementById("address");
  const messageBox = document.getElementById("message");

  const accountId = getAccountId();
  const role = getRole();

  if (!accountId || role !== ROLES.CUSTOMER) {
    alert("Вы не авторизованы как покупатель!");
    window.location.href = "auth.html";
    return;
  }

  // Загрузка текущих данных
  try {
    const data = await getProfile(accountId);
    emailInput.value = data.email || "";
    passwordInput.value = data.password || "";
    fullnameInput.value = data.fullName || "";
    addressInput.value = data.address || "";
  } catch (err) {
    console.error("Ошибка загрузки профиля:", err);
    alert("Не удалось загрузить данные профиля.");
  }

  // Сохранение изменений
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const fullname = fullnameInput.value.trim();
    const address = addressInput.value.trim();

    if (password && !/^[A-Za-z0-9]{7,10}$/.test(password)) {
      alert("Пароль должен содержать 7–10 латинских символов или цифр");
      return;
    }

    if (password === "" || email === "") {
      showMessage("❌ Не удалось сохранить изменения. Email и Пароль должны быть заполнены", "error");
      return;
    }

    try {
      await updateProfile(accountId, fullname, address, password);
      showMessage("✅ Данные успешно обновлены", "success");

      // через 2 секунды возвращаем в профиль
      setTimeout(() => {
        window.location.href = "profile.html";
      }, 2000);
    } catch (err) {
      console.error("Ошибка обновления профиля:", err);
      showMessage("❌ Не удалось сохранить изменения. Попробуйте позже!", "error");
    }
  });

  function showMessage(text, type) {
    messageBox.textContent = text;
    messageBox.className = type === "success" ? "message success" : "message error";
    messageBox.classList.remove("hidden");

    setTimeout(() => {
      messageBox.classList.add("hidden");
    }, 3000);
  }
});