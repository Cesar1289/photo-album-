import React from 'react';
import { Album } from '../types';
import { Images, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

interface AlbumCardProps {
  album: Album;
  photoCount: number;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({
  album,
  photoCount,
  onClick,
  onEdit,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div
      id={`album-card-${album.id}`}
      onClick={onClick}
      className="group relative bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        <img
          src={album.coverPhotoUrl}
          alt={album.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {album.category && (
            <span className="px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase bg-stone-900/75 text-stone-100 rounded-full backdrop-blur-md shadow-xs">
              {album.category}
            </span>
          )}

          <span className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-white/85 text-stone-800 rounded-full backdrop-blur-md shadow-xs">
            <Images className="w-3 h-3 text-stone-600" />
            <span>{photoCount} {photoCount === 1 ? 'photo' : 'photos'}</span>
          </span>
        </div>

        {/* Action Menu (Stop propagation so clicking doesn't trigger album open) */}
        <div
          className="absolute bottom-3 right-3 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <button
              id={`album-menu-btn-${album.id}`}
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="w-8 h-8 rounded-full bg-stone-900/60 hover:bg-stone-900/85 text-white flex items-center justify-center backdrop-blur-md transition-colors focus:outline-none"
              title="Album options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 bottom-10 z-20 w-36 py-1 bg-white rounded-xl shadow-lg border border-stone-200 text-xs text-stone-700">
                  <button
                    id={`album-edit-btn-${album.id}`}
                    onClick={(e) => {
                      setMenuOpen(false);
                      onEdit(e);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-stone-100 flex items-center gap-2"
                  >
                    <Pencil className="w-3.5 h-3.5 text-stone-500" />
                    <span>Edit Album</span>
                  </button>
                  <button
                    id={`album-delete-btn-${album.id}`}
                    onClick={(e) => {
                      setMenuOpen(false);
                      onDelete(e);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-rose-50 text-rose-600 flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Delete Album</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Album Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-stone-900 group-hover:text-stone-700 transition-colors line-clamp-1">
            {album.title}
          </h3>
          <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
            {album.description}
          </p>
        </div>
        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
          <span>Created {new Date(album.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          <span className="font-semibold text-stone-700 group-hover:translate-x-0.5 transition-transform">
            View album →
          </span>
        </div>
      </div>
    </div>
  );
};
