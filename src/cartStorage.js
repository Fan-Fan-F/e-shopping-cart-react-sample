/**
 * Shared cart persistence helpers.
 *
 * The original components each did `JSON.parse(localStorage.getItem('cart'))`
 * inline with no error handling, so one corrupted payload crashed the page.
 * These helpers centralize safe read/write and item validation.
 */

const CART_KEY = 'cart';

function isValidCartItem(item) {
    return (
        item &&
        (typeof item.id === 'number' || typeof item.id === 'string') &&
        typeof item.name === 'string' &&
        typeof item.price === 'number' &&
        Number.isFinite(item.price) &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
    );
}

export function loadCart() {
    try {
        const raw = window.localStorage.getItem(CART_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter(isValidCartItem);
    } catch {
        return [];
    }
}

export function saveCart(cart) {
    try {
        window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
        // Storage unavailable (private mode / quota): cart keeps working in memory.
    }
}

/**
 * Add a product to the cart, merging with an existing line.
 * The original handler pushed duplicates, so the same product appeared
 * once per click and the total ignored quantities.
 */
export function addToCart(product) {
    const cart = loadCart();
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
        const next = cart.map((item) =>
            item.id === product.id
                ? {...item, quantity: item.quantity + 1}
                : item
        );
        saveCart(next);
        return next;
    }
    const next = [...cart, {...product, quantity: 1}];
    saveCart(next);
    return next;
}

export function clearCart() {
    saveCart([]);
}

export function cartTotal(cart) {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return Math.round(total * 100) / 100;
}
