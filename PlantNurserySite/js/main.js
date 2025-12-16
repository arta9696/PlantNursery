// Запускай сайт через локальный сервер, а не локально файл file://...
// import { getRole } from '../storage/storage1.js'; // JS должен уже знать. До подключения main.js
// import { ROLES, showNotification } from './utils1.js'; // JS должен уже знать, что такое ROLES. До подключения main.js 

function loadMenu() {
    let menuHTML = `
        <header class="main-header">
        <div class="logo">
            <p class="logo-title">САНГРИЯ</p>
            <span class="logo-subtitle">питомник растений</span>
        </div>
        <nav class="main-nav">
            <div class="search-container">
                <input
                    type="text"
                    id="search-input"
                    placeholder="Поиск товара"
                />
                <button id="search-btn">🔍</button>
            </div>
            <button id="catalog-btn">Каталог</button>

            
    `;

    const container = document.getElementById("menu-container");
    if (container) {
        menuHTML += renderMainPage();
        menuHTML += `
            </nav>
            </header>
        `;
        container.innerHTML = menuHTML;
    }

    initMenuButtons();
}

// --- Рендеринг кнопок по ролям ---
function renderMainPage() {
    const role = getRole();
    let content = '';

    if (role === ROLES.GUEST) {
        content = `
            <button id="auth-btn">Войти</button>
            <button id="register-btn">Регистрация</button>
        `;
    }

    if (role === ROLES.CUSTOMER) {
        content = `
            <button id="favorite-btn">Избранное</button>
            <button id="cart-btn">Корзина</button>
            <button id="profile-btn">Мой профиль</button>
            <button id="logout-btn">Выход</button>
        `;
    }

    if (role === ROLES.MANAGER) {
        content = `
            <button id="logout-btn">Выход</button>
        `;
    }

    return content;
}

// --- Кнопки меню ---
function initMenuButtons() {
    // Логотип кликабельный
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', () => {
            window.location.href = 'catalog.html';
        });
    }

    document.getElementById("catalog-btn")?.addEventListener("click", () => {
        window.location.href = "catalog.html";
    });
    document.getElementById("favorite-btn")?.addEventListener("click", () => {
        window.location.href = "favorites.html";
    });
    document.getElementById("cart-btn")?.addEventListener("click", () => {
        window.location.href = "cart.html";
    });
    document.getElementById("history-order-btn")?.addEventListener("click", () => {
        window.location.href = "orders.html";
    });
    document.getElementById("profile-btn")?.addEventListener("click", () => {
        window.location.href = "profile.html";
    });
    document.getElementById("auth-btn")?.addEventListener("click", () => {
        window.location.href = "auth.html";
    });
    document.getElementById("register-btn")?.addEventListener("click", () => {
        window.location.href = "register.html";
    });
    document.getElementById("logout-btn")?.addEventListener("click", () => {
        clearAccount();
        window.location.href = "catalog.html";
    });

    // 🔍 ПОИСК
    document.getElementById("search-btn")?.addEventListener("click", () => {
        const input = document.getElementById("search-input");
        const query = input.value.trim();

        if (!query) return;

        window.location.href = `catalog.html?search=${encodeURIComponent(query)}`;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadMenu();
    renderWaitProducts();
});