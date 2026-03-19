export const services = [
  {
    id: 1,
    icon: "Shirt",
    title: "Wash & Fold",
    description: "Professional washing with premium detergents. Clothes returned fresh, clean, and neatly folded.",
    price: "$1.50/lb",
    color: "blue",
  },
  {
    id: 2,
    icon: "Wind",
    title: "Dry Cleaning",
    description: "Expert dry cleaning for delicate fabrics. Safe treatment for suits, dresses, and special garments.",
    price: "from $8.99",
    color: "purple",
  },
  {
    id: 3,
    icon: "Zap",
    title: "Ironing & Press",
    description: "Crisp, wrinkle-free clothes every time. Perfect pressing for shirts, trousers, and formal wear.",
    price: "from $2.99",
    color: "cyan",
  },
  {
    id: 4,
    icon: "Sparkles",
    title: "Steam Press",
    description: "Advanced steam pressing for superior results. Sanitizes and freshens while removing stubborn creases.",
    price: "from $3.50",
    color: "green",
  },
  {
    id: 5,
    icon: "Star",
    title: "Shoe Cleaning",
    description: "Professional shoe care and restoration. Deep clean, polish, and protect all types of footwear.",
    price: "from $9.99",
    color: "orange",
  },
];

export const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Marketing Manager",
    avatar: "SJ",
    rating: 5,
    comment: "FreshClean has completely transformed my weekly routine. My clothes always come back perfectly clean and folded. The pickup service is incredibly convenient!",
  },
  {
    id: 2,
    name: "Marcus Chen",
    role: "Software Engineer",
    avatar: "MC",
    rating: 5,
    comment: "The dry cleaning quality is exceptional. My suits look brand new every time. Fast turnaround and great customer service. Highly recommend!",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Teacher",
    avatar: "ER",
    rating: 5,
    comment: "Affordable, reliable, and top-notch quality. I've been using FreshClean for 2 years and have never been disappointed. The app makes ordering so easy!",
  },
];

export const orders = [
  { 
    id: "#LC-1025",
    customer: "Sarah Johnson",
    service: "Wash & Fold",
    pickup: "2024-05-20",
    delivery: "2024-05-22",
    status: "Delivered",
    price: "$18.50",
    phone: "555-0101",
    address: "123 Main St, Los Angeles, CA"
  },
  { 
    id: "#LC-1024",
    customer: "Marcus Chen",
    service: "Dry Cleaning",
    pickup: "2024-05-19",
    delivery: "2024-05-21",
    status: "Out for Delivery",
    price: "$32.00",
    phone: "555-0102",
    address: "456 Sunset Blvd, Los Angeles, CA"
  },
  { 
    id: "#LC-1023",
    customer: "Emily Rodriguez",
    service: "Ironing",
    pickup: "2024-05-18",
    delivery: "2024-05-20",
    status: "Ironing",
    price: "$14.99",
    phone: "555-0103",
    address: "789 Hollywood Ave, Los Angeles, CA"
  },
  { 
    id: "#LC-1022",
    customer: "James Wilson",
    service: "Steam Press",
    pickup: "2024-05-17",
    delivery: "2024-05-19",
    status: "Washing",
    price: "$22.50",
    phone: "555-0104",
    address: "321 Beverly Dr, Los Angeles, CA"
  },
  { 
    id: "#LC-1021",
    customer: "Priya Patel",
    service: "Shoe Cleaning",
    pickup: "2024-05-16",
    delivery: "2024-05-18",
    status: "Picked Up",
    price: "$19.99",
    phone: "555-0105",
    address: "654 Wilshire Blvd, Los Angeles, CA"
  },
  { 
    id: "#LC-1020",
    customer: "Tom Davis",
    service: "Wash & Fold",
    pickup: "2024-05-15",
    delivery: "2024-05-17",
    status: "Pending",
    price: "$12.75",
    phone: "555-0106",
    address: "987 Santa Monica Blvd, Los Angeles, CA"
  },
];

export const customers = [
  { id: 1, name: "Sarah Johnson", email: "sarah.j@email.com", phone: "555-0101", orders: 12, totalSpent: "$245.80", joined: "2023-01-15", avatar: "SJ" },
  { id: 2, name: "Marcus Chen", email: "marcus.c@email.com", phone: "555-0102", orders: 8, totalSpent: "$189.50", joined: "2023-03-22", avatar: "MC" },
  { id: 3, name: "Emily Rodriguez", email: "emily.r@email.com", phone: "555-0103", orders: 15, totalSpent: "$312.25", joined: "2022-11-08", avatar: "ER" },
  { id: 4, name: "James Wilson", email: "james.w@email.com", phone: "555-0104", orders: 5, totalSpent: "$98.00", joined: "2024-01-30", avatar: "JW" },
  { id: 5, name: "Priya Patel", email: "priya.p@email.com", phone: "555-0105", orders: 20, totalSpent: "$421.60", joined: "2022-08-14", avatar: "PP" },
  { id: 6, name: "Tom Davis", email: "tom.d@email.com", phone: "555-0106", orders: 3, totalSpent: "$56.25", joined: "2024-03-01", avatar: "TD" },
];

export const contactMessages = [
  { id: 1, name: "Alice Brown", email: "alice@email.com", phone: "555-0201", message: "Hi, I'd like to know more about your premium dry cleaning service. Do you handle wedding dresses?", date: "2024-05-20", replied: false },
  { id: 2, name: "Bob Miller", email: "bob@email.com", phone: "555-0202", message: "What are your pickup hours on weekends? I need to schedule a Saturday pickup.", date: "2024-05-19", replied: true },
  { id: 3, name: "Carol White", email: "carol@email.com", phone: "555-0203", message: "My order was supposed to be delivered yesterday. Can you please update me on the status?", date: "2024-05-18", replied: false },
  { id: 4, name: "Dan Lee", email: "dan@email.com", phone: "555-0204", message: "Do you offer corporate accounts for businesses? We have a team of 50+ employees.", date: "2024-05-17", replied: true },
];

export const revenueData = [
  { month: "Jan", revenue: 4200, orders: 85 },
  { month: "Feb", revenue: 5800, orders: 112 },
  { month: "Mar", revenue: 5200, orders: 98 },
  { month: "Apr", revenue: 7100, orders: 140 },
  { month: "May", revenue: 6800, orders: 132 },
  { month: "Jun", revenue: 8250, orders: 165 },
  { month: "Jul", revenue: 9100, orders: 180 },
  { month: "Aug", revenue: 8600, orders: 172 },
];

export const serviceUsageData = [
  { name: "Wash & Fold", value: 40, fill: "#1d4ed8" },
  { name: "Dry Cleaning", value: 25, fill: "#7c3aed" },
  { name: "Ironing", value: 20, fill: "#0891b2" },
  { name: "Steam Press", value: 10, fill: "#059669" },
  { name: "Shoe Cleaning", value: 5, fill: "#d97706" },
];

export const myOrders = [
  { id: "#LC-1025", service: "Wash & Fold", pickup: "May 20, 2024", delivery: "May 22, 2024", status: "Delivered", price: "$18.50" },
  { id: "#LC-1018", service: "Dry Cleaning", pickup: "May 10, 2024", delivery: "May 12, 2024", status: "Delivered", price: "$32.00" },
  { id: "#LC-1012", service: "Ironing", pickup: "Apr 28, 2024", delivery: "Apr 30, 2024", status: "Delivered", price: "$14.99" },
  { id: "#LC-1026", service: "Steam Press", pickup: "May 25, 2024", delivery: "May 27, 2024", status: "Washing", price: "$22.50" },
];


export const HomeContent = [
  {
    id: 1,
    page: "Home",
    key: "home_title",
    currentContent: "Welcome to our website"
  },
  {
    id: 2,
    page: "Home",
    key: "home_banner_text",
    currentContent: "Best services for your business"
  },
  {
    id: 3,
    page: "Home",
    key: "home_description",
    currentContent: "We provide modern solutions for companies."
  }
];


export const AboutContent = [
  {
    id: 1,
    page: "About",
    key: "about_title",
    currentContent: "About Us"
  },
  {
    id: 2,
    page: "About",
    key: "about_description",
    currentContent: "We are a leading provider of laundry services."
  },
  {
    id: 3,
    page: "About",
    key: "about_mission",
    currentContent: "Our mission is to provide exceptional laundry services."
  }
];


export const users = [
  { id: 1, name: "Sarah Johnson", email: "sarah.j@email.com", phone: "555-0101",role:"Admin"  },
  { id: 2, name: "Marcus Chen", email: "marcus.c@email.com", phone: "555-0102",role:"User"},
  { id: 3, name: "Emily Rodriguez", email: "emily.r@email.com", phone: "555-0103",role:"User" },
  { id: 4, name: "James Wilson", email: "james.w@email.com", phone: "555-0104",role:"User" },
  { id: 5, name: "Priya Patel", email: "priya.p@email.com", phone: "555-0105",role:"User" },
  { id: 6, name: "Tom Davis", email: "tom.d@email.com", phone: "555-0106",role:"User" },
];
  