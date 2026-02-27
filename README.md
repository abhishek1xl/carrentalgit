# 1XL Car Rentals - Fleet Management System

A comprehensive, professional car rental fleet and booking management dashboard built with React. Features full CRUD operations for vehicles, bookings, customers, and invoice management with real-time analytics.

## 🎯 Features

- **Dashboard Analytics** - Real-time vehicle availability, booking metrics, and revenue tracking
- **Vehicle Management** - Add, edit, delete vehicles with detailed specifications
- **Booking System** - Manage rental bookings with pickup/drop-off tracking
- **Customer Management** - Maintain customer profiles and license information
- **Invoice Management** - Generate and manage rental invoices with tax calculations
- **Reports & Analytics** - Revenue trends, vehicle distribution charts
- **Role-Based Access** - Admin, Executive, and Manager roles with different permissions
- **Responsive Design** - Mobile-friendly interface using Tailwind CSS
- **Charts & Visualizations** - Interactive charts using Recharts

## 📋 Demo Credentials

```
Admin:      username: admin,     password: admin123
Executive:  username: executive, password: exec123
Manager:    username: manager,   password: mgr123
```

## 🛠️ Tech Stack

- **React** 18.2.0 - UI framework
- **Tailwind CSS** 3.3.6 - Styling
- **Recharts** 2.10.0 - Charts and data visualization
- **Lucide React** 0.263.1 - Icon library
- **React Scripts** 5.0.1 - Build tools

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/car-rental-system.git
   cd car-rental-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Update homepage URL** (for GitHub Pages)
   - Edit `package.json`
   - Update `"homepage"` field: `"https://YOUR_USERNAME.github.io/car-rental-system"`

## 🚀 Running Locally

### Development Server
```bash
npm start
```
Opens [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
```bash
npm run build
```
Builds the app for production in the `build/` folder.

## 📤 Deploying to GitHub Pages

### Method 1: Automatic Deployment (Recommended)

1. **Ensure `gh-pages` is installed** (already in devDependencies)

2. **Update `package.json`** with your GitHub username:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/car-rental-system"
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

   This will:
   - Build the production version
   - Deploy to the `gh-pages` branch
   - Your app will be live at: `https://YOUR_USERNAME.github.io/car-rental-system`

### Method 2: Manual Deployment

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for GitHub Pages deployment"
   git push origin main
   ```

3. **Enable GitHub Pages**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Set source to `gh-pages` branch
   - Deploy key: Use the branch you want to deploy from

## 📖 Project Structure

```
car-rental-system/
├── public/
│   └── index.html          # Main HTML file
├── src/
│   ├── App.jsx            # Main application component
│   └── index.jsx          # React entry point
├── package.json           # Project configuration and dependencies
├── .gitignore            # Git ignore rules
├── README.md             # This file
└── build/                # Production build (after running npm run build)
```

## 🔧 Configuration

### Update Company Details

Edit the `CFG` object in [src/App.jsx](src/App.jsx#L17):

```javascript
const CFG = { 
  company: "1XL Car Rentals", 
  currency: "AED", 
  tax: 5, 
  ver: "1.0.0" 
};
```

### Customize Data

Sample data can be modified in [src/App.jsx](src/App.jsx#L31):
- `S_VEHICLES` - Vehicle inventory
- `S_CUSTOMERS` - Customer database
- `S_BOOKINGS` - Booking records

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## ⚙️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Runs the app in development mode |
| `npm run build` | Builds the app for production |
| `npm test` | Launches the test runner |
| `npm run deploy` | Deploys to GitHub Pages |
| `npm run eject` | Ejects from Create React App (irreversible) |

## 🚨 Troubleshooting

### App not loading on GitHub Pages

1. **Check homepage URL**
   ```bash
   # Verify in package.json
   "homepage": "https://YOUR_USERNAME.github.io/car-rental-system"
   ```

2. **Clear browser cache** and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

3. **Check gh-pages branch exists**
   - Go to repository settings
   - Verify `gh-pages` branch is created

### Dependencies not installing

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created for demonstration purposes. Feel free to fork and customize!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues and questions, please open an issue on [GitHub Issues](https://github.com/YOUR_USERNAME/car-rental-system/issues).

---

**Note:** This is a client-side React application using mock data. For production use, integrate with a backend API to persist data to a database.
