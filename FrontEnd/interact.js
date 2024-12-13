let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemsList = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    checkoutButton.addEventListener('click', checkout);

    function addToCart(event) {
        const menuItem = event.target.closest('.menu-item');
        const id = menuItem.dataset.id;
        const name = menuItem.dataset.name;
        const price = parseFloat(menuItem.dataset.price);

        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }

        updateCart();
    }

    function updateCart() {
        cartItemsList.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;
            cartItemsList.appendChild(li);
            total += item.price * item.quantity;
        });

        cartTotal.textContent = total.toFixed(2);
    }

    function checkout() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        alert(`Thank you for your purchase! Total: $${total.toFixed(2)}`);
        cart = [];
        updateCart();
    }
});