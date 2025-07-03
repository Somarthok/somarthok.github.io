// shop.js

// Immediately invoked function to avoid polluting global scope
(() => {
  // Cart data structure: {id: {name, price, quantity}}
  let cart = {};

  // Create and insert the sticky footer cart UI
  const cartFooterHtml = `
  <div id="cart-footer" class="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[95%] max-w-4xl bg-white/80 backdrop-blur-md rounded-t-3xl rounded-b-3xl shadow-lg flex items-center justify-between px-6 py-3 z-[1100]">
    <div class="flex items-center gap-4">
      <i class="fa-solid fa-cart-shopping text-2xl text-eco1"></i>
      <span id="cart-item-count" class="font-semibold text-eco1">0 items</span>
    </div>
    <div class="flex items-center gap-2">
      <button id="decrease-qty" class="px-3 py-1 bg-eco1 text-white rounded-md shadow hover:bg-eco3 transition" aria-label="Decrease quantity">-</button>
      <input type="number" id="item-qty" value="1" min="1" class="w-16 text-center rounded-md border border-eco1 focus:ring-2 focus:ring-eco3 outline-none" aria-label="Item quantity" />
      <button id="increase-qty" class="px-3 py-1 bg-eco1 text-white rounded-md shadow hover:bg-eco3 transition" aria-label="Increase quantity">+</button>
    </div>
    <div class="font-bold text-eco1 text-lg" id="cart-total">Total: ৳0.00</div>
    <button id="checkout-btn" class="bg-eco1 text-white px-6 py-2 rounded-full shadow hover:bg-eco3 transition font-semibold flex items-center gap-2" aria-label="Checkout">
      <i class="fa-solid fa-credit-card"></i> Checkout
    </button>
  </div>
  `;
  document.body.insertAdjacentHTML('beforeend', cartFooterHtml);

  // Create and insert the modal HTML for checkout
  const modalHtml = `
  <div id="shop-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1200] hidden">
    <div class="bg-white rounded-3xl max-w-3xl w-[90%] max-h-[80vh] flex flex-col shadow-lg overflow-hidden">
      <!-- Header -->
      <div class="flex justify-between items-center p-4 border-b border-gray-200">
        <h3 class="text-xl font-semibold text-eco1">Order Summary</h3>
        <button id="modal-close-btn" class="text-eco1 hover:text-eco3 transition text-2xl" aria-label="Close modal"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <!-- Progress Bar -->
      <div class="flex items-center justify-center gap-4 p-4 border-b border-gray-200">
        <div class="flex items-center gap-2">
          <div class="progress-dot active" data-step="1" aria-label="Step 1"></div>
          <div class="progress-line"></div>
          <div class="progress-dot" data-step="2" aria-label="Step 2"></div>
          <div class="progress-line"></div>
          <div class="progress-dot" data-step="3" aria-label="Step 3"></div>
        </div>
      </div>
      <!-- Content -->
      <div id="modal-content" class="p-6 overflow-y-auto flex-1" tabindex="0" aria-live="polite" aria-atomic="true">
        <!-- Receipt content dynamically inserted here -->
      </div>
      <!-- Footer Buttons -->
      <div class="flex justify-between items-center p-4 border-t border-gray-200">
        <button id="cancel-order-btn" class="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition flex items-center gap-2" aria-label="Cancel order"><i class="fa-solid fa-trash"></i> Cancel Order</button>
        <button id="modal-next-btn" class="bg-eco1 text-white px-6 py-2 rounded-full shadow hover:bg-eco3 transition font-semibold flex items-center gap-2" aria-label="Next step">Next <i class="fa-solid fa-arrow-right"></i></button>
      </div>
    </div>
  </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // References to inserted elements
  const cartFooter = document.getElementById('cart-footer');
  const itemQtyInput = document.getElementById('item-qty');
  const decreaseQtyBtn = document.getElementById('decrease-qty');
  const increaseQtyBtn = document.getElementById('increase-qty');
  const cartItemCount = document.getElementById('cart-item-count');
  const cartTotal = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');


  // Show modal on checkout
  checkoutBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
    modal.classList.remove('hidden');
    updateProgressBar();
    renderStepContent();
  });

  const modal = document.getElementById('shop-modal');
  const modalContent = document.getElementById('modal-content');
  const modalNextBtn = document.getElementById('modal-next-btn');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const cancelOrderBtn = document.getElementById('cancel-order-btn');

  // Cart logic: add items, update quantities, calculate total
  function updateCartUI() {
    const itemCount = Object.values(cart).reduce((acc, item) => acc + item.quantity, 0);
    const total = Object.values(cart).reduce((acc, item) => acc + item.price * item.quantity, 0);
    cartItemCount.textContent = `${itemCount} item${itemCount !== 1 ? 's' : ''}`;
    cartTotal.textContent = `Total: ৳${total.toFixed(2)}`;
    itemQtyInput.value = itemCount > 0 ? itemCount : 1;
    checkoutBtn.disabled = itemCount === 0;
  }

  function addItemToCart(id, name, price) {
    if (cart[id]) {
      cart[id].quantity += 1;
    } else {
      cart[id] = { name, price, quantity: 1 };
    }
    updateCartUI();
  }

  function setQuantity(qty) {
    if (qty < 1) qty = 1;
    const keys = Object.keys(cart);
    if (keys.length === 0) return;
    const id = keys[0]; // single item for now
    cart[id].quantity = qty;
    updateCartUI();
  }

  function increaseQuantity() {
    const keys = Object.keys(cart);
    if (keys.length === 0) return;
    const id = keys[0];
    cart[id].quantity += 1;
    updateCartUI();
  }

  function decreaseQuantity() {
    const keys = Object.keys(cart);
    if (keys.length === 0) return;
    const id = keys[0];
    if (cart[id].quantity > 1) {
      cart[id].quantity -= 1;
      updateCartUI();
    }
  }

  decreaseQtyBtn.addEventListener('click', decreaseQuantity);
  increaseQtyBtn.addEventListener('click', increaseQuantity);
  itemQtyInput.addEventListener('input', e => {
    let val = parseInt(e.target.value);
    if (isNaN(val) || val < 1) val = 1;
    setQuantity(val);
  });

  // Initialize with a default item (for demo)
  addItemToCart('default', 'Sample Item', 9.99);

  // Modal state
  let currentStep = 1;

  const progressDots = modal.querySelectorAll('.progress-dot');

  function updateProgressBar() {
    progressDots.forEach(dot => {
      const step = parseInt(dot.getAttribute('data-step'));
      dot.classList.toggle('active', step === currentStep);
    });
  }

  function renderStepContent() {
    if (currentStep === 1) {
      // Receipt summary
      let receiptHtml = '<div class="space-y-4">';
      let total = 0;
      for (const id in cart) {
        const item = cart[id];
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        receiptHtml += `
          <div class="flex justify-between items-center">
            <div>
              <p class="font-semibold">${item.name}</p>
              <p class="text-sm text-gray-600">$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div class="flex items-center gap-2">
              <button data-id="${id}" class="remove-item-btn text-red-500 hover:text-red-700" aria-label="Remove ${item.name}"><i class="fa-solid fa-trash"></i></button>
              <span class="font-semibold">$${itemTotal.toFixed(2)}</span>
            </div>
          </div>`;
      }
      receiptHtml += `<hr class="my-4" />`;
      receiptHtml += `<div class="flex justify-between font-bold text-lg">Total: ৳${total.toFixed(2)}</div>`;
      receiptHtml += '</div>';
      modalContent.innerHTML = receiptHtml;
      cancelOrderBtn.style.display = 'inline-flex';
      modalNextBtn.style.display = 'inline-flex';

      // Add remove item handlers
      modalContent.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.onclick = e => {
          const id = e.currentTarget.getAttribute('data-id');
          delete cart[id];
          updateCartUI();
          renderStepContent();
          if (Object.keys(cart).length === 0) {
            closeModal();
          }
        };
      });
    } else if (currentStep === 2) {
      // Delivery info form
      modalContent.innerHTML = `
        <form id="delivery-form" class="space-y-4" novalidate>
          <div>
            <label class="block font-semibold mb-1" for="address">Delivery Address</label>
            <input type="text" id="address" name="address" class="w-full border border-gray-300 rounded-md p-2" required />
          </div>
          <div>
            <label class="block font-semibold mb-1" for="phone">Phone Number</label>
            <input type="tel" id="phone" name="phone" class="w-full border border-gray-300 rounded-md p-2" required />
          </div>
          <div>
            <label class="block font-semibold mb-1" for="notes">Additional Notes</label>
            <textarea id="notes" name="notes" class="w-full border border-gray-300 rounded-md p-2" rows="3"></textarea>
          </div>
        </form>
      `;
      cancelOrderBtn.style.display = 'inline-flex';
      modalNextBtn.style.display = 'inline-flex';
    } else if (currentStep === 3) {
      // Payment options
      modalContent.innerHTML = `
        <div class="space-y-4">
          <div class="flex gap-4">
            <button id="pay-card-btn" class="flex-1 bg-eco1 text-white py-2 rounded-md shadow hover:bg-eco3 transition font-semibold">Bank Card</button>
            <button id="pay-bkash-btn" class="flex-1 bg-white border border-eco1 text-eco1 py-2 rounded-md shadow hover:bg-eco2 transition font-semibold">Bkash</button>
          </div>
          <div id="payment-form" class="mt-4"></div>
          <button id="pay-now-btn" class="w-full bg-eco1 text-white py-3 rounded-full shadow hover:bg-eco3 transition font-bold">Pay Now</button>
        </div>
      `;
      cancelOrderBtn.style.display = 'none';
      modalNextBtn.style.display = 'none';

      const payCardBtn = document.getElementById('pay-card-btn');
      const payBkashBtn = document.getElementById('pay-bkash-btn');
      const paymentForm = document.getElementById('payment-form');

      function showCardForm() {
        payCardBtn.classList.add('bg-eco1', 'text-white');
        payCardBtn.classList.remove('bg-white', 'border', 'border-eco1', 'text-eco1');
        payBkashBtn.classList.remove('bg-eco1', 'text-white');
        payBkashBtn.classList.add('bg-white', 'border', 'border-eco1', 'text-eco1');
        paymentForm.innerHTML = `
          <form id="card-form" class="space-y-4">
            <div>
              <label class="block font-semibold mb-1" for="card-number">Card Number</label>
              <input type="text" id="card-number" name="card-number" class="w-full border border-gray-300 rounded-md p-2" placeholder="1234 5678 9012 3456" required />
            </div>
            <div>
              <label class="block font-semibold mb-1" for="card-name">Name on Card</label>
              <input type="text" id="card-name" name="card-name" class="w-full border border-gray-300 rounded-md p-2" placeholder="John Doe" required />
            </div>
            <div class="flex gap-4">
              <div class="flex-1">
                <label class="block font-semibold mb-1" for="expiry">Expiry Date</label>
                <input type="text" id="expiry" name="expiry" class="w-full border border-gray-300 rounded-md p-2" placeholder="MM/YY" required />
              </div>
              <div class="flex-1">
                <label class="block font-semibold mb-1" for="cvv">CVV</label>
                <input type="text" id="cvv" name="cvv" class="w-full border border-gray-300 rounded-md p-2" placeholder="123" required />
              </div>
            </div>
          </form>
        `;
      }

      function showBkashForm() {
        payBkashBtn.classList.add('bg-eco1', 'text-white');
        payBkashBtn.classList.remove('bg-white', 'border', 'border-eco1', 'text-eco1');
        payCardBtn.classList.remove('bg-eco1', 'text-white');
        payCardBtn.classList.add('bg-white', 'border', 'border-eco1', 'text-eco1');
        paymentForm.innerHTML = `
          <div class="mb-4">
            <p class="font-semibold">Send Bkash payment to: <span class="text-eco1">0170000001</span></p>
          </div>
          <form id="bkash-form" class="space-y-4">
            <div>
              <label class="block font-semibold mb-1" for="trxid">Transaction ID (TrxID)</label>
              <input type="text" id="trxid" name="trxid" class="w-full border border-gray-300 rounded-md p-2" placeholder="Enter TrxID" required />
            </div>
            <div>
              <label class="block font-semibold mb-1" for="sender-phone">Sender's Phone Number</label>
              <input type="tel" id="sender-phone" name="sender-phone" class="w-full border border-gray-300 rounded-md p-2" placeholder="Enter Phone Number" required />
            </div>
          </form>
        `;
      }

      payCardBtn.addEventListener('click', showCardForm);
      payBkashBtn.addEventListener('click', showBkashForm);

      // Default to card form
      showCardForm();

      const payNowBtn = document.getElementById('pay-now-btn');
      payNowBtn.addEventListener('click', () => {
        paymentForm.innerHTML = `
          <div class="flex flex-col items-center justify-center py-20">
            <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-eco1 mb-6"></div>
            <p class="text-eco1 font-semibold text-lg">Processing your transaction...</p>
          </div>
        `;
        payNowBtn.disabled = true;
        setTimeout(() => {
          paymentForm.innerHTML = `
            <div class="flex flex-col items-center justify-center py-20 gap-4">
              <i class="fa-solid fa-check-circle text-4xl text-eco1"></i>
              <p class="text-eco1 font-bold text-xl text-center">Thank you! You just contributed one more step closer to an eco-friendly world. 🌿</p>
            </div>
          `;
          payNowBtn.style.display = 'none';
        }, 3000);
      });
    }
  }

  // Modal control functions
  function closeModal() {
    modal.style.display = 'none';
    currentStep = 1;
    updateProgressBar();
    renderStepContent();
  }

  modalCloseBtn.addEventListener('click', closeModal);

  cancelOrderBtn.addEventListener('click', () => {
    cart = {};
    updateCartUI();
    closeModal();
  });

  modalNextBtn.addEventListener('click', () => {
    if (currentStep === 1) {
      if (Object.keys(cart).length === 0) {
        alert('Your cart is empty!');
        return;
      }
      currentStep = 2;
    } else if (currentStep === 2) {
      const form = document.getElementById('delivery-form');
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      currentStep = 3;
    }
    updateProgressBar();
    renderStepContent();
  });

  // Initialize UI
  updateCartUI();
  updateProgressBar();
  renderStepContent();

  // Expose addItemToCart globally for app.js or other scripts to call
  window.addItemToCart = addItemToCart;
})();
