import dotenv from "dotenv";
import { db, connectDB } from "../config/database.js";
import { runMigrations } from "../utils/migrations.js";

dotenv.config();

/**
 * Sample data for seeding
 */
const seedData = {
  users: [
    {
      name: "Admin User",
      email: "admin@freshpress.com",
      password: "admin123",
      phone: "9876543210",
      role: "admin",
      address: "123 Admin Street",
      city: "New York",
      zipcode: "10001",
      is_active: true,
    },
    {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      phone: "9876543211",
      role: "customer",
      address: "456 Customer Lane",
      city: "Los Angeles",
      zipcode: "90001",
      is_active: true,
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      password: "password123",
      phone: "9876543212",
      role: "customer",
      address: "789 Main Street",
      city: "Chicago",
      zipcode: "60601",
      is_active: true,
    },
    {
      name: "Bob Johnson",
      email: "bob@example.com",
      password: "password123",
      phone: "9876543213",
      role: "customer",
      address: "321 Park Avenue",
      city: "Houston",
      zipcode: "77001",
      is_active: true,
    },
  ],
  services: [
    {
      name: "Basic Car Wash",
      description: "Complete exterior and interior wash",
      category: "Standard",
      price: 25.0,
      duration_minutes: 30,
      image_url: "/images/basic-wash.jpg",
      is_active: true,
    },
    {
      name: "Premium Detailing",
      description: "Deep cleaning with wax and polish",
      category: "Premium",
      price: 75.0,
      duration_minutes: 90,
      image_url: "/images/premium-detail.jpg",
      is_active: true,
    },
    {
      name: "Engine Wash",
      description: "Professional engine cleaning",
      category: "Specialty",
      price: 40.0,
      duration_minutes: 45,
      image_url: "/images/engine-wash.jpg",
      is_active: true,
    },
    {
      name: "Interior Cleaning",
      description: "Vacuum, wipe, and refresh interior",
      category: "Standard",
      price: 30.0,
      duration_minutes: 40,
      image_url: "/images/interior-clean.jpg",
      is_active: true,
    },
    {
      name: "Full Service Package",
      description: "Complete wash, detail, and protection",
      category: "Premium",
      price: 120.0,
      duration_minutes: 180,
      image_url: "/images/full-service.jpg",
      is_active: true,
    },
    {
      name: "Ceramic Coating",
      description: "Long-lasting protective coating",
      category: "Premium",
      price: 200.0,
      duration_minutes: 240,
      image_url: "/images/ceramic.jpg",
      is_active: true,
    },
  ],
  orders: [
    {
      customer_id: 2,
      service_id: 1,
      service_name: "Basic Car Wash",
      price: 25.0,
      status: "completed",
      scheduled_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      notes: "Customer satisfied with service",
      total_amount: 25.0,
    },
    {
      customer_id: 3,
      service_id: 2,
      service_name: "Premium Detailing",
      price: 75.0,
      status: "completed",
      scheduled_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      notes: "Excellent results",
      total_amount: 75.0,
    },
    {
      customer_id: 2,
      service_id: 3,
      service_name: "Engine Wash",
      price: 40.0,
      status: "confirmed",
      scheduled_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      notes: "Engine cleaning booked",
      total_amount: 40.0,
    },
    {
      customer_id: 4,
      service_id: 5,
      service_name: "Full Service Package",
      price: 120.0,
      status: "pending",
      scheduled_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      notes: "Waiting for confirmation",
      total_amount: 120.0,
    },
    {
      customer_id: 3,
      service_id: 1,
      service_name: "Basic Car Wash",
      price: 25.0,
      status: "in_progress",
      scheduled_date: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
      notes: "Service in progress",
      total_amount: 25.0,
    },
  ],
  messages: [
    {
      name: "Mike Wilson",
      email: "mike@example.com",
      phone: "9876543214",
      message: "I would like to know more about your ceramic coating service and pricing.",
      status: "unread",
      reply_message: null,
      replied_at: null,
    },
    {
      name: "Sarah Brown",
      email: "sarah@example.com",
      phone: "9876543215",
      message: "Can you provide a quote for monthly car maintenance?",
      status: "read",
      reply_message: null,
      replied_at: null,
    },
    {
      name: "David Lee",
      email: "david@example.com",
      phone: "9876543216",
      message: "Is there a discount for bulk orders?",
      status: "replied",
      reply_message: "Yes, we offer 10% discount for 5+ services booked in a month.",
      replied_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Emily Chen",
      email: "emily@example.com",
      phone: "9876543217",
      message: "What are your operating hours?",
      status: "replied",
      reply_message: "We are open Monday to Sunday, 8 AM to 6 PM.",
      replied_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ],
};

/**
 * Main seed function
 */
async function seed() {
  try {
    console.log("🌱 Starting database seeding...\n");

    // Connect to database
    await connectDB();

    // Run migrations
    await runMigrations(db);

    // Check if data already exists
    const userCount = await db("users").count("* as count").first();
    if (userCount && userCount.count > 0) {
      console.log("⚠️ Database already contains data. Skipping seeding.");
      console.log("To reseed, clear the database tables first.");
      process.exit(0);
    }

    // Seed users
    console.log("👤 Seeding users...");
    const userIds = await db("users").insert(seedData.users);
    console.log(`✅ Inserted ${userIds.length} users`);

    // Seed services
    console.log("🛠️ Seeding services...");
    const serviceIds = await db("services").insert(seedData.services);
    console.log(`✅ Inserted ${serviceIds.length} services`);

    // Seed orders
    console.log("📦 Seeding orders...");
    const orderIds = await db("orders").insert(seedData.orders);
    console.log(`✅ Inserted ${orderIds.length} orders`);

    // Seed messages
    console.log("💬 Seeding messages...");
    const messageIds = await db("messages").insert(seedData.messages);
    console.log(`✅ Inserted ${messageIds.length} messages`);

    console.log("\n✅ Database seeding completed successfully!");
    console.log("\n📊 Seeding Summary:");
    console.log(`   - Users: ${userIds.length}`);
    console.log(`   - Services: ${serviceIds.length}`);
    console.log(`   - Orders: ${orderIds.length}`);
    console.log(`   - Messages: ${messageIds.length}`);

    console.log("\n💡 Sample login credentials:");
    console.log("   Admin: admin@freshpress.com / admin123");
    console.log("   Customer: john@example.com / password123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run seed
seed();
