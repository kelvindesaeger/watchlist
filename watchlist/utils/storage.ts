import * as SecureStore from "expo-secure-store";

const SHEET_KEY = "google_sheet_url";

export async function saveSheetUrl(url: string) {
  await SecureStore.setItemAsync(SHEET_KEY, url);
}

export async function getSheetUrl() {
  return await SecureStore.getItemAsync(SHEET_KEY);
}

export async function clearSheetUrl() {
  await SecureStore.deleteItemAsync(SHEET_KEY);
}
