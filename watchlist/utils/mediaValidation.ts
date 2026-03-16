export const validateMediaForm = (form: any) => {
  if (!form.name?.trim()) {
    return { valid: false, message: "Name is required" };
  }

  if (!form.type?.trim()) {
    return { valid: false, message: "Type is required" };
  }

  if (form.season <= 0 || form.current_season <= 0) {
    return { valid: false, message: "Season must be positive" };
  }

  if (
    form.type !== "Video" &&
    (parseInt(form.episode) <= 0 || form.current_episode <= 0)
  ) {
    return { valid: false, message: "Episode must be positive" };
  }

  return { valid: true };
};
