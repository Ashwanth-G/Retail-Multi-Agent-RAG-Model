import { api } from "./api";

export interface RecommendPayload {
  user_id?: string;
  query: string;
  top_k?: number;
}

export interface Product {
  id: string;
  name?: string;
  brand?: string;
  category?: string;
  price?: number;
  rating?: number;
  score?: number;
  semantic?: number;
}

export interface RecommendResponse {
  results: Product[];
}

export const getRecommendations = async (
  payload: RecommendPayload
): Promise<RecommendResponse> => {
  const res = await api.post("/recommend", payload);
  return res.data;
};
