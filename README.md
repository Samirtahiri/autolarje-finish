# Car Wash Manager

A comprehensive single-user, offline car wash management application built with React and LocalStorage.

## Features

### 🔐 Authentication
- Simple static authentication system
- Default credentials: `admin` / `admin123`

### 📊 Dashboard
- Real-time KPI cards showing Today, Last 7 Days, and This Month statistics
- Income, Expenses, and Profit calculations
- Top 5 breakdowns by Car and Wash Type
- Quick summary with total counts and amounts

### 🚗 Add Wash
- Visual car selector with icon cards
- Wash type selection with auto-pricing
- Customizable pricing (per-car overrides supported)
- Date/time selection with notes
- Real-time price calculation based on settings

### 💰 Expenses
- Expense tracking with categories (Shampoo, Water, Detergent, etc.)
- Add, edit, and delete expenses
- Today's expenses quick view
- Date and category filtering

### 📋 History
- Combined view of washes and expenses
- Advanced filtering by date, car, wash type, and category
- Edit and delete functionality for all records
- Sortable by date (newest first)

### ⚙️ Settings
- **Cars Management**: Add, edit, delete cars with custom images
- **Wash Types Management**: Configure wash types with default prices
- **Data Management**: 
  - Export all data as JSON backup
  - Import data from JSON file
  - Reset all data with confirmation

## Technical Details

### Data Storage
- All data persisted in LocalStorage (`cw.data` key)
- No backend required - fully offline
- Automatic data migration support
- Export/Import functionality for backups

### Data Model
```javascript
{
  version: 1,
  cars: [{ id, name, imgUrl, createdAt }],
  washTypes: [{ id, name, defaultPrice, perCarOverrides, createdAt }],
  washes: [{ id, carId, washTypeId, price, date, notes, createdAt }],
  expenses: [{ id, name, amount, category, date, notes, createdAt }],
  settings: { currency: '€', weekMode: 'last7days' }
}
```

### Business Rules
- **Price Resolution**: Per-car override → Wash type default price
- **Time Buckets**: Daily (same calendar day), Weekly (last 7 days), Monthly (current month)
- **Statistics**: Real-time calculations for income, expenses, and profit
- **Validation**: Comprehensive form validation with user-friendly error messages

### Technologies Used
- **React 19** with functional components and hooks
- **Tailwind CSS** for styling
- **Plain JavaScript** Date APIs (no external date libraries)
- **LocalStorage** for data persistence
- **Responsive Design** for mobile and desktop

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm start
```

### Default Login
- Username: `admin`
- Password: `admin123`

### Available Scripts
- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner

## Usage Guide

1. **Login** with the default credentials
2. **Setup**: Go to Settings to configure your cars and wash types
3. **Add Washes**: Use the Add Wash tab to record car wash services
4. **Track Expenses**: Record business expenses in the Expenses tab
5. **Monitor Performance**: View real-time statistics on the Dashboard
6. **Manage Data**: Use History tab to view, edit, or delete records

## Data Management

### Export Data
- Go to Settings → Data Management
- Click "Export Data" to download a JSON backup file

### Import Data
- Go to Settings → Data Management
- Upload a JSON file to restore data (replaces current data)

### Reset Data
- Go to Settings → Data Management
- Click "Reset All Data" to start fresh (requires confirmation)

## Customization

### Adding Cars
1. Go to Settings → Cars
2. Enter car name and image URL
3. Click "Add Car"

### Adding Wash Types
1. Go to Settings → Wash Types
2. Enter type name and default price
3. Click "Add Wash Type"

### Per-Car Pricing
- Configure default prices for wash types
- Optionally set custom prices for specific cars
- System automatically uses the most specific price available

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Security Note

This application uses static authentication for simplicity. In a production environment, consider implementing proper authentication and data encryption.

## License

This project is open source and available under the MIT License.