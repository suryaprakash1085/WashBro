export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: 'user' | 'admin';
  avatar?: string;
  joinedDate: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  icon: string;
  category: string;
  active: boolean;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  address: string;
  service: string;
  pickupDate: string;
  deliveryDate: string;
  status: OrderStatus;
  price: number;
  instructions: string;
  createdAt: string;
}

export type OrderStatus = 
  | 'Pending' 
  | 'Picked Up' 
  | 'Washing' 
  | 'Ironing' 
  | 'Out for Delivery' 
  | 'Delivered';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  replied: boolean;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  text: string;
  rating: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface SiteSettings {
  logo: string;
  offerText: string;
  themeColor: string;
  heroTitle: string;
  heroSubtitle: string;
}
