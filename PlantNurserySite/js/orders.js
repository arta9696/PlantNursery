document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("history-orders-container");

    const role = getRole();
    const accountId = getAccountId();

    if (role !== ROLES.CUSTOMER) {
        showNotification("Доступ разрешён только покупателям");
        window.location.href = "catalog.html";
        return;
    }

    try {
        const orders = await getOrdersHistory(accountId);

        if (!orders || orders.length === 0) {
            showHistoryMessage(container, "Вы еще не оформляли заказы");
            return;
        }

        // Сортируем по дате: самые новые сверху
        orders.sort((a, b) => {
            const dateA = parseDateString(a.createdDate);
            const dateB = parseDateString(b.createdDate);
            return dateB - dateA; // новые сверху
        });

        // Рендерим заказы с нумерацией 1, 2, 3... (1 = самый новый)
        orders.forEach((order, index) => {
            const displayNumber = index + 1; // Заказ 1, Заказ 2 и т.д.
            container.appendChild(renderHistoryOrder(order, displayNumber));
        });

        // Инициализируем выпадающие списки после рендера
        initHistoryAccordions();

    } catch (error) {
        console.error(error);
        showHistoryMessage(
            container,
            "Не удалось загрузить историю заказов. Попробуйте обновить страницу",
            true
        );
    }
});

// Функция для парсинга строки даты в Date объект
function parseDateString(dateString) {
  if (!dateString) return new Date(0);

  // если прилетит ISO типа 2025-12-16T00:00:00Z — берём только дату
  const s = String(dateString).trim().slice(0, 10);

  let m;

  // yyyy-mm-dd
  m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);

  // dd.mm.yyyy
  m = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (m) return new Date(+m[3], +m[2] - 1, +m[1]);

  // dd.mm.yy
  m = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{2})$/);
  if (m) {
    let year = +m[3];
    year = year <= 50 ? 2000 + year : 1900 + year;
    return new Date(year, +m[2] - 1, +m[1]);
  }

  const d = new Date(dateString);
  return isNaN(d.getTime()) ? new Date(0) : d;
}

function renderHistoryOrder(order, displayNumber) {
    const orderDiv = document.createElement("div");
    orderDiv.className = "history-order-card";
    orderDiv.dataset.orderId = order.id;

    // Считаем общую сумму заказа
    const totalAmount = order.items.reduce((sum, item) => {
        return sum + (item.priceAtMoment * item.count);
    }, 0);

    // Подсчитываем общее количество товаров
    const totalItems = order.items.reduce((sum, item) => sum + Number(item.count), 0);

    orderDiv.innerHTML = `
        <div class="history-order-header">
            <div class="history-order-header-left">
                <div class="history-order-number">Заказ ${displayNumber}</div>
                <div class="history-order-title">${order.title}</div>
            </div>
            <div class="history-order-header-right">
                <span class="history-order-amount">${totalAmount.toFixed(2)} ₽</span>
            </div>
        </div>
        
        <div class="history-order-summary">
            <div class="history-order-date">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="history-order-icon">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>${formatHistoryDate(order.createdDate)}</span>
            </div>
            <div class="history-order-items-count">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="history-order-icon">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span>${totalItems} товар${getHistoryPlural(totalItems)}</span>
            </div>
        </div>
        
        <div class="history-order-accordion">
            <button class="history-accordion-toggle">
                <span>Состав заказа</span>
                <svg class="history-accordion-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>
            
            <div class="history-accordion-content">
                <div class="history-order-items-list">
                    ${order.items.map(item => `
                        <div class="history-order-item">
                            <div class="history-item-info">
                                <div class="history-item-title">${item.title}</div>
                                <div class="history-item-quantity">${item.count} шт.</div>
                            </div>
                            <div class="history-item-price">
                                <span class="history-item-unit-price">${Number(item.priceAtMoment).toFixed(2)} ₽/шт</span>
                                <span class="history-item-total-price">${(Number(item.priceAtMoment) * Number(item.count)).toFixed(2)} ₽</span>
                            </div>
                        </div>
                    `).join("")}
                    
                    <div class="history-order-total">
                        <div class="history-total-label">Итого к оплате:</div>
                        <div class="history-total-amount">${totalAmount.toFixed(2)} ₽</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    return orderDiv;
}

// Функция для склонения слова "товар"
function getHistoryPlural(count) {
    if (count % 10 === 1 && count % 100 !== 11) return '';
    if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) return 'а';
    return 'ов';
}

// Форматирование даты для отображения
function formatHistoryDate(dateString) {
  const d = parseDateString(dateString);
  if (!d || isNaN(d.getTime())) return "Дата не указана";

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

// Инициализация аккордеонов истории
function initHistoryAccordions() {
    const accordionToggles = document.querySelectorAll('.history-accordion-toggle');

    accordionToggles.forEach(toggle => {
        toggle.addEventListener('click', function () {
            const accordion = this.parentElement;
            const content = accordion.querySelector('.history-accordion-content');
            const icon = this.querySelector('.history-accordion-icon');

            accordion.classList.toggle('history-accordion-active');

            if (accordion.classList.contains('history-accordion-active')) {
                content.style.maxHeight = content.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
            } else {
                content.style.maxHeight = '0';
                icon.style.transform = 'rotate(0)';
            }
        });
    });
}

function showHistoryMessage(container, text, isError = false) {
    const message = document.createElement("div");
    message.className = isError ? "history-error-message" : "history-empty-state";
    message.innerHTML = `
        <div class="history-empty-icon">
            ${isError ? '⚠️' : '📦'}
        </div>
        <h3 class="history-empty-title">${text}</h3>
        ${!isError ? '<p class="history-empty-text">Посмотрите наш каталог и найдите то, что вам по душе</p>' : ''}
        ${!isError ? '<a href="catalog.html" class="history-btn-primary">Перейти в каталог</a>' : ''}
    `;
    container.appendChild(message);
}