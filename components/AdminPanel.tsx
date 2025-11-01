import React, { useState, useEffect } from 'react';
import { Product, Category, Brand } from '../types';
import { CATEGORIES, BRANDS } from '../constants';
import { PlusIcon, TrashIcon } from './Icons';

interface AdminPanelProps {
  products: Product[];
  onAddProduct: (productData: Omit<Product, 'id' | 'brand'> & { brand?: Brand }) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

const initialProductState: Omit<Product, 'id'> = {
  name: '',
  category: Category.FLOWER,
  price: 0,
  description: '',
  imageUrl: '',
  inStock: true,
  brand: Brand.LONG_MONEY_EXOTICS,
};

const AdminPanel: React.FC<AdminPanelProps> = ({ products, onAddProduct, onUpdateProduct, onDeleteProduct }) => {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Product | Omit<Product, 'id'>>(initialProductState);

  useEffect(() => {
    if (editingProduct) {
      setFormData(editingProduct);
      setView('form');
    } else {
      setFormData(initialProductState);
    }
  }, [editingProduct]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const name = target.name;
    
    // FIX: Use `instanceof` to correctly type-guard `e.target` before accessing
    // properties like `checked` or `type` which are not present on all element types.
    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
        setFormData(prev => ({ ...prev, [name]: target.checked }));
    } else if (target instanceof HTMLInputElement && target.type === 'number') {
        setFormData(prev => ({ ...prev, [name]: parseFloat(target.value) || 0 }));
    }
    else {
        setFormData(prev => ({ ...prev, [name]: target.value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onUpdateProduct(formData as Product);
    } else {
      onAddProduct(formData as Omit<Product, 'id'>);
    }
    setView('list');
    setEditingProduct(null);
  };
  
  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData(initialProductState);
    setView('form');
  }

  const handleCancel = () => {
    setView('list');
    setEditingProduct(null);
  };
  
  const handleDelete = (productId: string) => {
    if(window.confirm('Are you sure you want to delete this product?')) {
        onDeleteProduct(productId);
    }
  }

  const commonInputClass = "w-full px-3 py-2 border border-white/20 placeholder-gray-400 text-white rounded-md bg-base-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm";

  if (view === 'form') {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
        <h2 className="text-3xl font-bold mb-6">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit} className="bg-base-200/80 p-6 rounded-lg space-y-4">
          <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleInputChange} className={commonInputClass} required />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} className={commonInputClass} rows={4} required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleInputChange} className={commonInputClass} step="0.01" required />
            <select name="category" value={formData.category} onChange={handleInputChange} className={commonInputClass}>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select name="brand" value={formData.brand} onChange={handleInputChange} className={commonInputClass}>
                {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <input type="text" name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleInputChange} className={commonInputClass} required />
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="inStock" name="inStock" checked={formData.inStock} onChange={handleInputChange} className="h-4 w-4 text-primary bg-base-300 border-gray-500 rounded focus:ring-primary" />
            <label htmlFor="inStock" className="ml-2 block text-sm text-gray-300">In Stock</label>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={handleCancel} className="px-6 py-2 rounded-full text-white bg-base-300 hover:bg-base-100">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-full text-secondary bg-primary hover:bg-green-300 font-semibold">{editingProduct ? 'Save Changes' : 'Add Product'}</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Manage Products</h2>
        <button onClick={handleAddNew} className="flex items-center px-4 py-2 rounded-full text-secondary bg-primary hover:bg-green-300 font-semibold">
          <PlusIcon className="w-5 h-5 mr-2" />
          Add New
        </button>
      </div>
      <div className="bg-base-200/80 p-4 rounded-lg">
        <div className="space-y-3">
          {products.map(product => (
            <div key={product.id} className="flex items-center bg-base-300/50 p-3 rounded-md">
              <img src={product.imageUrl} alt={product.name} className="w-16 h-16 rounded-md object-cover flex-shrink-0" />
              <div className="flex-grow mx-4">
                <p className="font-semibold text-lg">{product.name}</p>
                <p className="text-sm text-primary">${product.price.toFixed(2)} - <span className={product.inStock ? 'text-green-400' : 'text-red-400'}>{product.inStock ? 'In Stock' : 'Out of Stock'}</span></p>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => setEditingProduct(product)} className="px-4 py-2 text-sm rounded-full bg-blue-500/80 hover:bg-blue-500 text-white">Edit</button>
                <button onClick={() => handleDelete(product.id)} className="p-2 rounded-full bg-red-500/80 hover:bg-red-500 text-white"><TrashIcon className="w-5 h-5"/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;