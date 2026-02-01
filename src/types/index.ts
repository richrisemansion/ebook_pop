export interface Book {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  pdfUrl?: string;
  category: AgeCategory;
  ageRange: string;
  pages: number;
  rating: number;
  reviews: number;
  features: string[];
  isNew?: boolean;
  isBestseller?: boolean;
  isActive?: boolean;
}

export type AgeCategory = 'baby' | 'preschool' | 'elementary' | 'preteen';

export interface CartItem extends Book {
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: CustomerInfo;
  totalAmount: number;
  status: 'pending' | 'paid' | 'verified' | 'completed' | 'cancelled';
  slipImage?: string;
  transferDate?: string;
  transferTime?: string;
  transferAmount?: number;
  createdAt: Date;
}

export interface CategoryInfo {
  id: AgeCategory;
  name: string;
  nameTh: string;
  ageRange: string;
  color: string;
  bgColor: string;
  description: string;
}
