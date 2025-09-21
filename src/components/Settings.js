import React, { useState } from 'react';
import { 
  addCar, updateCar, deleteCar,
  addWashType, updateWashType, deleteWashType,
  addCompany, updateCompany, deleteCompany,
  exportData, importData, resetStore
} from '../utils/storage';

const Settings = ({ store, updateStore }) => {
  const [activeTab, setActiveTab] = useState('cars');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [editingCar, setEditingCar] = useState(null);
  const [editingWashType, setEditingWashType] = useState(null);
  const [editingCompany, setEditingCompany] = useState(null);
  const [newCar, setNewCar] = useState({ name: '', imgUrl: '' });
  const [newWashType, setNewWashType] = useState({ name: '', defaultPrice: '' });
  const [newCompany, setNewCompany] = useState({ 
    name: '', 
    contactPerson: '', 
    phone: '', 
    email: '', 
    address: '' 
  });
  const [pricingConfig, setPricingConfig] = useState({
    currency: store.settings.currency,
    taxRate: 0,
    discountPercentage: 0,
    minimumWashPrice: 1,
    maximumWashPrice: 100
  });

  const tabs = [
    { id: 'cars', label: 'Makinat', icon: '🚗' },
    { id: 'wash-types', label: 'Llojet e Larjes', icon: '🧽' },
    { id: 'companies', label: 'Kompanitë', icon: '🏢' },
    { id: 'pricing', label: 'Çmimet & Konfigurimi', icon: '💰' },
    { id: 'data', label: 'Menaxhimi i të Dhënave', icon: '💾' },
  ];

  const handleAddCar = () => {
    if (!newCar.name.trim()) {
      setError('Ju lutemi vendosni një emër makine');
      return;
    }

    try {
      const newStore = addCar(store, newCar);
      updateStore(newStore);
      setNewCar({ name: '', imgUrl: '' });
      setSuccess('Makina u shtua me sukses!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Dështoi shtimi i makinës');
    }
  };

  const handleEditCar = (car) => {
    setEditingCar({ ...car });
  };

  const handleSaveCar = () => {
    if (!editingCar.name.trim()) {
      setError('Ju lutemi vendosni një emër makine');
      return;
    }

    try {
      const newStore = updateCar(store, editingCar.id, {
        name: editingCar.name,
        imgUrl: editingCar.imgUrl,
      });
      updateStore(newStore);
      setEditingCar(null);
      setSuccess('Makina u përditësua me sukses!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Dështoi përditësimi i makinës');
    }
  };

  const handleDeleteCar = (carId) => {
    if (window.confirm('Jeni i sigurt që dëshironi të fshini këtë makinë? Kjo do të heqë çdo mbivendosje çmimi sipas makinave.')) {
      const newStore = deleteCar(store, carId);
      updateStore(newStore);
      setSuccess('Makina u fshi me sukses!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleAddWashType = () => {
    if (!newWashType.name.trim() || !newWashType.defaultPrice || parseFloat(newWashType.defaultPrice) <= 0) {
      setError('Ju lutemi vendosni një emër për llojin e larjes dhe një çmim të paracaktuar të vlefshëm');
      return;
    }

    try {
      const newStore = addWashType(store, {
        name: newWashType.name,
        defaultPrice: parseFloat(newWashType.defaultPrice),
      });
      updateStore(newStore);
      setNewWashType({ name: '', defaultPrice: '' });
      setSuccess('Lloji i larjes u shtua me sukses!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Dështoi shtimi i llojit të larjes');
    }
  };

  const handleEditWashType = (washType) => {
    setEditingWashType({ ...washType });
  };

  const handleSaveWashType = () => {
    if (!editingWashType.name.trim() || !editingWashType.defaultPrice || parseFloat(editingWashType.defaultPrice) <= 0) {
      setError('Ju lutemi vendosni një emër për llojin e larjes dhe një çmim të paracaktuar të vlefshëm');
      return;
    }

    try {
      const newStore = updateWashType(store, editingWashType.id, {
        name: editingWashType.name,
        defaultPrice: parseFloat(editingWashType.defaultPrice),
      });
      updateStore(newStore);
      setEditingWashType(null);
      setSuccess('Lloji i larjes u përditësua me sukses!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Dështoi përditësimi i llojit të larjes');
    }
  };

  const handleDeleteWashType = (washTypeId) => {
    if (window.confirm('Jeni i sigurt që dëshironi të fshini këtë lloj larjeje?')) {
      const newStore = deleteWashType(store, washTypeId);
      updateStore(newStore);
      setSuccess('Lloji i larjes u fshi me sukses!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleAddCompany = () => {
    if (!newCompany.name.trim()) {
      setError('Ju lutemi vendosni një emër për kompaninë');
      return;
    }

    try {
      const newStore = addCompany(store, newCompany);
      updateStore(newStore);
      setNewCompany({ name: '', contactPerson: '', phone: '', email: '', address: '' });
      setSuccess('Kompania u shtua me sukses!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Dështoi shtimi i kompanisë');
    }
  };

  const handleEditCompany = (company) => {
    setEditingCompany({ ...company });
  };

  const handleSaveCompany = () => {
    if (!editingCompany.name.trim()) {
      setError('Ju lutemi vendosni një emër për kompaninë');
      return;
    }

    try {
      const newStore = updateCompany(store, editingCompany.id, {
        name: editingCompany.name,
        contactPerson: editingCompany.contactPerson,
        phone: editingCompany.phone,
        email: editingCompany.email,
        address: editingCompany.address,
      });
      updateStore(newStore);
      setEditingCompany(null);
      setSuccess('Kompania u përditësua me sukses!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Dështoi përditësimi i kompanisë');
    }
  };

  const handleDeleteCompany = (companyId) => {
    if (window.confirm('Jeni i sigurt që dëshironi të fshini këtë kompani?')) {
      const newStore = deleteCompany(store, companyId);
      updateStore(newStore);
      setSuccess('Kompania u fshi me sukses!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleExportData = () => {
    try {
      exportData(store);
      setSuccess('Të dhënat u eksportuan me sukses!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Dështoi eksportimi i të dhënave');
    }
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (file) {
      importData(
        file,
        (importedStore) => {
          updateStore(importedStore);
          setSuccess('Të dhënat u importuan me sukses!');
          setTimeout(() => setSuccess(''), 3000);
        },
        (err) => {
          setError('Dështoi importimi i të dhënave. Ju lutemi kontrolloni formatin e skedarit.');
        }
      );
      // Reset file input
      event.target.value = '';
    }
  };

  const handleResetData = () => {
    if (window.confirm('Jeni i sigurt që dëshironi të rivendosni të gjitha të dhënat? Ky veprim nuk mund të anulohet.')) {
      const newStore = resetStore();
      updateStore(newStore);
      setSuccess('Të dhënat u rivendosën me sukses!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleSavePricingConfig = () => {
    try {
      const newStore = {
        ...store,
        settings: {
          ...store.settings,
          currency: pricingConfig.currency,
          taxRate: pricingConfig.taxRate,
          discountPercentage: pricingConfig.discountPercentage,
          minimumWashPrice: pricingConfig.minimumWashPrice,
          maximumWashPrice: pricingConfig.maximumWashPrice
        }
      };
      updateStore(newStore);
      setSuccess('Konfigurimi i çmimeve u ruajt me sukses!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Dështoi ruajtja e konfigurimit të çmimeve');
    }
  };

  const handleUpdateCarPricing = (washTypeId, carId, price) => {
    try {
      const newStore = {
        ...store,
        washTypes: store.washTypes.map(washType => {
          if (washType.id === washTypeId) {
            const updatedOverrides = { ...washType.perCarOverrides };
            if (price && price > 0) {
              updatedOverrides[carId] = parseFloat(price);
            } else {
              delete updatedOverrides[carId];
            }
            return { ...washType, perCarOverrides: updatedOverrides };
          }
          return washType;
        })
      };
      updateStore(newStore);
      setSuccess('Çmimi i makinës u përditësua me sukses!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Dështoi përditësimi i çmimit të makinës');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cilësimet</h1>
        <p className="mt-1 text-sm text-gray-500">
          Menaxho makinat, llojet e larjes dhe të dhënat
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
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Cars Tab */}
      {activeTab === 'cars' && (
        <div className="space-y-6">
          {/* Add New Car */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Shto Makinë të Re</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Emri i Makinës</label>
                  <input
                    type="text"
                    value={newCar.name}
                    onChange={(e) => setNewCar({ ...newCar, name: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="e.g., BMW, Audi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">URL e Imazhit</label>
                  <input
                    type="url"
                    value={newCar.imgUrl}
                    onChange={(e) => setNewCar({ ...newCar, imgUrl: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="https://example.com/image.png"
                  />
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleAddCar}
                  disabled={!newCar.name.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Shto Makinën
                </button>
              </div>
            </div>
          </div>

          {/* Cars List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Makinat ({store.cars.length})</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {store.cars.map((car) => (
                  <div key={car.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="text-center">
                      <img
                        src={car.imgUrl}
                        alt={car.name}
                        className="w-16 h-16 mx-auto mb-2 object-contain"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/64x64?text=' + car.name;
                        }}
                      />
                      <div className="text-sm font-medium text-gray-900">{car.name}</div>
                      <div className="mt-2 flex justify-center space-x-2">
                        <button
                          onClick={() => handleEditCar(car)}
                          className="text-indigo-600 hover:text-indigo-900 text-xs"
                        >
                          Ndrysho
                        </button>
                        <button
                          onClick={() => handleDeleteCar(car.id)}
                          className="text-red-600 hover:text-red-900 text-xs"
                        >
                          Fshi
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wash Types Tab */}
      {activeTab === 'wash-types' && (
        <div className="space-y-6">
          {/* Add New Wash Type */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Shto Lloj të Ri Larjeje</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Emri i Llojit</label>
                  <input
                    type="text"
                    value={newWashType.name}
                    onChange={(e) => setNewWashType({ ...newWashType, name: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="e.g., Inside, Outside, Full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Default Price (€)</label>
                  <input
                    type="number"
                    value={newWashType.defaultPrice}
                    onChange={(e) => setNewWashType({ ...newWashType, defaultPrice: e.target.value })}
                    step="0.01"
                    min="0"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleAddWashType}
                  disabled={!newWashType.name.trim() || !newWashType.defaultPrice}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Shto Lloj Larjeje
                </button>
              </div>
            </div>
          </div>

          {/* Wash Types List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Llojet e Larjes ({store.washTypes.length})</h3>
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Default Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {store.washTypes.map((washType) => (
                      <tr key={washType.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {washType.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {washType.defaultPrice}€
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditWashType(washType)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            Ndrysho
                          </button>
                          <button
                            onClick={() => handleDeleteWashType(washType.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Fshi
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Companies Tab */}
      {activeTab === 'companies' && (
        <div className="space-y-6">
          {/* Add New Company */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Shto Kompani të Re</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Emri i Kompanisë *</label>
                  <input
                    type="text"
                    value={newCompany.name}
                    onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="p.sh., Kompania ABC"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Personi i Kontaktit</label>
                  <input
                    type="text"
                    value={newCompany.contactPerson}
                    onChange={(e) => setNewCompany({ ...newCompany, contactPerson: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="p.sh., Genti Hoxha"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Numri i Telefonit</label>
                  <input
                    type="tel"
                    value={newCompany.phone}
                    onChange={(e) => setNewCompany({ ...newCompany, phone: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="+355 69 123 4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={newCompany.email}
                    onChange={(e) => setNewCompany({ ...newCompany, email: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="kontakt@kompania.al"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Adresa</label>
                  <textarea
                    value={newCompany.address}
                    onChange={(e) => setNewCompany({ ...newCompany, address: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Rruga Dëshmorët, Tiranë"
                  />
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleAddCompany}
                  disabled={!newCompany.name.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Shto Kompaninë
                </button>
              </div>
            </div>
          </div>

          {/* Companies List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Kompanitë ({store.companies.length})</h3>
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Emri i Kompanisë
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Personi i Kontaktit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Telefoni
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Veprimet
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {store.companies.map((company) => (
                      <tr key={company.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {company.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {company.contactPerson || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {company.phone || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {company.email || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditCompany(company)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            Ndrysho
                          </button>
                          <button
                            onClick={() => handleDeleteCompany(company.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Fshi
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pricing & Configuration Tab */}
      {activeTab === 'pricing' && (
        <div className="space-y-6">
          {/* General Pricing Settings */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">General Pricing Settings</h3>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Currency Symbol</label>
                  <input
                    type="text"
                    value={pricingConfig.currency}
                    onChange={(e) => setPricingConfig({...pricingConfig, currency: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="€"
                    maxLength="3"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={pricingConfig.taxRate}
                    onChange={(e) => setPricingConfig({...pricingConfig, taxRate: parseFloat(e.target.value) || 0})}
                    step="0.01"
                    min="0"
                    max="100"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Default Discount (%)</label>
                  <input
                    type="number"
                    value={pricingConfig.discountPercentage}
                    onChange={(e) => setPricingConfig({...pricingConfig, discountPercentage: parseFloat(e.target.value) || 0})}
                    step="0.01"
                    min="0"
                    max="100"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Minimum Wash Price</label>
                  <input
                    type="number"
                    value={pricingConfig.minimumWashPrice}
                    onChange={(e) => setPricingConfig({...pricingConfig, minimumWashPrice: parseFloat(e.target.value) || 1})}
                    step="0.01"
                    min="0"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="1.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Maximum Wash Price</label>
                  <input
                    type="number"
                    value={pricingConfig.maximumWashPrice}
                    onChange={(e) => setPricingConfig({...pricingConfig, maximumWashPrice: parseFloat(e.target.value) || 100})}
                    step="0.01"
                    min="0"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="100.00"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <button
                  onClick={handleSavePricingConfig}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Ruaj Cilësimet e Çmimeve
                </button>
              </div>
            </div>
          </div>

          {/* Per-Car Pricing Overrides */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Per-Car Pricing Overrides</h3>
              <p className="text-sm text-gray-500 mb-4">
                Set custom prices for specific car types. Leave empty to use default wash type pricing.
              </p>
              
              {store.washTypes.length > 0 && store.cars.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Car Type
                        </th>
                        {store.washTypes.map((washType) => (
                          <th key={washType.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {washType.name}
                            <div className="text-xs text-gray-400">(Default: {washType.defaultPrice}{pricingConfig.currency})</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {store.cars.map((car) => (
                        <tr key={car.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={car.imgUrl}
                                alt={car.name}
                                className="w-8 h-8 object-contain mr-3"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/32x32?text=' + car.name;
                                }}
                              />
                              <span className="text-sm font-medium text-gray-900">{car.name}</span>
                            </div>
                          </td>
                          {store.washTypes.map((washType) => {
                            const currentPrice = washType.perCarOverrides && washType.perCarOverrides[car.id];
                            return (
                              <td key={washType.id} className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="number"
                                  value={currentPrice || ''}
                                  onChange={(e) => handleUpdateCarPricing(washType.id, car.id, e.target.value)}
                                  step="0.01"
                                  min="0"
                                  className="w-20 px-2 py-1 text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                  placeholder={washType.defaultPrice.toString()}
                                />
                                <span className="ml-1 text-xs text-gray-500">{pricingConfig.currency}</span>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Please add cars and wash types first to configure per-car pricing.</p>
                </div>
              )}
            </div>
          </div>

          {/* Business Settings */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Business Settings</h3>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Name</label>
                  <input
                    type="text"
                    value={store.settings.businessName || ''}
                    onChange={(e) => {
                      const newStore = {
                        ...store,
                        settings: { ...store.settings, businessName: e.target.value }
                      };
                      updateStore(newStore);
                    }}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="My Car Wash Business"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Adresa e Biznesit</label>
                  <input
                    type="text"
                    value={store.settings.businessAddress || ''}
                    onChange={(e) => {
                      const newStore = {
                        ...store,
                        settings: { ...store.settings, businessAddress: e.target.value }
                      };
                      updateStore(newStore);
                    }}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="123 Main St, City"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    value={store.settings.phoneNumber || ''}
                    onChange={(e) => {
                      const newStore = {
                        ...store,
                        settings: { ...store.settings, phoneNumber: e.target.value }
                      };
                      updateStore(newStore);
                    }}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={store.settings.email || ''}
                    onChange={(e) => {
                      const newStore = {
                        ...store,
                        settings: { ...store.settings, email: e.target.value }
                      };
                      updateStore(newStore);
                    }}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="contact@mycarwash.com"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Management Tab */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Menaxhimi i të Dhënave</h3>
              
              {/* Data Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="text-md font-medium text-blue-900 mb-2">Përmbledhje e të Dhënave</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-blue-700">
                  <div>
                    <span className="font-medium">Makinat:</span> {store.cars.length}
                  </div>
                  <div>
                    <span className="font-medium">Llojet e Larjes:</span> {store.washTypes.length}
                  </div>
                  <div>
                    <span className="font-medium">Larjet:</span> {store.washes.length}
                  </div>
                  <div>
                    <span className="font-medium">Shpenzimet:</span> {store.expenses.length}
                  </div>
                  <div>
                    <span className="font-medium">Kompanitë:</span> {store.companies.length}
                  </div>
                  <div>
                    <span className="font-medium">Versioni:</span> {store.version || 1}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Export Data */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-md font-medium text-gray-900 mb-2">Eksporto të Dhënat</h4>
                  <p className="text-sm text-gray-500 mb-3">
                    Shkarko të gjitha të dhënat si skedar JSON për qëllime rezervimi. 
                    Skedari do të përmbajë makinat, llojet e larjes, larjet, shpenzimet, kompanitë dhe cilësimet.
                  </p>
                  <button
                    onClick={handleExportData}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Eksporto të Dhënat
                  </button>
                </div>

                {/* Import Data */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-md font-medium text-gray-900 mb-2">Importo të Dhënat</h4>
                  <p className="text-sm text-gray-500 mb-3">
                    Ngarko një skedar JSON për të rivendosur të dhënat. Kjo do të zëvendësojë të gjitha të dhënat aktuale.
                    Sigurohuni që skedari është eksportuar nga kjo aplikacion.
                  </p>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>

                {/* Reset Data */}
                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <h4 className="text-md font-medium text-red-900 mb-2">Rivendos të Gjitha të Dhënat</h4>
                  <p className="text-sm text-red-700 mb-3">
                    Kjo do të fshijë përgjithmonë të gjitha të dhënat dhe do të rivendosë në cilësimet e paracaktuara. Ky veprim nuk mund të anulohet.
                  </p>
                  <button
                    onClick={handleResetData}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Rivendos të Gjitha të Dhënat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modals */}
      {editingCar && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ndrysho Makinën</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Emri i Makinës</label>
                  <input
                    type="text"
                    value={editingCar.name}
                    onChange={(e) => setEditingCar({...editingCar, name: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">URL e Imazhit</label>
                  <input
                    type="url"
                    value={editingCar.imgUrl}
                    onChange={(e) => setEditingCar({...editingCar, imgUrl: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setEditingCar(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Anulo
                </button>
                <button
                  onClick={handleSaveCar}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Ruaj
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingWashType && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ndrysho Llojin e Larjes</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Emri i Llojit</label>
                  <input
                    type="text"
                    value={editingWashType.name}
                    onChange={(e) => setEditingWashType({...editingWashType, name: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Default Price (€)</label>
                  <input
                    type="number"
                    value={editingWashType.defaultPrice}
                    onChange={(e) => setEditingWashType({...editingWashType, defaultPrice: parseFloat(e.target.value) || 0})}
                    step="0.01"
                    min="0"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setEditingWashType(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveWashType}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Ruaj
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Company Edit Modal */}
      {editingCompany && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ndrysho Kompaninë</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Emri i Kompanisë *</label>
                  <input
                    type="text"
                    value={editingCompany.name}
                    onChange={(e) => setEditingCompany({...editingCompany, name: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Personi i Kontaktit</label>
                  <input
                    type="text"
                    value={editingCompany.contactPerson}
                    onChange={(e) => setEditingCompany({...editingCompany, contactPerson: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Numri i Telefonit</label>
                  <input
                    type="tel"
                    value={editingCompany.phone}
                    onChange={(e) => setEditingCompany({...editingCompany, phone: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={editingCompany.email}
                    onChange={(e) => setEditingCompany({...editingCompany, email: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Adresa</label>
                  <textarea
                    value={editingCompany.address}
                    onChange={(e) => setEditingCompany({...editingCompany, address: e.target.value})}
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setEditingCompany(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Anulo
                </button>
                <button
                  onClick={handleSaveCompany}
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

export default Settings;
