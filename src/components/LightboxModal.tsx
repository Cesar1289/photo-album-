import React, { useState, useEffect, useCallback } from 'react';
import { Photo, Album } from '../types';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Download,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Info,
  Calendar,
  MapPin,
  Folder
} from 'lucide-react';

interface LightboxModalProps {
  photo: Photo | null;
  photos: Photo[];
  albums: Album[];
  onClose: () => void;
  onSelectPhoto: (photo: Photo) => void;
  onToggleFavorite: (id: string) => void;
  onDeletePhoto: (id: string) => void;
  onSelectTag: (tag: string) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  photo,
  photos,
  albums,
  onClose,
  onSelectPhoto,
  onToggleFavorite,
  onDeletePhoto,
  onSelectTag,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const currentIndex = photos.findIndex((p) => p.id === photo?.id);
  const currentAlbum = albums.find((a) => a.id === photo?.albumId);

  // Reset zoom and confirmation when active photo changes
  useEffect(() => {
    setZoomLevel(1);
    setConfirmDelete(false);
  }, [photo?.id]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onSelectPhoto(photos[currentIndex - 1]);
    } else {
      onSelectPhoto(photos[photos.length - 1]);
    }
  }, [currentIndex, photos, onSelectPhoto]);

  const handleNext = useCallback(() => {
    if (currentIndex < photos.length - 1) {
      onSelectPhoto(photos[currentIndex + 1]);
    } else {
      onSelectPhoto(photos[0]);
    }
  }, [currentIndex, photos, onSelectPhoto]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!photo) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photo, onClose, handlePrev, handleNext]);

  if (!photo) return null;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.3, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.3, 0.7));
  const handleResetZoom = () => setZoomLevel(1);

  const handleDownload = () => {
    // Direct download link trigger
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = `${photo.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    link.target = '_blank';
    link.rel = 'noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      id="lightbox-backdrop"
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between select-none animate-in fade-in duration-200"
    >
      {/* Top Navigation Bar */}
      <div className="relative z-20 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/80 to-transparent text-stone-200">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-stone-400">
            {currentIndex + 1} / {photos.length}
          </span>
          <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-stone-600" />
          <h2 className="hidden sm:inline-block text-sm font-semibold text-stone-200 truncate max-w-xs">
            {photo.title}
          </h2>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Zoom controls */}
          <div className="flex items-center bg-stone-800/80 rounded-full px-1.5 py-1 border border-stone-700/60 text-stone-300">
            <button
              id="zoom-out-btn"
              onClick={handleZoomOut}
              className="p-1 hover:text-white rounded-full transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              id="zoom-reset-btn"
              onClick={handleResetZoom}
              className="px-1.5 text-[11px] font-mono hover:text-white transition-colors"
              title="Reset zoom"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button
              id="zoom-in-btn"
              onClick={handleZoomIn}
              className="p-1 hover:text-white rounded-full transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            {zoomLevel !== 1 && (
              <button
                onClick={handleResetZoom}
                className="p-1 hover:text-white ml-0.5 text-stone-400"
                title="Reset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Favorite */}
          <button
            id="lightbox-fav-btn"
            onClick={() => onToggleFavorite(photo.id)}
            className={`p-2 rounded-full transition-colors ${
              photo.isFavorite
                ? 'bg-rose-500 text-white'
                : 'bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white'
            }`}
            title={photo.isFavorite ? 'Unfavorite' : 'Favorite'}
          >
            <Heart className={`w-4 h-4 ${photo.isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Info toggle */}
          <button
            id="lightbox-info-btn"
            onClick={() => setShowDetails(!showDetails)}
            className={`p-2 rounded-full transition-colors ${
              showDetails ? 'bg-amber-400 text-stone-900 font-bold' : 'bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white'
            }`}
            title="Toggle Details"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Download */}
          <button
            id="lightbox-download-btn"
            onClick={handleDownload}
            className="p-2 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
            title="Download original"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Delete Photo */}
          {confirmDelete ? (
            <div className="flex items-center gap-1 bg-rose-950/80 border border-rose-700/80 rounded-full px-2 py-0.5">
              <span className="text-[11px] text-rose-300">Delete?</span>
              <button
                id="lightbox-confirm-delete-btn"
                onClick={() => {
                  onDeletePhoto(photo.id);
                  onClose();
                }}
                className="text-[11px] font-bold text-white bg-rose-600 hover:bg-rose-500 px-2 py-0.5 rounded-full"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-[11px] text-stone-400 hover:text-white px-1"
              >
                No
              </button>
            </div>
          ) : (
            <button
              id="lightbox-delete-btn"
              onClick={() => setConfirmDelete(true)}
              className="p-2 rounded-full bg-stone-800/80 hover:bg-rose-900/80 text-stone-300 hover:text-rose-300 transition-colors"
              title="Delete Photo"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {/* Close button */}
          <button
            id="lightbox-close-btn"
            onClick={onClose}
            className="p-2 rounded-full bg-stone-800/90 hover:bg-stone-700 text-stone-200 hover:text-white transition-colors ml-2"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-1 flex items-center justify-center p-4 sm:p-10 overflow-hidden">
        {/* Navigation Arrows */}
        {photos.length > 1 && (
          <>
            <button
              id="lightbox-prev-btn"
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-stone-900/70 hover:bg-stone-900/95 text-stone-200 hover:text-white flex items-center justify-center backdrop-blur-md border border-stone-700/50 transition-all hover:scale-110 shadow-lg"
              title="Previous photo (Left arrow)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              id="lightbox-next-btn"
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-stone-900/70 hover:bg-stone-900/95 text-stone-200 hover:text-white flex items-center justify-center backdrop-blur-md border border-stone-700/50 transition-all hover:scale-110 shadow-lg"
              title="Next photo (Right arrow)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Zoomable Image Container */}
        <div className="max-w-full max-h-full flex items-center justify-center transition-transform duration-200 ease-out"
             style={{ transform: `scale(${zoomLevel})` }}>
          <img
            src={photo.url}
            alt={photo.title}
            referrerPolicy="no-referrer"
            className="max-h-[82vh] max-w-[88vw] object-contain rounded-lg shadow-2xl transition-all"
          />
        </div>

        {/* Side / Drawer Detail Panel */}
        {showDetails && (
          <div
            id="photo-details-panel"
            className="absolute top-4 right-4 bottom-4 w-80 bg-stone-900/90 backdrop-blur-xl border border-stone-700/70 rounded-2xl p-5 text-stone-200 shadow-2xl z-30 overflow-y-auto animate-in slide-in-from-right-5 duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <span className="text-xs font-bold tracking-wider text-amber-300 uppercase">Photo Information</span>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-stone-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white leading-snug">{photo.title}</h3>
                  {photo.caption && (
                    <p className="text-xs text-stone-300 mt-1 leading-relaxed">{photo.caption}</p>
                  )}
                </div>

                {currentAlbum && (
                  <div className="flex items-center gap-2.5 text-xs text-stone-300 bg-stone-800/60 p-2.5 rounded-xl border border-stone-700/50">
                    <Folder className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-stone-400 block">Album</span>
                      <span className="font-semibold text-stone-100">{currentAlbum.title}</span>
                    </div>
                  </div>
                )}

                {photo.location && (
                  <div className="flex items-center gap-2.5 text-xs text-stone-300 bg-stone-800/60 p-2.5 rounded-xl border border-stone-700/50">
                    <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-stone-400 block">Location</span>
                      <span className="text-stone-200">{photo.location}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2.5 text-xs text-stone-300 bg-stone-800/60 p-2.5 rounded-xl border border-stone-700/50">
                  <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-stone-400 block">Date Added</span>
                    <span className="text-stone-200">
                      {new Date(photo.dateAdded).toLocaleDateString(undefined, {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {photo.tags && photo.tags.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-stone-400 block mb-2">Tags</span>
                    <div className="flex flex-wrap gap-1.5">
                      {photo.tags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => {
                            onSelectTag(tag);
                            onClose();
                          }}
                          className="px-2.5 py-1 text-xs rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition-colors"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800 text-[11px] text-stone-500 flex justify-between items-center">
              <span>Aspect: {photo.aspectRatio || 'standard'}</span>
              <span>ID: {photo.id.slice(0, 8)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Photo Strip Thumbnail Carousel */}
      <div className="relative z-20 px-4 py-2.5 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center overflow-x-auto scrollbar-none gap-2">
        {photos.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => onSelectPhoto(item)}
            className={`relative shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all focus:outline-none ${
              item.id === photo.id
                ? 'border-amber-400 scale-110 shadow-md ring-2 ring-amber-400/30'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
            title={`Photo ${idx + 1}: ${item.title}`}
          >
            <img
              src={item.url}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
