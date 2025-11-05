document.addEventListener("DOMContentLoaded", async () => {
  const emailElem = document.getElementById("profile-email");
  const passwordElem = document.getElementById("profile-password");
  const fullnameElem = document.getElementById("profile-fullname");
  const addressElem = document.getElementById("profile-address");
  const fullnameGroup = document.getElementById("fullname-group");
  const addressGroup = document.getElementById("address-group");
  const editBtn = document.getElementById("edit-btn");

  const accountId = getAccountId();
  const role = getRole();

  if (!accountId || role !== ROLES.CUSTOMER) {
    alert("Вы не авторизованы как покупатель!");
    window.location.href = "auth.html";
    return;
  }

  try {
    const profile = await getProfile(accountId);

    emailElem.textContent = profile.email || "—";
    passwordElem.textContent = profile.password || "—";

    if (profile.fullName && profile.fullName.trim() !== "") {
      fullnameElem.textContent = profile.fullName;
      fullnameGroup.style.display = "block";
    } else {
      fullnameElem.textContent = "—";
      // fullnameGroup.style.display = "none";
    }

    if (profile.address && profile.address.trim() !== "") {
      addressElem.textContent = profile.address;
      addressGroup.style.display = "block";
    } else {
      addressElem.textContent = "—";
      // addressGroup.style.display = "none";
    }

  } catch (err) {
    console.error("Ошибка загрузки профиля:", err);
    alert("Не удалось загрузить данные профиля.");
  }

  editBtn.addEventListener("click", () => {
    window.location.href = "edit-profile.html";
  });
});