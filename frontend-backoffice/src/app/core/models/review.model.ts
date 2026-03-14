export interface Review {
  id: string;
  content: string;
  rating: number | null;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    pseudo: string;
    email: string;
  };
  recipeId: string;
  parentReviewId: string | null;
  replies: Review[];
}
