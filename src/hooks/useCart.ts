import { useEffect, useMemo, useState } from 'react';
import { db } from '../data/db';
import type { Guitar, CartItem } from '../types/index';

const useCart = () => {
	const initialCart = (): CartItem[] => {
		const localStorageCart = localStorage.getItem('cart');
		return localStorageCart ? JSON.parse(localStorageCart) : [];
	};

	const [data] = useState(db);
	const [cart, setCart] = useState(initialCart);

	const MAX_ITEMS = 5;
	const MIN_ITEMS = 1;

	useEffect(() => {
		localStorage.setItem('cart', JSON.stringify(cart));
	}, [cart]);

	const addToCart = (item: Guitar) => {
		const itemExist = cart.findIndex((guitar) => guitar.id === item.id);

		if (itemExist >= 0) {
			if (cart[itemExist].quatity >= MAX_ITEMS) return;

			const updateCart = [...cart];
			updateCart[itemExist].quatity++;
			setCart(updateCart);
		} else {
			const newItem: CartItem = { ...item, quatity: 1 }
			setCart([...cart, newItem]);
		}
	};

	const removeFromCart = (id: Guitar['id']) => {
		setCart((prevCart) => prevCart.filter((guitar) => guitar.id !== id));
	};

	const increaseQuantity = (id: Guitar['id']) => {
		const updatedCart = cart.map((item) => {
			if (item.id === id && item.quatity < MAX_ITEMS) {
				return {
					...item,
					quatity: item.quatity + 1,
				};
			}

			return item;
		});

		setCart(updatedCart);
	};

	const decreaseQuatity = (id: Guitar['id']) => {
		const updatedCart = cart.map((item) => {
			if (item.id === id && item.quatity > MIN_ITEMS) {
				return {
					...item,
					quatity: item.quatity - 1,
				};
			}
			return item;
		});
		setCart(updatedCart);
	};

	const clearCart = () => {
		setCart([]);
	};

	// State Derivado
	const isEmpty = useMemo(() => cart.length === 0, [cart]);

	const cartTotal = useMemo(
		() => cart.reduce((total, item) => total + item.quatity * item.price, 0),
		[cart]
	);

	return {
		data,
		cart,
		addToCart,
		removeFromCart,
		decreaseQuatity,
		increaseQuantity,
		clearCart,
		isEmpty,
		cartTotal,
	};
};

export default useCart;
