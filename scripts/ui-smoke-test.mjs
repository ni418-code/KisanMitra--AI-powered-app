#!/usr/bin/env node
/**
 * Kisan Mitra — headless UI smoke test.
 *
 * Renders the real React app inside jsdom (via Vite's SSR module loader, so the
 * exact same source files the browser would run are used), walks through every
 * view of every role and fails on any console error, unhandled rejection or
 * React render crash.
 *
 * Usage: node scripts/ui-smoke-test.mjs [serverBaseUrl]
 *        (the Express/Vite dev server must be running — API calls hit it)
 */
import { JSDOM } from 'jsdom';
import { createServer } from 'vite';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BASE = (process.argv[2] || process.env.TEST_BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');

const ROLE_FLOWS = {
  farmer: [
    'dashboard',
    'market_prices',
    'msp_table',
    'produce',
    'deals',
    'offers',
    'orders',
    'escrow',
    'logistics_storage',
    'profit_calculator',
    'chat',
    'alerts',
    'ai_assistant',
    'disputes',
    'profile',
  ],
  buyer: [
    'dashboard',
    'market_prices',
    'buyer_requests',
    'deals',
    'offers',
    'orders',
    'escrow',
    'chat',
    'alerts',
    'ai_assistant',
    'disputes',
    'profile',
  ],
  // The admin sidebar intentionally only exposes the dashboard, escrow,
  // the admin demo controller and the profile page.
  admin: ['dashboard', 'escrow', 'admin_panel', 'profile'],
};

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

async function main() {
  console.log(`\n🌾 Kisan Mitra UI smoke test (jsdom) against ${BASE}\n`);

  // ---------- jsdom environment ----------
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
    url: `${BASE}/`,
    pretendToBeVisual: true,
  });
  const { window } = dom;

  const define = (key, value) =>
    Object.defineProperty(globalThis, key, { value, writable: true, configurable: true, enumerable: true });

  define('window', window);
  define('document', window.document);
  define('navigator', window.navigator);
  define('HTMLElement', window.HTMLElement);
  define('Element', window.Element);
  define('Node', window.Node);
  define('Event', window.Event);
  define('CustomEvent', window.CustomEvent);
  define('MouseEvent', window.MouseEvent);
  define('KeyboardEvent', window.KeyboardEvent);
  define('DOMParser', window.DOMParser);
  define('SVGElement', window.SVGElement);
  define('getComputedStyle', window.getComputedStyle.bind(window));
  define('requestAnimationFrame', window.requestAnimationFrame.bind(window));
  define('cancelAnimationFrame', window.cancelAnimationFrame.bind(window));
  define('localStorage', window.localStorage);
  define('sessionStorage', window.sessionStorage);
  define('WebSocket', window.WebSocket);
  define('IS_REACT_ACT_ENVIRONMENT', true);
  window.IS_REACT_ACT_ENVIRONMENT = true;
  window.matchMedia =
    window.matchMedia ||
    ((q) => ({ matches: false, media: q, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() {} }));
  define('matchMedia', window.matchMedia);
  window.scrollTo = () => {};
  define('scrollTo', window.scrollTo);
  // jsdom does not implement scrollIntoView; mirror it as a no-op.
  window.Element.prototype.scrollIntoView = function scrollIntoView() {};
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  define('ResizeObserver', window.ResizeObserver);
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  define('IntersectionObserver', window.IntersectionObserver);

  // Relative + absolute fetches resolve to the running dev server.
  const nodeFetch = globalThis.fetch;
  global.fetch = (input, init) => {
    let url = typeof input === 'string' ? input : input.url;
    if (/^\//.test(url)) url = `${BASE}${url}`;
    return nodeFetch(url, init);
  };
  window.fetch = global.fetch;

  // ---------- console / error capture ----------
  const consoleErrors = [];
  const pageErrors = [];
  const origError = console.error;
  const origWarn = console.warn;
  console.error = (...args) => {
    const msg = args.map((a) => (a && a.stack ? a.stack : String(a))).join(' ');
    consoleErrors.push(msg);
    origError('    [console.error]', msg.slice(0, 400));
  };
  console.warn = (...args) => {
    const msg = args.map(String).join(' ');
    // Vite/React dev noise we don't care about.
    if (/deprecat|Download the React DevTools/i.test(msg)) return;
    consoleErrors.push('WARN: ' + msg);
  };
  window.addEventListener('error', (e) => pageErrors.push(String(e.message)));
  window.addEventListener('unhandledrejection', (e) => pageErrors.push('unhandledrejection: ' + String(e.reason)));
  const onUnhandled = (reason) => pageErrors.push('unhandledrejection: ' + String(reason));
  process.on('unhandledRejection', onUnhandled);

  // ---------- load the real app through Vite ----------
  const vite = await createServer({
    root: ROOT,
    logLevel: 'error',
    server: { middlewareMode: true, hmr: { port: 24679 }, watch: null },
    appType: 'custom',
  });

  let App;
  try {
    App = (await vite.ssrLoadModule('/src/App.tsx')).default;
  } catch (err) {
    console.error = origError;
    console.log(`\n💥 Could not load the app: ${err.stack || err.message}`);
    await vite.close();
    process.exit(1);
  }

  const container = window.document.getElementById('root');
  const root = createRoot(container);

  const errorsBefore = consoleErrors.length;
  await act(async () => {
    root.render(React.createElement(App));
  });
  await act(async () => {
    await sleep(600);
  });

  check('App mounts on the landing page without crashing', container.innerHTML.length > 1000);
  const landingText = container.textContent || '';
  check('Landing page renders hero content', /Kisan/i.test(landingText));

  // ---------- helper: click the sidebar item for a view ----------
  async function clickText(text, tag = 'button') {
    const nodes = Array.from(container.querySelectorAll(tag));
    const node = nodes.find((n) => (n.textContent || '').trim().toLowerCase().includes(text.toLowerCase()));
    if (!node) return false;
    await act(async () => {
      node.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    });
    await act(async () => {
      await sleep(120);
    });
    return true;
  }

  async function login(role) {
    // The AuthContext exposes demo login through the app's own demo buttons.
    // Simplest reliable path: hit the API directly and stash the token, then remount.
    const res = await fetch(`${BASE}/api/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(`demo-login failed for ${role}`);
    window.localStorage.setItem('km_auth_token', json.data.token);
    await act(async () => {
      root.render(null);
    });
    await act(async () => {
      root.render(React.createElement(App));
    });
    await act(async () => {
      await sleep(700);
    });
  }

  const VIEW_LABELS = {
    dashboard: 'Dashboard',
    market_prices: 'Market Intelligence',
    msp_table: 'MSP Benchmarks',
    produce: 'My Produce Lots',
    buyer_requests: 'Purchase Requirements',
    deals: 'Smart Matching Engine',
    offers: 'Offers & Negotiations',
    orders: 'Orders & Transactions',
    escrow: 'Secure Escrow',
    logistics_storage: 'Logistics & Transport',
    profit_calculator: 'Profit & Sale Window',
    chat: 'Direct Chat',
    alerts: 'Price Alerts',
    ai_assistant: 'AI KisanMitra Sahayak',
    disputes: 'Help & Grievances',
    profile: 'Profile & Settings',
    admin_panel: 'Admin Demo Controller',
  };

  for (const role of ['farmer', 'buyer', 'admin']) {
    console.log(`\n[${role.toUpperCase()} flow]`);
    const before = consoleErrors.length;
    await login(role);
    const afterLogin = container.textContent || '';
    check(`${role}: logged in (workspace shows role badge)`, new RegExp(role === 'admin' ? 'Admin / System' : role === 'farmer' ? 'Farmer / FPO' : 'Buyer / Processor', 'i').test(afterLogin));

    for (const view of ROLE_FLOWS[role]) {
      const label = VIEW_LABELS[view] || view;
      const errCountBefore = consoleErrors.length;
      const clicked = await clickText(label);
      const text = container.textContent || '';
      const errs = consoleErrors.slice(errCountBefore);
      const ok = clicked && container.innerHTML.length > 500 && errs.length === 0;
      check(`${role}: view "${view}" renders`, ok, !clicked ? 'sidebar item not found' : errs.length ? errs[0].slice(0, 180) : '');
      if (!ok && errs.length) {
        // give the other views a chance; do not abort
      }
      void text;
    }
    void before;
  }

  // ---------- logout / landing again ----------
  await act(async () => {
    window.localStorage.removeItem('km_auth_token');
    root.render(null);
  });
  await act(async () => {
    root.render(React.createElement(App));
  });
  await act(async () => {
    await sleep(500);
  });
  check('App renders landing page again after logout', (container.textContent || '').length > 200);

  console.error = origError;
  console.warn = origWarn;
  process.off('unhandledRejection', onUnhandled);

  await act(async () => {
    root.unmount();
  });
  await vite.close();

  const realErrors = consoleErrors.filter(
    (e) => !/Warning: |not wrapped in act|useLayoutEffect does nothing on the server|WebSocket server error: Port \d+ is already in use/i.test(e)
  );
  check('No console errors / React warnings during the whole walkthrough', realErrors.length === 0, realErrors.slice(0, 3).join(' | ').slice(0, 400));
  check('No unhandled promise rejections', pageErrors.length === 0, pageErrors.slice(0, 2).join(' | ').slice(0, 300));

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
  console.error('\n💥 UI smoke test crashed:', err && err.stack ? err.stack : err);
  process.exit(1);
});
