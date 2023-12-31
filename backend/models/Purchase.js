import mongoose, { Schema, model } from "mongoose";

const purchaseSchema = new Schema({
  billno:{
    type: String,
    unique: true
  },
  date: {
    type: Date,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  details: [
    {
      p_id: {
        type: String,  // Assuming productID is a string, change the type accordingly
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      rateOfProduct: {
        type: Number,
        required: true,
      },
    },
  ],
});

export default model("Purchase", purchaseSchema);