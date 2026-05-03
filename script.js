// Initial state
const initialData = [];

let items = [...initialData];

// DOM Elements
const listContainer = document.getElementById('item-list');
const countBadge = document.getElementById('item-count');
const addForm = document.getElementById('add-form');
const searchInput = document.getElementById('search-input');
const maxPriceInput = document.getElementById('max-price-input');
const resetButton = document.getElementById('reset-btn');

// Utility: Format Rupiah (custom formatting to match the design)
const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number).replace(/^Rp/, 'Rp ');
};

// Render Items to the table
const renderItems = () => {
  const searchTerm = searchInput.value.toLowerCase();
  const maxPrice = maxPriceInput.value ? parseInt(maxPriceInput.value) : Infinity;

  // Filter items based on search and max price
  const filteredItems = items.filter(item => {
    const matchName = item.name.toLowerCase().includes(searchTerm);
    const matchPrice = item.price <= maxPrice;
    return matchName && matchPrice;
  });

  // Clear list container
  listContainer.innerHTML = '';
  
  if (filteredItems.length === 0) {
    if (items.length === 0) {
      listContainer.innerHTML = `
        <div class="px-6 py-12 flex flex-col items-center justify-center text-center">
          <div class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
             <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
          </div>
          <p class="text-gray-500 font-medium text-sm">Anda belum menambahkan barang.</p>
          <p class="text-gray-400 text-xs mt-1">Silakan tambahkan barang baru melalui form di atas.</p>
        </div>
      `;
    } else {
      listContainer.innerHTML = `
        <div class="px-6 py-8 text-center text-gray-500 text-sm">
          Tidak ada barang yang sesuai dengan pencarian Anda.
        </div>
      `;
    }
  } else {
    // Inject items into the list
    filteredItems.forEach(item => {
      const row = document.createElement('div');
      row.className = 'grid grid-cols-12 items-center px-6 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors';
      row.innerHTML = `
        <div class="col-span-5 text-[14px] font-semibold text-[#1e293b] pr-4 whitespace-nowrap overflow-hidden text-ellipsis">
          ${item.name}
        </div>
        <div class="col-span-3 text-[14px] font-semibold text-[#1e293b]">
          ${formatRupiah(item.price)}
        </div>
        <div class="col-span-2 text-[14px] font-semibold text-[#1e293b]">
          ${item.stock}
        </div>
        <div class="col-span-2 flex justify-end">
          <button onclick="deleteItem(${item.id})" class="text-red-400 bg-[#FFF5F5] p-2 rounded-lg hover:bg-red-100 hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-200">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      `;
      listContainer.appendChild(row);
    });
  }

  // Update item count badge
  countBadge.textContent = `${items.length} Barang`;
};

// Handle Add Form Submission
addForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nameInput = document.getElementById('name');
  const priceInput = document.getElementById('price');
  const stockInput = document.getElementById('stock');

  const name = nameInput.value.trim();
  const price = parseInt(priceInput.value);
  const stock = parseInt(stockInput.value);

  if (name && !isNaN(price) && !isNaN(stock)) {
    const newItem = {
      id: Date.now(), // Generate a unique ID based on timestamp
      name,
      price,
      stock
    };
    
    // Add to items array
    items.unshift(newItem); // Add new items to the top of the list
    
    // Reset form
    addForm.reset();
    
    // Re-render
    renderItems();
  }
});

// Handle Delete Item
window.deleteItem = (id) => {
  if(confirm("Apakah Anda yakin ingin menghapus barang ini?")) {
    items = items.filter(item => item.id !== id);
    renderItems();
  }
};

// Handle Search Input
searchInput.addEventListener('input', renderItems);

// Handle Max Price Filter Input
maxPriceInput.addEventListener('input', renderItems);

// Handle Reset Filter Button
resetButton.addEventListener('click', () => {
  searchInput.value = '';
  maxPriceInput.value = '';
  renderItems();
});

// Initial Render on Page Load
renderItems();
