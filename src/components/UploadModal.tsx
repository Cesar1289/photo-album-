import React, { useState, useRef } from 'react';
import { Photo, Album } from '../types';
import { X, Upload, Link as LinkIcon, Image as ImageIcon, Plus } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  albums: Album[];
  selectedAlbumId?: string;
  onAddPhoto: (photo: Omit<Photo, 'id' | 'dateAdded'>) => void;
  onCreateAlbum: (title: string, description: string) => string; // returns new album id
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  albums,
  selectedAlbumId,
  onAddPhoto,
  onCreateAlbum,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [photoUrl, setPhotoUrl] = useState('');
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [albumId, setAlbumId] = useState(selectedAlbumId || albums[0]?.id || '');
  const [location, setLocation] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'landscape' | 'portrait' | 'square' | 'wide'>('landscape');
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [showQuickAlbumInput, setShowQuickAlbumInput] = useState(false);
  const [quickAlbumTitle, setQuickAlbumTitle] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WebP, etc.)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPhotoUrl(result);
      setPreviewError(false);
      if (!title) {
        // Default title to filename without extension
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleQuickCreateAlbum = () => {
    if (!quickAlbumTitle.trim()) return;
    const newId = onCreateAlbum(quickAlbumTitle.trim(), 'Created while uploading photos.');
    setAlbumId(newId);
    setQuickAlbumTitle('');
    setShowQuickAlbumInput(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    onAddPhoto({
      url: photoUrl.trim(),
      title: title.trim() || 'Untitled Photograph',
      caption: caption.trim(),
      albumId: albumId || albums[0]?.id || 'default',
      location: location.trim() || undefined,
      tags: tags.length > 0 ? tags : ['photo'],
      isFavorite: false,
      aspectRatio,
    });

    // Reset fields
    setPhotoUrl('');
    setTitle('');
    setCaption('');
    setLocation('');
    setTagsInput('');
    onClose();
  };

  return (
    <div
      id="upload-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="upload-modal-dialog"
        className="bg-white rounded-3xl max-w-xl w-full border border-stone-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <div>
            <h2 className="text-lg font-bold text-stone-900 font-display">Add Photo to Album</h2>
            <p className="text-xs text-stone-500">Upload a picture from your device or use a web link</p>
          </div>
          <button
            id="close-upload-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers: File Upload vs URL */}
        <div className="px-6 pt-4">
          <div className="flex bg-stone-100 p-1 rounded-xl">
            <button
              id="upload-tab-file"
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'upload' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload File</span>
            </button>
            <button
              id="upload-tab-url"
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'url' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Image URL</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* File drop zone or URL input */}
          {activeTab === 'upload' ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="photo-file-picker"
              />
              <div
                id="photo-dropzone"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-amber-500 bg-amber-50/50'
                    : photoUrl
                    ? 'border-emerald-300 bg-emerald-50/30'
                    : 'border-stone-200 hover:border-stone-400 bg-stone-50/50'
                }`}
              >
                {photoUrl ? (
                  <div className="relative w-full max-h-40 flex items-center justify-center overflow-hidden rounded-xl">
                    <img
                      src={photoUrl}
                      alt="Upload preview"
                      className="max-h-40 object-contain rounded-lg shadow-xs"
                    />
                    <div className="absolute inset-0 bg-stone-900/30 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition-opacity">
                      Click to change photo
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-stone-200/70 flex items-center justify-center text-stone-600 mb-2.5">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-stone-800">
                      Drag & drop your photo here, or <span className="text-amber-700 underline">browse</span>
                    </span>
                    <span className="text-[11px] text-stone-400 mt-1">
                      Supports JPG, PNG, WEBP, GIF
                    </span>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div>
              <label htmlFor="photo-url-input" className="block text-xs font-semibold text-stone-700 mb-1">
                Image Web URL
              </label>
              <input
                id="photo-url-input"
                type="url"
                required
                value={photoUrl}
                onChange={(e) => {
                  setPhotoUrl(e.target.value);
                  setPreviewError(false);
                }}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-400 focus:outline-none"
              />
              {photoUrl && !previewError && (
                <div className="mt-2.5 relative max-h-36 overflow-hidden rounded-xl bg-stone-100 flex items-center justify-center border border-stone-200">
                  <img
                    src={photoUrl}
                    alt="Preview"
                    onError={() => setPreviewError(true)}
                    className="max-h-36 object-contain rounded-lg"
                  />
                </div>
              )}
              {previewError && (
                <p className="text-xs text-rose-500 mt-1">Unable to load image from this URL. Please verify the link.</p>
              )}
            </div>
          )}

          {/* Form Fields: Title & Caption */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="photo-title-input" className="block text-xs font-semibold text-stone-700 mb-1">
                Title *
              </label>
              <input
                id="photo-title-input"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Golden Gate Sunset"
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-400 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="photo-album-select" className="block text-xs font-semibold text-stone-700 mb-1">
                Album *
              </label>
              <div className="flex gap-1.5">
                <select
                  id="photo-album-select"
                  value={albumId}
                  onChange={(e) => setAlbumId(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-400 focus:outline-none"
                >
                  {albums.map((alb) => (
                    <option key={alb.id} value={alb.id}>
                      {alb.title}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  id="toggle-quick-album-btn"
                  onClick={() => setShowQuickAlbumInput(!showQuickAlbumInput)}
                  className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors"
                  title="Create new album"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Album Creator Row */}
          {showQuickAlbumInput && (
            <div className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-center gap-2">
              <input
                type="text"
                value={quickAlbumTitle}
                onChange={(e) => setQuickAlbumTitle(e.target.value)}
                placeholder="New album name..."
                className="flex-1 px-2.5 py-1 text-xs bg-white border border-amber-300 rounded-lg focus:outline-none"
              />
              <button
                type="button"
                id="submit-quick-album-btn"
                onClick={handleQuickCreateAlbum}
                className="px-3 py-1 bg-stone-900 text-white text-xs font-medium rounded-lg hover:bg-stone-800"
              >
                Create
              </button>
            </div>
          )}

          <div>
            <label htmlFor="photo-caption-input" className="block text-xs font-semibold text-stone-700 mb-1">
              Caption / Notes
            </label>
            <textarea
              id="photo-caption-input"
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Describe the memory, camera settings, or story..."
              className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="photo-location-input" className="block text-xs font-semibold text-stone-700 mb-1">
                Location (optional)
              </label>
              <input
                id="photo-location-input"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Kyoto, Japan"
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-400 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="photo-tags-input" className="block text-xs font-semibold text-stone-700 mb-1">
                Tags (comma-separated)
              </label>
              <input
                id="photo-tags-input"
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="nature, travel, sunset"
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Aspect ratio */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Display Shape</label>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {(['landscape', 'portrait', 'square', 'wide'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setAspectRatio(mode)}
                  className={`py-1.5 rounded-lg border text-xs capitalize transition-all ${
                    aspectRatio === mode
                      ? 'bg-stone-900 text-white border-stone-900 font-semibold'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
            <button
              type="button"
              id="cancel-upload-btn"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-full transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="confirm-upload-btn"
              disabled={!photoUrl}
              className="px-5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-50 disabled:pointer-events-none rounded-full shadow-xs transition-all"
            >
              Save Photo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
