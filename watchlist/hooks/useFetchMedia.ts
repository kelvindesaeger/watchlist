import { getSheetUrl } from "@/utils/storage";
import { useMedia } from "../context/MediaContext";

export const useFetchMedia = () => {
  const { setItems } = useMedia();

  const fetchMedia = async () => {
    try {
        const SHEET_API_URL = await getSheetUrl();
        if (!SHEET_API_URL) {
            // console.error("No sheet URL found");
            return;
        }
        const response = await fetch(SHEET_API_URL);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setItems(data);
    } catch (error) {
      console.error("Error fetching media:", error);
    }
  };

  return { fetchMedia };
};
