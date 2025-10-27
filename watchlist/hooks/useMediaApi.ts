import { getSheetUrl } from "@/utils/storage";
import type { MediaItem } from "../context/MediaContext";
import { useMedia } from "../context/MediaContext";

export const useMediaApi = () => {
  const { items, setItems } = useMedia();

  const getUrl = async () => await getSheetUrl();

  const fetchMedia = async () => {
    const SHEET_API_URL = await getUrl();
    const response = await fetch(SHEET_API_URL!);
    const data = await response.json();
    setItems(data);
  };

  const addMedia = async (newItem: MediaItem) => {
    const SHEET_API_URL = await getUrl();
    const response = await fetch(SHEET_API_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });
    const added = await response.json();
    setItems(prev => [...prev, added]);
  };

  const updateMedia = async (updatedItem: MediaItem) => {
    const SHEET_API_URL = await getUrl();
    const body = { _method: "PUT", ...updatedItem };

    const response = await fetch(SHEET_API_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error("Update failed");
    setItems(prev =>
      prev.map(i => (String(i.id) === String(updatedItem.id) ? updatedItem : i))
    );
  };


  return { fetchMedia, addMedia, updateMedia };
};
