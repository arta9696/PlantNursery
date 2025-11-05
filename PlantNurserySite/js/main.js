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
document.addEventListener("DOMContentLoaded", loadMenu);


// === Меню ===
// function renderMenu() {
//     const menu = document.getElementById('main-menu');
//     menu.innerHTML = '';

//     const { role } = getUser();
//     const menuItems = [];

//     if (!role) {
//         menuItems.push(
//             { text: 'Каталог товаров', link: 'catalog.html' },
//             { text: 'Войти', link: 'login.html' },
//             { text: 'Зарегистрироваться', link: 'register.html' }
//         );
//     } else if (role === 'customer') {
//         menuItems.push(
//             { text: 'Каталог товаров', link: 'catalog.html' },
//             { text: 'Корзина', link: 'cart.html' },
//             { text: 'Мой профиль', link: 'profile.html' }
//         );
//     } else if (role === 'manager') {
//         menuItems.push(
//             { text: 'Каталог товаров', link: 'catalog.html' },
//             { text: 'Выйти', link: '#', action: logout }
//         );
//     }

//     menuItems.forEach(item => {
//         const btn = document.createElement('a');
//         btn.textContent = item.text;
//         btn.href = item.link;
//         if (item.action) btn.addEventListener('click', item.action);
//         menu.appendChild(btn);
//     });
// }

// function logout() {
//     clearUser();
//     showNotification('Вы вышли из аккаунта');
//     setTimeout(() => window.location.href = 'catalog.html', 1000);
// }
// document.addEventListener('DOMContentLoaded', async () => {
//   renderMenu();
//   await loadCatalog();
// });