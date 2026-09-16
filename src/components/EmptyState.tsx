import React from 'react';
import { Camera, Heart, Search, FolderPlus, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-photos' | 'no-favorites' | 'no-search-results' | 'empty-album';
  searchQuery?: string;
  onAction?: () => void;
  actionText?: string;
  onResetSearch?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  searchQuery,
  onAction,
  actionText,
  onResetSearch,
}) => {
  const getContent = () => {
    switch (type) {
      case 'no-favorites':
        return {
          icon: <Heart className="w-8 h-8 text-rose-400" />,
          title: 'No favorite photos yet',
          description: 'Tap the heart icon on any photo to save it to your personal favorites collection.',
          buttonText: actionText || 'Explore All Photos',
        };
      case 'no-search-results':
        return {
          icon: <Search className="w-8 h-8 text-stone-400" />,
          title: `No matches found for "${searchQuery}"`,
          description: 'Try checking your spelling or searching for a different keyword, tag, or location.',
          buttonText: 'Clear Search',
        };
      case 'empty-album':
        return {
          icon: <FolderPlus className="w-8 h-8 text-amber-500" />,
          title: 'This album is currently empty',
          description: 'Start adding photos to bring this collection to life.',
          buttonText: actionText || 'Add Photo to Album',
        };
      case 'no-photos':
      default:
        return {
          icon: <Camera className="w-8 h-8 text-stone-400" />,
          title: 'Your gallery is empty',
          description: 'Upload your first photograph or import images to create your photo album.',
          buttonText: actionText || 'Upload Photo',
        };
    }
  };

  const content = getContent();

  return (
    <div id="empty-state-container" className="py-16 px-4 flex flex-col items-center justify-center text-center max-w-sm mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-stone-100/90 border border-stone-200/80 flex items-center justify-center mb-4 shadow-2xs">
        {content.icon}
      </div>
      <h3 className="text-base font-bold text-stone-900 mb-1.5 font-display">{content.title}</h3>
      <p className="text-xs text-stone-500 leading-relaxed mb-6">{content.description}</p>
      {type === 'no-search-results' && onResetSearch ? (
        <button
          onClick={onResetSearch}
          className="px-4 py-2 text-xs font-semibold text-stone-800 bg-stone-200 hover:bg-stone-300 rounded-full transition-colors"
        >
          {content.buttonText}
        </button>
      ) : onAction ? (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-full shadow-xs transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{content.buttonText}</span>
        </button>
      ) : null}
    </div>
  );
};
