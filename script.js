const cart = [];
const cartButton = document.getElementById('cartButton');
const cartDrawer = document.getElementById('cartDrawer');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const themeToggle = document.querySelector('[data-theme-toggle]');
const liveChatButton = document.getElementById('liveChatButton');
const chatWidget = document.getElementById('chatWidget');
const closeChat = document.getElementById('closeChat');

let currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
document.documentElement.setAttribute('data-theme', currentTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
  });
}

function formatBRL(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function renderCart() {
  cartCount.textContent = cart.length;
  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio.</p>';
    cartTotal.textContent = formatBRL(0);
    return;
  }

  cartItems.innerHTML = cart.map((item, index) => `
    <article class="cart-item">
      <div>
        <strong>${item.name}</strong>
        <p>${formatBRL(item.price)}</p>
      </div>
      <button aria-label="Remover ${item.name}" data-remove="${index}">✕</button>
    </article>
  `).join('');

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = formatBRL(total);

  document.querySelectorAll('[data-remove]').forEach((button) => {
    button.addEventListener('click', () => {
      cart.splice(Number(button.dataset.remove), 1);
      renderCart();
    });
  });
}

function addToCart(name, price) {
  cart.push({ name, price: Number(price) });
  renderCart();
  cartDrawer.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
}

document.querySelectorAll('.add-to-cart').forEach((button) => {
  button.addEventListener('click', () => addToCart(button.dataset.name, button.dataset.price));
});

cartButton.addEventListener('click', () => {
  cartDrawer.classList.toggle('open');
  cartDrawer.setAttribute('aria-hidden', String(!cartDrawer.classList.contains('open')));
});

closeCart.addEventListener('click', () => {
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
});

liveChatButton.addEventListener('click', () => {
  chatWidget.classList.toggle('hidden');
  chatWidget.setAttribute('aria-hidden', String(chatWidget.classList.contains('hidden')));
});

closeChat.addEventListener('click', () => {
  chatWidget.classList.add('hidden');
  chatWidget.setAttribute('aria-hidden', 'true');
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const counters = document.querySelectorAll('[data-counter]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const element = entry.target;
    const target = Number(element.dataset.counter);
    let value = 0;
    const step = Math.max(1, Math.floor(target / 40));
    const interval = setInterval(() => {
      value += step;
      if (value >= target) {
        value = target;
        clearInterval(interval);
      }
      element.textContent = `${value}+`;
    }, 28);
    counterObserver.unobserve(element);
  });
}, { threshold: 0.4 });

counters.forEach((counter) => counterObserver.observe(counter));
renderCart();
