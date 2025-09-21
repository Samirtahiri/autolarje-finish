import React, { useState, useEffect } from 'react';
import { addWash, resolveDefaultPrice } from '../utils/storage';
import { formatDateForInput } from '../utils/stats';

const AddWash = ({ store, updateStore }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCar, setSelectedCar] = useState('');
  const [selectedWashType, setSelectedWashType] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [carPlate, setCarPlate] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Set default date to now
    setDate(formatDateForInput(new Date().toISOString()));
  }, []);

  useEffect(() => {
    // Auto-fill price when car or wash type changes
    if (selectedCar && selectedWashType) {
      const defaultPrice = resolveDefaultPrice(store, selectedCar, selectedWashType);
      setPrice(defaultPrice.toString());
    }
  }, [selectedCar, selectedWashType, store]);

  const nextStep = () => {
    if (currentStep === 1 && selectedCar) {
      setCurrentStep(2);
      setError('');
    } else if (currentStep === 2 && selectedWashType) {
      setCurrentStep(3);
      setError('');
    } else if (currentStep === 1) {
      setError('Ju lutemi zgjidhni një makinë për të vazhduar');
    } else if (currentStep === 2) {
      setError('Ju lutemi zgjidhni një lloj larjeje për të vazhduar');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedCar('');
    setSelectedWashType('');
    setSelectedCompany('');
    setCarPlate('');
    setIsPaid(false);
    setPrice('');
    setNotes('');
    setError('');
    setSuccess('');
  };

  const handleSubmit = () => {
    setError('');
    setSuccess('');

    // Validation
    if (!price || parseFloat(price) <= 0) {
      setError('Ju lutemi shkruani një çmim të vlefshëm');
      return;
    }

    try {
      const newStore = addWash(store, {
        carId: selectedCar,
        washTypeId: selectedWashType,
        price: parseFloat(price),
        date: new Date(date).toISOString(),
        notes: notes.trim(),
        companyId: selectedCompany || null,
        carPlate: carPlate.trim(),
        isPaid: isPaid,
      });

      updateStore(newStore);
      resetForm();
      setSuccess('Larja u shtua me sukses!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Dështoi shtimi i larjes. Ju lutemi provoni përsëri.');
    }
  };

  const CarCard = ({ car }) => (
    <div
      className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
        selectedCar === car.id
          ? 'border-indigo-500 bg-indigo-50 shadow-lg scale-105'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => setSelectedCar(car.id)}
    >
      <div className="text-center">
        <img
          src={car.imgUrl}
          alt={car.name}
          className="w-20 h-20 mx-auto mb-3 object-contain"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/80x80?text=' + car.name;
          }}
        />
        <div className="text-lg font-semibold text-gray-900">{car.name}</div>
      </div>
    </div>
  );

  const WashTypeCard = ({ washType }) => {
    const defaultPrice = resolveDefaultPrice(store, selectedCar, washType.id);
    return (
      <div
        className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
          selectedWashType === washType.id
            ? 'border-green-500 bg-green-50 shadow-lg scale-105'
            : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => setSelectedWashType(washType.id)}
      >
        <div className="text-center">
          <div className="text-4xl mb-3">🧽</div>
          <div className="text-lg font-semibold text-gray-900 mb-2">{washType.name}</div>
          <div className="text-2xl font-bold text-green-600">
            {defaultPrice}{store.settings.currency}
          </div>
          <div className="text-sm text-gray-500 mt-1">Çmimi i Paracaktuar</div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Shto Larje</h1>
        <p className="mt-1 text-sm text-gray-500">
          Regjistro një shërbim të ri larjeje makinash - Hapi {currentStep} nga 3
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              1
            </div>
            <span className={`text-sm font-medium ${currentStep >= 1 ? 'text-indigo-600' : 'text-gray-500'}`}>
              Zgjidh Makinën
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              2
            </div>
            <span className={`text-sm font-medium ${currentStep >= 2 ? 'text-indigo-600' : 'text-gray-500'}`}>
              Zgjidh Shërbimin
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              3
            </div>
            <span className={`text-sm font-medium ${currentStep >= 3 ? 'text-indigo-600' : 'text-gray-500'}`}>
              Rishiko & Konfirmo
            </span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>
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

      {/* Step 1: Car Selection */}
      {currentStep === 1 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Hapi 1: Zgjidh Makinën</h2>
          <p className="text-gray-600 mb-6">Zgjidh makinën që duhet të lahet</p>
          
          {store.cars.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {store.cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-4">🚗</div>
              <p className="text-gray-500 mb-2 text-lg">Nuk ka makina të disponueshme</p>
              <p className="text-sm text-gray-400">
                Shko te Cilësimet për të shtuar makina së pari
              </p>
            </div>
          )}
          
          <div className="mt-8 flex justify-end">
            <button
              onClick={nextStep}
              disabled={!selectedCar}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg text-sm font-medium flex items-center"
            >
              Hapi Tjetër
              <span className="ml-2">→</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Wash Type Selection */}
      {currentStep === 2 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Hapi 2: Zgjidh Shërbimin</h2>
          <p className="text-gray-600 mb-6">Zgjidh llojin e shërbimit të larjes</p>
          
          {store.washTypes.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {store.washTypes.map((washType) => (
                <WashTypeCard key={washType.id} washType={washType} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-4">🧽</div>
              <p className="text-gray-500 mb-2 text-lg">Nuk ka lloje larjesh të disponueshme</p>
              <p className="text-sm text-gray-400">
                Shko te Cilësimet për të shtuar lloje larjesh së pari
              </p>
            </div>
          )}
          
          <div className="mt-8 flex justify-between">
            <button
              onClick={prevStep}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg text-sm font-medium flex items-center"
            >
              <span className="mr-2">←</span>
              Kthehu
            </button>
            <button
              onClick={nextStep}
              disabled={!selectedWashType}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg text-sm font-medium flex items-center"
            >
              Hapi Tjetër
              <span className="ml-2">→</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Confirm */}
      {currentStep === 3 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Hapi 3: Rishiko & Konfirmo</h2>
          <p className="text-gray-600 mb-6">Rishiko zgjedhjen tënde dhe shto shënime nëse dëshiron</p>
          
          {/* Selection Summary */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Përmbledhje Larjeje</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Makina e Zgjedhur</label>
                <div className="flex items-center mt-1">
                  <img
                    src={store.cars.find(c => c.id === selectedCar)?.imgUrl}
                    alt={store.cars.find(c => c.id === selectedCar)?.name}
                    className="w-8 h-8 object-contain mr-3"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/32x32?text=' + store.cars.find(c => c.id === selectedCar)?.name;
                    }}
                  />
                  <span className="text-lg font-medium text-gray-900">
                    {store.cars.find(c => c.id === selectedCar)?.name}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Lloji i Shërbimit</label>
                <div className="flex items-center mt-1">
                  <span className="text-2xl mr-3">🧽</span>
                  <span className="text-lg font-medium text-gray-900">
                    {store.washTypes.find(wt => wt.id === selectedWashType)?.name}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Çmimi</label>
                <div className="mt-1">
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    step="0.01"
                    min={store.settings.minimumWashPrice || 0}
                    max={store.settings.maximumWashPrice || 1000}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg font-semibold"
                  />
                  <span className="ml-2 text-lg font-medium text-gray-900">{store.settings.currency}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Data & Ora</label>
                <input
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Company Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-500">Kompania (Opsionale)</label>
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Zgjidh kompani...</option>
                  {store.companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Car Plate (only show if company is selected) */}
              {selectedCompany && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Targa e Mjetit</label>
                  <input
                    type="text"
                    value={carPlate}
                    onChange={(e) => setCarPlate(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="p.sh., AB 123 CD"
                  />
                </div>
              )}

              {/* Payment Status */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-2">Statusi i Pagesës</label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={isPaid}
                      onChange={() => setIsPaid(true)}
                      className="mr-2 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-green-600 font-medium">✓ I Paguar</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={!isPaid}
                      onChange={() => setIsPaid(false)}
                      className="mr-2 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-red-600 font-medium">✗ Nuk është paguar</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Optional Notes */}
          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Shënime (Opsionale)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Shto shënime të veçanta për këtë larje..."
            />
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg text-sm font-medium flex items-center"
            >
              <span className="mr-2">←</span>
              Kthehu
            </button>
            <button
              onClick={handleSubmit}
              disabled={!price}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg text-sm font-medium flex items-center"
            >
              <span className="mr-2">✓</span>
              Përfundo Larjen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddWash;
