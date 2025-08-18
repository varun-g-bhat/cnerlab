// import mongoose, { Schema, Document } from "mongoose";

// const cartSchema = new Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     componentName: {
//       type: mongoose.Schema.Types.String,
//       ref: "Component",
//       required: true,
//     },
//     quantity: {
//       type: Number,
//       required: true,
//     },
//     componentType: {
//       type: mongoose.Schema.Types.String,
//       ref: "Component",
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// export interface ICartModel extends Document {
//   userId: mongoose.Schema.Types.ObjectId;
//   componentName: string;
//   quantity: number;
//   componentType: string;
// }

// export default mongoose.model<ICartModel>("Cart", cartSchema);

import mongoose, { Schema, Document } from "mongoose";

const cartSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
  },
  { timestamps: true }
);

export interface ICartModel extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  componentId: mongoose.Schema.Types.ObjectId;
  quantity: number;
}

export default mongoose.model<ICartModel>("Cart", cartSchema);
