import axios from 'axios';

const GITHUB_USERNAME = 'ImTanjim';
const REPO_NAME = 'Tour_Images';
const BASE_URL = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/photos`;

export const fetchPhotos = async (folder = '') => {
  try {
    const url = folder ? `${BASE_URL}/${folder}` : BASE_URL;
    const response = await axios.get(url);

    // only filters Images
    const Images = response.data.filter((file) => {
      const ext = file.name.split('.').pop().toLowerCase();
      return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
    });

    return Images;
  } catch (error) {
    console.error('Error fetching photos from GitHub:', error);
    return [];
  }
};

export const fetchFolders = async () => {
  try {
    const response = await axios.get(BASE_URL);

    // only filters Folders
    const folders = response.data.filter(
      (item) => item.type === 'dir',
    );

    return folders;
  } catch (error) {
    console.error('Error fetching folders from GitHub:', error);
    return [];
  }
};
