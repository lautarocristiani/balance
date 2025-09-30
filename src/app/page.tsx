'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { ProductForm } from '@/components/ProductForm';
import { supabase } from '@/lib/supabaseClient';
import type { Product } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/Button';
import { PlusCircle, X } from 'lucide-react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  }

  useEffect(() => { 
    fetchProducts(); 
  }, []);

  async function handleAddProduct(productData: { 
    name: string; 
    price: number; 
    description: string; 
    imageFile?: File | null; 
  }) {
    setIsSubmitting(true);
    let imageUrl: string | null = null;

    if (productData.imageFile) {
      const fileName = `${uuidv4()}-${productData.imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product_images')
        .upload(fileName, productData.imageFile);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        alert('Error al subir la imagen.');
        setIsSubmitting(false);
        return;
      }
      
      const { data: publicUrlData } = supabase.storage
        .from('product_images')
        .getPublicUrl(uploadData.path);
      
      imageUrl = publicUrlData.publicUrl;
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{ 
        name: productData.name, 
        price: productData.price, 
        description: productData.description, 
        image_url: imageUrl 
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding product:', error);
      alert('Error al añadir el producto.');
    } else if (data) {
      setProducts(prevProducts => [data, ...prevProducts]);
      closeModal();
    }
    
    setIsSubmitting(false);
  }
  
  async function handleUpdateProduct(productData: { 
    name: string; 
    price: number; 
    description: string;
    imageFile?: File | null;
    wantsToRemoveImage?: boolean;
  }) {
    if (!editingProduct) return;

    setIsSubmitting(true);
    let newImageUrl: string | null = editingProduct.image_url;

    if (productData.imageFile || productData.wantsToRemoveImage) {
      if (editingProduct.image_url) {
        try {
          const urlParts = editingProduct.image_url.split('/');
          const fileName = urlParts[urlParts.length - 1];
          await supabase.storage.from('product_images').remove([fileName]);
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }

      if (productData.imageFile) {
        const fileName = `${uuidv4()}-${productData.imageFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product_images')
          .upload(fileName, productData.imageFile);

        if (uploadError) {
          console.error('Error uploading new image:', uploadError);
          alert('Error al subir la nueva imagen.');
          setIsSubmitting(false);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from('product_images')
          .getPublicUrl(uploadData.path);
        
        newImageUrl = publicUrlData.publicUrl;
      } else {
        newImageUrl = null;
      }
    }

    const { data, error } = await supabase
      .from('products')
      .update({ 
        name: productData.name, 
        price: productData.price, 
        description: productData.description,
        image_url: newImageUrl
      })
      .eq('id', editingProduct.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      alert('Error al actualizar el producto.');
    } else if (data) {
      setProducts(products.map(p => (p.id === data.id ? data : p)));
      closeModal();
    }
    setIsSubmitting(false);
  }

  async function handleDeleteProduct(id: number) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      alert('Error al eliminar el producto.');
    } else {
      setProducts(products.filter(p => p.id !== id));
    }
  }
  
  const openModalForEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const openModalForCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
        setEditingProduct(null);
    }, 300);
  };

  return (
    <>
      <main className="container mx-auto p-4 sm:p-8 min-h-screen">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-50">
              Balance
              <span className="text-orange-500">.</span>
            </h1>
            <p className="text-slate-600 dark:text-gray-500 mt-2 text-lg">
              Your simple inventory management hub.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <Button onClick={openModalForCreate}>
              <PlusCircle className="w-5 h-5 md:mr-2" />
              <span className="hidden sm:inline">Add Product</span>
            </Button>
          </div>
        </header>
        
        <section>
          {loading ? (
            <p className="text-lg text-center py-20 text-slate-500">Loading products...</p>
          ) : (
            <>
              {products.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                   <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200">No products found.</h2>
                   <p className="text-slate-500 dark:text-slate-400 mt-2">Click "Add Product" to get started!</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onDelete={handleDeleteProduct}
                      onEdit={openModalForEdit}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-start p-4 sm:items-center animate-in animate-fade-in">
          <div className="bg-white dark:bg-gray-500/10 border border-slate-200 dark:border-gray-700 rounded-lg p-6 w-full max-w-md relative">
             <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                 {editingProduct ? 'Edit Product' : 'Add New Product'}
               </h2>
               <Button size="icon" onClick={closeModal} disabled={isSubmitting}>
                 <X className="w-5 h-5"/>
               </Button>
             </div>
             <ProductForm
                initialData={editingProduct}
                onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
                isLoading={isSubmitting}
              />
          </div>
        </div>
      )}
    </>
  );
}