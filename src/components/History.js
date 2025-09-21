import React, { useState } from 'react';
import { updateWash, deleteWash, updateExpense, deleteExpense } from '../utils/storage';
import { formatDate, formatCurrency } from '../utils/stats';

const History = ({ store, updateStore }) => {
  const [activeTab, setActiveTab] = useState('washes');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');
  const [carFilter, setCarFilter] = useState('');
  const [washTypeFilter, setWashTypeFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [editingWash, setEditingWash] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Get filtered data
  const getFilteredWashes = () => {
    let filtered = [...store.washes];
    
    if (dateFromFilter) {
      const fromDate = new Date(dateFromFilter);
      fromDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(wash => new Date(wash.date) >= fromDate);
    }
    
    if (dateToFilter) {
      const toDate = new Date(dateToFilter);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(wash => new Date(wash.date) <= toDate);
    }
    
    if (carFilter) {
      filtered = filtered.filter(wash => wash.carId === carFilter);
    }
    
    if (washTypeFilter) {
      filtered = filtered.filter(wash => wash.washTypeId === washTypeFilter);
    }
    
    if (companyFilter) {
      if (companyFilter === 'no-company') {
        filtered = filtered.filter(wash => !wash.companyId);
      } else {
        filtered = filtered.filter(wash => wash.companyId === companyFilter);
      }
    }
    
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const getFilteredExpenses = () => {
    let filtered = [...store.expenses];
    
    if (dateFromFilter) {
      const fromDate = new Date(dateFromFilter);
      fromDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(expense => new Date(expense.date) >= fromDate);
    }
    
    if (dateToFilter) {
      const toDate = new Date(dateToFilter);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(expense => new Date(expense.date) <= toDate);
    }
    
    if (categoryFilter) {
      filtered = filtered.filter(expense => expense.category === categoryFilter);
    }
    
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const handleEditWash = (wash) => {
    setEditingWash({ ...wash });
  };

  const handleSaveWash = () => {
    if (!editingWash.carId || !editingWash.washTypeId || editingWash.price <= 0) {
      setError('Ju lutemi plotësoni të gjitha fushat e kërkuara me vlera të vlefshme');
      return;
    }

    try {
      const newStore = updateWash(store, editingWash.id, {
        carId: editingWash.carId,
        washTypeId: editingWash.washTypeId,
        price: editingWash.price,
        date: new Date(editingWash.date).toISOString(),
        notes: editingWash.notes || '',
        companyId: editingWash.companyId || null,
        carPlate: editingWash.carPlate || '',
        isPaid: editingWash.isPaid || false,
      });

      updateStore(newStore);
      setEditingWash(null);
      setSuccess('Larja u përditësua me sukses!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Dështoi përditësimi i larjes');
    }
  };

  const handleDeleteWash = (washId) => {
    if (window.confirm('Jeni i sigurt që dëshironi të fshini këtë larje?')) {
      const newStore = deleteWash(store, washId);
      updateStore(newStore);
      setSuccess('Larja u fshi me sukses!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense({ ...expense });
  };

  const handleSaveExpense = () => {
    if (!editingExpense.name || editingExpense.amount <= 0) {
      setError('Ju lutemi plotësoni të gjitha fushat e kërkuara me vlera të vlefshme');
      return;
    }

    try {
      const newStore = updateExpense(store, editingExpense.id, {
        name: editingExpense.name,
        amount: editingExpense.amount,
        category: editingExpense.category || '',
        date: new Date(editingExpense.date).toISOString(),
        notes: editingExpense.notes || '',
      });

      updateStore(newStore);
      setEditingExpense(null);
      setSuccess('Shpenzimi u përditësua me sukses!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Dështoi përditësimi i shpenzimit');
    }
  };

  const handleDeleteExpense = (expenseId) => {
    if (window.confirm('Jeni i sigurt që dëshironi të fshini këtë shpenzim?')) {
      const newStore = deleteExpense(store, expenseId);
      updateStore(newStore);
      setSuccess('Shpenzimi u fshi me sukses!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const getCarName = (carId) => {
    const car = store.cars.find(c => c.id === carId);
    return car ? car.name : 'Unknown Car';
  };

  const getWashTypeName = (washTypeId) => {
    const washType = store.washTypes.find(wt => wt.id === washTypeId);
    return washType ? washType.name : 'Unknown Type';
  };

  const getCompanyName = (companyId) => {
    const company = store.companies.find(c => c.id === companyId);
    return company ? company.name : 'Unknown Company';
  };

  const categories = [...new Set(store.expenses.map(e => e.category).filter(Boolean))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Historiku</h1>
        <p className="mt-1 text-sm text-gray-500">
          Shiko dhe menaxho larjet dhe shpenzimet e tua
        </p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800 text-sm">{error}</div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="text-green-800 text-sm">{success}</div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('washes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'washes'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Larjet ({getFilteredWashes().length})
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'expenses'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Shpenzimet ({getFilteredExpenses().length})
          </button>
        </nav>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nga Data</label>
            <input
              type="date"
              value={dateFromFilter}
              onChange={(e) => setDateFromFilter(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Deri në Datën</label>
            <input
              type="date"
              value={dateToFilter}
              onChange={(e) => setDateToFilter(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {activeTab === 'washes' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Filtro Makina</label>
                <select
                  value={carFilter}
                  onChange={(e) => setCarFilter(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Të Gjitha Makinat</option>
                  {store.cars.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Filtro Lloj Larjeje</label>
                <select
                  value={washTypeFilter}
                  onChange={(e) => setWashTypeFilter(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Të Gjitha Llojet</option>
                  {store.washTypes.map((washType) => (
                    <option key={washType.id} value={washType.id}>
                      {washType.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Filtro Kompani</label>
                <select
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Të Gjitha Kompanitë</option>
                  <option value="no-company">Pa Kompani (Individual)</option>
                  {store.companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {activeTab === 'expenses' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Filtro Kategori</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Të Gjitha Kategoritë</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Quick Date Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 mr-2">Filtrat e shpejtë:</span>
          <button
            onClick={() => {
              const today = new Date();
              setDateFromFilter(today.toISOString().split('T')[0]);
              setDateToFilter(today.toISOString().split('T')[0]);
            }}
            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
          >
            Sot
          </button>
          <button
            onClick={() => {
              const today = new Date();
              const weekAgo = new Date(today);
              weekAgo.setDate(today.getDate() - 7);
              setDateFromFilter(weekAgo.toISOString().split('T')[0]);
              setDateToFilter(today.toISOString().split('T')[0]);
            }}
            className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200"
          >
            7 Ditët e Fundit
          </button>
          <button
            onClick={() => {
              const today = new Date();
              const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
              setDateFromFilter(monthStart.toISOString().split('T')[0]);
              setDateToFilter(today.toISOString().split('T')[0]);
            }}
            className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200"
          >
            Këtë Muaj
          </button>
          <button
            onClick={() => {
              setDateFromFilter('');
              setDateToFilter('');
              setCarFilter('');
              setWashTypeFilter('');
              setCompanyFilter('');
              setCategoryFilter('');
            }}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
          >
            Fshij të gjitha
          </button>
        </div>
      </div>

      {/* Përmbledhje Filtri */}
      {(dateFromFilter || dateToFilter || carFilter || washTypeFilter || companyFilter || categoryFilter) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Përmbledhje e Filtrave</h4>
          <div className="flex flex-wrap gap-4 text-sm text-blue-700">
            {dateFromFilter && <span>Nga: {dateFromFilter}</span>}
            {dateToFilter && <span>Deri: {dateToFilter}</span>}
            {carFilter && <span>Makina: {store.cars.find(c => c.id === carFilter)?.name}</span>}
            {washTypeFilter && <span>Lloji: {store.washTypes.find(wt => wt.id === washTypeFilter)?.name}</span>}
            {companyFilter && (
              <span>
                Kompania: {companyFilter === 'no-company' ? 'Pa Kompani (Individual)' : store.companies.find(c => c.id === companyFilter)?.name}
              </span>
            )}
            {categoryFilter && <span>Kategoria: {categoryFilter}</span>}
          </div>
          <div className="mt-2 text-sm text-blue-600">
            {activeTab === 'washes' && (
              <>Po shfaqen {getFilteredWashes().length} larje (Totali: {getFilteredWashes().reduce((sum, wash) => sum + wash.price, 0).toFixed(2)}€)</>
            )}
            {activeTab === 'expenses' && (
              <>Po shfaqen {getFilteredExpenses().length} shpenzime (Totali: {getFilteredExpenses().reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}€)</>
            )}
          </div>
        </div>
      )}

      {/* Washes Tab */}
      {activeTab === 'washes' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Wash History ({getFilteredWashes().length})
            </h3>
            
            {getFilteredWashes().length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Makina
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lloji i Larjes
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Çmimi
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                        Kompania
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Targa
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statusi
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Shënime
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Veprimet
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getFilteredWashes().map((wash) => (
                      <tr key={wash.id}>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {getCarName(wash.carId)}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getWashTypeName(wash.washTypeId)}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(wash.price)}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                          {wash.companyId ? getCompanyName(wash.companyId) : '-'}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                          {wash.carPlate || '-'}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            wash.isPaid 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {wash.isPaid ? '✓' : '✗'}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(wash.date)}
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-sm text-gray-500 max-w-xs truncate hidden lg:table-cell">
                          {wash.notes || '-'}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                            <button
                              onClick={() => handleEditWash(wash)}
                              className="text-indigo-600 hover:text-indigo-900 text-xs sm:text-sm"
                            >
                              Ndrysho
                            </button>
                            <button
                              onClick={() => handleDeleteWash(wash.id)}
                              className="text-red-600 hover:text-red-900 text-xs sm:text-sm"
                            >
                              Fshi
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Nuk u gjetën larje që përputhen me filtrat e tu
              </div>
            )}
          </div>
        </div>
      )}

      {/* Expenses Tab */}
      {activeTab === 'expenses' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Historiku i Shpenzimeve ({getFilteredExpenses().length})
            </h3>
            
            {getFilteredExpenses().length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Emri
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                        Kategoria
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Shuma
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Shënime
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Veprimet
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getFilteredExpenses().map((expense) => (
                      <tr key={expense.id}>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {expense.name}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                          {expense.category || '-'}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(expense.amount)}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(expense.date)}
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-sm text-gray-500 max-w-xs truncate hidden lg:table-cell">
                          {expense.notes || '-'}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                            <button
                              onClick={() => handleEditExpense(expense)}
                              className="text-indigo-600 hover:text-indigo-900 text-xs sm:text-sm"
                            >
                              Ndrysho
                            </button>
                            <button
                              onClick={() => handleDeleteExpense(expense.id)}
                              className="text-red-600 hover:text-red-900 text-xs sm:text-sm"
                            >
                              Fshi
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Nuk u gjetën shpenzime që përputhen me filtrat e tu
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Modals */}
      {editingWash && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 sm:top-20 mx-auto p-4 sm:p-5 border w-11/12 sm:w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ndrysho Larjen</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Makina</label>
                  <select
                    value={editingWash.carId}
                    onChange={(e) => setEditingWash({...editingWash, carId: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    {store.cars.map((car) => (
                      <option key={car.id} value={car.id}>
                        {car.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Lloji i Larjes</label>
                  <select
                    value={editingWash.washTypeId}
                    onChange={(e) => setEditingWash({...editingWash, washTypeId: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    {store.washTypes.map((washType) => (
                      <option key={washType.id} value={washType.id}>
                        {washType.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Çmimi ({store.settings.currency})</label>
                  <input
                    type="number"
                    value={editingWash.price}
                    onChange={(e) => setEditingWash({...editingWash, price: parseFloat(e.target.value) || 0})}
                    step="0.01"
                    min="0"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Kompania</label>
                  <select
                    value={editingWash.companyId || ''}
                    onChange={(e) => setEditingWash({...editingWash, companyId: e.target.value || null})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Zgjidh kompani...</option>
                    {store.companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>

                {editingWash.companyId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Targa e Mjetit</label>
                    <input
                      type="text"
                      value={editingWash.carPlate || ''}
                      onChange={(e) => setEditingWash({...editingWash, carPlate: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="p.sh., AB 123 CD"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Statusi i Pagesës</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={editingWash.isPaid}
                        onChange={() => setEditingWash({...editingWash, isPaid: true})}
                        className="mr-2 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-green-600 font-medium">✓ I Paguar</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={!editingWash.isPaid}
                        onChange={() => setEditingWash({...editingWash, isPaid: false})}
                        className="mr-2 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-red-600 font-medium">✗ Nuk është paguar</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Data & Ora</label>
                  <input
                    type="datetime-local"
                    value={editingWash.date.slice(0, 16)}
                    onChange={(e) => setEditingWash({...editingWash, date: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Shënime</label>
                  <textarea
                    value={editingWash.notes || ''}
                    onChange={(e) => setEditingWash({...editingWash, notes: e.target.value})}
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setEditingWash(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Anulo
                </button>
                <button
                  onClick={handleSaveWash}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Ruaj
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingExpense && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 sm:top-20 mx-auto p-4 sm:p-5 border w-11/12 sm:w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ndrysho Shpenzimin</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Emri</label>
                  <input
                    type="text"
                    value={editingExpense.name}
                    onChange={(e) => setEditingExpense({...editingExpense, name: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Shuma ({store.settings.currency})</label>
                  <input
                    type="number"
                    value={editingExpense.amount}
                    onChange={(e) => setEditingExpense({...editingExpense, amount: parseFloat(e.target.value) || 0})}
                    step="0.01"
                    min="0"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kategoria</label>
                  <input
                    type="text"
                    value={editingExpense.category || ''}
                    onChange={(e) => setEditingExpense({...editingExpense, category: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Data & Ora</label>
                  <input
                    type="datetime-local"
                    value={editingExpense.date.slice(0, 16)}
                    onChange={(e) => setEditingExpense({...editingExpense, date: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Shënime</label>
                  <textarea
                    value={editingExpense.notes || ''}
                    onChange={(e) => setEditingExpense({...editingExpense, notes: e.target.value})}
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setEditingExpense(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Anulo
                </button>
                <button
                  onClick={handleSaveExpense}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Ruaj
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
