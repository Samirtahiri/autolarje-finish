import React, { useState, useEffect } from 'react';
import { addExpense, updateExpense, deleteExpense } from '../utils/storage';
import { formatDateForInput, formatDate, formatCurrency } from '../utils/stats';

const Expenses = ({ store, updateStore }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const categories = [
    'Rrogat',
    'Avans',
    'Material',
    'Komunale',
    'Qiraja',
    'Tjera'
  ];

  useEffect(() => {
    // Set default date to now
    setDate(formatDateForInput(new Date().toISOString()));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!name.trim()) {
      setError('Ju lutemi shkruani emrin e shpenzimit');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError('Ju lutemi shkruani një shumë të vlefshme');
      return;
    }
    if (!date) {
      setError('Ju lutemi zgjidhni një datë dhe orë');
      return;
    }

    try {
      const expenseData = {
        name: name.trim(),
        amount: parseFloat(amount),
        category: category.trim(),
        date: new Date(date).toISOString(),
        notes: notes.trim(),
      };

      let newStore;
      if (editingId) {
        newStore = updateExpense(store, editingId, expenseData);
        setSuccess('Shpenzimi u përditësua me sukses!');
      } else {
        newStore = addExpense(store, expenseData);
        setSuccess('Shpenzimi u shtua me sukses!');
      }

      updateStore(newStore);
      
      // Reset form
      resetForm();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Dështoi ruajtja e shpenzimit. Ju lutemi provoni përsëri.');
    }
  };

  const resetForm = () => {
    setName('');
    setAmount('');
    setCategory('');
    setDate(formatDateForInput(new Date().toISOString()));
    setNotes('');
    setEditingId(null);
  };

  const handleEdit = (expense) => {
    setName(expense.name);
    setAmount(expense.amount.toString());
    setCategory(expense.category || '');
    setDate(formatDateForInput(expense.date));
    setNotes(expense.notes || '');
    setEditingId(expense.id);
  };

  const handleDelete = (expenseId) => {
    if (window.confirm('Jeni i sigurt që dëshironi të fshini këtë shpenzim?')) {
      const newStore = deleteExpense(store, expenseId);
      updateStore(newStore);
      setSuccess('Shpenzimi u fshi me sukses!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  // Get today's expenses
  const todayExpenses = store.expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const today = new Date();
    return expenseDate.toDateString() === today.toDateString();
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Shpenzimet</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gjurmo shpenzimet e biznesit tënd
        </p>
      </div>

      {/* Add/Edit Expense Form */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                {editingId ? 'Ndrysho Shpenzimin' : 'Shto Shpenzim të Ri'}
              </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Expense Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Emri i Shpenzimit *
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="p.sh., Shampo, Fatura e ujit"
                />
              </div>

              {/* Amount */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Shuma ({store.settings.currency}) *
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.01"
                  min="0"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="0.00"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Kategoria
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Zgjidh kategori</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Data & Ora *
                </label>
                <input
                  type="datetime-local"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Shënime (Opsionale)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Shto shënime shtesë për këtë shpenzim..."
              />
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

            {/* Form Actions */}
            <div className="flex justify-end space-x-3">
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Anulo
                </button>
              )}
              <button
                type="submit"
                disabled={!name.trim() || !amount || !date}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                {editingId ? 'Ruaj Ndryshimet' : 'Shto Shpenzim'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Today's Expenses */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Shpenzimet e Sotme ({todayExpenses.length})
          </h3>
          
          {todayExpenses.length > 0 ? (
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
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Veprimet
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {todayExpenses.map((expense) => (
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
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                          <button
                            onClick={() => handleEdit(expense)}
                            className="text-indigo-600 hover:text-indigo-900 text-xs sm:text-sm"
                          >
                            Ndrysho
                          </button>
                          <button
                            onClick={() => handleDelete(expense.id)}
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
              Nuk ka shpenzime të regjistruara për sot
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Expenses;
