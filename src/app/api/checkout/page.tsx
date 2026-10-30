'use client';

import { useState } from 'react';

export default function CheckoutPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    async function handleCheckout(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const response = await fetch('/api/checkout', {
                method: 'POST',
                body: JSON.stringify({
                    product: formData.get('product'),
                    quantity: formData.get('quantity'),
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Checkout failed');
            }

            const data = await response.json();
            setMessage('Checkout successful!');
        } catch (error) {
            setMessage('Checkout failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleCheckout}>
            <input name="product" placeholder="Product ID" required />
            <input name="quantity" type="number" placeholder="Quantity" required />
            <button type="submit" disabled={loading}>
                {loading ? 'Processing...' : 'Checkout'}
            </button>
            {message && <p>{message}</p>}
        </form>
    );
}