// Hiển thị ngày giờ trên header
function updateCurrentTime() {
  const now = new Date();
  const dateStr = now.toLocaleDateString('vi-VN');
  const timeStr = now.toLocaleTimeString('vi-VN');
  const el = document.getElementById('currentTime');
  if (el) el.textContent = `${dateStr} ${timeStr}`;
}
setInterval(updateCurrentTime, 1000);
updateCurrentTime();
// Logout button logic
// Logout handler now tied to the 'More' offcanvas button (if present)
const moreLogoutBtn = document.getElementById('moreLogoutBtn');
function doLogout() {
  // Clear stored customer info and cart then redirect to customer-info page
  try {
    localStorage.removeItem('customerInfo');
    localStorage.removeItem('cartItems');
  } catch (e) {}
  // update badge if present
  try { updateBadge(); } catch (e) {}
  // close offcanvas if open
  try {
    const off = document.getElementById('moreOffcanvas');
    if (off) {
      const bs = bootstrap.Offcanvas.getInstance(off) || new bootstrap.Offcanvas(off);
      bs.hide();
    }
  } catch (e) {}
  // Redirect to the customer info page
  window.location.href = '/customer-info';
}
if (moreLogoutBtn) moreLogoutBtn.addEventListener('click', doLogout);
// Edit info button navigates to the dedicated info page
const moreEditInfoBtn = document.getElementById('moreEditInfoBtn');
if (moreEditInfoBtn) {
  moreEditInfoBtn.addEventListener('click', function() {
    // close offcanvas then navigate to the info page
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
// New flow: customer info lives on /customer-info page. On overview, show shop only if customerInfo present; otherwise redirect visitor to /customer-info
const shopSection = document.getElementById('shopSection');
let customerInfo = JSON.parse(localStorage.getItem('customerInfo') || 'null');
if (!customerInfo) {
  // redirect to the info page so user can enter details
  window.location.href = '/customer-info';
} else {
  if (shopSection) shopSection.style.display = '';
}

// Cart logic
let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
const cartItemsList = document.getElementById('cartItems');
const cartBadge = document.getElementById('cartBadge');
function updateBadge() {
  if (cartBadge) {
    const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const count = cart.length;
    if (count > 0) {
      cartBadge.style.display = 'inline-block';
      cartBadge.textContent = count;
    } else {
      // hide badge when empty and reset to original icon size
      cartBadge.style.display = 'none';
      cartBadge.textContent = '';
    }
  }
}
// Toast notification helper
function showToast(msg) {
  const toast = document.getElementById('toastNoti');
  const toastMsg = document.getElementById('toastNotiMsg');
  if (!toast || !toastMsg) return;
  toastMsg.textContent = msg;
  toast.style.display = '';
  toast.classList.remove('hide');
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => { toast.style.display = 'none'; }, 500);
  }, 1500);
}

document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.id;
    const name = btn.dataset.name;
    const price = btn.dataset.price;
    cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    let item = cartItems.find(i => i.id === id);
    if (item) {
      item.qty++;
      showToast(`Đã tăng số lượng: ${name} (Tổng: ${item.qty})`);
    } else {
      cartItems.push({ id, name, price, qty: 1 });
      showToast(`Đã thêm vào giỏ: ${name} (Tổng: 1)`);
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    if (cartItemsList) renderCartItems();
    updateBadge();
    btn.classList.add('added');
    setTimeout(() => btn.classList.remove('added'), 1200);
  });
});
window.addEventListener('storage', function() {
  // other tabs updated cart -> refresh local view
  cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
  if (cartItemsList) renderCartItems();
  updateBadge();
  // update greeting if customer info changed
  updateCarouselGreeting();
});
function renderCartItems() {
  if (!cartItemsList) return;
  cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
  cartItemsList.innerHTML = '';
  let total = 0;
  cartItems.forEach(item => {
    total += item.qty * parseInt(item.price);
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.textContent = `${item.name} x ${item.qty}`;
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
  if (cartItems.length > 0) {
    const totalLi = document.createElement('li');
    totalLi.className = 'list-group-item fw-bold text-end';
    totalLi.textContent = `Tổng tiền: ${total} VND`;
    cartItemsList.appendChild(totalLi);
  }
}
renderCartItems();
updateBadge();

// Carousel greeting: update greeting text on slides when customer info is present
function updateCarouselGreeting() {
  try {
    const gEl = document.getElementById('carouselGreeting');
    if (!gEl) return;
    const info = JSON.parse(localStorage.getItem('customerInfo') || 'null');
    if (info && info.customerName) {
      gEl.textContent = `Xin chào, ${info.customerName}!`;
      gEl.classList.remove('d-none');
    } else {
      gEl.classList.add('d-none');
    }
  } catch (e) {
    // ignore
  }
}
updateCarouselGreeting();

// Category menu filtering
function initCategoryMenu() {
  try {
    const menu = document.getElementById('categoryMenu');
    if (!menu) return;
      const buttons = Array.from(menu.querySelectorAll('.category-btn'));
      // make first button active by default
      buttons.forEach((b, idx) => {
        if (idx === 0) b.classList.add('active');
        b.addEventListener('click', () => {
          buttons.forEach(x => x.classList.remove('active'));
          b.classList.add('active');
          const cat = b.dataset.cat;
          filterProductsByCategory(cat);
        });
      });
  } catch (e) {}
}

function filterProductsByCategory(cat) {
  // Ẩn/hiện nhóm sản phẩm theo danh mục
  const groups = document.querySelectorAll('.product-category-group');
  if (cat === 'Tất cả') {
    groups.forEach(g => g.style.display = '');
  } else {
    groups.forEach(g => {
      if (g.getAttribute('data-cat-group') === cat) {
        g.style.display = '';
      } else {
        g.style.display = 'none';
      }
    });
  }
}

initCategoryMenu();

// After building the menu, apply the filter for the active tab (so initial view matches the selected tab)
try {
  const activeBtn = document.querySelector('#categoryMenu .category-btn.active');
  if (activeBtn) filterProductsByCategory(activeBtn.dataset.cat);
} catch (e) {}

// Wire "Xem thêm" buttons in the category sections to filter to that category and scroll to the product grid
function initSeeMoreButtons() {
  try {
    const btns = document.querySelectorAll('.see-more-btn');
    btns.forEach(b => {
      b.addEventListener('click', (e) => {
        const cat = b.dataset.cat;
        filterProductsByCategory(cat);
      });
    });
  } catch (e) {}
}
initSeeMoreButtons();

document.getElementById('submitOrderBtn').addEventListener('click', async function() {
  if (!customerInfo) {
    alert('Vui lòng nhập thông tin khách hàng trước!');
    return;
  }
  if (cartItems.length === 0) {
    alert('Vui lòng chọn ít nhất 1 sản phẩm!');
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
  document.getElementById('orderResult').textContent = 'Đặt hàng thành công!';
  cartItems = [];
  localStorage.setItem('cartItems', '[]');
  renderCartItems();
  updateBadge();
});

// Điều hướng menu (navCart id)
const cartNavBtn = document.getElementById('navCart');
if (cartNavBtn) {
  cartNavBtn.addEventListener('click', function(e) {
    // If not logged in (no customer info), stop navigation and prompt user to enter info
    const info = localStorage.getItem('customerInfo');
    if (!info) {
      e.preventDefault();
      // prompt and send the user to the customer info page
      alert('Vui lòng nhập thông tin khách hàng trước khi vào Giỏ hàng.');
      window.location.href = '/customer-info';
    }
    // otherwise allow navigation
  });
}

// Ensure fixed bottom nav doesn't cover content: measure nav height and apply padding to main
function adjustBottomPadding() {
  try {
    const nav = document.querySelector('.app-bottom-nav');
    const main = document.querySelector('main.container');
    if (!nav || !main) return;
    const navHeight = nav.offsetHeight || parseInt(getComputedStyle(nav).height) || 68;
    // add a small gap so content isn't flush against the nav
    main.style.paddingBottom = (navHeight + 12) + 'px';
  } catch (e) {
    // ignore
  }
}

// debounce helper
let _adjTimer = null;
function debounceAdjust() {
  clearTimeout(_adjTimer);
  _adjTimer = setTimeout(adjustBottomPadding, 80);
}

// run on load and resize
adjustBottomPadding();
window.addEventListener('resize', debounceAdjust);
