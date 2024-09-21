const productsList = document.querySelector(".grid-list");

// import data from "./data.js";

const allProducts = document.querySelectorAll(".product-card");

// Search functionality
const searchInputDOMElement = document.querySelector(".search__input");
// Product filter
const filterBtns = document.querySelectorAll("[data-filter-btn]");
const filterBox = document.querySelector("[data-filter]");
let lastClickedFilterBtn = filterBtns[0];

const filter = function () {
  lastClickedFilterBtn.classList.remove("active");
  this.classList.add("active");
  lastClickedFilterBtn = this;
  filterBox.setAttribute("data-filter", this.dataset.filterBtn);
  filterProducts(this.dataset.filterBtn);
};

// Add event listeners to filter buttons
addEventOnElem(filterBtns, "click", filter);
function filterAndGroupProducts(searchTerm) {
  const filteredProducts = Array.from(allProducts).filter(product => {
    return product.textContent.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  // Show filtered products
  allProducts.forEach(product => {
    product.parentElement.style.display = 'none'; // Hide all products initially
  });
  filteredProducts.forEach(product => {
    product.parentElement.style.display = 'block'; // Show filtered products
  });
}

function filterProducts(category) {
  allProducts.forEach(product => {
    if (category === 'all' || product.parentElement.classList.contains(category)) {
      product.parentElement.style.display = 'block'; // Show product if it matches the category
    } else {
      product.parentElement.style.display = 'none'; // Hide product if it doesn't match
    }
  });
}

// Sort functionality
const sortSelect = document.createElement('select');
sortSelect.style.padding = '10px 5px'
sortSelect.innerHTML = `
  <option value="default">Sort by</option>
  <option value="price-asc">Price: Low to High</option>
  <option value="price-desc">Price: High to Low</option>
`;
document.querySelector('.title-wrapper').appendChild(sortSelect);

sortSelect.addEventListener('change', function() {
  const sortValue = this.value;
  const productList = Array.from(allProducts).map(product => product.parentElement);
  
  if (sortValue === 'price-asc') {
    productList.sort((a, b) => {
      const priceA = parseFloat(a.querySelector('.price').getAttribute('value'));
      const priceB = parseFloat(b.querySelector('.price').getAttribute('value'));
      return priceA - priceB;
    });
  } else if (sortValue === 'price-desc') {
    productList.sort((a, b) => {
      const priceA = parseFloat(a.querySelector('.price').getAttribute('value'));
      const priceB = parseFloat(b.querySelector('.price').getAttribute('value'));
      return priceB - priceA;
    });
  }

  const productListContainer = document.querySelector('.product-list');
  productListContainer.innerHTML = '';
  productList.forEach(product => productListContainer.appendChild(product));
});

// Debounce function to limit the frequency of function calls
const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    const context = this;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(context, args), delay);
  };
};

// Combine debounce with filterAndGroupProducts for both search inputs
const handleSearchInput = debounce(function (e) {
  const searchTerm = e.target.value.trim();
  if (searchTerm) {
    filterAndGroupProducts(searchTerm);
  } else {
    // If the search input is empty, reset the filter
    allProducts.forEach(product => {
      product.parentElement.style.display = 'block'; // Show all products
    });
  }
}, 300);

searchInputDOMElement.addEventListener('input', handleSearchInput);

// Function to add event listeners
function addEventOnElem(elem, type, callback) {
  if (elem.length && elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else if (elem.length === undefined) {
    elem.addEventListener(type, callback);
  }
}
// searchInputDOMElement.addEventListener('input' , filterAndGroupProducts(searchInputDOMElement.value))

