import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '../services/supabase';
import type { Product } from '../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  refreshData: () => void;
  productCount: number;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product, refreshData, productCount }) => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    oldPrice: '',
    description: '',
    image: '',
    lynkUrl: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        price: product.price,
        oldPrice: product.oldPrice,
        description: product.description,
        image: product.image,
        lynkUrl: product.lynkUrl,
      });
    } else {
      setFormData({
        title: '',
        price: '',
        oldPrice: '',
        description: '',
        image: '',
        lynkUrl: '',
      });
    }
  }, [product, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (product) {
      // Update existing product
      const { error } = await supabase.from('products').update(formData).eq('id', product.id);
      if (error) {
        toast.error('Failed to update product.');
      } else {
        toast.success('Product updated successfully!');
        refreshData();
        onClose();
      }
    } else {
      // Add new product
      const { error } = await supabase.from('products').insert([{ ...formData, position: productCount }]);
       if (error) {
        toast.error('Failed to add product.');
      } else {
        toast.success('Product added successfully!');
        refreshData();
        onClose();
      }
    }
    setLoading(false);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{product ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
                    <input type="text" name="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Old Price</label>
                    <input type="text" name="oldPrice" value={formData.oldPrice} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600" required />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={6} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
                <input type="url" name="image" value={formData.image} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lynk.id URL</label>
                <input type="url" name="lynkUrl" value={formData.lynkUrl} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600" required />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary-dark disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
