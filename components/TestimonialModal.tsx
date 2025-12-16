import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '../services/supabase';
import type { Testimonial } from '../types';

interface TestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  testimonial: Testimonial | null;
  refreshData: () => void;
  testimonialCount: number;
}

const TestimonialModal: React.FC<TestimonialModalProps> = ({ isOpen, onClose, testimonial, refreshData, testimonialCount }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    text: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (testimonial) {
      setFormData({
        name: testimonial.name,
        role: testimonial.role,
        text: testimonial.text,
        image: testimonial.image,
      });
    } else {
      setFormData({
        name: '',
        role: '',
        text: '',
        image: '',
      });
    }
  }, [testimonial, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (testimonial) {
      // Update existing testimonial
      const { error } = await supabase.from('testimonials').update(formData).eq('id', testimonial.id);
      if (error) {
        toast.error('Failed to update testimonial.');
      } else {
        toast.success('Testimonial updated successfully!');
        refreshData();
        onClose();
      }
    } else {
      // Add new testimonial
      const { error } = await supabase.from('testimonials').insert([{ ...formData, position: testimonialCount }]);
      if (error) {
        toast.error('Failed to add testimonial.');
      } else {
        toast.success('Testimonial added successfully!');
        refreshData();
        onClose();
      }
    }
    setLoading(false);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{testimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                    <input type="text" name="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600" required />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Testimonial Text</label>
                <textarea name="text" value={formData.text} onChange={handleChange} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
                <input type="url" name="image" value={formData.image} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600" required />
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

export default TestimonialModal;
