import React from 'react';
import { formatDate } from '../src/utils/dateUtils';

interface MediaItem {
  url: string;
  activityId: string;
  timestamp: string;
  actorName: string;
  description?: string;
}

interface Props {
  items: MediaItem[];
  onSelect?: (item: MediaItem) => void;
}

const MediaGallery: React.FC<Props> = ({ items, onSelect }) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="size-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
          <span className="material-symbols-outlined text-3xl">photo_library</span>
        </div>
        <p className="text-slate-500 font-medium">No photos found in the family gallery.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1 sm:gap-2">
      {items.map((item, index) => (
        <div 
          key={`${item.activityId}-${index}`}
          className="aspect-square relative group cursor-pointer overflow-hidden rounded-lg bg-slate-200 shadow-sm"
          onClick={() => onSelect?.(item)}
        >
          <div 
            className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url('${item.url}')` }}
          />
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 text-white">
            <p className="text-[10px] font-bold truncate">{item.actorName}</p>
            <p className="text-[8px] opacity-80">{formatDate(item.timestamp)}</p>
          </div>
          
          <div className="absolute top-2 right-2 size-5 bg-white/20 backdrop-blur-md rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-[14px] text-white">zoom_in</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MediaGallery;
