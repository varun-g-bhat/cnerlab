// import mongoose, { Schema, Document } from "mongoose";

// interface IComponent {
//   componentId: mongoose.Types.ObjectId;
//   name: string;
//   quantity: number;
//   returned: boolean;
//   dueDate: Date;
//   status: "pending" | "approved" | "rejected";
// }

// interface IProduct {
//   componentType: string;
//   components: IComponent[];
// }

// export interface IPurchase extends Document {
//   userId: mongoose.Types.ObjectId;
//   products: IProduct[];
//   createdAt: Date;
//   updatedAt: Date;
// }

// const componentSchema = new Schema<IComponent>({
//   componentId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Component", // NOTE: this is a subdocument — you’ll likely ref `Component` and access subdoc by ID
//     required: true,
//   },
//   name: { type: String, required: true },
//   quantity: { type: Number, required: true },
//   returned: { type: Boolean, default: false },
//   dueDate: {
//     type: Date,
//     required: true,
//     default: () => {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       today.setDate(today.getDate() + 14);
//       return today;
//     },
//   },
//   status: {
//     type: String,
//     enum: ["pending", "approved", "rejected"],
//     default: "pending",
//   },
// });

// const purchaseSchema = new Schema<IPurchase>(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     products: [
//       {
//         componentType: { type: String, required: true },
//         components: [componentSchema],
//       },
//     ],
//   },
//   { timestamps: true }
// );

// export default mongoose.model<IPurchase>("Purchase", purchaseSchema);

import mongoose, { Schema, Document } from "mongoose";

const purchaseHistorySchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: false,
    },
    permissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permission",
      required: true,
    },
    returned: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export interface IPurchaseHistory extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  userName?: string;
  permissionId: mongoose.Schema.Types.ObjectId;
  returned: boolean;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  reminderSent: boolean;
}

export default mongoose.model<IPurchaseHistory>(
  "PurchaseHistory",
  purchaseHistorySchema
);
