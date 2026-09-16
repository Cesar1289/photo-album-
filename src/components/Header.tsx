import React from 'react';
import { Images, FolderHeart, Sparkles, Plus, Search, X, Heart } from 'lucide-react';
import { ViewMode } from '../types';

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenUpload: () => void;
  onOpenCreateAlbum: () => void;
  totalPhotos: number;
  totalAlbums: number;
  favoriteCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  searchQuery,
  onSearchChange,
  onOpenUpload,
  onOpenCreateAlbum,
  totalPhotos,
  totalAlbums,
  favoriteCount,
}) => {
  return (
    <header id="main-header" className="sticky top-0 z-30 bg-[#fcfbf9]/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-3.5">
          
          {/* Logo & Branding */}
          <div className="flex items-center justify-between">
            <button
              id="brand-logo-btn"
              onClick={() => onViewChange('all')}
              className="group flex items-center gap-3 text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-stone-900 text-stone-100 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <Images className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-stone-900 block leading-tight font-display">
                  Photo Album
                </span>
                <span className="text-xs text-stone-500 font-medium tracking-wide">
                  Curated Collections & Memories
                </span>
              </div>
            </button>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                id="mobile-upload-btn"
                onClick={onOpenUpload}
                className="p-2 bg-stone-900 text-stone-100 rounded-lg hover:bg-stone-800 transition-colors"
                title="Add Photo"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md mx-0 md:mx-4">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search photos, tags, albums, locations..."
                className="w-full pl-9 pr-8 py-2 text-sm bg-stone-100/90 hover:bg-stone-100 focus:bg-white text-stone-800 rounded-full border border-stone-200/80 focus:border-stone-400 focus:outline-none transition-all placeholder:text-stone-400"
              />
              {searchQuery && (
                <button
                  id="clear-search-btn"
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 focus:outline-none"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              id="new-album-btn"
              onClick={onOpenCreateAlbum}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-700 bg-stone-100/90 hover:bg-stone-200/80 rounded-full border border-stone-200/80 transition-colors focus:outline-none"
            >
              <FolderHeart className="w-3.5 h-3.5 text-stone-600" />
              <span>New Album</span>
            </button>
            <button
              id="add-photo-btn"
              onClick={onOpenUpload}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-full shadow-sm transition-all hover:shadow focus:outline-none"
            >
              <Plus className="w-3.5 h-3.5 text-amber-200" />
              <span>Add Photo</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 border-t border-stone-200/60 pt-2 pb-2.5 overflow-x-auto scrollbar-none">
          <button
            id="tab-all-photos"
            onClick={() => onViewChange('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              currentView === 'all'
                ? 'bg-stone-900 text-stone-50 font-semibold shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>All Photos</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              currentView === 'all' ? 'bg-stone-800 text-stone-300' : 'bg-stone-200/80 text-stone-600'
            }`}>
              {totalPhotos}
            </span>
          </button>

          <button
            id="tab-albums"
            onClick={() => onViewChange('albums')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              currentView === 'albums' || currentView === 'album-detail'
                ? 'bg-stone-900 text-stone-50 font-semibold shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
            }`}
          >
            <FolderHeart className="w-3.5 h-3.5" />
            <span>Albums</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              currentView === 'albums' || currentView === 'album-detail' ? 'bg-stone-800 text-stone-300' : 'bg-stone-200/80 text-stone-600'
            }`}>
              {totalAlbums}
            </span>
          </button>

          <button
            id="tab-favorites"
            onClick={() => onViewChange('favorites')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              currentView === 'favorites'
                ? 'bg-stone-900 text-stone-50 font-semibold shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${currentView === 'favorites' ? 'fill-rose-400 text-rose-400' : 'text-stone-500'}`} />
            <span>Favorites</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              currentView === 'favorites' ? 'bg-stone-800 text-stone-300' : 'bg-stone-200/80 text-stone-600'
            }`}>
              {favoriteCount}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};
