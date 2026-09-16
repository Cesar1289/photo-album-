export interface Photo {
  id: string;
  url: string;
  title: string;
  caption?: string;
  albumId: string;
  dateAdded: string;
  location?: string;
  tags: string[];
  isFavorite: boolean;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'wide';
}

export interface Album {
  id: string;
  title: string;
  description: string;
  coverPhotoUrl: string;
  createdAt: string;
  category?: string;
}

export type ViewMode = 'all' | 'albums' | 'album-detail' | 'favorites';
export type GridLayout = 'masonry' | 'grid' | 'compact';
