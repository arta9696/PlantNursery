// --- Регистрация ---
async function register(email, password) {
  const res = await fetch(`${API_HOST}/account/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (res.status === 409) {
    alert("Аккаунт с такой почтой уже зарегистрирован");
    return;
  }  else if (res.status !== 200) {
    alert("Ошибка сервера. Попробуйте позже.");
    return;
  }
  return res.json();
}

async function getProfile(accountId) {
  const res = await fetch(`${API_HOST}/customer/profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accountId })
  });
  if (res.status !== 200) {
    throw new Error("Ошибка загрузки профиля");
  }
  return res.json();
}

async function updateProfile(accountId, fullname, address, password) {
  const res = await fetch(`${API_HOST}/customer/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accountId, email, password, fullName, address })
  });

  if (res.status !== 200) {
    throw new Error("Ошибка обновления профиля");
  }

  return res.json();
}