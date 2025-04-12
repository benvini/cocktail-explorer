**Cocktail Explorer App**

A React application for discovering, searching, and creating custom cocktail recipes.
Features

- Browse and search cocktails
- View detailed recipes with ingredients and instructions
- Create, edit, and delete custom cocktails
- Responsive design for all devices

_Tech Stack_

- React 19 with TypeScript
- Vite for build tooling
- Material UI 7
- CSS Modules
- Local Storage for persistence
- TheCocktailDB API

_Getting Started_

bash# Clone repository
git clone https://github.com/yourusername/cocktail-explorer.git
cd cocktail-explorer

# Install dependencies

npm install

# Start development server

npm run dev

# Build for production

npm run build

_Project Structure_

src/
├── components/ # Reusable UI components
├── hooks/ # Custom React hooks
├── navigation/ # Routing configuration
├── screens/ # Application pages
├── shared/ # Types and constants
├── utils/ # API and storage utilities
└── App.tsx # Main application component

_Implementation Highlights_

- Custom cocktails are stored in local storage with CRUD operations
- Search queries both local storage and external API
- Custom cocktails are prioritized in search results
- Fully responsive with adaptive layouts
