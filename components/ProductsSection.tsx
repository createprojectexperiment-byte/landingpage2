import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { toast } from 'sonner';
import type { Product } from '../types';
import { supabase } from '../services/supabase';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import { PlusIcon } from './Icons';

interface ProductsSectionProps {
  products: Product[];
  isAdmin: boolean;
  refreshData: () => void;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({ products, isAdmin, refreshData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };
  
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
        const oldIndex = products.findIndex((p) => p.id === active.id);
        const newIndex = products.findIndex((p) => p.id === over.id);
        
        const newProductsOrder = arrayMove(products, oldIndex, newIndex);

        const updatePromises = newProductsOrder.map((product, index) =>
            supabase.from('products').update({ position: index }).eq('id', product.id)
        );

        try {
            await Promise.all(updatePromises);
            toast.success('Urutan produk diperbarui!');
            refreshData();
        } catch (error) {
            toast.error('Gagal memperbarui urutan.');
            console.error(error);
        }
    }
  };


  return (
    <section id="products" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
            Produk <span className="text-brand-primary">Unggulan</span>
          </h2>
        </div>

        {products.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
                <p className="text-gray-500 dark:text-gray-400 text-lg">Belum ada produk yang ditampilkan.</p>
                {isAdmin && <p className="text-sm text-brand-primary mt-2">Klik tombol di bawah untuk menambah produk.</p>}
            </div>
        ) : (
            <div className="space-y-8">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={products.map(p => p.id)} strategy={verticalListSortingStrategy}>
                        {products.map((product) => (
                            <ProductCard 
                                key={product.id}
                                product={product}
                                isAdmin={isAdmin}
                                onEdit={() => handleEdit(product)}
                                refreshData={refreshData}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>
        )}

        {isAdmin && (
          <div className="text-center mt-12">
            <button
              onClick={handleAdd}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg flex items-center mx-auto transition-colors"
            >
              <PlusIcon className="w-6 h-6 mr-2" />
              Tambah Produk
            </button>
          </div>
        )}
      </div>
      
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        refreshData={refreshData}
        productCount={products.length}
      />
    </section>
  );
};

export default ProductsSection;
