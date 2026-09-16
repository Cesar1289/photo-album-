import { Album, Photo } from '../types';

export const INITIAL_ALBUMS: Album[] = [
  {
    id: 'album-1',
    title: 'Alpine Escapes',
    description: 'Crisp mountain air, misty pine valleys, and serene glacial lakes captured during hiking trails.',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-06-12',
    category: 'Travel'
  },
  {
    id: 'album-2',
    title: 'Modern Architecture',
    description: 'Striking lines, minimalist facades, concrete textures, and reflective glass across urban skylines.',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-07-04',
    category: 'Architecture'
  },
  {
    id: 'album-3',
    title: 'Coffee & Quiet Moments',
    description: 'Cozy morning rituals, warm ceramic mugs, fresh roasts, and quiet sunlit reading corners.',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-08-19',
    category: 'Lifestyle'
  },
  {
    id: 'album-4',
    title: 'Botanical Sanctuary',
    description: 'Lush monstera fronds, golden sunlight through green canopies, and wild desert succulents.',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-09-01',
    category: 'Nature'
  }
];

export const INITIAL_PHOTOS: Photo[] = [
  // Alpine Escapes
  {
    id: 'photo-1',
    albumId: 'album-1',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    title: 'Yosemite Valley Mist',
    caption: 'Early morning light breaking over towering granite cliffs and still alpine river.',
    dateAdded: '2026-06-12',
    location: 'Yosemite National Park, California',
    tags: ['mountains', 'sunrise', 'reflection', 'nature'],
    isFavorite: true,
    aspectRatio: 'landscape'
  },
  {
    id: 'photo-2',
    albumId: 'album-1',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    title: 'Mount Rainier Sunset',
    caption: 'Pink and violet alpenglow across the snow-capped summit ridge.',
    dateAdded: '2026-06-14',
    location: 'Cascade Range, Washington',
    tags: ['mountains', 'sunset', 'snow', 'peaks'],
    isFavorite: false,
    aspectRatio: 'landscape'
  },
  {
    id: 'photo-3',
    albumId: 'album-1',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    title: 'Starry Peaks in the Dolomites',
    caption: 'Clear night sky above rugged jagged peaks illuminated by starlight.',
    dateAdded: '2026-06-18',
    location: 'Dolomites, Italy',
    tags: ['night', 'stars', 'mountains'],
    isFavorite: true,
    aspectRatio: 'portrait'
  },
  {
    id: 'photo-4',
    albumId: 'album-1',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    title: 'Foggy Forest Meadow',
    caption: 'Soft blankets of fog weaving through pine tree needles at dawn.',
    dateAdded: '2026-06-20',
    location: 'Black Forest, Germany',
    tags: ['fog', 'forest', 'morning'],
    isFavorite: false,
    aspectRatio: 'landscape'
  },

  // Modern Architecture
  {
    id: 'photo-5',
    albumId: 'album-2',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    title: 'Financial Tower Angles',
    caption: 'Upward geometric perspective of glass curtain walls converging into the sky.',
    dateAdded: '2026-07-04',
    location: 'Tokyo, Japan',
    tags: ['skyscraper', 'geometry', 'urban', 'minimal'],
    isFavorite: true,
    aspectRatio: 'portrait'
  },
  {
    id: 'photo-6',
    albumId: 'album-2',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    title: 'Brutalist Concrete Atrium',
    caption: 'Architectural interplay of light and shadow across sculptural concrete stairs.',
    dateAdded: '2026-07-08',
    location: 'London, UK',
    tags: ['concrete', 'shadow', 'indoor', 'design'],
    isFavorite: false,
    aspectRatio: 'square'
  },
  {
    id: 'photo-7',
    albumId: 'album-2',
    url: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=80',
    title: 'Curved Pavilion Facade',
    caption: 'Rhythmic wooden slats wrapping around an organic contemporary museum pavilion.',
    dateAdded: '2026-07-15',
    location: 'Copenhagen, Denmark',
    tags: ['museum', 'facade', 'wood', 'lines'],
    isFavorite: false,
    aspectRatio: 'landscape'
  },

  // Coffee & Quiet Moments
  {
    id: 'photo-8',
    albumId: 'album-3',
    url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
    title: 'Morning Flat White & Book',
    caption: 'Steaming espresso and velvety foam next to an open notebook on rustic oak.',
    dateAdded: '2026-08-19',
    location: 'Melbourne, Australia',
    tags: ['coffee', 'latte', 'morning', 'cozy'],
    isFavorite: true,
    aspectRatio: 'landscape'
  },
  {
    id: 'photo-9',
    albumId: 'album-3',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
    title: 'Artisan Pour Over Station',
    caption: 'Carefully brewed single-origin drip coffee flowing into a glass decanter.',
    dateAdded: '2026-08-22',
    location: 'Portland, Oregon',
    tags: ['pourover', 'brew', 'cafe', 'glass'],
    isFavorite: false,
    aspectRatio: 'portrait'
  },
  {
    id: 'photo-10',
    albumId: 'album-3',
    url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1200&q=80',
    title: 'Rainy Day Cafe Window',
    caption: 'Droplets beading on window panes while warm golden lamps glow within.',
    dateAdded: '2026-08-25',
    location: 'Seattle, Washington',
    tags: ['rain', 'window', 'ambient', 'mood'],
    isFavorite: true,
    aspectRatio: 'landscape'
  },

  // Botanical Sanctuary
  {
    id: 'photo-11',
    albumId: 'album-4',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    title: 'Sunbeams Through Canopy',
    caption: 'Golden morning light filtering through ancient redwood fronds.',
    dateAdded: '2026-09-01',
    location: 'Muir Woods, California',
    tags: ['forest', 'sunlight', 'botanical', 'green'],
    isFavorite: false,
    aspectRatio: 'landscape'
  },
  {
    id: 'photo-12',
    albumId: 'album-4',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    title: 'Geometric Succulent Rosette',
    caption: 'Intricate fractal symmetry of desert echeveria succulent with dusty teal tones.',
    dateAdded: '2026-09-04',
    location: 'Oaxaca, Mexico',
    tags: ['succulent', 'plants', 'macro', 'teal'],
    isFavorite: true,
    aspectRatio: 'square'
  }
];
