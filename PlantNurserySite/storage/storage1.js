// --- Получаем данные из localStorage ---
function getRole() {
    if (localStorage.getItem('role') === null) setRole(ROLES.GUEST);
    //return localStorage.getItem('role') || ROLES.GUEST;
    return localStorage.getItem('role');
}

function getAccountId() {
    return localStorage.getItem('accountId');
}

function setRole(role) {
    localStorage.setItem('role', role);
}

function setAccountid(accountId) {
    if (accountId) localStorage.setItem('accountId', accountId);
}

function clearAccount() {
    localStorage.removeItem('role');
    localStorage.removeItem('accountId');
}