function getTotalPrice() {
  const cartItem = document.querySelectorAll('.cart__item');
  let sumOfPrices = 0;
  cartItem.forEach((element) => {
    sumOfPrices += parseFloat(element.innerHTML.split('$')[1]);
  });
  document.querySelector('.total-price').innerHTML = Math.round(sumOfPrices * 100) / 100;
}

const getItemStorage = () => {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = localStorage.cartItems;
};

const setItem = () => {
  const cartItems = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cartItems', cartItems);
};

function removeFromCar() {
  const cartItems = document.querySelector('.cart__items');
  cartItems.addEventListener('click', (event) => {
    if (event.target.classList.contains('cart__item')) {
      event.target.parentElement.removeChild(event.target);
      getTotalPrice();
      setItem();
    }
  });
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const appendObject = (object) => {
  document.querySelector('.loading').remove();
  object.forEach((element) => {
    const newObject = {
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    };
    const items = document.querySelector('.items');
    items.appendChild(createProductItemElement(newObject));
  });
};

const appendInCart = (object) => {
  const cart = document.querySelector('.cart__items');
  const newObject = {
    sku: object.id,
    name: object.title,
    salePrice: object.price,
  };
  cart.appendChild(createCartItemElement(newObject));
  setItem();
  getTotalPrice();
};

const fetchToCart = id =>
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(response => response.json())
    .then(data => appendInCart(data));

const eventTarget = (event) => {
  if (event.target.classList.contains('item__add')) {
    const parentElement = event.target.parentNode;
    const id = parentElement.firstChild.innerText;
    fetchToCart(id);
  }
};

const addToCart = () => {
  const items = document.querySelector('.items');
  items.addEventListener('click', eventTarget);
};

const buttonEmptyCart = () => {
  const button = document.querySelector('.empty-cart');
  const cart = document.querySelector('.cart__items');
  button.addEventListener('click', () => {
    while (cart.firstChild) {
      cart.removeChild(cart.firstChild);
    }
    setItem();
    getTotalPrice();
  });
};

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data => appendObject(data.results));
  addToCart();
  buttonEmptyCart();
  getItemStorage();
  getTotalPrice();
  removeFromCar();
};
