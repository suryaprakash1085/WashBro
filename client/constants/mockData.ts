import type { Order, Service, ContactMessage, Testimonial, TeamMember, User } from '@/types';

export const MOCK_SERVICES: Service[] = [
  { id: 's1', title: 'Wash & Fold', description: 'Complete washing, drying and folding of your everyday clothes with premium detergents.', price: 12.99, icon: 'WashingMachine', category: 'Washing', active: true },
  { id: 's2', title: 'Ironing', description: 'Professional steam ironing for crisp, wrinkle-free garments ready to wear.', price: 8.99, icon: 'Flame', category: 'Ironing', active: true },
  { id: 's3', title: 'Dry Cleaning', description: 'Expert dry cleaning for delicate fabrics, suits, dresses and special garments.', price: 24.99, icon: 'Sparkles', category: 'Dry Cleaning', active: true },
  { id: 's4', title: 'Steam Press', description: 'High-quality steam pressing that removes tough wrinkles and refreshes fabric.', price: 14.99, icon: 'Wind', category: 'Steam Press', active: true },
  { id: 's5', title: 'Shoe Cleaning', description: 'Professional sneaker and shoe cleaning to restore your footwear to like-new condition.', price: 19.99, icon: 'Footprints', category: 'Shoe Cleaning', active: true },
  { id: 's6', title: 'Bedding & Linens', description: 'Fresh washing and pressing of sheets, pillowcases, comforters and towels.', price: 29.99, icon: 'Bed', category: 'Washing', active: true },
  { id: 's7', title: 'Stain Removal', description: 'Targeted treatment for stubborn stains on any fabric type with eco-friendly solutions.', price: 9.99, icon: 'Droplets', category: 'Special', active: true },
  { id: 's8', title: 'Express Service', description: 'Same-day turnaround for urgent laundry needs — pickup in 4 hours guaranteed.', price: 34.99, icon: 'Zap', category: 'Express', active: true },
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Sarah Mitchell', email: 'sarah@example.com', phone: '(555) 123-4567', address: '142 Oak Avenue, San Francisco', role: 'user', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', joinedDate: '2024-01-15' },
  { id: 'u2', name: 'James Parker', email: 'james@example.com', phone: '(555) 234-5678', address: '88 Pine Street, San Francisco', role: 'user', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', joinedDate: '2024-02-20' },
  { id: 'u3', name: 'Emily Chen', email: 'emily@example.com', phone: '(555) 345-6789', address: '56 Maple Drive, Oakland', role: 'user', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', joinedDate: '2024-03-10' },
  { id: 'u4', name: 'Michael Torres', email: 'michael@example.com', phone: '(555) 456-7890', address: '321 Elm Court, Berkeley', role: 'user', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', joinedDate: '2024-03-18' },
  { id: 'u5', name: 'Olivia Adams', email: 'olivia@example.com', phone: '(555) 567-8901', address: '78 Cedar Lane, San Jose', role: 'user', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', joinedDate: '2024-04-05' },
  { id: 'u6', name: 'Daniel Kim', email: 'daniel@example.com', phone: '(555) 678-9012', address: '192 Birch Road, Palo Alto', role: 'user', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', joinedDate: '2024-04-22' },
  { id: 'u7', name: 'Sophia Rivera', email: 'sophia@example.com', phone: '(555) 789-0123', address: '415 Walnut Ave, Sunnyvale', role: 'user', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', joinedDate: '2024-05-01' },
  { id: 'u8', name: 'Liam Johnson', email: 'liam@example.com', phone: '(555) 890-1234', address: '63 Spruce Way, Fremont', role: 'user', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop', joinedDate: '2024-05-15' },
  { id: 'u9', name: 'Ava Thompson', email: 'ava@example.com', phone: '(555) 901-2345', address: '207 Aspen Blvd, Daly City', role: 'user', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop', joinedDate: '2024-06-02' },
  { id: 'u10', name: 'Noah Williams', email: 'noah@example.com', phone: '(555) 012-3456', address: '155 Redwood Ct, Santa Clara', role: 'user', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop', joinedDate: '2024-06-20' },
];

const svcNames = ['Wash & Fold', 'Ironing', 'Dry Cleaning', 'Steam Press', 'Shoe Cleaning', 'Bedding & Linens', 'Stain Removal', 'Express Service'];
const statuses: Order['status'][] = ['Pending', 'Picked Up', 'Washing', 'Ironing', 'Out for Delivery', 'Delivered'];
const prices = [12.99, 8.99, 24.99, 14.99, 19.99, 29.99, 9.99, 34.99];

function makeOrders(): Order[] {
  const orders: Order[] = [];
  for (let i = 0; i < 24; i++) {
    const user = MOCK_USERS[i % MOCK_USERS.length];
    const svcIdx = i % svcNames.length;
    const d = new Date(2025, 0, 5 + i * 2);
    const dd = new Date(d); dd.setDate(dd.getDate() + 3);
    orders.push({
      id: `FP-${(1000 + i).toString()}`,
      userId: user.id,
      userName: user.name,
      userPhone: user.phone,
      userEmail: user.email,
      address: user.address,
      service: svcNames[svcIdx],
      pickupDate: d.toISOString().split('T')[0],
      deliveryDate: dd.toISOString().split('T')[0],
      status: statuses[i % statuses.length],
      price: prices[svcIdx],
      instructions: i % 3 === 0 ? 'Handle with care, delicate fabric' : '',
      createdAt: d.toISOString(),
    });
  }
  return orders;
}

export const MOCK_ORDERS: Order[] = makeOrders();

export const MOCK_MESSAGES: ContactMessage[] = [
  { id: 'm1', name: 'Rachel Green', email: 'rachel@mail.com', phone: '(555) 111-2222', message: 'Do you offer pickup service on weekends? I need help with my curtains.', replied: false, createdAt: '2025-06-01T10:00:00Z' },
  { id: 'm2', name: 'Tom Hardy', email: 'tom@mail.com', phone: '(555) 333-4444', message: 'How much would it cost to dry clean 3 suits? Also is there a bulk discount?', replied: true, createdAt: '2025-05-28T14:30:00Z' },
  { id: 'm3', name: 'Lisa Wong', email: 'lisa@mail.com', phone: '(555) 555-6666', message: 'Your express service is amazing! Got my clothes back same day. Thank you!', replied: true, createdAt: '2025-05-25T09:15:00Z' },
  { id: 'm4', name: 'David Clark', email: 'david@mail.com', phone: '(555) 777-8888', message: 'I have a wedding dress that needs careful cleaning. Do you handle bridal wear?', replied: false, createdAt: '2025-06-03T16:00:00Z' },
  { id: 'm5', name: 'Karen Smith', email: 'karen@mail.com', phone: '(555) 999-0000', message: 'Can I schedule a recurring weekly pickup? Would love a subscription plan.', replied: false, createdAt: '2025-06-04T11:20:00Z' },
  { id: 'm6', name: 'Alex Brown', email: 'alex@mail.com', phone: '(555) 222-3333', message: 'Great service! The stain removal on my silk blouse was perfect. 5 stars!', replied: true, createdAt: '2025-05-20T08:00:00Z' },
  { id: 'm7', name: 'Jessica Lee', email: 'jessica@mail.com', phone: '(555) 444-5555', message: 'Do you have any eco-friendly detergent options for sensitive skin?', replied: false, createdAt: '2025-06-05T13:45:00Z' },
  { id: 'm8', name: 'Ryan Martinez', email: 'ryan@mail.com', phone: '(555) 666-7777', message: 'My order FP-1005 seems delayed. Can someone provide an update?', replied: false, createdAt: '2025-06-06T10:30:00Z' },
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
  { id: 't1', name: 'Sarah Mitchell', role: 'Working Professional', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop', text: 'FreshPress has been a lifesaver! I no longer spend my weekends doing laundry. The quality is impeccable and the delivery is always on time.', rating: 5 },
  { id: 't2', name: 'James Parker', role: 'Business Owner', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop', text: 'As a restaurant owner, we need clean linens daily. FreshPress handles everything perfectly — the whites are always bright and crisp.', rating: 5 },
  { id: 't3', name: 'Emily Chen', role: 'New Mother', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop', text: 'With a newborn, finding time for laundry is impossible. FreshPress picks up and delivers like clockwork. Absolutely recommend!', rating: 5 },
  { id: 't4', name: 'Michael Torres', role: 'Software Engineer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop', text: 'I tried many laundry services but FreshPress stands out. Their dry cleaning is superb, especially for my suits. Worth every penny.', rating: 4 },
  { id: 't5', name: 'Olivia Adams', role: 'Interior Designer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop', text: 'The attention to detail is extraordinary. They handle my delicate fabrics with such care. I will never go back to doing my own laundry!', rating: 5 },
  { id: 't6', name: 'Daniel Kim', role: 'College Student', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop', text: 'Super affordable for students! The wash and fold service keeps my clothes fresh without breaking the bank. Great customer service too.', rating: 4 },
];

export const MOCK_TEAM: TeamMember[] = [
  { id: 'tm1', name: 'Catherine Moore', role: 'Founder & CEO', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop' },
  { id: 'tm2', name: 'Robert Chen', role: 'Operations Manager', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop' },
  { id: 'tm3', name: 'Maria Santos', role: 'Head of Quality', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop' },
  { id: 'tm4', name: 'Alex Johnson', role: 'Lead Technician', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop' },
];

export const MONTHLY_REVENUE = [
  { month: 'Jan', revenue: 12400, orders: 145 },
  { month: 'Feb', revenue: 13800, orders: 162 },
  { month: 'Mar', revenue: 15200, orders: 178 },
  { month: 'Apr', revenue: 14600, orders: 171 },
  { month: 'May', revenue: 17800, orders: 209 },
  { month: 'Jun', revenue: 19200, orders: 225 },
  { month: 'Jul', revenue: 18400, orders: 216 },
  { month: 'Aug', revenue: 21000, orders: 246 },
  { month: 'Sep', revenue: 19800, orders: 232 },
  { month: 'Oct', revenue: 22400, orders: 263 },
  { month: 'Nov', revenue: 24100, orders: 283 },
  { month: 'Dec', revenue: 26500, orders: 311 },
];

export const SERVICE_USAGE = [
  { name: 'Wash & Fold', count: 842, fill: 'hsl(221, 83%, 53%)' },
  { name: 'Dry Cleaning', count: 534, fill: 'hsl(24, 95%, 53%)' },
  { name: 'Ironing', count: 421, fill: 'hsl(160, 60%, 45%)' },
  { name: 'Steam Press', count: 287, fill: 'hsl(280, 60%, 55%)' },
  { name: 'Shoe Cleaning', count: 198, fill: 'hsl(340, 65%, 55%)' },
  { name: 'Express', count: 156, fill: 'hsl(38, 92%, 50%)' },
];
