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
async function addToCart(accountId, productId, count) {
  const res = await fetch(`${API_HOST}/products/${productId}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accountId, count })
  });
  if (res.status === 200) {
    alert("Товар добавлен в корзину!");
  } else if (res.status === 400) {
    alert("В вашей корзине уже находиться 10 товаров данного вида! Больше добавить нельзя!");
  } else if (res.status === 404) {
    alert("Товар или покупатель не найден.");
  } else if (res.status === 500) {
    alert("Внутренняя ошибка сервера. Попробуйте позже.");
  } else {
    alert("Произошла ошибка при добавлении товара.");
  }
}

// --- Уведомление о поступлении ---
async function notifyWhenInStock(accountId, productId) {
  const res = await fetch(`${API_HOST}/products/${productId}/wait`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accountId })
  });

  if (res.status === 200) {
    alert("Вы успешно подписались на уведомление о поступлении товара!");
  } else if (res.status === 409) {
    alert("Вы уже подписаны на уведомление для этого товара.");
  } else if (res.status === 500) {
    alert("Произошла ошибка на сервере. Попробуйте позже.");
  } else {
    alert("Ошибка. Попробуйте еще раз.");
  }

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

function decodePossiblyEncodedString(encodedString) {
  try {
    // First, try URL decoding
    const decodedUrl = decodeURIComponent(encodedString);
    // If the URL decoding significantly changed the string and it doesn't look like a URL-safe Base64,
    // it's likely a URL-encoded string.
    // This is a heuristic; a more robust check might involve regex for common URL patterns.
    if (decodedUrl !== encodedString && !/^[A-Za-z0-9\-_]+={0,2}$/.test(encodedString)) {
      return decodedUrl;
    }
  } catch (e) {
    // If decodeURIComponent throws an error, it's not a valid URI component.
    // Proceed to Base64 decoding.
  }

  try {
    // Prepare for Base64 decoding (handle URL-safe characters and padding)
    let base64String = encodedString
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    // Add padding if missing for standard atob()
    const paddingNeeded = base64String.length % 4;
    if (paddingNeeded === 2) {
      base64String += '==';
    } else if (paddingNeeded === 3) {
      base64String += '=';
    }

    // Attempt Base64 decoding
    return atob(base64String);
  } catch (e) {
    // If atob throws an error, it's not valid Base64.
    // In this case, return the original string or handle as an unknown format.
    console.warn("Could not decode string as URL or Base64:", encodedString, e);
    return encodedString; // Or throw an error, or return null
  }
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
