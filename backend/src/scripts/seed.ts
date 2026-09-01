import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User, UserRole } from "../models/User";
import { Customer } from "../models/Customer";
import { Mechanic, MechanicStatus } from "../models/Mechanic";
import { Vehicle } from "../models/Vehicle";
import { Service, ServiceCategory } from "../models/Service";
import { Booking, BookingStatus } from "../models/Booking";
import { connectDB, disconnectDB } from "../config/database";

dotenv.config();

const MECHANIC_NAMES = [
  "John Smith",
  "Mike Johnson",
  "Sarah Wilson",
  "David Brown",
  "Emily Davis",
  "Robert Miller",
  "Lisa Anderson",
  "James Taylor",
  "Maria Garcia",
  "William Chen",
  "Patricia Lee",
  "Richard Martinez",
];

const VEHICLE_MAKES = [
  "Toyota",
  "Honda",
  "Ford",
  "Chevrolet",
  "BMW",
  "Mercedes",
  "Audi",
  "Nissan",
  "Hyundai",
  "Kia",
];

const SERVICE_DATA = [
  {
    name: "Oil Change",
    category: ServiceCategory.OIL_CHANGE,
    basePrice: 79.99,
    duration: 45,
  },
  {
    name: "Tire Replacement",
    category: ServiceCategory.TIRE_REPLACEMENT,
    basePrice: 199.99,
    duration: 60,
  },
  {
    name: "Brake Repair",
    category: ServiceCategory.BRAKE_REPAIR,
    basePrice: 299.99,
    duration: 90,
  },
  {
    name: "Engine Diagnostics",
    category: ServiceCategory.ENGINE_DIAGNOSTICS,
    basePrice: 149.99,
    duration: 60,
  },
  {
    name: "Battery Replacement",
    category: ServiceCategory.BATTERY_REPLACEMENT,
    basePrice: 159.99,
    duration: 30,
  },
  {
    name: "Transmission Repair",
    category: ServiceCategory.TRANSMISSION_REPAIR,
    basePrice: 599.99,
    duration: 180,
  },
  {
    name: "AC Service",
    category: ServiceCategory.AC_SERVICE,
    basePrice: 129.99,
    duration: 60,
  },
  {
    name: "Car Wash",
    category: ServiceCategory.CAR_WASH,
    basePrice: 39.99,
    duration: 20,
  },
  {
    name: "Detailing",
    category: ServiceCategory.DETAILING,
    basePrice: 249.99,
    duration: 120,
  },
  {
    name: "Electrical Repair",
    category: ServiceCategory.ELECTRICAL_REPAIR,
    basePrice: 179.99,
    duration: 75,
  },
  {
    name: "Exhaust Repair",
    category: ServiceCategory.EXHAUST_REPAIR,
    basePrice: 219.99,
    duration: 90,
  },
  {
    name: "Radiator Repair",
    category: ServiceCategory.RADIATOR_REPAIR,
    basePrice: 259.99,
    duration: 80,
  },
  {
    name: "Starter Repair",
    category: ServiceCategory.STARTER_REPAIR,
    basePrice: 189.99,
    duration: 70,
  },
  {
    name: "Alternator Repair",
    category: ServiceCategory.ALTERNATOR_REPAIR,
    basePrice: 209.99,
    duration: 75,
  },
  {
    name: "Suspension Repair",
    category: ServiceCategory.SUSPENSION_REPAIR,
    basePrice: 349.99,
    duration: 120,
  },
];

const getRandomDate = (start: Date, end: Date) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
};

const getRandomItem = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)]!;
};

const generateLicensePlate = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  let plate = "";
  for (let i = 0; i < 3; i++) {
    plate += letters[Math.floor(Math.random() * letters.length)];
  }
  for (let i = 0; i < 4; i++) {
    plate += numbers[Math.floor(Math.random() * numbers.length)];
  }
  return plate;
};

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log("🗑️ Clearing existing data...");

    await User.deleteMany({});
    await Customer.deleteMany({});
    await Mechanic.deleteMany({});
    await Vehicle.deleteMany({});
    await Service.deleteMany({});
    await Booking.deleteMany({});

    console.log("📝 Creating admin user...");
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = await User.create({
      email: "admin@instantmechanic.com",
      password: hashedPassword,
      name: "Admin User",
      role: UserRole.ADMIN,
    });
    console.log("✅ Admin user created");

    console.log("📝 Creating services...");
    const services = await Service.insertMany(
      SERVICE_DATA.map((s) => ({
        ...s,
        description: `Professional ${s.name} service`,
      })),
    );
    console.log(`✅ ${services.length} services created`);

    console.log("📝 Creating mechanics...");
    const mechanics: Array<Awaited<ReturnType<typeof Mechanic.create>>> = [];
    for (let i = 0; i < 12; i++) {
      const email = `mechanic${i + 1}@instantmechanic.com`;
      const user = await User.create({
        email,
        password: await bcrypt.hash("mechanic123", 10),
        name: MECHANIC_NAMES[i % MECHANIC_NAMES.length],
        role: UserRole.MECHANIC,
      });

      const mechanic = await Mechanic.create({
        userId: user.id,
        name: user.name,
        email: user.email,
        phone: `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        specialization: getRandomItem(SERVICE_DATA).name,
        status: getRandomItem([
          MechanicStatus.AVAILABLE,
          MechanicStatus.BUSY,
          MechanicStatus.ON_BREAK,
        ]),
        jobsCompleted: Math.floor(Math.random() * 200) + 10,
        rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
        latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
        longitude: -74.006 + (Math.random() - 0.5) * 0.1,
      });
      mechanics.push(mechanic);
    }
    console.log(`✅ ${mechanics.length} mechanics created`);

    console.log("📝 Creating customers and vehicles...");
    const customers: Array<Awaited<ReturnType<typeof Customer.create>>> = [];
    const vehicles: Array<Awaited<ReturnType<typeof Vehicle.create>>> = [];

    for (let i = 0; i < 50; i++) {
      const customer = await Customer.create({
        name: `${getRandomItem(["John", "Jane", "Mike", "Sarah", "David", "Emma", "Chris", "Lisa", "Tom", "Anna"])} ${getRandomItem(["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"])}`,
        email: `customer${i + 1}@example.com`,
        phone: `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        address: `${Math.floor(Math.random() * 999) + 100} ${getRandomItem(["Main St", "Park Ave", "Broadway", "5th Ave", "Market St", "Washington Ave"])}`,
      });
      customers.push(customer);

      const numVehicles = Math.floor(Math.random() * 2) + 1;
      for (let j = 0; j < numVehicles; j++) {
        const vehicle = await Vehicle.create({
          customerId: customer.id,
          make: getRandomItem(VEHICLE_MAKES),
          model: `${getRandomItem(["Civic", "Accord", "Camry", "Corolla", "F-150", "Mustang", "3 Series", "A4", "C-Class"])}`,
          year: Math.floor(Math.random() * 15) + 2010,
          licensePlate: generateLicensePlate(),
          color: getRandomItem([
            "Red",
            "Blue",
            "Black",
            "White",
            "Silver",
            "Gray",
          ]),
        });
        vehicles.push(vehicle);
      }
    }
    console.log(
      `✅ ${customers.length} customers and ${vehicles.length} vehicles created`,
    );

    console.log("📝 Creating bookings...");
    const bookings = [];
    const statuses = [
      BookingStatus.PENDING,
      BookingStatus.ASSIGNED,
      BookingStatus.MECHANIC_ON_WAY,
      BookingStatus.IN_PROGRESS,
      BookingStatus.COMPLETED,
      BookingStatus.CANCELLED,
    ];

    const startDate = new Date("2024-01-01");
    const endDate = new Date();

    for (let i = 0; i < 500; i++) {
      const customer = getRandomItem(customers);
      const vehicle = getRandomItem(vehicles);
      const service = getRandomItem(services);
      const mechanic = getRandomItem(mechanics);
      const status = getRandomItem(statuses);
      const scheduledAt = getRandomDate(startDate, endDate);

      // In the booking creation part, make sure we use the IDs properly
      const booking = await Booking.create({
        customerId: customer._id, // Use _id from the document
        vehicleId: vehicle._id, // Use _id from the document
        serviceId: service._id, // Use _id from the document
        mechanicId:
          status !== BookingStatus.PENDING && status !== BookingStatus.CANCELLED
            ? mechanic._id
            : undefined,
        status,
        amount:
          Math.round(service.basePrice * (0.7 + Math.random() * 0.6) * 100) /
          100,
        scheduledAt,
        completedAt:
          status === BookingStatus.COMPLETED
            ? getRandomDate(scheduledAt, endDate)
            : undefined,
        note: Math.random() > 0.7 ? "Please call before arriving" : undefined,
      });
      bookings.push(booking);
    }
    console.log(`✅ ${bookings.length} bookings created`);

    console.log("🎉 Database seeding completed successfully!");
    console.log("📊 Summary:");
    console.log(`  - ${await User.countDocuments()} users`);
    console.log(`  - ${await Customer.countDocuments()} customers`);
    console.log(`  - ${await Mechanic.countDocuments()} mechanics`);
    console.log(`  - ${await Vehicle.countDocuments()} vehicles`);
    console.log(`  - ${await Service.countDocuments()} services`);
    console.log(`  - ${await Booking.countDocuments()} bookings`);
    console.log("\n🔑 Login credentials:");
    console.log("  Admin: admin@instantmechanic.com / admin123");
    console.log("  Mechanic: mechanic1@instantmechanic.com / mechanic123");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await disconnectDB();
  }
};

// Run the seed function
seedDatabase();
