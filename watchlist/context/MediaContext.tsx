import React, { createContext, ReactNode, useContext, useState } from "react";

// Define a media item type
export interface MediaItem {
  id: string;
  name: string;
  type: string;
  platform: string;
  schedule?: string;
  status?: string;
  priority?: string;
  season?: number;
  episode?: number;
  current_season?: number;
  current_episode?: number;
  notes?: string;
  image?: string;
}

type MediaContextType = {
  items: MediaItem[];
  setItems: React.Dispatch<React.SetStateAction<MediaItem[]>>;
};

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<MediaItem[]>([]);

  return (
    <MediaContext.Provider value={{ items, setItems }}>
      {children}
    </MediaContext.Provider>
  );
};

export const useMedia = () => {
  const context = useContext(MediaContext);
  if (!context) throw new Error("useMedia must be used within MediaProvider");
  return context;
};
