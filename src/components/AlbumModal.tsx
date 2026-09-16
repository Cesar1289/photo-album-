import React, { useState, useEffect } from 'react';
import { Album, Photo } from '../types';
import { X, FolderPlus, Image as ImageIcon } from 'lucide-react';

interface AlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  albumToEdit?: Album | null;
  availablePhotos: Photo[];
  onSaveAlbum: (albumData: { id?: string; title: string; description: string; coverPhotoUrl: string; category?: string }) => void;
}

const CATEGORIES = ['Travel', 'Family', 'Architecture', 'Nature', 'Lifestyle', 'Portraits', 'Events', 'Art'];

export const AlbumModal: React.FC<AlbumModalProps> = ({
  isOpen,
  onClose,
  albumToEdit,
  availablePhotos,
  onSaveAlbum,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverPhotoUrl, setCoverPhotoUrl] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);

  useEffect(() => {
    if (albumToEdit) {
      setTitle(albumToEdit.title);
      setDescription(albumToEdit.description);
      setCoverPhotoUrl(albumToEdit.coverPhotoUrl);
      setCategory(albumToEdit.category || CATEGORIES[0]);
    } else {
      setTitle('');
      setDescription('');
      // Default to first photo url or unsplash default
      setCoverPhotoUrl(availablePhotos[0]?.url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80');
      setCategory(CATEGORIES[0]);
    }
    setShowPhotoPicker(false);
  }, [albumToEdit, isOpen, availablePhotos]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSaveAlbum({
      id: albumToEdit?.id,
      title: title.trim(),
      description: description.trim(),
      coverPhotoUrl: coverPhotoUrl || availablePhotos[0]?.url || '',
      category,
    });
    onClose();
  };

  return (
    <div
      id="album-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="album-modal-dialog"
        className="bg-white rounded-3xl max-w-lg w-full border border-stone-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-stone-100 rounded-xl text-stone-800">
              <FolderPlus className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 font-display">
                {albumToEdit ? 'Edit Album' : 'Create New Album'}
              </h2>
              <p className="text-xs text-stone-500">Organize your memories into themed collections</p>
            </div>
          </div>
          <button
            id="close-album-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="album-title-input" className="block text-xs font-semibold text-stone-700 mb-1">
              Album Title *
            </label>
            <input
              id="album-title-input"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Summer in Provence"
              className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-400 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="album-desc-input" className="block text-xs font-semibold text-stone-700 mb-1">
              Description
            </label>
            <textarea
              id="album-desc-input"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What makes this album special?"
              className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="album-category-select" className="block text-xs font-semibold text-stone-700 mb-1">
                Category
              </label>
              <select
                id="album-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-400 focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Cover Photo
              </label>
              <button
                type="button"
                id="choose-cover-photo-btn"
                onClick={() => setShowPhotoPicker(!showPhotoPicker)}
                className="w-full px-3 py-2 text-xs bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-xl text-stone-700 flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-1.5 truncate">
                  <ImageIcon className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  <span>{showPhotoPicker ? 'Close Picker' : 'Select from Library'}</span>
                </span>
                <span className="text-[10px] text-amber-700 font-bold">Pick</span>
              </button>
            </div>
          </div>

          {/* Cover Photo Preview & Manual URL */}
          <div>
            <label htmlFor="album-cover-url-input" className="block text-xs font-semibold text-stone-700 mb-1">
              Cover Image URL
            </label>
            <input
              id="album-cover-url-input"
              type="url"
              value={coverPhotoUrl}
              onChange={(e) => setCoverPhotoUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-400 focus:outline-none"
            />
            {coverPhotoUrl && (
              <div className="mt-2 h-28 w-full rounded-xl overflow-hidden border border-stone-200 bg-stone-100 relative">
                <img
                  src={coverPhotoUrl}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 text-[10px] bg-black/60 text-white rounded-md">
                  Cover Preview
                </span>
              </div>
            )}
          </div>

          {/* Photo picker grid */}
          {showPhotoPicker && availablePhotos.length > 0 && (
            <div className="border border-stone-200 rounded-xl p-2.5 bg-stone-50">
              <span className="text-[11px] font-semibold text-stone-600 block mb-2">
                Click an existing photo to set as cover:
              </span>
              <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto">
                {availablePhotos.map((photo) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => {
                      setCoverPhotoUrl(photo.url);
                      setShowPhotoPicker(false);
                    }}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      coverPhotoUrl === photo.url ? 'border-amber-500 scale-95 shadow' : 'border-transparent hover:opacity-80'
                    }`}
                  >
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
            <button
              type="button"
              id="cancel-album-btn"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-full transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="confirm-album-btn"
              className="px-5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-full shadow-xs transition-all"
            >
              {albumToEdit ? 'Save Changes' : 'Create Album'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
