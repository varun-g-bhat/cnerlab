// // import moongoose, { Schema, Document } from "mongoose";

// // const componentSchema = new Schema({
// //   name: { type: String, required: true },
// //   image_url: { type: String, required: true },
// //   quantity: { type: Number, required: true },
// // });

// // const componentTypeSchema = new Schema(
// //   {
// //     componentType: { type: String, required: true },
// //     components: [componentSchema],
// //   },
// //   {
// //     timestamps: true,
// //   }
// // );

// // export default moongoose.model("ComponentType", componentTypeSchema);
// // import mongoose, { Schema, Document } from "mongoose";

// // const componentSchema = new Schema({
// //   name: { type: String, required: true },
// //   image_url: { type: String, required: true },
// //   quantity: { type: Number, required: true },
// // });

// // const componentTypeSchema = new Schema(
// //   {
// //     componentType: { type: String, required: true },
// //     components: [componentSchema],
// //   },
// //   {
// //     timestamps: true,
// //   }
// // );

// // export default mongoose.model("ComponentType", componentTypeSchema);

// import mongoose, { Schema, Document } from "mongoose";

// export interface IComponent {
//   name: string;
//   image_url: string;
//   quantity: number;
// }

// export interface IComponentModel extends Document {
//   componentType: string;
//   component: IComponent[];
// }

// const ComponentSchema: Schema<IComponentModel> = new Schema({
//   componentType: {
//     type: String,
//     required: true,
//   },
//   component: [
//     {
//       name: {
//         type: String,
//         required: true,
//       },
//       image_url: {
//         type: String,
//         required: true,
//       },
//       quantity: {
//         type: Number,
//         required: true,
//       },
//     },
//   ],
// });

// export default mongoose.model<IComponentModel>("Component", ComponentSchema);

import mongoose, { Schema, Document } from "mongoose";

const componentSchema = new Schema(
  {
    componentType: { type: String, required: true },
    componentName: { type: String, required: true, unique: true },
    image_url: { type: String, required: true },
    quantity: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export interface IComponentModel extends Document {
  componentType: string;
  componentName: string;
  image_url: string;
  quantity: number;
}

export default mongoose.model<IComponentModel>("Component", componentSchema);
