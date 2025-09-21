import React from 'react';
import { getAllStats, formatCurrency } from '../utils/stats';

const Dashboard = ({ store }) => {
  const stats = getAllStats(store);
  const { kpis, incomeByCar, incomeByWashType } = stats;
  const currency = store.settings.currency || '€';

  const KPICard = ({ title, data, icon, color }) => (
    <div className={`bg-white overflow-hidden shadow rounded-lg border-l-4 ${color}`}>
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className="text-2xl">{icon}</span>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(data.income, currency)}
                </div>
                <div className="ml-2 text-sm text-gray-500">
                  Të Ardhurat
                </div>
              </dd>
              <dd className="flex items-baseline">
                <div className="text-lg font-medium text-red-600">
                  -{formatCurrency(data.expenses, currency)}
                </div>
                <div className="ml-2 text-sm text-gray-500">
                  Shpenzimet
                </div>
              </dd>
              <dd className="flex items-baseline">
                <div className={`text-lg font-medium ${data.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {data.profit >= 0 ? '+' : ''}{formatCurrency(data.profit, currency)}
                </div>
                <div className="ml-2 text-sm text-gray-500">
                  Fitimi
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  const BreakdownCard = ({ title, data, dataKey }) => (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">{title}</h3>
        <div className="space-y-3">
          {data.length > 0 ? (
            data.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-900">{item[dataKey]}</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(item.income, currency)}
                </span>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">Nuk ka të dhëna të disponueshme</div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paneli Kryesor</h1>
        <p className="mt-1 text-sm text-gray-500">
          Pasqyra e performancës së biznesit tuaj të larjeve
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <KPICard
          title="Sot"
          data={kpis.today}
          icon="📅"
          color="border-blue-400"
        />
        <KPICard
          title="7 Ditët e Fundit"
          data={kpis.last7Days}
          icon="📊"
          color="border-green-400"
        />
        <KPICard
          title="Këtë Muaj"
          data={kpis.thisMonth}
          icon="📈"
          color="border-purple-400"
        />
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
        <BreakdownCard
          title="Të Ardhurat sipas Makinave (Top 5)"
          data={incomeByCar}
          dataKey="carName"
        />
        <BreakdownCard
          title="Të Ardhurat sipas Llojit të Larjes (Top 5)"
          data={incomeByWashType}
          dataKey="typeName"
        />
      </div>

      {/* Quick Stats Summary */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Përmbledhje e Shpejtë</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {store.washes.length}
              </div>
              <div className="text-sm text-gray-500">Total Larjesh</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(store.washes.reduce((sum, wash) => sum + wash.price, 0), currency)}
              </div>
              <div className="text-sm text-gray-500">Të Ardhurat Totale</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg sm:col-span-2 lg:col-span-1">
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(store.expenses.reduce((sum, expense) => sum + expense.amount, 0), currency)}
              </div>
              <div className="text-sm text-gray-500">Shpenzimet Totale</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
