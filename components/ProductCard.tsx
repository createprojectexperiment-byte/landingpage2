import React from 'react';
import type { Product } from '../types';
import { supabase } from '../services/supabase';
import { toast } from 'sonner';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PencilIcon, TrashIcon } from './Icons';

interface ProductCardProps {
    product: Product;
    isAdmin: boolean;
    onEdit: () => void;
    refreshData: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isAdmin, onEdit, refreshData }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: product.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    
    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete "${product.title}"?`)) {
            const { error } = await supabase.from('products').delete().eq('id', product.id);
            if (error) {
                toast.error('Failed to delete product.');
            } else {
                toast.success('Product deleted successfully.');
                refreshData();
            }
        }
    };
    
    const descriptionLines = product.description.split('\n').map((line, index) => (
        <p key={index} className="mb-2">{line.trim()}</p>
    ));

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-shadow hover:shadow-2xl">
            <div className="md:flex">
                <div className="md:flex-shrink-0">
                    <img className="h-48 w-full object-cover md:h-full md:w-64" src={product.image} alt={product.title} loading="lazy" />
                </div>
                <div className="p-8 relative w-full">
                    {isAdmin && (
                        <div className="absolute top-4 right-4 flex space-x-2">
                            <button onClick={onEdit} className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"><PencilIcon className="w-5 h-5"/></button>
                            <button onClick={handleDelete} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"><TrashIcon className="w-5 h-5"/></button>
                        </div>
                    )}
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{product.title}</h3>
                    <div className="flex items-baseline mt-2">
                        <span className="text-2xl font-extrabold text-brand-primary">{product.price}</span>
                        <span className="ml-2 text-lg text-gray-500 dark:text-gray-400 line-through">{product.oldPrice}</span>
                    </div>
                    <div className="mt-4 text-gray-600 dark:text-gray-300 prose prose-sm dark:prose-invert max-w-none">
                       {descriptionLines}
                    </div>
                    <a href={product.lynkUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-6 bg-brand-primary hover:bg-brand-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105">
                        Beli Sekarang
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
