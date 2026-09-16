import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { AlbumCard } from './components/AlbumCard';
import { PhotoCard } from './components/PhotoCard';
import { LightboxModal } from './components/LightboxModal';
import { UploadModal } from './components/UploadModal';
import { AlbumModal } from './components/AlbumModal';
import { FilterBar, SortOption } from './components/FilterBar';
import { EmptyState } from './components/EmptyState';
import { Album, Photo, ViewMode, GridLayout } from './types';
import { INITIAL_ALBUMS, INITIAL_PHOTOS } from './data/initialData';
import { ArrowLeft, Plus, Pencil, Trash2, RotateCcw, FolderHeart, Sparkles } from 'lucide-react';

const STORAGE_KEY_ALBUMS = 'photo_album_app_albums_v1';
const STORAGE_KEY_PHOTOS = 'photo_album_app_photos_v1';

export function App() {
  // Load initial state from localStorage or defaults
  const [albums, setAlbums] = useState<Album[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ALBUMS);
      return saved ? JSON.parse(saved) : INITIAL_ALBUMS;
    } catch {
      return INITIAL_ALBUMS;
    }
  });

  const [photos, setPhotos] = useState<Photo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PHOTOS);
      return saved ? JSON.parse(saved) : INITIAL_PHOTOS;
    } catch {
      return INITIAL_PHOTOS;
    }
  });

  // Navigation & View States
  const [currentView, setCurrentView] = useState<ViewMode>('all');
  const [activeAlbumId, setActiveAlbumId] = useState<string | null>(null);

  // Filters & Layout
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [layout, setLayout] = useState<GridLayout>('masonry');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  // Modals
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [albumToEdit, setAlbumToEdit] = useState<Album | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ALBUMS, JSON.stringify(albums));
    } catch (err) {
      console.error('Failed to save albums to localStorage', err);
    }
  }, [albums]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PHOTOS, JSON.stringify(photos));
    } catch (err) {
      console.error('Failed to save photos to localStorage', err);
    }
  }, [photos]);

  // Current active album object
  const activeAlbum = useMemo(() => {
    return albums.find((a) => a.id === activeAlbumId) || null;
  }, [albums, activeAlbumId]);

  // All unique tags across photos
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    photos.forEach((p) => p.tags.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet).sort();
  }, [photos]);

  // Favorite counts
  const favoriteCount = useMemo(() => {
    return photos.filter((p) => p.isFavorite).length;
  }, [photos]);

  // Filtered photos based on view, album, search, and tag
  const filteredPhotos = useMemo(() => {
    let result = [...photos];

    // View filter
    if (currentView === 'favorites') {
      result = result.filter((p) => p.isFavorite);
    } else if (currentView === 'album-detail' && activeAlbumId) {
      result = result.filter((p) => p.albumId === activeAlbumId);
    }

    // Tag filter
    if (selectedTag) {
      result = result.filter((p) => p.tags.includes(selectedTag));
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        const titleMatch = p.title.toLowerCase().includes(q);
        const captionMatch = p.caption?.toLowerCase().includes(q);
        const locationMatch = p.location?.toLowerCase().includes(q);
        const tagMatch = p.tags.some((t) => t.toLowerCase().includes(q));
        const album = albums.find((a) => a.id === p.albumId);
        const albumMatch = album?.title.toLowerCase().includes(q);
        return titleMatch || captionMatch || locationMatch || tagMatch || albumMatch;
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (sortOption === 'newest') {
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
      if (sortOption === 'oldest') {
        return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
      }
      if (sortOption === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortOption === 'favorites') {
        if (a.isFavorite === b.isFavorite) {
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        }
        return a.isFavorite ? -1 : 1;
      }
      return 0;
    });

    return result;
  }, [photos, currentView, activeAlbumId, selectedTag, searchQuery, sortOption, albums]);

  // Filtered albums for albums view
  const filteredAlbums = useMemo(() => {
    if (!searchQuery.trim()) return albums;
    const q = searchQuery.toLowerCase().trim();
    return albums.filter((a) => {
      const titleMatch = a.title.toLowerCase().includes(q);
      const descMatch = a.description.toLowerCase().includes(q);
      const catMatch = a.category?.toLowerCase().includes(q);
      return titleMatch || descMatch || catMatch;
    });
  }, [albums, searchQuery]);

  // Handlers
  const handleToggleFavorite = (photoId: string) => {
    setPhotos((prev) =>
      prev.map((p) => {
        if (p.id === photoId) {
          const nextState = !p.isFavorite;
          if (nextState) {
            showToast(`Added "${p.title}" to favorites`);
          }
          return { ...p, isFavorite: nextState };
        }
        return p;
      })
    );

    // Update lightbox instance if open
    if (lightboxPhoto && lightboxPhoto.id === photoId) {
      setLightboxPhoto((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  const handleDeletePhoto = (photoId: string) => {
    const photoToDelete = photos.find((p) => p.id === photoId);
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    showToast(`Removed "${photoToDelete?.title || 'photo'}"`);
  };

  const handleAddPhoto = (photoData: Omit<Photo, 'id' | 'dateAdded'>) => {
    const newPhoto: Photo = {
      ...photoData,
      id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      dateAdded: new Date().toISOString(),
    };
    setPhotos((prev) => [newPhoto, ...prev]);

    // Update album cover photo if album has no cover
    const targetAlbum = albums.find((a) => a.id === photoData.albumId);
    if (targetAlbum && !targetAlbum.coverPhotoUrl) {
      setAlbums((prev) =>
        prev.map((a) => (a.id === targetAlbum.id ? { ...a, coverPhotoUrl: newPhoto.url } : a))
      );
    }

    showToast(`Added "${newPhoto.title}" to ${targetAlbum?.title || 'album'}`);
  };

  const handleCreateAlbum = (title: string, description: string): string => {
    const newId = `album-${Date.now()}`;
    const newAlbum: Album = {
      id: newId,
      title,
      description,
      coverPhotoUrl: photos[0]?.url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      createdAt: new Date().toISOString(),
      category: 'Personal',
    };
    setAlbums((prev) => [newAlbum, ...prev]);
    showToast(`Created album "${title}"`);
    return newId;
  };

  const handleSaveAlbum = (albumData: {
    id?: string;
    title: string;
    description: string;
    coverPhotoUrl: string;
    category?: string;
  }) => {
    if (albumData.id) {
      // Edit existing
      setAlbums((prev) =>
        prev.map((a) =>
          a.id === albumData.id
            ? {
                ...a,
                title: albumData.title,
                description: albumData.description,
                coverPhotoUrl: albumData.coverPhotoUrl,
                category: albumData.category,
              }
            : a
        )
      );
      showToast(`Updated album "${albumData.title}"`);
    } else {
      // Create new
      handleCreateAlbum(albumData.title, albumData.description);
    }
    setAlbumToEdit(null);
  };

  const handleDeleteAlbum = (albumId: string) => {
    const albumToDelete = albums.find((a) => a.id === albumId);
    if (!albumToDelete) return;

    if (window.confirm(`Are you sure you want to delete "${albumToDelete.title}"? Photos in this album will remain in your library.`)) {
      setAlbums((prev) => prev.filter((a) => a.id !== albumId));
      if (activeAlbumId === albumId) {
        setCurrentView('albums');
        setActiveAlbumId(null);
      }
      showToast(`Deleted album "${albumToDelete.title}"`);
    }
  };

  const handleOpenAlbum = (albumId: string) => {
    setActiveAlbumId(albumId);
    setCurrentView('album-detail');
    setSelectedTag(null);
  };

  const handleResetDemoData = () => {
    if (window.confirm('Reset all photos and albums back to sample showcase data?')) {
      setAlbums(INITIAL_ALBUMS);
      setPhotos(INITIAL_PHOTOS);
      setCurrentView('all');
      setActiveAlbumId(null);
      setSelectedTag(null);
      setSearchQuery('');
      showToast('Restored demo showcase albums');
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-stone-900 flex flex-col selection:bg-amber-100">
      {/* Header */}
      <Header
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          if (view !== 'album-detail') {
            setActiveAlbumId(null);
          }
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenCreateAlbum={() => {
          setAlbumToEdit(null);
          setIsAlbumModalOpen(true);
        }}
        totalPhotos={photos.length}
        totalAlbums={albums.length}
        favoriteCount={favoriteCount}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Album Detail Header (when inside an album) */}
        {currentView === 'album-detail' && activeAlbum && (
          <div id="album-detail-banner" className="mb-6 bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs">
            <div className="relative h-44 sm:h-56 w-full bg-stone-900">
              <img
                src={activeAlbum.coverPhotoUrl}
                alt={activeAlbum.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />

              {/* Back navigation */}
              <div className="absolute top-4 left-4 z-10">
                <button
                  id="back-to-albums-btn"
                  onClick={() => {
                    setCurrentView('albums');
                    setActiveAlbumId(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-900/70 hover:bg-stone-900 text-stone-100 backdrop-blur-md text-xs font-semibold transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>All Albums</span>
                </button>
              </div>

              {/* Banner content */}
              <div className="absolute bottom-4 left-4 right-4 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  {activeAlbum.category && (
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-400 text-stone-950 mb-1.5">
                      {activeAlbum.category}
                    </span>
                  )}
                  <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
                    {activeAlbum.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-stone-300 max-w-xl mt-1 line-clamp-2">
                    {activeAlbum.description}
                  </p>
                </div>

                {/* Album Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    id="edit-album-btn"
                    onClick={() => {
                      setAlbumToEdit(activeAlbum);
                      setIsAlbumModalOpen(true);
                    }}
                    className="p-2 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-200 transition-colors"
                    title="Edit album"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    id="delete-album-btn"
                    onClick={() => handleDeleteAlbum(activeAlbum.id)}
                    className="p-2 rounded-full bg-stone-800/80 hover:bg-rose-900/80 text-stone-200 hover:text-rose-200 transition-colors"
                    title="Delete album"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    id="add-to-album-btn"
                    onClick={() => setIsUploadOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white text-stone-900 text-xs font-bold hover:bg-stone-100 transition-colors shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-700" />
                    <span>Add to Album</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Mode: ALBUMS Overview */}
        {currentView === 'albums' && (
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-200/60">
              <div>
                <h2 className="text-xl font-bold text-stone-900 font-display">Collections & Albums</h2>
                <p className="text-xs text-stone-500">Group your photos into meaningful albums</p>
              </div>
              <button
                id="create-album-top-btn"
                onClick={() => {
                  setAlbumToEdit(null);
                  setIsAlbumModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-full transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-amber-300" />
                <span>Create Album</span>
              </button>
            </div>

            {filteredAlbums.length === 0 ? (
              <EmptyState
                type="no-photos"
                actionText="Create Your First Album"
                onAction={() => {
                  setAlbumToEdit(null);
                  setIsAlbumModalOpen(true);
                }}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAlbums.map((album) => {
                  const albumPhotoCount = photos.filter((p) => p.albumId === album.id).length;
                  return (
                    <AlbumCard
                      key={album.id}
                      album={album}
                      photoCount={albumPhotoCount}
                      onClick={() => handleOpenAlbum(album.id)}
                      onEdit={() => {
                        setAlbumToEdit(album);
                        setIsAlbumModalOpen(true);
                      }}
                      onDelete={() => handleDeleteAlbum(album.id)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* View Modes: ALL PHOTOS, FAVORITES, or ALBUM DETAIL */}
        {currentView !== 'albums' && (
          <div>
            {/* View Header Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
              <div>
                <h2 className="text-xl font-bold text-stone-900 font-display capitalize">
                  {currentView === 'favorites'
                    ? 'Favorite Photographs'
                    : currentView === 'album-detail'
                    ? `Photos in ${activeAlbum?.title}`
                    : 'Photo Stream'}
                </h2>
                <p className="text-xs text-stone-500">
                  {currentView === 'favorites'
                    ? 'All images marked as your personal highlights'
                    : currentView === 'album-detail'
                    ? `${filteredPhotos.length} photos in this collection`
                    : 'Browse, curate, and explore all captured moments'}
                </p>
              </div>

              {/* Quick Reset Demo button */}
              <button
                id="reset-demo-btn"
                onClick={handleResetDemoData}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-stone-500 hover:text-stone-800 bg-stone-100 hover:bg-stone-200/80 rounded-full transition-colors"
                title="Restore default showcase photos"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Demo Photos</span>
              </button>
            </div>

            {/* Filter Bar */}
            <FilterBar
              layout={layout}
              onLayoutChange={setLayout}
              sortOption={sortOption}
              onSortChange={setSortOption}
              allTags={allTags}
              selectedTag={selectedTag}
              onSelectTag={setSelectedTag}
              showingCount={filteredPhotos.length}
              totalCount={photos.length}
            />

            {/* Photos Display Area */}
            <div className="mt-6">
              {filteredPhotos.length === 0 ? (
                <EmptyState
                  type={
                    searchQuery
                      ? 'no-search-results'
                      : currentView === 'favorites'
                      ? 'no-favorites'
                      : currentView === 'album-detail'
                      ? 'empty-album'
                      : 'no-photos'
                  }
                  searchQuery={searchQuery}
                  onResetSearch={() => setSearchQuery('')}
                  onAction={() => {
                    if (currentView === 'favorites') {
                      setCurrentView('all');
                    } else {
                      setIsUploadOpen(true);
                    }
                  }}
                  actionText={
                    currentView === 'favorites' ? 'Browse All Photos' : 'Add First Photo'
                  }
                />
              ) : (
                <>
                  {/* Masonry Layout */}
                  {layout === 'masonry' && (
                    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                      {filteredPhotos.map((photo) => (
                        <PhotoCard
                          key={photo.id}
                          photo={photo}
                          albumTitle={albums.find((a) => a.id === photo.albumId)?.title}
                          layout="masonry"
                          onClick={() => setLightboxPhoto(photo)}
                          onToggleFavorite={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(photo.id);
                          }}
                          onSelectTag={(tag) => setSelectedTag(tag)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Standard Grid Layout */}
                  {layout === 'grid' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredPhotos.map((photo) => (
                        <PhotoCard
                          key={photo.id}
                          photo={photo}
                          albumTitle={albums.find((a) => a.id === photo.albumId)?.title}
                          layout="grid"
                          onClick={() => setLightboxPhoto(photo)}
                          onToggleFavorite={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(photo.id);
                          }}
                          onSelectTag={(tag) => setSelectedTag(tag)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Compact Grid Layout */}
                  {layout === 'compact' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                      {filteredPhotos.map((photo) => (
                        <PhotoCard
                          key={photo.id}
                          photo={photo}
                          albumTitle={albums.find((a) => a.id === photo.albumId)?.title}
                          layout="compact"
                          onClick={() => setLightboxPhoto(photo)}
                          onToggleFavorite={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(photo.id);
                          }}
                          onSelectTag={(tag) => setSelectedTag(tag)}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Lightbox Modal */}
      {lightboxPhoto && (
        <LightboxModal
          photo={lightboxPhoto}
          photos={filteredPhotos}
          albums={albums}
          onClose={() => setLightboxPhoto(null)}
          onSelectPhoto={(p) => setLightboxPhoto(p)}
          onToggleFavorite={handleToggleFavorite}
          onDeletePhoto={handleDeletePhoto}
          onSelectTag={(tag) => setSelectedTag(tag)}
        />
      )}

      {/* Upload Photo Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        albums={albums}
        selectedAlbumId={activeAlbumId || undefined}
        onAddPhoto={handleAddPhoto}
        onCreateAlbum={handleCreateAlbum}
      />

      {/* Create / Edit Album Modal */}
      <AlbumModal
        isOpen={isAlbumModalOpen}
        onClose={() => {
          setIsAlbumModalOpen(false);
          setAlbumToEdit(null);
        }}
        albumToEdit={albumToEdit}
        availablePhotos={photos}
        onSaveAlbum={handleSaveAlbum}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="app-toast-notification"
          className="fixed bottom-5 right-5 z-50 bg-stone-900 text-stone-50 px-4 py-2.5 rounded-2xl shadow-xl border border-stone-800 text-xs font-medium flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-200"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-stone-200/60 bg-white py-6 mt-12 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FolderHeart className="w-4 h-4 text-stone-600" />
            <span className="font-semibold text-stone-800">Photo Album</span>
            <span className="text-stone-300">•</span>
            <span>{photos.length} photos</span>
            <span className="text-stone-300">•</span>
            <span>{albums.length} albums</span>
          </div>
          <p className="text-stone-400">
            Click any photo to inspect, zoom, download, or favorite.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
