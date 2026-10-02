export interface ProductRecord {
  id: string;
  title: string;
  sku?: string;
  imageUrl?: string;
  images?: Array<string | { url?: string }>;
  isNew?: boolean;
  stock?: number;
  lowStockThreshold?: number;
  price?: number;
  originalPrice?: number;
  ratingCache?: number;
  reviewCountCache?: number;
}

export interface ProductCardProps {
  record: ProductRecord;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}