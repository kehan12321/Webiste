import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ClientContext = createContext(null);

const LS_KEY = 'zaliant_client_state_v1';

// Demo seed cards to ensure Apply works out-of-the-box
const DEMO_GIFTS = {
  'GFT-DEMO100': 100,
  'GFT-START50': 50,
};

const initialState = {
  user: { id: 'u1', name: 'Guest', email: '' },
  addresses: [],
  paymentMethods: [],
  orders: [],
  tickets: [],
  // Gift cards map: code -> { balance: number, createdAt: string }
  giftCards: {},
};

export const ClientProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const loaded = raw ? JSON.parse(raw) : initialState;
      // Merge demo gifts if missing
      const now = new Date().toISOString();
      const withSeeds = { ...loaded, giftCards: { ...loaded.giftCards } };
      Object.entries(DEMO_GIFTS).forEach(([code, amount]) => {
        if (!withSeeds.giftCards[code]) {
          withSeeds.giftCards[code] = { balance: amount, createdAt: now };
        }
      });
      return withSeeds;
    } catch {
      // Fallback to initial with seeds
      const now = new Date().toISOString();
      const seeded = { ...initialState, giftCards: {} };
      Object.entries(DEMO_GIFTS).forEach(([code, amount]) => {
        seeded.giftCards[code] = { balance: amount, createdAt: now };
      });
      return seeded;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const addAddress = (addr) => setState(s => ({ ...s, addresses: [...s.addresses, { id: cryptoRandomId(), ...addr }] }));
  const removeAddress = (id) => setState(s => ({ ...s, addresses: s.addresses.filter(a => a.id !== id) }));

  const addPaymentMethod = (pm) => setState(s => ({ ...s, paymentMethods: [...s.paymentMethods, { id: cryptoRandomId(), ...pm }] }));
  const removePaymentMethod = (id) => setState(s => ({ ...s, paymentMethods: s.paymentMethods.filter(p => p.id !== id) }));

  const addOrder = (order) => setState(s => ({ ...s, orders: [{ id: cryptoRandomId(), createdAt: new Date().toISOString(), ...order }, ...s.orders] }));

  // Replace orders with server-sourced ones (normalize shape for dashboard)
  const setOrdersFromServer = (orders) => {
    const normalized = (orders || []).map(o => ({
      id: o.id || cryptoRandomId(),
      createdAt: o.createdAt || new Date().toISOString(),
      txId: o.txId || `ORD-${o.id ?? ''}`,
      paidWith: o.paidWith || (o.status === 'PAID' ? 'Payment' : 'Pending'),
      total: Number(o.total || 0),
      giftApplied: Number(o.giftApplied || 0),
    }));
    setState(s => ({ ...s, orders: normalized }));
  };

  const createTicket = (ticket) => setState(s => ({ ...s, tickets: [{ id: cryptoRandomId(), status: 'open', createdAt: new Date().toISOString(), ...ticket }, ...s.tickets] }));

  const generateGiftCode = (len = 10) => {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'GFT-';
    for (let i = 0; i < len; i++) code += alphabet[Math.floor(Math.random() * alphabet.length)];
    return code;
  };

  const purchaseGiftCard = (amount) => {
    const code = generateGiftCode();
    setState(s => ({
      ...s,
      giftCards: { ...s.giftCards, [code]: { balance: amount, createdAt: new Date().toISOString() } }
    }));
    return code;
  };

  const addGiftCard = (code, amount) => {
    setState(s => ({
      ...s,
      giftCards: { ...s.giftCards, [code]: { balance: (s.giftCards[code]?.balance || 0) + amount, createdAt: s.giftCards[code]?.createdAt || new Date().toISOString() } }
    }));
  };

  const getGiftCardBalance = (code) => state.giftCards[code?.toUpperCase?.() || code]?.balance || 0;

  const applyGiftCard = (code, amount) => {
    setState(s => {
      const key = code?.toUpperCase?.() || code;
      const current = s.giftCards[key]?.balance || 0;
      const used = Math.min(current, amount);
      const remaining = Math.max(0, current - used);
      const next = { ...s.giftCards };
      next[key] = { balance: remaining, createdAt: s.giftCards[key]?.createdAt || new Date().toISOString() };
      return { ...s, giftCards: next };
    });
  };

  const value = useMemo(() => ({
    state,
    addAddress,
    removeAddress,
    addPaymentMethod,
    removePaymentMethod,
    addOrder,
    setOrdersFromServer,
    createTicket,
    purchaseGiftCard,
    addGiftCard,
    getGiftCardBalance,
    applyGiftCard,
  }), [state]);

  return (
    <ClientContext.Provider value={value}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => {
  const ctx = useContext(ClientContext);
  if (!ctx) throw new Error('useClient must be used within ClientProvider');
  return ctx;
};

function cryptoRandomId() {
  const arr = new Uint32Array(2);
  (window.crypto || window.msCrypto).getRandomValues(arr);
  return 'id-' + arr[0].toString(36) + arr[1].toString(36);
}
