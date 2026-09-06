const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ==================== DATA ====================
const PRODUCTS = [
    // PUBG Mobile
    { id: 'pubg-1', game: 'PUBG Mobile', name: 'UC 100 (Small)', price: 150000, desc: 'UC 100 untuk PUBG Mobile. Delivery via official/reseller channel.' },
    { id: 'pubg-2', game: 'PUBG Mobile', name: 'UC 500 (Medium)', price: 450000, desc: 'UC 500. Value terbaik per UC.' },
    { id: 'pubg-3', game: 'PUBG Mobile', name: 'UC 1000 (Large)', price: 850000, desc: 'UC 1000. Premium tier.' },
    { id: 'pubg-4', game: 'PUBG Mobile', name: 'Royal Pass Season', price: 350000, desc: 'Royal Pass akses season berjalan.' },
    
    // Mobile Legends
    { id: 'ml-1', game: 'Mobile Legends', name: 'Diamond 100', price: 35000, desc: 'Diamond 100 + bonus gold.' },
    { id: 'ml-2', game: 'Mobile Legends', name: 'Diamond 300', price: 95000, desc: 'Diamond 300 + bonus gold.' },
    { id: 'ml-3', game: 'Mobile Legends', name: 'Diamond 600', price: 175000, desc: 'Diamond 600. Value terbaik.' },
    { id: 'ml-4', game: 'Mobile Legends', name: 'Battle Pass', price: 120000, desc: 'Battle Pass akses + rewards.' },
];

const orders = [];

// ==================== ROUTES ====================
app.get('/api/products', (req, res) => res.json(PRODUCTS));

app.get('/api/orders', (req, res) => res.json(orders));

app.get('/api/orders/:id', (req, res) => {
    const order = orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
});

app.post('/api/orders', (req, res) => {
    const { playerId, productId, paymentMethod, customerInfo } = req.body;
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return res.status(400).json({ error: 'Produk tidak ditemukan' });
    if (!playerId || !playerId.trim()) return res.status(400).json({ error: 'Player ID wajib diisi' });
    
    const order = {
        id: uuidv4(),
        playerId: playerId.trim(),
        productId,
        productName: product.name,
        game: product.game,
        price: product.price,
        paymentMethod: paymentMethod || 'transfer',
        customerInfo: customerInfo || {},
        status: 'pending',
        notes: '',
        createdAt: new Date().toISOString(),
    };
    orders.push(order);
    res.status(201).json(order);
});

app.post('/api/orders/:id/status', (req, res) => {
    const order = orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const { status, paymentProof } = req.body;
    if (status === 'paid' && paymentProof) order.paymentProof = paymentProof;
    if (['pending', 'paid', 'processing', 'delivered', 'failed'].includes(status)) {
        order.status = status;
        res.json(order);
    } else {
        res.status(400).json({ error: 'Status tidak valid' });
    }
});

app.post('/api/orders/:id/notes', (req, res) => {
    const order = orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const { notes } = req.body;
    if (notes) {
        order.notes = (order.notes ? order.notes + '\n' : '') + notes;
        res.json(order);
    } else {
        res.status(400).json({ error: 'Notes wajib diisi' });
    }
});

// ==================== START ====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✓ BANGMX STORE running di http://localhost:${PORT}`);
    console.log(`✓ Admin panel: http://localhost:${PORT}/admin.html`);
});
