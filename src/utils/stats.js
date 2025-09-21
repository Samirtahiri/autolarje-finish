// Statistics calculation utilities

// Helper functions for date calculations
export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.toDateString() === d2.toDateString();
};

export const isLast7Days = (date, now = new Date()) => {
  const targetDate = new Date(date);
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  return targetDate >= sevenDaysAgo && targetDate <= now;
};

export const isThisMonth = (date, now = new Date()) => {
  const targetDate = new Date(date);
  return targetDate.getMonth() === now.getMonth() && 
         targetDate.getFullYear() === now.getFullYear();
};

export const isToday = (date, now = new Date()) => {
  return isSameDay(date, now);
};

// Calculate KPIs for different time periods
export const calculateKPIs = (store, now = new Date()) => {
  const { washes, expenses } = store;
  
  const todayWashes = washes.filter(wash => isToday(wash.date, now));
  const last7DaysWashes = washes.filter(wash => isLast7Days(wash.date, now));
  const thisMonthWashes = washes.filter(wash => isThisMonth(wash.date, now));
  
  const todayExpenses = expenses.filter(expense => isToday(expense.date, now));
  const last7DaysExpenses = expenses.filter(expense => isLast7Days(expense.date, now));
  const thisMonthExpenses = expenses.filter(expense => isThisMonth(expense.date, now));
  
  const calculatePeriodStats = (washList, expenseList) => {
    const income = washList.reduce((sum, wash) => sum + wash.price, 0);
    const totalExpenses = expenseList.reduce((sum, expense) => sum + expense.amount, 0);
    const profit = income - totalExpenses;
    
    return {
      income: Math.round(income * 100) / 100,
      expenses: Math.round(totalExpenses * 100) / 100,
      profit: Math.round(profit * 100) / 100,
    };
  };
  
  return {
    today: calculatePeriodStats(todayWashes, todayExpenses),
    last7Days: calculatePeriodStats(last7DaysWashes, last7DaysExpenses),
    thisMonth: calculatePeriodStats(thisMonthWashes, thisMonthExpenses),
  };
};

// Calculate income breakdowns
export const calculateIncomeByCar = (store) => {
  const { washes, cars } = store;
  
  const carIncome = {};
  washes.forEach(wash => {
    const car = cars.find(c => c.id === wash.carId);
    const carName = car ? car.name : 'Unknown Car';
    carIncome[carName] = (carIncome[carName] || 0) + wash.price;
  });
  
  return Object.entries(carIncome)
    .map(([carName, income]) => ({ carName, income: Math.round(income * 100) / 100 }))
    .sort((a, b) => b.income - a.income)
    .slice(0, 5);
};

export const calculateIncomeByWashType = (store) => {
  const { washes, washTypes } = store;
  
  const typeIncome = {};
  washes.forEach(wash => {
    const washType = washTypes.find(wt => wt.id === wash.washTypeId);
    const typeName = washType ? washType.name : 'Unknown Type';
    typeIncome[typeName] = (typeIncome[typeName] || 0) + wash.price;
  });
  
  return Object.entries(typeIncome)
    .map(([typeName, income]) => ({ typeName, income: Math.round(income * 100) / 100 }))
    .sort((a, b) => b.income - a.income)
    .slice(0, 5);
};

// Get all statistics
export const getAllStats = (store) => {
  const kpis = calculateKPIs(store);
  const incomeByCar = calculateIncomeByCar(store);
  const incomeByWashType = calculateIncomeByWashType(store);
  
  return {
    kpis,
    incomeByCar,
    incomeByWashType,
  };
};

// Format currency
export const formatCurrency = (amount, currency = '€') => {
  return `${amount.toFixed(2)}${currency}`;
};

// Format date for display
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Format date for input fields
export const formatDateForInput = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm format
};
