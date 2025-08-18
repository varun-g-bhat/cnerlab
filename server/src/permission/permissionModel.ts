// // import mongoose, { Schema } from "mongoose";

// // const componentSchema = new Schema({
// //   name: { type: String, required: true },
// //   quantity: { type: Number, required: true },
// //   returned: { type: Boolean, default: false },
// //   dueDate: { type: Date, required: true },
// //   status: {
// //     type: String,
// //     enum: ["pending", "approved", "rejected"],
// //     default: "pending",
// //   },
// // });

// // const permissionSchema = new mongoose.Schema(
// //   {
// //     userId: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "User",
// //       required: true,
// //     },
// //     products: [
// //       {
// //         componentType: {
// //           type: String,
// //           required: true,
// //         },

// //         components: [componentSchema],
// //       },
// //     ],
// //   },
// //   {
// //     timestamps: true,
// //   }
// // );

// // export default mongoose.model("Permission", permissionSchema);

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

// export interface IPermission extends Document {
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

// const permissionSchema = new Schema<IPermission>(
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

// export default mongoose.model<IPermission>("Permission", permissionSchema);

import mongoose, { Schema, Document } from "mongoose";

const permissionSchema = new Schema(
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
    componentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Component",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export interface IPermissionModel extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  userName: String;
  componentId: mongoose.Schema.Types.ObjectId;
  quantity: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
export default mongoose.model<IPermissionModel>("Permission", permissionSchema);
