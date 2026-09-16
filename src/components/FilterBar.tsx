import React from 'react';
import { GridLayout } from '../types';
import { LayoutGrid, Grid3X3, Columns, ArrowUpDown, Tag, X } from 'lucide-react';

export type SortOption = 'newest' | 'oldest' | 'title' | 'favorites';

interface FilterBarProps {
  layout: GridLayout;
  onLayoutChange: (layout: GridLayout) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  allTags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  showingCount: number;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  layout,
  onLayoutChange,
  sortOption,
  onSortChange,
  allTags,
  selectedTag,
  onSelectTag,
  showingCount,
  totalCount,
}) => {
  return (
    <div id="filter-bar" className="py-3 flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/60 text-xs">
      {/* Left: Result count & active tag badge */}
      <div className="flex items-center gap-2">
        <span className="text-stone-500 font-medium">
          Showing <strong className="text-stone-900 font-semibold">{showingCount}</strong>
          {showingCount !== totalCount && ` of ${totalCount}`} photos
        </span>

        {selectedTag && (
          <div className="flex items-center gap-1 pl-2.5 pr-1.5 py-0.5 rounded-full bg-amber-100/80 text-amber-900 font-medium text-[11px] border border-amber-200/80">
            <Tag className="w-3 h-3 text-amber-700" />
            <span>#{selectedTag}</span>
            <button
              onClick={() => onSelectTag(null)}
              className="p-0.5 hover:bg-amber-200 rounded-full transition-colors ml-0.5"
              title="Clear tag filter"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Right: Layout Switcher & Sort Selector */}
      <div className="flex items-center gap-3">
        {/* Sort Selector */}
        <div className="flex items-center gap-1.5 bg-stone-100/90 px-2.5 py-1 rounded-full border border-stone-200/70">
          <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
          <select
            id="sort-select"
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-transparent text-stone-700 font-medium focus:outline-none cursor-pointer pr-1"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="title">Title (A-Z)</option>
            <option value="favorites">Favorites first</option>
          </select>
        </div>

        {/* Layout Switcher buttons */}
        <div className="flex items-center bg-stone-100/90 p-0.5 rounded-full border border-stone-200/70">
          <button
            id="layout-masonry-btn"
            onClick={() => onLayoutChange('masonry')}
            className={`p-1.5 rounded-full transition-all ${
              layout === 'masonry' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-400 hover:text-stone-700'
            }`}
            title="Masonry layout"
          >
            <Columns className="w-3.5 h-3.5" />
          </button>
          <button
            id="layout-grid-btn"
            onClick={() => onLayoutChange('grid')}
            className={`p-1.5 rounded-full transition-all ${
              layout === 'grid' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-400 hover:text-stone-700'
            }`}
            title="Standard Grid"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            id="layout-compact-btn"
            onClick={() => onLayoutChange('compact')}
            className={`p-1.5 rounded-full transition-all ${
              layout === 'compact' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-400 hover:text-stone-700'
            }`}
            title="Compact Grid"
          >
            <Grid3X3 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Optional Tag Pills Slider */}
      {allTags.length > 0 && !selectedTag && (
        <div className="w-full flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] text-stone-400 shrink-0 font-medium">Quick Tags:</span>
          {allTags.slice(0, 10).map((tag) => (
            <button
              key={tag}
              onClick={() => onSelectTag(tag)}
              className="shrink-0 px-2 py-0.5 rounded-full bg-stone-100 hover:bg-stone-200/80 text-stone-600 text-[11px] transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
