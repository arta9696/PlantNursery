// Роли пользователей
const ROLES = {
  GUEST: "guest",
  CUSTOMER: "customer",
  MANAGER: "manager"
};

// Можно добавить и другие общие константы, например:
const API_HOST = "/api"; 
// const API_HOST = "http://demo9118989.mockable.io/api";


function showNotification(message) {
  alert(message);
}

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

function isValidImageUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return /\.(jpg|jpeg|png|webp|gif)$/i.test(parsedUrl.pathname);
  } catch {
    return false;
  }
}

// возвращает идентификатор элемента из URL
function getProductIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id"); // вернёт строку "1", "2" и т.д.
}