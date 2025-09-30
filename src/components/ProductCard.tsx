'use client';

import { Button } from './ui/Button';
import { Edit, Trash2 } from 'lucide-react';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onDelete: (id: number) => void;
  onEdit: (product: Product) => void;
}

export function ProductCard({ product, onDelete, onEdit }: ProductCardProps) {
  return (
    <div className="border border-gray-300 dark:border-white/10 rounded-lg p-4 flex flex-col gap-4 bg-white dark:bg-gray-500/5 hover:border-orange-500 dark:hover:border-orange-500 transition-colors duration-300">
      <div className="aspect-video rounded-md overflow-hidden">
        <img 
          src={product.image_url || `https://placehold.co/600x400/1e293b/f97316?text=Image`} 
          alt={product.name} 
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex-grow">
        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50">{product.name}</h3>
        <p className="text-orange-500 font-semibold text-md my-1">${product.price}</p>
        <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">{product.description}</p>
      </div>
      <div className="flex gap-2 mt-2">
        <Button onClick={() => onEdit(product)} size="sm" className="w-full">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button onClick={() => onDelete(product.id)} variant="destructive" size="sm" className="w-full">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
}