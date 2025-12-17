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

async function checkCode(code) {
    const url = `https://discord.com/api/v9/entitlements/gift-codes/${code}?with_application=false&with_subscription_plan=true`;
    try {
        const res = await fetch(url);
        if (res.status === 200) return { valid: true };
        if (res.status === 429) {
            const data = await res.json();
            const wait = (data.retry_after || 6) * 1000;
            log(`<span class="ratelimited">> Rate limited. Waiting ${data.retry_after || 6}s...</span>`);
            await new Promise(r => setTimeout(r, wait));
            return { valid: false, status: 'Rate Limited' };
        }
    } catch (e) {}
    return { valid: false, status: 'Invalid' };
}

// Generate Only
document.getElementById('generate-only').onclick = () => {
    const amount = parseInt(amountInput.value) || 10;
    if (amount < 1 || amount > 100) {
        log('> Error: Amount must be 1-100');
        return;
    }

    log(`\n> Generating ${amount} Nitro codes...\n`);

    for (let i = 0; i < amount; i++) {
        const code = generateCode();
        log(`https://discord.gift/<strong>${code}</strong>`);
    }

    log(`\n> ${amount} codes generated.`);
};

// Generate & Check
document.getElementById('generate-check').onclick = async () => {
    const amount = parseInt(amountInput.value) || 10;
    if (amount < 1 || amount > 100) {
        log('> Error: Amount must be 1-100');
        return;
    }

    log(`\n> Generating and checking ${amount} codes...\n`);

    for (let i = 0; i < amount; i++) {
        const code = generateCode();
        log(`https://discord.gift/<strong>${code}</strong>`);
        log('> Checking...');

        const result = await checkCode(code);
        if (result.valid) {
            log(`<span class="valid">>>> VALID NITRO FOUND!!!</span>`);
        } else {
            log(`> ${result.status || 'Invalid'}`);
        }
        log(''); // spacing
    }

    log(`> Scan complete.`);
};

// Clear
document.getElementById('clear').onclick = () => {
    output.innerHTML = '> Terminal cleared.\n> Ready.';
};
