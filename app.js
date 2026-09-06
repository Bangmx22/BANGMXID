// BANGMX STORE — App.js

// Rekening pembayaran (ganti sesuai kebutuhan)
const BANK_ACCOUNTS = {
    banks: ['Bank BCA', 'Bank Mandiri', 'Bank BRI'],
    accountNumber: '123-456-7890',
    accountName: 'BANGMX Store'
};

let currentProduct = null;
let currentOrder = null;

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    document.getElementById('cancel-order')?.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('products');
    });
});

function loadProducts() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';
    PRODUCTS.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <span class="game-tag">${p.game}</span>
            <h3>${p.name}</h3>
            <p class="desc">${p.desc}</p>
            <div class="price">Rp ${p.price.toLocaleString('id-ID')}</div>
            <button class="btn btn-primary" onclick="selectProduct('${p.id}')">Pilih & Order</button>
        `;
        grid.appendChild(card);
    });
}

function selectProduct(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    currentProduct = product;
    document.getElementById('product-id').value = productId;
    document.getElementById('player-id').value = '';
    document.getElementById('fullname').value = '';
    document.getElementById('contact').value = '';
    document.getElementById('notes').value = '';
    showSection('order-section');
}

document.getElementById('order-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const playerId = document.getElementById('player-id').value.trim();
    const fullname = document.getElementById('fullname').value.trim();
    const contact = document.getElementById('contact').value.trim();
    const notes = document.getElementById('notes').value.trim();
    
    if (!playerId) { showToast('Player ID wajib diisi', 'error'); return; }
    if (!fullname) { showToast('Nama lengkap wajib diisi', 'error'); return; }
    
    const productId = document.getElementById('product-id').value;
    const product = PRODUCTS.find(p => p.id === productId);
    
    // Buat order lokal (tanpa backend — cukup untuk tampilkan info pembayaran)
    const orderId = 'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
    const order = {
        id: orderId,
        productName: product.name,
        game: product.game,
        price: product.price,
        playerId: playerId,
        customerInfo: { fullname, contact, notes },
        status: 'Pending',
        createdAt: new Date().toLocaleString('id-ID'),
    };
    
    currentOrder = order;
    showPaymentInfo(order);
    showSection('payment-section');
    showToast('Order berhasil dibuat! Melakukan pembayaran.', 'success');
});

function showPaymentInfo(order) {
    const container = document.getElementById('payment-info');
    container.innerHTML = `
        <h3>✅ Order #${order.id.slice(0, 8)} — Rp ${order.price.toLocaleString('id-ID')}</h3>
        <p><strong>Produk:</strong> ${order.productName} (${order.game})</p>
        <p><strong>Player ID:</strong> ${order.playerId}</p>
        <p><strong>Pembeli:</strong> ${order.customerInfo?.fullname || '-'}</p>
        <p><strong>Status:</strong> <span style="color: var(--warning)">${order.status}</span></p>
        
        <div class="payment-rekening">
            ${BANK_ACCOUNTS.banks.map(bank => `
                <div class="rekening-row"><span class="rekening-label">Bank</span><span>${bank}</span></div>
            `).join('')}
            <div class="rekening-row"><span class="rekening-label">No. Rekening</span><span>${BANK_ACCOUNTS.accountNumber}</span></div>
            <div class="rekening-row"><span class="rekening-label">Atas Nama</span><span>${BANK_ACCOUNTS.accountName}</span></div>
        </div>
        
        <div class="payment-note">
            ⚠️ Lakukan transfer sesuai nominal. Setelah transfer, segera kirim bukti ke admin (link di bawah) untuk diproses.
        </div>
        
        <div class="payment-actions" style="margin-top: 20px">
            <a href="/admin.html?order=${order.id}" target="_blank" class="btn btn-outline">
                📋 Konfirmasi Pembayaran (Admin)
            </a>
        </div>
    `;
}

function showSection(sectionId) {
    document.getElementById('products').style.display = sectionId === 'products' ? 'block' : 'none';
    document.getElementById('order-section').style.display = sectionId === 'order-section' ? 'block' : 'none';
    document.getElementById('payment-section').style.display = sectionId === 'payment-section' ? 'block' : 'none';
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast-icon">${type === 'success' ? '✅' : '❌'}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// Data lokal buat inline access
window.PRODUCTS = [
    { id: 'pubg-1', name: 'UC 100 (Small)', game: 'PUBG Mobile', price: 150000, desc: 'UC 100 untuk PUBG Mobile.' },
    { id: 'pubg-2', name: 'UC 500 (Medium)', game: 'PUBG Mobile', price: 450000, desc: 'UC 500.' },
    { id: 'pubg-3', name: 'UC 1000 (Large)', game: 'PUBG Mobile', price: 850000, desc: 'UC 1000.' },
    { id: 'pubg-4', name: 'Royal Pass Season', game: 'PUBG Mobile', price: 350000, desc: 'Royal Pass akses.' },
    { id: 'ml-1', name: 'Diamond 100', game: 'Mobile Legends', price: 35000, desc: 'Diamond 100 + bonus gold.' },
    { id: 'ml-2', name: 'Diamond 300', game: 'Mobile Legends', price: 95000, desc: 'Diamond 300 + bonus gold.' },
    { id: 'ml-3', name: 'Diamond 600', game: 'Mobile Legends', price: 175000, desc: 'Diamond 600.' },
    { id: 'ml-4', name: 'Battle Pass', game: 'Mobile Legends', price: 120000, desc: 'Battle Pass akses + rewards.' },
];
