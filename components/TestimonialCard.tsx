import React from 'react';
import type { Testimonial } from '../types';
import { supabase } from '../services/supabase';
import { toast } from 'sonner';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PencilIcon, TrashIcon } from './Icons';

interface TestimonialCardProps {
    testimonial: Testimonial;
    isAdmin: boolean;
    onEdit: () => void;
    refreshData: () => void;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, isAdmin, onEdit, refreshData }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: testimonial.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    
    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete the testimonial from "${testimonial.name}"?`)) {
            const { error } = await supabase.from('testimonials').delete().eq('id', testimonial.id);
            if (error) {
                toast.error('Failed to delete testimonial.');
            } else {
                toast.success('Testimonial deleted successfully.');
                refreshData();
            }
        }
    };
    
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md relative">
            {isAdmin && (
                <div className="absolute top-4 right-4 flex space-x-2">
                    <button onClick={onEdit} className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"><PencilIcon className="w-5 h-5"/></button>
                    <button onClick={handleDelete} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"><TrashIcon className="w-5 h-5"/></button>
                </div>
            )}
            <div className="flex items-center mb-4">
                <img className="w-14 h-14 rounded-full object-cover mr-4" src={testimonial.image} alt={testimonial.name} loading="lazy" />
                <div>
                    <p className="font-bold text-lg text-gray-900 dark:text-white">{testimonial.name}</p>
                    <p className="text-sm text-brand-primary">{testimonial.role}</p>
                </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.text}"</p>
        </div>
    );
};

export default TestimonialCard;
