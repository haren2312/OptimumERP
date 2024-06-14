const { Schema, Types, model } = require("mongoose");
const paymentMethods = require("../constants/paymentMethods");

const purchaseInvoice = new Schema(
  {
    party: {
      type: Types.ObjectId,
      required: true,
      ref: "party",
    },
    billingAddress: {
      type: String,
      required: true,
    },
    payment: {
      _id: false,
      type: {
        amount: {
          type: Number,
        },
        paymentMode: {
          type: String,
          enum: paymentMethods.map((method) => method.value),
        },
        description: {
          type: String,
        },
        date: {
          type: Date,
        },
      },
    },
    total: {
      type: Number,
      default: 0,
      required: true,
    },
    totalTax: {
      type: Number,
      default: 0,
      required: true,
    },
    sgst: {
      type: Number,
      default: 0,
      min: 0,
    },
    cgst: {
      type: Number,
      default: 0,
      min: 0,
    },
    igst: {
      type: Number,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      default: "Thanks for the business.",
    },
    org: {
      type: Types.ObjectId,
      required: true,
      ref: "organization",
    },
    items: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          default: 0,
        },
        code: {
          type: String,
        },
        quantity: {
          type: Number,
          required: true,
          default: 0,
        },
        um: {
          type: String,
          default: "none",
        },
        gst: {
          type: String,
          default: "none",
        },
      },
    ],
    date: {
      type: Date,
      default: new Date(Date.now()),
    },
    num: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      required: true,
      ref: "user",
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "user",
    },
    status: {
      type: String,
      default: "sent",
      enum: ["paid", "unpaid"],
    },
    financialYear: {
      type: {
        start: {
          type: Date,
          required: true,
        },
        end: {
          type: Date,
          required: true,
        },
      },
      _id: false,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
const Purchase = model("purchase", purchaseInvoice);
purchaseInvoice.index({
  description: "text",
  num: "text",
});
module.exports = Purchase;
