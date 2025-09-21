// Data models and LocalStorage utilities

// Generate unique IDs
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Data types
export const createCar = (name, imgUrl) => ({
  id: generateId(),
  name,
  imgUrl,
  createdAt: new Date().toISOString(),
});

export const createWashType = (name, defaultPrice) => ({
  id: generateId(),
  name,
  defaultPrice,
  perCarOverrides: {},
  createdAt: new Date().toISOString(),
});

export const createWash = (carId, washTypeId, price, date, notes = '', companyId = null, carPlate = '', isPaid = false) => ({
  id: generateId(),
  carId,
  washTypeId,
  price,
  date,
  notes,
  companyId,
  carPlate,
  isPaid,
  createdAt: new Date().toISOString(),
});

export const createCompany = (name, contactPerson = '', phone = '', email = '', address = '') => ({
  id: generateId(),
  name,
  contactPerson,
  phone,
  email,
  address,
  createdAt: new Date().toISOString(),
});

export const createExpense = (name, amount, category = '', date, notes = '') => ({
  id: generateId(),
  name,
  amount,
  category,
  date,
  notes,
  createdAt: new Date().toISOString(),
});

// Default store structure
export const createDefaultStore = () => ({
  version: 1,
  cars: [
    createCar('BMW', 'https://logos-world.net/wp-content/uploads/2020/04/BMW-Logo.png'),
    createCar('Audi', 'https://logos-world.net/wp-content/uploads/2020/04/Audi-Logo.png'),
    createCar('Mercedes', 'https://logos-world.net/wp-content/uploads/2020/04/Mercedes-Benz-Logo.png'),
  ],
  washTypes: [
    createWashType('Brenda', 5),
    createWashType('Jashtë', 7),
    createWashType('E Plotë', 10),
  ],
  companies: [
    createCompany('Kompania ABC', 'Genti Hoxha', '+355 69 123 4567', 'genti@abc.al', 'Rruga Dëshmorët, Tiranë'),
    createCompany('Biznes XYZ', 'Ana Krasniqi', '+355 69 987 6543', 'ana@xyz.al', 'Bulevardi Dëshmorët, Prishtinë'),
  ],
  washes: [],
  expenses: [],
  settings: {
    currency: '€',
    weekMode: 'last7days',
    taxRate: 0,
    discountPercentage: 0,
    minimumWashPrice: 1,
    maximumWashPrice: 100,
    businessName: '',
    businessAddress: '',
    phoneNumber: '',
    email: '',
  },
});

// LocalStorage operations
const STORAGE_KEY = 'cw.data';

export const loadStore = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return migrateStoreIfNeeded(parsed);
    }
  } catch (error) {
    console.error('Error loading store:', error);
  }
  return createDefaultStore();
};

export const saveStore = (store) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    return true;
  } catch (error) {
    console.error('Error saving store:', error);
    return false;
  }
};

export const migrateStoreIfNeeded = (store) => {
  if (!store.version) {
    store.version = 1;
  }
  
  // Add companies if they don't exist
  if (!store.companies) {
    store.companies = [
      createCompany('Kompania ABC', 'Genti Hoxha', '+355 69 123 4567', 'genti@abc.al', 'Rruga Dëshmorët, Tiranë'),
      createCompany('Biznes XYZ', 'Ana Krasniqi', '+355 69 987 6543', 'ana@xyz.al', 'Bulevardi Dëshmorët, Prishtinë'),
    ];
  }
  
  // Migrate settings to include new fields
  if (!store.settings) {
    store.settings = {};
  }
  
  // Add new settings fields if they don't exist
  const defaultSettings = {
    currency: '€',
    weekMode: 'last7days',
    taxRate: 0,
    discountPercentage: 0,
    minimumWashPrice: 1,
    maximumWashPrice: 100,
    businessName: '',
    businessAddress: '',
    phoneNumber: '',
    email: '',
  };
  
  store.settings = { ...defaultSettings, ...store.settings };
  
  // Future migration logic can be added here
  return store;
};

export const resetStore = () => {
  localStorage.removeItem(STORAGE_KEY);
  return createDefaultStore();
};

// Store operations
export const addCar = (store, carData) => {
  const newCar = createCar(carData.name, carData.imgUrl);
  const newStore = {
    ...store,
    cars: [...store.cars, newCar],
  };
  saveStore(newStore);
  return newStore;
};

export const updateCar = (store, carId, updates) => {
  const newStore = {
    ...store,
    cars: store.cars.map(car =>
      car.id === carId ? { ...car, ...updates } : car
    ),
  };
  saveStore(newStore);
  return newStore;
};

export const deleteCar = (store, carId) => {
  const newStore = {
    ...store,
    cars: store.cars.filter(car => car.id !== carId),
    // Remove per-car overrides from wash types
    washTypes: store.washTypes.map(washType => {
      const { [carId]: removed, ...remainingOverrides } = washType.perCarOverrides || {};
      return { ...washType, perCarOverrides: remainingOverrides };
    }),
  };
  saveStore(newStore);
  return newStore;
};

export const addWashType = (store, washTypeData) => {
  const newWashType = createWashType(washTypeData.name, washTypeData.defaultPrice);
  const newStore = {
    ...store,
    washTypes: [...store.washTypes, newWashType],
  };
  saveStore(newStore);
  return newStore;
};

export const updateWashType = (store, washTypeId, updates) => {
  const newStore = {
    ...store,
    washTypes: store.washTypes.map(washType =>
      washType.id === washTypeId ? { ...washType, ...updates } : washType
    ),
  };
  saveStore(newStore);
  return newStore;
};

export const deleteWashType = (store, washTypeId) => {
  const newStore = {
    ...store,
    washTypes: store.washTypes.filter(washType => washType.id !== washTypeId),
  };
  saveStore(newStore);
  return newStore;
};

export const addWash = (store, washData) => {
  const newWash = createWash(
    washData.carId,
    washData.washTypeId,
    washData.price,
    washData.date,
    washData.notes,
    washData.companyId || null,
    washData.carPlate || '',
    washData.isPaid || false
  );
  const newStore = {
    ...store,
    washes: [...store.washes, newWash],
  };
  saveStore(newStore);
  return newStore;
};

export const updateWash = (store, washId, updates) => {
  const newStore = {
    ...store,
    washes: store.washes.map(wash =>
      wash.id === washId ? { ...wash, ...updates } : wash
    ),
  };
  saveStore(newStore);
  return newStore;
};

export const deleteWash = (store, washId) => {
  const newStore = {
    ...store,
    washes: store.washes.filter(wash => wash.id !== washId),
  };
  saveStore(newStore);
  return newStore;
};

export const addExpense = (store, expenseData) => {
  const newExpense = createExpense(
    expenseData.name,
    expenseData.amount,
    expenseData.category,
    expenseData.date,
    expenseData.notes
  );
  const newStore = {
    ...store,
    expenses: [...store.expenses, newExpense],
  };
  saveStore(newStore);
  return newStore;
};

export const updateExpense = (store, expenseId, updates) => {
  const newStore = {
    ...store,
    expenses: store.expenses.map(expense =>
      expense.id === expenseId ? { ...expense, ...updates } : expense
    ),
  };
  saveStore(newStore);
  return newStore;
};

export const deleteExpense = (store, expenseId) => {
  const newStore = {
    ...store,
    expenses: store.expenses.filter(expense => expense.id !== expenseId),
  };
  saveStore(newStore);
  return newStore;
};

// CRUD operations for companies
export const addCompany = (store, companyData) => {
  const newCompany = createCompany(
    companyData.name,
    companyData.contactPerson || '',
    companyData.phone || '',
    companyData.email || '',
    companyData.address || ''
  );
  const newStore = {
    ...store,
    companies: [...store.companies, newCompany],
  };
  saveStore(newStore);
  return newStore;
};

export const updateCompany = (store, companyId, updates) => {
  const newStore = {
    ...store,
    companies: store.companies.map(company =>
      company.id === companyId ? { ...company, ...updates } : company
    ),
  };
  saveStore(newStore);
  return newStore;
};

export const deleteCompany = (store, companyId) => {
  const newStore = {
    ...store,
    companies: store.companies.filter(company => company.id !== companyId),
  };
  saveStore(newStore);
  return newStore;
};

// Price resolution
export const resolveDefaultPrice = (store, carId, washTypeId) => {
  const washType = store.washTypes.find(wt => wt.id === washTypeId);
  if (!washType) return 0;
  
  // Check for per-car override first
  if (washType.perCarOverrides && washType.perCarOverrides[carId]) {
    return washType.perCarOverrides[carId];
  }
  
  return washType.defaultPrice;
};

// Export/Import functionality
export const exportData = (store) => {
  // Create export metadata
  const exportData = {
    ...store,
    exportInfo: {
      exportedAt: new Date().toISOString(),
      exportedBy: 'Car Wash Manager',
      version: store.version || 1,
      totalWashes: store.washes.length,
      totalExpenses: store.expenses.length,
      totalCars: store.cars.length,
      totalWashTypes: store.washTypes.length,
      totalCompanies: store.companies.length,
    }
  };
  
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  // Create a more descriptive filename
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0];
  const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '-');
  const exportFileDefaultName = `autolarje-backup-${dateStr}-${timeStr}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const importData = (file, onSuccess, onError) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedData = JSON.parse(e.target.result);
      
      // Remove export metadata if it exists
      const importedStore = { ...importedData };
      delete importedStore.exportInfo;
      
      // Enhanced validation
      if (!importedStore.cars || !importedStore.washTypes || !importedStore.washes || !importedStore.expenses) {
        throw new Error('Format i pavlefshëm të dhënash. Sigurohuni që skedari përmban të gjitha seksionet e nevojshme.');
      }
      
      // Validate required arrays
      if (!Array.isArray(importedStore.cars) || !Array.isArray(importedStore.washTypes) || 
          !Array.isArray(importedStore.washes) || !Array.isArray(importedStore.expenses)) {
        throw new Error('Format i pavlefshëm të dhënash. Të dhënat duhet të jenë në formë array.');
      }
      
      // Check if companies array exists, if not add it
      if (!importedStore.companies) {
        importedStore.companies = [];
      }
      
      // Check if settings exist, if not add default settings
      if (!importedStore.settings) {
        importedStore.settings = {
          currency: '€',
          weekMode: 'last7days',
          taxRate: 0,
          discountPercentage: 0,
          minimumWashPrice: 1,
          maximumWashPrice: 100,
          businessName: '',
          businessAddress: '',
          phoneNumber: '',
          email: '',
        };
      }
      
      const migratedStore = migrateStoreIfNeeded(importedStore);
      saveStore(migratedStore);
      onSuccess(migratedStore);
    } catch (error) {
      onError(error);
    }
  };
  reader.readAsText(file);
};
