// Change your password here
const ACCESS_CODE = "swavey2025";

// Generate particles on load
window.onload = () => {
    const particles = document.querySelector('.particles');
    for (let i = 0; i < 80; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        p.style.width = p.style.height = Math.random() * 4 + 2 + 'px';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.animationDuration = Math.random() * 20 + 10 + 's';
        p.style.animationDelay = Math.random() * 5 + 's';
        particles.appendChild(p);
    }
};

// Screens
const loginScreen = document.getElementById('login-screen');
const mainScreen = document.getElementById('main-screen');
const accessInput = document.getElementById('access-code');
const loginBtn = document.getElementById('login-btn');
const errorMsg = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');

loginBtn.onclick = () => {
    if (accessInput.value === ACCESS_CODE) {
        loginScreen.classList.remove('active');
        mainScreen.classList.add('active');
        errorMsg.textContent = '';
        accessInput.value = '';
    } else {
        errorMsg.textContent = 'Access Denied';
    }
};

accessInput.onkeypress = (e) => { if (e.key === 'Enter') loginBtn.click(); };

logoutBtn.onclick = () => {
    mainScreen.classList.remove('active');
    loginScreen.classList.add('active');
};

// Generator
const resultsDiv = document.getElementById('results');

function generateCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 24; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

async function checkCode(code) {
    const url = `https://discord.com/api/v9/entitlements/gift-codes/${code}?with_application=false&with_subscription_plan=true`;
    try {
        const res = await fetch(url);
        if (res.status === 200) return { valid: true };
        if (res.status === 429) {
            const data = await res.json();
            const wait = (data.retry_after || 5) * 1000;
            await new Promise(r => setTimeout(r, wait));
            return { valid: false, status: 'Rate Limited (waited)' };
        }
    } catch (e) {}
    return { valid: false, status: 'Invalid' };
}

document.getElementById('generate-btn').onclick = async () => {
    resultsDiv.innerHTML = '<p style="text-align:center; font-size:1.5em; text-shadow:0 0 20px #0ff;">Processing...</p>';
    const codes = Array.from({length: 10}, generateCode);
    resultsDiv.innerHTML = '';

    for (const code of codes) {
        const card = document.createElement('div');
        card.classList.add('code-card');
        card.innerHTML = `
            <a href="https://discord.gift/\( {code}" target="_blank">https://discord.gift/ \){code}</a>
            <div class="status">Checking...</div>
        `;
        resultsDiv.appendChild(card);

        const result = await checkCode(code);
        const status = card.querySelector('.status');
        status.textContent = result.valid ? 'VALID!' : result.status || 'Invalid';

        card.classList.add(result.valid ? 'valid' : result.status?.includes('Rate') ? 'ratelimited' : 'invalid');
    }
};

document.getElementById('clear-btn').onclick = () => resultsDiv.innerHTML = '';
