// Cart page logic: require customerInfo, load cart from localStorage, render, allow remove, submit order
if (!localStorage.getItem('customerInfo')) {
  // not logged in / no customer info -> redirect to customer info page
  alert('Vui lòng nhập thông tin khách hàng trước khi xem giỏ hàng.');
  window.location.href = '/customer-info';
}
let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
const cartItemsList = document.getElementById('cartPageItems');
const badge = document.getElementById('cartPageBadge');
function renderCartItems() {
  cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
  cartItemsList.innerHTML = '';
  let total = 0;
  cartItems.forEach(item => {
    const itemTotal = item.qty * parseInt(item.price);
    total += itemTotal;
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `<span><b>${item.name}</b> x ${item.qty} <span class='text-secondary ms-2'>${item.price} VND</span></span>`;
    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-sm btn-danger';
    removeBtn.textContent = 'X';
    removeBtn.onclick = () => {
      cartItems.splice(cartItems.indexOf(item), 1);
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      renderCartItems();
      updateBadge();
    };
    li.appendChild(removeBtn);
    cartItemsList.appendChild(li);
  });
  document.getElementById('cartTotal').textContent = cartItems.length > 0 ? `Tổng tiền: ${total} VND` : '';
  updateBadge();
}
function updateBadge() {
  const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
  const count = cart.length;
  if (badge) {
    if (count > 0) {
      badge.style.display = 'inline-block';
      badge.textContent = count;
    } else {
      badge.style.display = 'none';
      badge.textContent = '';
    }
  }
}
window.addEventListener('storage', function() {
  renderCartItems();
  updateBadge();
});
renderCartItems();
document.getElementById('cartSubmitOrderBtn').addEventListener('click', async function() {
  if (cartItems.length === 0) {
    alert('Vui lòng chọn ít nhất 1 sản phẩm!');
    return;
  }
  // Lấy thông tin khách hàng từ localStorage
  const customerInfo = JSON.parse(localStorage.getItem('customerInfo') || 'null');
  if (!customerInfo) {
    alert('Vui lòng nhập thông tin khách hàng ở trang chính!');
    return;
  }
  const data = {
    ...customerInfo,
    items: cartItems
  };
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await res.json();
  document.getElementById('cartOrderResult').textContent = 'Đặt hàng thành công!';
  cartItems = [];
  localStorage.setItem('cartItems', '[]');
  renderCartItems();
  updateBadge();
});
// Điều hướng menu (navCart id)
const cartNavBtn = document.getElementById('navCart');
if (cartNavBtn) {
  cartNavBtn.addEventListener('click', function(e) {
    // link already points to /cart, no JS navigation needed
  });
}

// Wire logout button in offcanvas (if present on this page)
const moreLogoutBtnCart = document.getElementById('moreLogoutBtn');
if (moreLogoutBtnCart) {
  moreLogoutBtnCart.addEventListener('click', function() {
    try {
      localStorage.removeItem('customerInfo');
      localStorage.removeItem('cartItems');
    } catch (e) {}
    // close offcanvas
    try {
      const off = document.getElementById('moreOffcanvas');
      if (off) {
        const bs = bootstrap.Offcanvas.getInstance(off) || new bootstrap.Offcanvas(off);
        bs.hide();
      }
    } catch (e) {}
    // redirect to customer info page
    window.location.href = '/customer-info';
  });
}
// Edit info button on cart page
const moreEditInfoBtnCart = document.getElementById('moreEditInfoBtn');
if (moreEditInfoBtnCart) {
  moreEditInfoBtnCart.addEventListener('click', function() {
    try { localStorage.removeItem('customerInfo'); } catch (e) {}
    // close and redirect to home so user can enter info
    try {
      const off = document.getElementById('moreOffcanvas');
      if (off) {
        const bs = bootstrap.Offcanvas.getInstance(off) || new bootstrap.Offcanvas(off);
        bs.hide();
      }
    } catch (e) {}
    window.location.href = '/customer-info';
  });
}

// Ensure fixed bottom nav doesn't cover content on cart page
function adjustBottomPaddingCart() {
  try {
    const nav = document.querySelector('.app-bottom-nav');
    const main = document.querySelector('main.container');
    if (!nav || !main) return;
    const navHeight = nav.offsetHeight || parseInt(getComputedStyle(nav).height) || 68;
    main.style.paddingBottom = (navHeight + 12) + 'px';
  } catch (e) {
    // ignore
  }
}

adjustBottomPaddingCart();
window.addEventListener('resize', function() {
  clearTimeout(window.__cartPadTimer);
  window.__cartPadTimer = setTimeout(adjustBottomPaddingCart, 80);
});
