#!/usr/bin/env node
/**
 * Kisan Mitra — end-to-end API smoke test.
 * Boots nothing; assumes the server is already running at BASE (default http://localhost:3000).
 * Usage: node scripts/smoke-test.mjs [baseUrl]
 */
const BASE = (process.argv[2] || process.env.TEST_BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');

let pass = 0;
let fail = 0;
const failures = [];

function check(name, cond, extra) {
  if (cond) {
    pass++;
    console.log(`  ✅ ${name}`);
  } else {
    fail++;
    failures.push(name + (extra ? ` — ${extra}` : ''));
    console.log(`  ❌ ${name}${extra ? ` — ${extra}` : ''}`);
  }
}

async function j(pathname, options = {}) {
  const res = await fetch(`${BASE}${pathname}`, options);
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('application/json')) {
    const text = await res.text();
    throw new Error(`${pathname} -> HTTP ${res.status}, non-JSON: ${text.slice(0, 200)}`);
  }
  return { status: res.status, body: await res.json() };
}

const auth = (token) => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` });
const post = (pathname, token, body) => j(pathname, { method: 'POST', headers: auth(token), body: JSON.stringify(body || {}) });
const put = (pathname, token, body) => j(pathname, { method: 'PUT', headers: auth(token), body: JSON.stringify(body || {}) });
const patch = (pathname, token, body) => j(pathname, { method: 'PATCH', headers: auth(token), body: JSON.stringify(body || {}) });
const del = (pathname, token) => j(pathname, { method: 'DELETE', headers: auth(token) });
const get = (pathname, token) => j(pathname, { headers: token ? auth(token) : { 'Content-Type': 'application/json' } });

async function main() {
  console.log(`\n🌾 Kisan Mitra smoke test against ${BASE}\n`);

  // ---------- Public ----------
  console.log('[Public endpoints]');
  {
    const r = await get('/api/health');
    check('GET /api/health healthy', r.status === 200 && r.body.status === 'healthy');
  }
  {
    const r = await get('/api/markets/prices');
    check('GET /api/markets/prices', r.body.success && Array.isArray(r.body.data?.prices) && r.body.data.prices.length > 0);
  }
  {
    const r = await get('/api/markets/crops/Tomato');
    check('GET /api/markets/crops/:crop', r.body.success && Array.isArray(r.body.data?.history));
  }
  {
    const r = await get('/api/markets/msp');
    check('GET /api/markets/msp', r.body.success && Array.isArray(r.body.data?.mspList) && r.body.data.mspList.length > 0);
  }
  {
    const r = await get('/api/markets/net-return?cropName=Tomato&quantityKg=1000&farmerDistrict=Guntur&farmerState=Andhra%20Pradesh');
    check('GET /api/markets/net-return', r.body.success);
  }
  {
    const r = await get('/api/products');
    check('GET /api/products', r.body.success && Array.isArray(r.body.data?.products));
  }
  {
    const r = await get('/api/buyer-requests');
    check('GET /api/buyer-requests', r.body.success && Array.isArray(r.body.data?.requests));
  }
  {
    const r = await post('/api/ai/chat', null, { message: 'What is the best time to sell tomato?', language: 'en' });
    check('POST /api/ai/chat', r.body.success && typeof r.body.data?.reply === 'string' && r.body.data.reply.length > 0, JSON.stringify(r.body).slice(0, 200));
  }

  // ---------- Auth ----------
  console.log('\n[Auth]');
  let farmerToken, buyerToken, adminToken;
  {
    const r = await post('/api/auth/demo-login', null, { role: 'farmer' });
    check('POST /api/auth/demo-login (farmer)', r.body.success && !!r.body.data?.token && r.body.data.user.role === 'farmer');
    farmerToken = r.body.data?.token;
  }
  {
    const r = await post('/api/auth/demo-login', null, { role: 'buyer' });
    check('POST /api/auth/demo-login (buyer)', r.body.success && !!r.body.data?.token && r.body.data.user.role === 'buyer');
    buyerToken = r.body.data?.token;
  }
  {
    const r = await post('/api/auth/demo-login', null, { role: 'admin' });
    check('POST /api/auth/demo-login (admin)', r.body.success && !!r.body.data?.token && r.body.data.user.role === 'admin');
    adminToken = r.body.data?.token;
  }
  {
    const r = await get('/api/auth/me', farmerToken);
    check('GET /api/auth/me', r.body.success && !!r.body.data?.user?.id);
  }
  {
    const r = await j('/api/auth/me', { headers: { 'Content-Type': 'application/json' } });
    check('GET /api/auth/me rejects anonymous', r.status === 401 || r.body.success === false);
  }
  {
    const r = await j('/api/auth/me', { headers: { 'Content-Type': 'application/json', Authorization: 'Bearer garbage.token.here' } });
    check('GET /api/auth/me rejects bad token', r.status === 401 || r.body.success === false);
  }
  const otpPhone = '90000' + String(Date.now()).slice(-5);
  {
    const r = await post('/api/auth/send-otp', null, { phone: otpPhone, role: 'farmer' });
    check('POST /api/auth/send-otp', r.body.success && !!r.body.data?.demoCode);
    const code = r.body.data?.demoCode;
    if (code) {
      const v = await post('/api/auth/verify-otp', null, { phone: otpPhone, otp: code, role: 'farmer', name: 'Test Farmer' });
      check('POST /api/auth/verify-otp (new user signup)', v.body.success && !!v.body.data?.token, JSON.stringify(v.body).slice(0, 200));
    } else {
      check('POST /api/auth/verify-otp (new user signup)', false, 'no demoCode returned');
    }
  }
  {
    const r = await put('/api/auth/profile', farmerToken, { name: 'Ramesh Patel' });
    check('PUT /api/auth/profile', r.body.success && !!r.body.data?.user);
  }

  // ---------- Produce ----------
  console.log('\n[Farmer produce]');
  let productId;
  {
    const r = await post('/api/products', farmerToken, {
      cropName: 'Onion',
      category: 'Vegetables',
      variety: 'Nasik Red',
      quantity: 800,
      unit: 'kg',
      expectedPrice: 24,
      quality: 'Grade A (Premium)',
      location: { state: 'Andhra Pradesh', district: 'Guntur', market: 'Guntur Mandi' },
      availableFrom: '2026-09-01',
      availableUntil: '2026-09-30',
      description: 'Smoke-test lot',
    });
    check('POST /api/products (farmer)', r.body.success && !!r.body.data?.product?.id);
    productId = r.body.data?.product?.id;
  }
  {
    const r = await post('/api/products', buyerToken, { cropName: 'Hack', quantity: 1, unit: 'kg', expectedPrice: 1 });
    check('POST /api/products rejected for buyer (403)', r.status === 403 || r.body.success === false);
  }
  if (productId) {
    const r = await get(`/api/products/${productId}`);
    check('GET /api/products/:id', r.body.success && r.body.data?.product?.id === productId);
    const u = await put(`/api/products/${productId}`, farmerToken, { expectedPrice: 26 });
    check('PUT /api/products/:id', u.body.success && u.body.data?.product?.expectedPrice === 26);
    const m = await get(`/api/products/${productId}/matching-requests`, farmerToken);
    check('GET /api/products/:id/matching-requests', m.body.success && Array.isArray(m.body.data?.matches));
  }

  // ---------- Buyer requirements ----------
  console.log('\n[Buyer requirements]');
  let requestId;
  {
    const r = await post('/api/buyer-requests', buyerToken, {
      cropName: 'Onion',
      quantity: 500,
      unit: 'kg',
      offeredPrice: 25,
      deliveryLocation: { state: 'Telangana', district: 'Hyderabad', address: 'Smoke test warehouse' },
      requiredDate: '2026-09-10',
      qualityRequirement: 'Grade A (Premium)',
      description: 'Smoke-test requirement',
    });
    check('POST /api/buyer-requests (buyer)', r.body.success && !!r.body.data?.request?.id);
    requestId = r.body.data?.request?.id;
  }
  {
    const r = await post('/api/buyer-requests', farmerToken, { cropName: 'Onion', quantity: 1, unit: 'kg', offeredPrice: 1 });
    check('POST /api/buyer-requests rejected for farmer (403)', r.status === 403 || r.body.success === false);
  }
  if (requestId) {
    const r = await get(`/api/buyer-requests/${requestId}/matching-farmers`, buyerToken);
    check('GET /api/buyer-requests/:id/matching-farmers', r.body.success && Array.isArray(r.body.data?.matches));
  }

  // ---------- Offers + orders + escrow ----------
  console.log('\n[Offers → order → escrow]');
  let offerId, orderId;
  if (productId && requestId) {
    const r = await post('/api/offers', buyerToken, {
      requestId,
      productId,
      targetUserId: 'usr-1',
      cropName: 'Onion',
      quantity: 400,
      unit: 'kg',
      proposedPrice: 25,
      transportIncluded: true,
      notes: 'Smoke test offer',
    });
    check('POST /api/offers', r.body.success && !!r.body.data?.offer?.id);
    offerId = r.body.data?.offer?.id;
  }
  {
    const r = await get('/api/offers', farmerToken);
    check('GET /api/offers', r.body.success && Array.isArray(r.body.data?.offers));
  }
  if (offerId) {
    const r = await put(`/api/offers/${offerId}/accept`, farmerToken, {});
    check('PUT /api/offers/:id/accept creates order + conversation', r.body.success && !!r.body.data?.order?.id);
    orderId = r.body.data?.order?.id;
  }
  if (orderId) {
    // deposit (buyer) -> mark_delivered (farmer) -> verify_quality (buyer) -> auto-release
    const steps = [
      ['deposit', buyerToken, 'funds_locked'],
      ['mark_delivered', farmerToken, 'farmer_delivered'],
      ['verify_quality', buyerToken, 'released'], // auto-releases once delivered + verified
    ];
    let ok = true;
    let detail = '';
    for (const [action, token, expected] of steps) {
      const r = await post(`/api/orders/${orderId}/escrow`, token, { action });
      const step = r.body?.data?.order?.escrowStep;
      if (!r.body.success || step !== expected) {
        ok = false;
        detail = `action=${action} -> step=${step} body=${JSON.stringify(r.body).slice(0, 200)}`;
        break;
      }
    }
    check('Escrow flow deposit → delivered → verified → auto-released', ok, detail);
    const o = await get(`/api/orders/${orderId}`, buyerToken);
    check('GET /api/orders/:id', o.body.success && o.body.data?.order?.paymentStatus === 'released');
  }
  {
    const r = await get('/api/orders', farmerToken);
    check('GET /api/orders', r.body.success && Array.isArray(r.body.data?.orders));
  }

  // ---------- Logistics ----------
  console.log('\n[Logistics & storage]');
  let taskId;
  {
    const r = await post('/api/logistics', farmerToken, {
      type: 'transport',
      title: 'Smoke Test Truck — Guntur → Hyderabad',
      reference: 'Vehicle: Test Truck • Driver: Test Driver',
      driverName: 'Test Driver',
      vehicle: 'Test Truck',
      pickup: 'Guntur',
      drop: 'Hyderabad',
    });
    check('POST /api/logistics', r.body.success && !!r.body.data?.task?.id);
    taskId = r.body.data?.task?.id;
  }
  if (taskId) {
    const r = await patch(`/api/logistics/${taskId}/status`, farmerToken, { status: 'completed', notes: 'done' });
    check('PATCH /api/logistics/:id/status', r.body.success);
  }
  {
    const r = await get('/api/logistics', farmerToken);
    check('GET /api/logistics', r.body.success && Array.isArray(r.body.data?.tasks));
  }

  // ---------- Chat ----------
  console.log('\n[Real-time chat]');
  let convId;
  {
    const r = await post('/api/conversations', farmerToken, { targetUserId: 'usr-2', cropName: 'Onion' });
    check('POST /api/conversations', r.body.success && !!r.body.data?.conversation?.id);
    convId = r.body.data?.conversation?.id;
  }
  {
    const r = await get('/api/conversations', farmerToken);
    check('GET /api/conversations', r.body.success && Array.isArray(r.body.data?.conversations));
  }
  if (convId) {
    const r = await post(`/api/conversations/${convId}/messages`, farmerToken, { text: 'Namaste, smoke test message' });
    check('POST /api/conversations/:id/messages', r.body.success && !!r.body.data?.message?.id);
    const c = await get('/api/conversations', buyerToken);
    const found = c.body?.data?.conversations?.find((x) => x.id === convId);
    check('message visible to the other party', !!found && (found.messages || []).some((m) => m.text === 'Namaste, smoke test message'));
  }

  // ---------- Notifications ----------
  console.log('\n[Notifications]');
  {
    const r = await get('/api/notifications', farmerToken);
    check('GET /api/notifications', r.body.success && Array.isArray(r.body.data?.notifications));
    const first = r.body.data.notifications[0];
    if (first) {
      const p = await patch(`/api/notifications/${first.id}/read`, farmerToken, {});
      check('PATCH /api/notifications/:id/read', p.body.success);
    } else {
      check('PATCH /api/notifications/:id/read', false, 'no notification to read');
    }
  }

  // ---------- Price alerts ----------
  console.log('\n[Price alerts]');
  let alertId;
  {
    const r = await post('/api/alerts', farmerToken, { crop: 'Tomato', targetPrice: 32, condition: 'above', market: 'All', district: 'Guntur' });
    check('POST /api/alerts', r.body.success && !!r.body.data?.alert?.id);
    alertId = r.body.data?.alert?.id;
  }
  if (alertId) {
    const t = await patch(`/api/alerts/${alertId}/toggle`, farmerToken, {});
    check('PATCH /api/alerts/:id/toggle', t.body.success);
    const d = await del(`/api/alerts/${alertId}`, farmerToken);
    check('DELETE /api/alerts/:id', d.body.success);
  }
  {
    const r = await get('/api/alerts', farmerToken);
    check('GET /api/alerts', r.body.success && Array.isArray(r.body.data?.alerts));
  }

  // ---------- Admin ----------
  console.log('\n[Admin]');
  {
    const r = await get('/api/admin/stats', adminToken);
    check('GET /api/admin/stats', r.body.success && !!r.body.data?.stats);
  }
  {
    const r = await get('/api/admin/users', adminToken);
    check('GET /api/admin/users', r.body.success && Array.isArray(r.body.data?.users));
  }
  {
    const r = await get('/api/admin/disputes', adminToken);
    check('GET /api/admin/disputes', r.body.success && Array.isArray(r.body.data?.disputes));
  }
  {
    const r = await get('/api/admin/stats', farmerToken);
    check('GET /api/admin/stats forbidden for farmer (403)', r.status === 403 || r.body.success === false);
  }
  {
    const r = await post('/api/markets/sync', adminToken, {});
    check('POST /api/markets/sync', r.status === 200 || r.body.success === true, JSON.stringify(r.body).slice(0, 160));
  }

  // ---------- Static / PWA ----------
  console.log('\n[PWA + static assets]');
  for (const p of ['/', '/manifest.webmanifest', '/sw.js', '/icons/icon-192.png', '/og-image.jpg']) {
    const res = await fetch(`${BASE}${p}`);
    check(`GET ${p} → 200`, res.status === 200, `got ${res.status}`);
    await res.arrayBuffer();
  }

  console.log(`\n──────────────────────────────`);
  console.log(`✅ Passed: ${pass}   ❌ Failed: ${fail}`);
  if (failures.length) {
    console.log('\nFailures:');
    failures.forEach((f) => console.log('  - ' + f));
  }
  console.log('');
  process.exit(fail === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error('\n💥 Smoke test crashed:', err.message);
  process.exit(1);
});
