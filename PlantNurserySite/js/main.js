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
            <button id="catalog-btn">Каталог</button>
    `;

    // если на странице есть контейнер — вставляем туда меню
    const container = document.getElementById("menu-container");
    if (container) {
        menuHTML += renderMainPage();
        //menuHTML += renderWaitProducts();
        menuHTML += `
            </nav>
            </header>
        `;
        container.innerHTML = menuHTML;
    }
    initMenuButtons();
    // если нет контейнера — ничего не делаем
}

// --- Рендеринг главной страницы ---
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
        <button id="cart-btn">Корзина</button>
        <button id="profile-btn">Мой профиль</button>
        <button id="logout-btn">Выход</button>
        `;
    }

    if (role === ROLES.MANAGER) {
        content = `
        <button id="logout-btn">Выход</button>
        `;
        // window.location.href = 'catalog.html'; // Менеджера сразу перекидываем в каталог
        //return;
    }

    // main.innerHTML = content;
    return content;
}

// function renderWaitProducts() {
//     const waitProducts = JSON.parse(getWaitProducts() || "[]");
//     if (waitProducts.length === 0) return "";
//     alert(waitProducts)

//     let html = `<div class="wait-products-panel"><span>Товары в наличии:</span><ul>`;
//     waitProducts.forEach(product => {
//         html += `<li><a href="product.html?id=${product.id}">${product.title}</a></li>`;
//     });

//     html += `</ul></div>`;
//     return html;
// }
function renderWaitProducts() {
    const waitProducts = JSON.parse(getWaitProducts() || "[]");
    if (waitProducts.length === 0) {
        document.getElementById("wait-products-container").innerHTML = "";
        return;
    }

    let html = `<div class="wait-products-panel"><span>Товары в наличии:</span><ul>`;
    waitProducts.forEach(product => {
        html += `<li><a href="product.html?id=${product.id}">${product.title}</a></li>`;
    });
    html += `</ul></div>`;

    document.getElementById("wait-products-container").innerHTML = html;
}

function initMenuButtons() {
    document.getElementById("catalog-btn")?.addEventListener("click", () => {
        window.location.href = "catalog.html";
    });
    document.getElementById("cart-btn")?.addEventListener("click", () => {
        window.location.href = "cart.html";
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
}

// --- Запуск при загрузке страницы ---
// document.addEventListener("DOMContentLoaded", loadMenu);
document.addEventListener("DOMContentLoaded", () => {
    loadMenu();
    renderWaitProducts(); // рендерим уведомления отдельно
});
