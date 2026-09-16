import React from 'react';
import { Photo, GridLayout } from '../types';
import { Heart, MapPin, Maximize2 } from 'lucide-react';

interface PhotoCardProps {
  photo: Photo;
  albumTitle?: string;
  layout: GridLayout;
  onClick: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onSelectTag?: (tag: string) => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  albumTitle,
  layout,
  onClick,
  onToggleFavorite,
  onSelectTag,
}) => {
  // Height and aspect ratio styles based on layout mode
  const getAspectClass = () => {
    if (layout === 'grid') {
      return 'aspect-4/3';
    }
    if (layout === 'compact') {
      return 'aspect-square';
    }
    // Masonry: use natural/photo-defined aspect ratio
    switch (photo.aspectRatio) {
      case 'portrait':
        return 'aspect-3/4';
      case 'square':
        return 'aspect-square';
      case 'wide':
        return 'aspect-16/9';
      case 'landscape':
      default:
        return 'aspect-4/3';
    }
  };

  return (
    <div
      id={`photo-card-${photo.id}`}
      onClick={onClick}
      className={`group relative bg-stone-100 rounded-2xl overflow-hidden border border-stone-200/70 shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer ${
        layout === 'masonry' ? 'break-inside-avoid mb-4' : ''
      }`}
    >
      {/* Image element */}
      <div className={`relative w-full ${getAspectClass()} overflow-hidden bg-stone-200`}>
        <img
          src={photo.url}
          alt={photo.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Badges: Favorite Button & Fullscreen Hint */}
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
          <button
            id={`fav-btn-${photo.id}`}
            onClick={onToggleFavorite}
            className={`p-2 rounded-full backdrop-blur-md transition-all focus:outline-none ${
              photo.isFavorite
                ? 'bg-rose-500/90 text-white shadow-xs scale-105'
                : 'bg-stone-900/40 text-stone-200 hover:bg-stone-900/80 hover:text-white group-hover:opacity-100 opacity-80'
            }`}
            title={photo.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${photo.isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* View Lightbox icon top left on hover */}
        <div className="absolute top-2.5 left-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="p-2 rounded-full bg-stone-900/50 backdrop-blur-md text-stone-200 hover:text-white flex items-center justify-center">
            <Maximize2 className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Hover Caption Details */}
        <div className="absolute bottom-0 inset-x-0 p-3.5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end">
          <h4 className="text-sm font-semibold tracking-tight text-stone-50 drop-shadow-xs line-clamp-1">
            {photo.title}
          </h4>

          {photo.location && (
            <div className="flex items-center gap-1 text-[11px] text-stone-300 mt-0.5 drop-shadow-xs line-clamp-1">
              <MapPin className="w-3 h-3 text-amber-300 shrink-0" />
              <span>{photo.location}</span>
            </div>
          )}

          {/* Tags list */}
          {photo.tags && photo.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {photo.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectTag) onSelectTag(tag);
                  }}
                  className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-md text-stone-100 transition-colors"
                >
                  #{tag}
                </span>
              ))}
              {photo.tags.length > 3 && (
                <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-black/30 text-stone-300">
                  +{photo.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* For compact layout, show minimal text below photo */}
      {layout === 'compact' && (
        <div className="p-2 bg-white">
          <p className="text-xs font-medium text-stone-800 truncate">{photo.title}</p>
          {albumTitle && <p className="text-[10px] text-stone-400 truncate">{albumTitle}</p>}
        </div>
      )}
    </div>
  );
};
