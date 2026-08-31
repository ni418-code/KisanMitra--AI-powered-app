#!/usr/bin/env node
/**
 * Kisan Mitra — real-time (Socket.IO) smoke test.
 * Verifies that chat messages and notifications pushed by the server actually
 * arrive on the other party's socket.
 *
 * Usage: node scripts/realtime-test.mjs [baseUrl]
 */
import { io } from 'socket.io-client';

const BASE = (process.argv[2] || process.env.TEST_BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');

let pass = 0;
let fail = 0;
const failures = [];

function check(name, ok, extra) {
  if (ok) {
    pass++;
    console.log(`  ✅ ${name}`);
  } else {
    fail++;
    failures.push(name + (extra ? ` — ${extra}` : ''));
    console.log(`  ❌ ${name}${extra ? ` — ${extra}` : ''}`);
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function j(pathname, options = {}) {
  const res = await fetch(`${BASE}${pathname}`, options);
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? { status: res.status, body: await res.json() } : { status: res.status, body: null };
}

function connect(token) {
  return new Promise((resolve, reject) => {
    const socket = io(BASE, {
      transports: ['websocket', 'polling'],
      auth: token ? { token } : undefined,
      reconnection: false,
    });
    const t = setTimeout(() => reject(new Error('socket connect timeout')), 8000);
    socket.on('connect', () => {
      clearTimeout(t);
      resolve(socket);
    });
    socket.on('connect_error', (err) => {
      clearTimeout(t);
      reject(err);
    });
  });
}

async function main() {
  console.log(`\n🌾 Kisan Mitra real-time test against ${BASE}\n`);

  const login = async (role) => {
    const r = await j('/api/auth/demo-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    if (!r.body?.success) throw new Error(`login failed for ${role}`);
    return r.body.data;
  };

  const farmer = await login('farmer');
  const buyer = await login('buyer');

  // Open a conversation between them via the API.
  const convRes = await j('/api/conversations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${buyer.token}` },
    body: JSON.stringify({ targetUserId: farmer.user.id, cropName: 'Tomato' }),
  });
  check('conversation opened', convRes.body?.success && !!convRes.body.data?.conversation?.id);
  const convId = convRes.body?.data?.conversation?.id;

  const farmerSocket = await connect(farmer.token);
  const buyerSocket = await connect(buyer.token);
  check('both clients connected to Socket.IO', farmerSocket.connected && buyerSocket.connected);

  farmerSocket.emit('join-user', farmer.user.id);
  buyerSocket.emit('join-user', buyer.user.id);
  if (convId) farmerSocket.emit('join-conversation', convId);
  await sleep(300);

  // ---------- 1. chat broadcast ----------
  const receivedByFarmer = new Promise((resolve) => {
    const t = setTimeout(() => resolve(null), 6000);
    farmerSocket.on('new-message', (data) => {
      clearTimeout(t);
      resolve(data);
    });
  });

  const text = `Realtime probe ${Date.now()}`;
  const sent = await j(`/api/conversations/${convId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${buyer.token}` },
    body: JSON.stringify({ text }),
  });
  check('buyer POSTs a chat message', sent.body?.success);

  const chatEvent = await receivedByFarmer;
  check(
    'farmer receives the message over the socket in real time',
    !!chatEvent && chatEvent.message?.text === text && chatEvent.conversationId === convId,
    chatEvent ? JSON.stringify(chatEvent).slice(0, 160) : 'no event received within 6s'
  );

  // ---------- 2. notification push ----------
  const notifPromise = new Promise((resolve) => {
    const t = setTimeout(() => resolve(null), 6000);
    farmerSocket.on('notification', (data) => {
      clearTimeout(t);
      resolve(data);
    });
  });

  // Buyer creates an offer aimed at the farmer → server should push a notification.
  const products = await j('/api/products?farmerId=usr-1');
  const product = products.body?.data?.products?.[0];
  const offerRes = await j('/api/offers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${buyer.token}` },
    body: JSON.stringify({
      productId: product?.id,
      targetUserId: farmer.user.id,
      cropName: product?.cropName || 'Tomato',
      quantity: 50,
      unit: 'kg',
      proposedPrice: 30,
      transportIncluded: true,
      notes: 'Realtime notification probe',
    }),
  });
  check('buyer creates an offer', offerRes.body?.success, JSON.stringify(offerRes.body).slice(0, 160));

  const notif = await notifPromise;
  check(
    'farmer receives a live notification for the new offer',
    !!notif && notif.userId === farmer.user.id,
    notif ? JSON.stringify(notif).slice(0, 160) : 'no notification event within 6s'
  );

  // ---------- 3. typing indicator ----------
  const typingPromise = new Promise((resolve) => {
    const t = setTimeout(() => resolve(null), 4000);
    farmerSocket.on('typing-status', (data) => {
      clearTimeout(t);
      resolve(data);
    });
  });
  buyerSocket.emit('typing', { conversationId: convId, senderName: buyer.user.name, isTyping: true });
  const typing = await typingPromise;
  check('typing indicator is relayed', !!typing && typing.isTyping === true);

  farmerSocket.disconnect();
  buyerSocket.disconnect();

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
  console.error('\n💥 Real-time test crashed:', err && err.message ? err.message : err);
  process.exit(1);
});
