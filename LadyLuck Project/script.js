// ===== Skins Database =====
const skins = [
    // Blue rarity (80% общ шанс)
    { name: "P250", rarity: "blue", chance: 11.43, img: "pictures/P250Done.jpg", desc: "Честит 8 март! Пожелавам ти домът винаги да е пълен с любов и топлина. Нека мъката и проблемите винаги те подминават." },
    { name: "Tec 9", rarity: "blue", chance: 11.43, img: "pictures/Tec9Done.jpg", desc: "Честит 8 март! Нека очите ти блестят от радост, нека всичките ти мечти се превърнат в реалност." },
    { name: "USP-S", rarity: "blue", chance: 11.43, img: "pictures/USPsDone.jpg", desc: "В този прекрасен ден искам искрено да те поздравя. Пожелавам ти да останеш все така нежна, мъдра и красива." },
    { name: "Five Seven", rarity: "blue", chance: 11.43, img: "pictures/FiveSevenDone.jpg", desc: "Нека празникът 8 март бъде изпълнен с положителни емоции, букети цветя и приятни подаръци." },
    { name: "Famas", rarity: "blue", chance: 11.43, img: "pictures/FamasDone.jpg", desc: "Честит 8 март! Пожелавам ти пролетно настроение и душата ти винаги да прелива от любов." },
    { name: "Mag7", rarity: "blue", chance: 11.43, img: "pictures/Mag7Done.png", desc: "В най-нежния и красив ден в годината бързам да те поздравя за 8 март!" },
    { name: "Mp7", rarity: "blue", chance: 11.43, img: "pictures/Mp7Done.jpg", desc: "Най-сладката и нежна, най-красивата и обичана! Честит 8 март, мила!" },
    { name: "Nova", rarity: "blue", chance: 11.43, img: "pictures/NovaDone.jpg", desc: "Честит 8 март, Kurt! Нека пролетта винаги живее в душата ти." },
    { name: "Xm9", rarity: "blue", chance: 11.43, img: "pictures/Xm9Done.jpg", desc: "Честит 8 март, мила мамо! Пожелавам ти океан от щастие и светлина в очите." },
    
    // Purple rarity (15%)
    { name: "Mp5 SD", rarity: "purple", chance: 7.5, img: "pictures/Mp5 SD.jpg", desc: "На 8 март бързам да ти пожелая всичко най-добро, най-важно и красиво за една прекрасна жена." },
    { name: "Mac 10", rarity: "purple", chance: 7.5, img: "pictures/Mac10Done.jpg", desc: "Мила мамо, поздравления за 8 март! Желая ти пролетно настроение и безкрайно щастие." },
    
    // Pink rarity (3%)
    { name: "Deagle", rarity: "pink", chance: 1.5, img: "pictures/DeagleDone.jpg", desc: "Нека този прекрасен празник ти донесе много сбъднати мечти." },
    { name: "AWP", rarity: "pink", chance: 1.5, img: "pictures/AwpDone.jpg", desc: "Скъпа моя мамо, поздравявам те за 8 март! Нека всички грижи и несгоди да изчезнат от живота ти." },
    
    // Red rarity (0.64%)
    { name: "M4A4", rarity: "red", chance: 0.32, img: "pictures/m4a4Done.png", desc: "Честит 8 март! Пожелавам ти да вървиш през живота с лека походка и да получаваш с лекота всичко, което пожелаеш." },
    { name: "AK 47", rarity: "red", chance: 0.32, img: "pictures/ak 47Done.png", desc: "Невъзможно е дори за миг да си представя света без теб, без твоята красота и нежност." },
    
    // Gold rarity (0.26%)
    { name: "Shadow Daggers", rarity: "gold", chance: 0.26, img: "pictures/ShadowDaggersDone.png", desc: "Честит 8 март, мила! Пожелавам ти всичко най-красиво в този прекрасен ден – много цветя, комплименти и усмивки." }
];

// ===== DOM Elements =====
const reel = document.getElementById("reel");
const reelContainer = document.getElementById("reelContainer");
const openBtn = document.getElementById("openBtn");
const result = document.getElementById("result");
const newCaseBtn = document.getElementById("newCaseBtn");
const glow = document.getElementById("caseGlow");
const opensCountSpan = document.getElementById("opensCount");
const luckMeterSpan = document.getElementById("luckMeter");

// ===== Audio Elements =====
const spinSound = document.getElementById("spinSound");
const winSound = document.getElementById("winSound");
const rareSound = document.getElementById("rareSound");

// ===== Game State =====
let opensCount = localStorage.getItem('opensCount') ? parseInt(localStorage.getItem('opensCount')) : 0;
let lastRarity = null;
let spinning = false;

// ===== Initialize =====
updateStats();

// ===== Core Functions =====
function pickSkin() {
    const total = skins.reduce((a, b) => a + b.chance, 0);
    let random = Math.random() * total;
    let sum = 0;
    
    for (let skin of skins) {
        sum += skin.chance;
        if (random <= sum) {
            return skin;
        }
    }
    return skins[0];
}

function createReel(winner) {
    spinning = true;
    openBtn.disabled = true;
    
    reel.innerHTML = "";
    
    let items = [];
    for (let i = 0; i < 6; i++) {
        skins.forEach(s => items.push({...s}));
    }
    
    const winPos = 40 + Math.floor(Math.random() * 5);
    items[winPos] = winner;
    
    items.forEach((s, index) => {
        let div = document.createElement("div");
        div.className = `reel-item ${s.rarity}`;
        if (index === winPos) div.classList.add('winning');
        
        div.innerHTML = `
            <img src="${s.img}" alt="${s.name}" loading="lazy">
            <div>${s.name}</div>
            <div class="rarity-label">${s.rarity}</div>
        `;
        reel.appendChild(div);
    });
    
    reelContainer.style.display = "block";
    void reelContainer.offsetWidth;
    
    const winningElement = reel.children[winPos];
    const reelRect = reel.getBoundingClientRect();
    const itemRect = winningElement.getBoundingClientRect();
    const itemCenter = itemRect.left - reelRect.left + (itemRect.width / 2);
    const containerCenter = reelContainer.offsetWidth / 2;
    const target = itemCenter - containerCenter;
    
    spinSound.currentTime = 0;
    spinSound.play().catch(e => console.log('Audio play failed:', e));
    
    let startTime = null;
    const duration = 4000;
    
    reelContainer.classList.add('spinning');
    
    function animate(currentTime) {
        if (!startTime) startTime = currentTime;
        
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOut = 1 - Math.pow(1 - progress, 4);
        
        let transform = target * easeOut;
        if (progress > 0.95) {
            const bounce = Math.sin((progress - 0.95) * 100) * 10;
            transform += bounce;
        }
        
        reel.style.transform = `translateX(-${transform}px)`;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            spinning = false;
            reelContainer.classList.remove('spinning');
            spinSound.pause();
            spinSound.currentTime = 0;
            
            if (winner.rarity === 'gold' || winner.rarity === 'red') {
                rareSound.play().catch(e => console.log('Audio play failed:', e));
            } else {
                winSound.play().catch(e => console.log('Audio play failed:', e));
            }
            
            showResult(winner);
            
            winningElement.classList.add('winning');
            winningElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }
    }
    
    requestAnimationFrame(animate);
}

function showResult(skin) {
    opensCount++;
    localStorage.setItem('opensCount', opensCount);
    updateStats();
    
    glow.className = `case-glow glow-${skin.rarity}`;
    glow.style.opacity = 1;
    
    result.innerHTML = `
        <div class="skin-card ${skin.rarity}">
            <h2>${skin.name}</h2>
            <img src="${skin.img}" alt="${skin.name}">
            <p>⭐ ${skin.rarity.toUpperCase()} ⭐</p>
            <div class="skin-desc">${skin.desc}</div>
        </div>
    `;
    
    createConfetti(skin.rarity);
    
    newCaseBtn.style.display = "inline-block";
    
    updateLuckMeter(skin.rarity);
}

function createConfetti(rarity) {
    const colors = {
        gold: ['#ffd700', '#ffb347', '#ffa500'],
        red: ['#ff3a3a', '#ff6b6b', '#ff0000'],
        pink: ['#ff79c9', '#ff9ec1', '#ff69b4'],
        purple: ['#b87cff', '#d4a5ff', '#9b59b6'],
        blue: ['#5fb5ff', '#8ac4ff', '#3498db']
    };
    
    const colorSet = colors[rarity] || colors.blue;
    const count = rarity === 'gold' ? 500 : (rarity === 'red' ? 300 : 200);
    
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            const left = Math.random() * 100;
            const size = Math.random() * 15 + 5;
            const color = colorSet[Math.floor(Math.random() * colorSet.length)];
            const duration = Math.random() * 3 + 2;
            const delay = Math.random() * 2;
            
            confetti.style.left = left + '%';
            confetti.style.width = size + 'px';
            confetti.style.height = size + 'px';
            confetti.style.backgroundColor = color;
            confetti.style.animation = `confettiFall ${duration}s linear ${delay}s forwards`;
            
            if (Math.random() > 0.5) {
                confetti.style.borderRadius = '50%';
            }
            
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), (duration + delay) * 1000);
        }, i * 2);
    }
}

function updateStats() {
    opensCountSpan.textContent = opensCount;
}

function updateLuckMeter(rarity) {
    const luckLevels = {
        'gold': '🌟🌟🌟🌟🌟',
        'red': '🌟🌟🌟🌟',
        'pink': '🌟🌟🌟',
        'purple': '🌟🌟',
        'blue': '🌟'
    };
    
    luckMeterSpan.textContent = luckLevels[rarity] || '✨✨✨';
    
    luckMeterSpan.style.transform = 'scale(1.5)';
    setTimeout(() => {
        luckMeterSpan.style.transform = 'scale(1)';
    }, 300);
}

// ===== Event Listeners =====
openBtn.addEventListener('click', () => {
    if (spinning) return;
    
    const winner = pickSkin();
    lastRarity = winner.rarity;
    createReel(winner);
});

newCaseBtn.addEventListener('click', () => {
    window.location.reload();
});

document.getElementById('case').addEventListener('mouseenter', () => {
    if (!spinning) {
        glow.style.opacity = 0.3;
    }
});

document.getElementById('case').addEventListener('mouseleave', () => {
    if (!spinning) {
        glow.style.opacity = 0;
    }
});

// ===== Keyboard shortcut (Spacebar to open) =====
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !spinning && !openBtn.disabled) {
        e.preventDefault();
        openBtn.click();
    }
});

// ===== Preload images =====
window.addEventListener('load', () => {
    skins.forEach(skin => {
        const img = new Image();
        img.src = skin.img;
    });
});

// ===== Debug info =====
const totalChance = skins.reduce((sum, skin) => sum + skin.chance, 0);
console.log('🎮 Lady Luck Case Loaded!');
console.log('Total chance:', totalChance.toFixed(2) + '%');
console.log('Skins loaded:', skins.length);