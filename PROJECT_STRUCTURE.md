# Project Structure: jour-marche

This document outlines the current file and directory structure of the jour-marche project.

## Root Directory
- .gitignore
- eslint.config.js
- index.html
- package-lock.json
- package.json
- postcss.config.js
- README.md
- tailwind.config.js
- tsconfig.app.json
- tsconfig.json
- tsconfig.node.json
- vite.config.ts

## public/
- vite.svg

## src/
- App.css
- App.tsx
- index.css
- main.tsx

### src/assets/
- jour_marché.png

### src/components/
#### src/components/layout/
- index.ts

##### src/components/layout/Footer/
- Footer.css
- Footer.tsx
- index.ts

##### src/components/layout/Header/
- Header.tsx
- index.ts

#### src/components/ui/
- index.ts

##### src/components/ui/Badge/
- Badge.css
- Badge.tsx
- index.ts

##### src/components/ui/Button/
- Button.css
- Button.tsx
- index.ts

##### src/components/ui/Card/
- Card.css
- Card.tsx
- index.ts

##### src/components/ui/Input/
- index.ts
- Input.css
- Input.tsx

### src/context/
- AuthContext.tsx
- CartContext.tsx
- OrderContext.tsx

### src/data/
- mockData.ts

### src/pages/
#### src/pages/auth/
- index.ts

##### src/pages/auth/Login/
- index.ts
- Login.css
- Login.tsx

##### src/pages/auth/Signup/
- index.ts
- Signup.css
- Signup.tsx

#### src/pages/buyer/
- index.ts

##### src/pages/buyer/Dashboard/
- BuyerDashboard.css
- BuyerDashboard.tsx
- BuyerSidebar.tsx
- index.ts

#### src/pages/guest/
- index.ts

##### src/pages/guest/Cart/
- Cart.css
- Cart.tsx
- index.ts

##### src/pages/guest/Categories/
- Categories.css
- Categories.tsx
- index.ts

##### src/pages/guest/Home/
- Home.css
- Home.tsx
- index.ts

##### src/pages/guest/ProductDetail/
- index.ts
- ProductDetail.css
- ProductDetail.tsx

##### src/pages/guest/Promotions/
- index.ts
- Promotions.css
- Promotions.tsx

##### src/pages/guest/Search/
- index.ts
- Search.tsx

##### src/pages/guest/Shops/
- index.ts
- ShopDetail.tsx
- Shops.css
- Shops.tsx

#### src/pages/seller/
- index.ts

##### src/pages/seller/CreateProduct/
- CreateProduct.css
- CreateProduct.tsx
- index.ts

##### src/pages/seller/CreateShop/
- CreateShop.css
- CreateShop.tsx
- index.ts

##### src/pages/seller/Dashboard/
- index.ts
- SellerDashboard.css
- SellerDashboard.tsx

##### src/pages/seller/Layout/
- index.ts
- SellerLayout.css
- SellerLayout.tsx

##### src/pages/seller/ShopPage/
- index.ts
- ShopPage.css
- ShopPage.tsx

### src/styles/
- variables.css

### src/types/
- index.ts
