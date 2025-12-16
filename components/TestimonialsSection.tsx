import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { toast } from 'sonner';
import type { Testimonial } from '../types';
import { supabase } from '../services/supabase';
import TestimonialCard from './TestimonialCard';
import TestimonialModal from './TestimonialModal';
import { PlusIcon } from './Icons';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  isAdmin: boolean;
  refreshData: () => void;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials, isAdmin, refreshData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingTestimonial(null);
    setIsModalOpen(true);
  };
  
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
        const oldIndex = testimonials.findIndex((t) => t.id === active.id);
        const newIndex = testimonials.findIndex((t) => t.id === over.id);
        
        const newTestimonialsOrder = arrayMove(testimonials, oldIndex, newIndex);

        const updatePromises = newTestimonialsOrder.map((testimonial, index) =>
            supabase.from('testimonials').update({ position: index }).eq('id', testimonial.id)
        );

        try {
            await Promise.all(updatePromises);
            toast.success('Testimonial order updated successfully!');
            refreshData();
        } catch (error) {
            toast.error('Failed to update testimonial order.');
            console.error(error);
        }
    }
  };


  return (
    <section className="py-20 bg-brand-light dark:bg-brand-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
            Apa Kata <span className="text-brand-primary">Mereka</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={testimonials.map(t => t.id)} strategy={horizontalListSortingStrategy}>
                    {testimonials.map((testimonial) => (
                        <TestimonialCard
                            key={testimonial.id}
                            testimonial={testimonial}
                            isAdmin={isAdmin}
                            onEdit={() => handleEdit(testimonial)}
                            refreshData={refreshData}
                        />
                    ))}
                </SortableContext>
            </DndContext>
        </div>

        {isAdmin && (
          <div className="text-center mt-12">
            <button
              onClick={handleAdd}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg flex items-center mx-auto transition-colors"
            >
              <PlusIcon className="w-6 h-6 mr-2" />
              Tambah Testimoni
            </button>
          </div>
        )}
      </div>

      <TestimonialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        testimonial={editingTestimonial}
        refreshData={refreshData}
        testimonialCount={testimonials.length}
      />
    </section>
  );
};

export default TestimonialsSection;
