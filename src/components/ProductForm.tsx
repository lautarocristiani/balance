'use client';

import { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { ImageUp, XCircle } from 'lucide-react';
import type { Product } from "@/types";

interface ProductFormProps {
  initialData?: Product | null;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [wantsToRemoveImage, setWantsToRemoveImage] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPrice(initialData.price.toString());
      setDescription(initialData.description || '');
      setImagePreviewUrl(initialData.image_url || null);
      setImageFile(null);
      setWantsToRemoveImage(false);
    } else {
      setName('');
      setPrice('');
      setDescription('');
      handleRemoveImage();
    }
  }, [initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      setWantsToRemoveImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
    setWantsToRemoveImage(true);
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || isLoading) return; 
    
    onSubmit({ 
      name, 
      price: parseFloat(price), 
      description,
      imageFile,
      wantsToRemoveImage
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className="text-sm font-medium text-gray-600 dark:text-gray-400">Product Name</label>
        <input 
          id="name" 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-gray-100 dark:bg-gray-500/50 border-gray-300 dark:border-gray-700 rounded-md p-2 mt-1 text-gray-900 dark:text-gray-50 focus:ring-2 focus:ring-orange-500 focus:outline-none" 
          disabled={isLoading}
          required
        />
      </div>
      
      <div>
        <label htmlFor="price" className="text-sm font-medium text-gray-600 dark:text-gray-400">Price</label>
        <input 
          id="price" 
          type="number" 
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full bg-gray-100 dark:bg-gray-500/50 border-gray-300 dark:border-gray-700 rounded-md p-2 mt-1 text-gray-900 dark:text-gray-50 focus:ring-2 focus:ring-orange-500 focus:outline-none" 
          disabled={isLoading}
          required
        />
      </div>
          
      <div>
        <label htmlFor="description" className="text-sm font-medium text-gray-600 dark:text-gray-400">Description</label>
        <textarea 
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full bg-gray-100 dark:bg-gray-500/50 border-gray-300 dark:border-gray-700 rounded-md p-2 mt-1 text-gray-900 dark:text-gray-50 focus:ring-2 focus:ring-orange-500 focus:outline-none" 
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="image" className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">Product Image</label>
        <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-2 flex items-center justify-center group hover:border-orange-500 transition-colors cursor-pointer h-32">
          <input 
            id="image" 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            disabled={isLoading}
          />
          {!imagePreviewUrl ? (
            <div className="flex flex-col items-center text-gray-500 dark:text-gray-400 group-hover:text-orange-500 transition-colors">
              <ImageUp className="w-8 h-8 mb-2" />
              <span className="text-sm">Click to upload image</span>
            </div>
          ) : (
            <div className="relative w-full h-full rounded-md overflow-hidden flex items-center justify-center">
              <img src={imagePreviewUrl} alt="Image preview" className="object-contain w-full h-full" />
              <button 
                type="button" 
                onClick={handleRemoveImage} 
                className="absolute top-1 right-1 bg-red-600/70 hover:bg-red-700 p-1 rounded-full text-white transition-colors"
                disabled={isLoading}
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="mt-2">
        {isLoading 
          ? 'Saving...' 
          : (initialData ? 'Save Changes' : 'Add Product')}
      </Button>
    </form>
  );
}