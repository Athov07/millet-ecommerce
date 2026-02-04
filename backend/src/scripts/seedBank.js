const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Bank = require("../models/Bank");

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seed = async () => {
  await Bank.deleteMany({});

  await Bank.insertMany([
    {
      cardNumber: "1111222233334444",
      expiry: "12/25",
      cvv: "123",
      nameOnCard: "John Doe",
      balance: 5000
    },
    {
      cardNumber: "5555666677778888",
      expiry: "11/24",
      cvv: "456",
      nameOnCard: "Jane Smith",
      balance: 10000
    }
  ]);

  console.log("Bank seeded!");
  mongoose.connection.close();
};

seed();
