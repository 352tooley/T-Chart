# T-Mobile T-Chart Web App

A mobile-first web application designed for T-Mobile retail stores to digitize customer information capture and create compelling sales comparisons. Replace pen-and-paper T-Charts with this easy-to-use digital solution.

## Features

### 📱 Mobile-First Design
- Optimized for phones and tablets
- Works on iOS and Android
- Responsive design for all screen sizes

### 📝 Customer Information Capture
- Quick entry of customer name and phone
- Track new vs existing customers
- Rep and store tracking for accountability

### 🔄 T-Chart Comparison
**Current Service** (What they have):
- Current carrier
- Number of voice, tablet, and watch lines
- Current wireless and home internet pricing
- Automatic total calculation

**Proposed T-Mobile Plan** (What we offer):
- Pre-loaded T-Mobile plans (Go5G Next, Go5G Plus, Go5G, Magenta, Essentials)
- Automatic pricing based on line count
- Plan benefits displayed automatically
- Home Internet option with bundling discounts

### 💰 Smart Pricing
- AutoPay discount
- Insider code (20% off)
- Work perks discount
- Free line promotions
- Automatic total calculation
- Side-by-side savings comparison

### 📊 Callback List
- View all saved T-Charts
- Filter by store, rep, status
- Search by customer name or phone
- Status tracking (No contact, Appointment set, Closed)
- Export to CSV for Google Sheets

### 💾 Data Storage
- Saves locally in browser
- No internet required after initial load
- Data persists across sessions
- Export to CSV for backup

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder, ready to deploy to any web hosting service.

## How to Use

### Creating a T-Chart

1. **Enter Rep Information**
   - Select your name (or enter it the first time)
   - Select your store

2. **Enter Customer Information**
   - Customer name and phone number (required)
   - Mark as new or existing customer

3. **Document Current Service**
   - What carrier do they currently have?
   - How many lines (voice, tablet, watch)?
   - Current monthly costs

4. **Build Your Proposal**
   - Select a T-Mobile plan from the dropdown
   - Choose number of lines
   - Apply discounts (AutoPay, Insider, Work Perks, Free Lines)
   - Add Home Internet if applicable
   - Plan benefits automatically display

5. **Review Comparison**
   - See side-by-side pricing
   - View monthly savings (or additional cost with better value)

6. **Set Status & Notes**
   - Update callback status
   - Set appointment if needed
   - Add custom notes

7. **Save**
   - Click "Save T-Chart" to add to callback list

### Managing Callbacks

1. Click "Callback List" in the navigation
2. Use filters to find specific customers:
   - Search by name or phone
   - Filter by store
   - Filter by rep
   - Filter by status
3. Click any card to view full details
4. Export to CSV for importing to Google Sheets

### Exporting to Google Sheets

1. Go to Callback List
2. Click "Export to CSV"
3. Open Google Sheets
4. File → Import → Upload
5. Select the downloaded CSV file
6. Your data is now in Google Sheets!

## T-Mobile Plans Included

### Go5G Next
- Premium unlimited data
- 50GB high-speed hotspot
- 4K UHD streaming
- Free streaming services
- Annual phone upgrade

### Go5G Plus
- Premium unlimited data
- 50GB high-speed hotspot
- 4K UHD streaming
- Free streaming services

### Go5G
- Unlimited 5G & 4G LTE
- 15GB high-speed hotspot
- HD streaming

### Magenta
- Unlimited talk, text & data
- 5GB hotspot
- International texting

### Essentials
- Unlimited basics
- Best value option

### Home Internet
- No data caps
- No contracts
- Special pricing when bundled with wireless

## Customization

### Adding New Plans

Edit `src/data/plans.js` to add or modify plans and pricing.

### Adjusting Discounts

Update the discount percentages in `src/data/plans.js`:
- Insider code default: 20%
- Work perks default: 15%

### Changing Stores

The app currently has 9 generic stores. To customize:
1. Open `src/components/TChartForm.jsx`
2. Find the `stores` array
3. Replace with your actual store names

## Browser Support

- Chrome/Edge (recommended)
- Safari
- Firefox
- Mobile browsers (iOS Safari, Chrome Android)

## Data Privacy

- All data is stored locally in your browser
- No data is sent to external servers
- Data stays on your device unless you export it
- Clear browser data to remove all T-Charts

## Tips for Best Results

1. **Fill in all fields** for the most accurate comparison
2. **Use AutoPay discount** when applicable for best pricing
3. **Show plan benefits** to build value even if price is higher
4. **Export regularly** to back up your callback list
5. **Set clear appointment times** to improve follow-up success

## Support

For issues or questions, contact your district manager or IT support.

## Version

Version 1.0 - Initial Release

---

Built for T-Mobile retail teams to improve customer experience and increase efficiency.
