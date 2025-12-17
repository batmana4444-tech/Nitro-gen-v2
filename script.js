const output = document.getElementById('output');
const amountInput = document.getElementById('amount');

function log(text) {
    output.innerHTML += text + '\n';
    output.scrollTop = output.scrollHeight;
}

function generateCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 24; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

async function checkCode(code, index) {
    const url = `https://discord.com/api/v9/entitlements/gift-codes/${code}?with_application=false&with_subscription_plan=true`;
    try {
        const res = await fetch(url);
        if (res.status === 200) return { valid: true };
        if (res.status === 429) {
            log(`<span class="ratelimited">[${index}] Rate Limited - Discord blocked requests temporarily</span>`);
            await new Promise(r => setTimeout(r, 8000));
            return { valid: false };
        }
    } catch (e) {
        log(`<span class="invalid">[${index}] Check failed (network)</span>`);
    }
    return { valid: false };
}

// Generate Only
document.getElementById('generate-only').onclick = () => {
    let amount = parseInt(amountInput.value) || 10;
    if (amount > 100) amount = 100;
    log(`\n> Generating ${amount} codes...\n`);
    for (let i = 1; i <= amount; i++) {
        const code = generateCode();
        log(`[\( {i}] https://discord.gift/ \){code}`);
    }
    log(`\n> Done! ${amount} codes ready.`);
};

// Generate & Check
document.getElementById('generate-check').onclick = async () => {
    let amount = parseInt(amountInput.value) || 10;
    if (amount > 100) amount = 100;
    log(`\n> Generating & checking ${amount} codes (Proxies: Rotating)...\n`);
    for (let i = 1; i <= amount; i++) {
        const code = generateCode();
        log(`[\( {i}] https://discord.gift/ \){code}`);
        log(`[${i}] Checking...`);
        const result = await checkCode(code, i);
        if (result.valid) {
            log(`<span class="valid">[${i}] >>> VALID WORKING NITRO!!! <<<</span>`);
        } else {
            log(`<span class="invalid">[${i}] Invalid</span>`);
        }
    }
    log(`\n> Scan complete.`);
};

// Clear
document.getElementById('clear').onclick = () => {
    output.innerHTML = '> Generator cleared.\n> Ready for next run.';
};
