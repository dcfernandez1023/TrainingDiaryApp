export const setStorageItem = (key, value) => {
  if(key === undefined || key === null || value === undefined || value === null) {
    return;
  }
  window.localStorage.setItem(key.toString(), value.toString());
}

export const getStorageItem = (key) => {
  if(key === undefined || key === null) {
    return null;
  }
  return window.localStorage.getItem(key.toString());
}

export const initTrainingDiaryStorage = () => {
  if(getStorageItem("TRAINING_DIARY_USER") === null) {
    setStorageItem("TRAINING_DIARY_USER", "");
  }
  if(getStorageItem("TRAINING_DIARY_API_TOKEN") === null) {
    setStorageItem("TRAINING_DIARY_API_TOKEN", "");
  }
}
