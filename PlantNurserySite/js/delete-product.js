// Функция создания модального окна подтверждения
function createConfirmationModal(productId, productTitle) {
    const modal = document.createElement("div");
    modal.className = "modal-overlay active";

    modal.innerHTML = `
        <div class="modal-container">
            <div class="modal-header">
                <h3>Подтверждение удаления</h3>
            </div>
            <div class="modal-body">
                <p>Вы уверены, что хотите удалить товар?</p>
                <div class="product-preview">
                    <div class="product-image-small">
                        <img src="${document.querySelector('.item-image img')?.src || ''}" alt="${productTitle}">
                    </div>
                    <div class="product-info-small">
                        <h4>"${productTitle}"</h4>
                        <p>${document.querySelector('.item-info p')?.textContent?.substring(0, 50) || 'Описание товара'}...</p>
                        <p class="price">Цена: ${document.querySelector('.item-price')?.textContent?.replace('Цена:', '') || '100 руб.'}</p>
                    </div>
                </div>
                <p class="warning-text">Это действие невозможно отменить.</p>
            </div>
            <div class="modal-footer">
                <button id="confirmDeleteBtn" class="btn-delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                    Удалить
                </button>
                <button id="cancelDeleteBtn" class="btn-cancel">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    Отмена
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden'; // Блокируем скролл страницы

    // Закрытие модального окна
    function closeModal() {
        modal.classList.remove('active');
        setTimeout(() => {
            if (modal.parentNode) {
                document.body.removeChild(modal);
            }
            document.body.style.overflow = 'auto'; // Восстанавливаем скролл
        }, 300);
    }

    // Подтверждение удаления
    document.getElementById("confirmDeleteBtn").addEventListener("click", async () => {
        const confirmBtn = document.getElementById("confirmDeleteBtn");
        confirmBtn.innerHTML = '<div class="spinner"></div> Удаление...';
        confirmBtn.disabled = true;

        try {
            let status;
            try {
                status = await deleteProduct(productId);
            } catch (error) {
                console.error("Ошибка при удалении товара:", error);
                throw error;
            }

            if (status === 200) {
                // Показываем успешное сообщение на короткое время
                modal.querySelector('.modal-body').innerHTML = `
                    <div class="success-message">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4CAF50">
                            <path d="M20 6L9 17l-5-5"/>
                        </svg>
                        <h4>Товар успешно удален</h4>
                    </div>
                `;

                setTimeout(() => {
                    window.location.href = "catalog.html";
                }, 1500);
            } else if (status === 404) {
                closeModal();
                alert("Товар не найден");
                window.location.href = "catalog.html";
            } else {
                closeModal();
                alert("Ошибка при удалении товара. Попробуйте повторить позднее!");
                window.location.href = "catalog.html";
            }
        } catch (error) {
            console.error("Ошибка:", error);
            closeModal();
            alert("Произошла ошибка при удалении товара");
        }
    });

    // Отмена удаления
    document.getElementById("cancelDeleteBtn").addEventListener("click", () => {
        closeModal();
    });

    // Закрытие при клике вне модального окна
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', function handleEscape(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscape);
        }
    });
}