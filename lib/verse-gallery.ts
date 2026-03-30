export const VERSE_IMAGE_GALLERY_KEY =
  "christian-study-guide:verse-image-gallery";

export interface SavedVerseImage {
  id: string;
  verse: string;
  reference: string;
  theme: string;
  bgColor: string;
  textColor: string;
  imageUrl: string;
  createdAt: string;
}
