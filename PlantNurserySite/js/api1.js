// --- Каталог ---
async function getProducts() {
  const res = await fetch(`${API_HOST}/products`);
  if (!res.ok) throw new Error('Ошибка загрузки товаров');
  const data = await res.json();
  return data.products;
}

// --- Товар по ID ---
async function getProductById(id) {
  const res = await fetch(`${API_HOST}/products/${id}`);
  if (!res.ok) throw new Error('Ошибка загрузки товара');
  return res.json();
}

// --- Добавить в корзину ---
async function addToCart(accountId, productId) {
  const res = await fetch(`${API_HOST}/products/${productId}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accountId })
  });
  if (res.status !== 200 && res.status !== 409) throw new Error('Ошибка добавления в корзину');
  return res.status;
}

// --- Авторизация ---
async function login(email, password) {
  const res = await fetch(`${API_HOST}/account/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (res.status === 404) {
    alert("Аккаунт с такой почтой не был зарегистрирован");
    return;
    // throw new Error("Аккаунт с такой почтой не был зарегистрирован");
  } else if (res.status === 401) {
    alert("Неверный логин или пароль");
    return;
    // throw new Error("Неверный логин или пароль");
  } else if (res.status !== 200) {
    alert("Ошибка сервера. Попробуйте позже.");
    return;
    // throw new Error("Ошибка сервера. Попробуйте позже.");
  }
  return res.json();
}

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
  } else if (res.status !== 201) {
    alert("Ошибка сервера. Попробуйте позже.");
    return;
  }
  alert("Регистрация прошла успешно! Выполните вход в аккаунт!");
}

// --- Корзина ---
async function getCart(accountId) {
  const res = await fetch(`${API_HOST}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accountId })
  });
  if (!res.ok) throw new Error('Ошибка загрузки корзины');
  const data = await res.json();
  return data.products;
  // return data;
}

// --- Удалить из корзины ---
async function removeFromCart(accountId, productId) {
  let message = ""
  const res = await fetch(`${API_HOST}/cart/${productId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accountId })
  });
  // if (!res.ok) throw new Error('Ошибка удаления товара'); 
  // return res;

  if (res.status !== 200) {
    message = "Ошибка удаления товара! Попробуйте позже";
    // throw new Error('Ошибка удаления товара');
  } else message = "Товар успешно удален из корзины!";
  alert(message);
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

async function updateProfile(accountId, email, fullName, address, password) {
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

// // --- Регистрация ---
// export async function register(email, password) {
//   const res = await fetch(`${API_HOST}/account/register`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ email, password })
//   });
//   if (!res.ok) throw new Error('Ошибка регистрации');
//   return res.json();
// }
