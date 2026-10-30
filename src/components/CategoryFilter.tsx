import React from 'react';
import { ArrowUpDown, CheckSquare, Square } from 'lucide-react';
import { CATEGORIES } from '../data/sampleProducts';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'name';
  onSortChange: (sort: 'featured' | 'price-asc' | 'price-desc' | 'name') => void;
  onlyInStock: boolean;
  onToggleInStock: () => void;
  productCount: number;
  totalCount: number;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  onlyInStock,
  onToggleInStock,
  productCount,
  totalCount
}) => {
  return (
    <div className="space-y-4">
      {/* Category Segmented Controls */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Auxiliary bar: count, in-stock toggle, and sorting */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600 pt-2 border-t border-stone-200/60">
        <div className="flex items-center gap-3">
          <span className="font-medium text-stone-700">
            Menampilkan <strong className="text-stone-900 tabular-nums">{productCount}</strong> dari <span className="tabular-nums">{totalCount}</span> barang
          </span>
          <span aria-hidden="true" className="text-stone-300">|</span>
          <button
            type="button"
            onClick={onToggleInStock}
            className="inline-flex items-center gap-1.5 hover:text-stone-900 cursor-pointer select-none transition-colors"
          >
            {onlyInStock ? (
              <CheckSquare className="w-4 h-4 text-stone-900" />
            ) : (
              <Square className="w-4 h-4 text-stone-400" />
            )}
            <span>Hanya Stok Tersedia</span>
          </button>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
          <span className="hidden sm:inline">Urutkan:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="bg-white border border-stone-200 rounded-md px-2.5 py-1 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-900 cursor-pointer"
          >
            <option value="featured">Koleksi Rekomendasi</option>
            <option value="price-asc">Harga: Terendah ke Tertinggi</option>
            <option value="price-desc">Harga: Tertinggi ke Terendah</option>
            <option value="name">Nama Barang (A - Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
