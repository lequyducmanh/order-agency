const { faker } = require('@faker-js/faker');

// Define a small set of categories for the menu
const categories = [
  'Tất cả',
  'Flash Sale',
  'Món Đang Giảm',
  'Món Mới',
  'Bánh kẹo',
  'Đồ uống'
];

const candyNames = [
  "Bánh quy socola",
  "Kẹo dẻo trái cây",
  "Bánh bông lan trứng muối",
  "Kẹo sữa mềm",
  "Bánh mochi nhân đậu đỏ",
  "Kẹo chanh muối",
  "Bánh quy bơ",
  "Kẹo dừa Bến Tre",
  "Bánh pía Sóc Trăng",
  "Bánh gạo giòn",
  "Kẹo me cay",
  "Bánh mì ngọt"
];

const candyImages = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80", // bánh quy socola
  "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80", // kẹo dẻo trái cây
  "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80", // bánh bông lan trứng muối
  "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80", // kẹo sữa mềm
  "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80", // bánh mochi nhân đậu đỏ
  "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80", // kẹo chanh muối
  "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80", // bánh quy bơ
  "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80", // kẹo dừa Bến Tre
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80", // bánh pía Sóc Trăng
  "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80", // bánh gạo giòn
  "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80", // kẹo me cay
  "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80" // bánh mì ngọt
];

const products = Array.from({ length: 12 }, (_, i) => ({
  id: faker.string.uuid(),
  name: candyNames[i % candyNames.length],
  price: faker.commerce.price(10000, 100000, 0),
  image: candyImages[i % candyImages.length],
  stock: faker.number.int({ min: 5, max: 50 }),
  category: faker.helpers.arrayElement(categories.slice(1)),
}));

const customers = Array.from({ length: 8 }, () => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  phone: faker.phone.number(),
  address: faker.location.streetAddress(),
}));

const orders = [];

function addOrder({ customerName, customerPhone, customerAddress, items }) {
  const order = {
    id: faker.string.uuid(),
    customerName,
    customerPhone,
    customerAddress,
    items,
    createdAt: new Date().toISOString(),
    status: 'pending',
  };
  orders.push(order);
  return order;
}

module.exports = { products, customers, orders, addOrder, categories };
