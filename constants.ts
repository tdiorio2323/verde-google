import { Product, Category, Brand } from './types';

export const CATEGORIES: Category[] = [
  Category.FLOWER,
  Category.PRE_PACKAGED,
  Category.EDIBLES,
  Category.CONCENTRATE,
  Category.DISPOSABLES,
  Category.MERCH,
];

export const BRANDS: Brand[] = Object.values(Brand);

export const MOCK_PRODUCTS: Product[] = [
  // Long Money Exotics Products
  {
    id: "lme-pp1",
    name: "Strawberry Goyard",
    category: Category.PRE_PACKAGED,
    price: 39.99,
    description: "Premium pre-packaged flower with a sweet strawberry aroma.",
    imageUrl: "https://i.imgur.com/Fm4rXLu.jpeg",
    inStock: true,
    brand: Brand.LONG_MONEY_EXOTICS,
  },
  {
    id: "lme-pp2",
    name: "Popsicle Goyard",
    category: Category.PRE_PACKAGED,
    price: 39.99,
    description: "Exclusive pre-packaged flower with a cool, refreshing flavor profile.",
    imageUrl: "https://i.imgur.com/5zJaC9v.jpeg",
    inStock: true,
    brand: Brand.LONG_MONEY_EXOTICS,
  },
  {
    id: "lme-pp3",
    name: "Green Apple Goyard",
    category: Category.PRE_PACKAGED,
    price: 39.99,
    description: "A tangy and potent pre-packaged flower with a crisp green apple taste.",
    imageUrl: "https://i.imgur.com/zBwLB7C.jpeg",
    inStock: true,
    brand: Brand.LONG_MONEY_EXOTICS,
  },
  {
    id: "lme-m1",
    name: "Long Money Exotics Sticker",
    category: Category.MERCH,
    price: 7.00,
    description: "High-quality vinyl sticker featuring the Long Money Exotics logo.",
    imageUrl: "https://i.imgur.com/s01nTdc.jpeg",
    inStock: true,
    brand: Brand.LONG_MONEY_EXOTICS,
  },
  {
    id: "lme-m2",
    name: "Long Money Exotics Beanie (Grey)",
    category: Category.MERCH,
    price: 25.00,
    description: "A stylish and comfortable grey beanie with the Long Money Exotics logo.",
    imageUrl: "https://i.imgur.com/BUNigf2.jpeg",
    inStock: true,
    brand: Brand.LONG_MONEY_EXOTICS,
  },
];