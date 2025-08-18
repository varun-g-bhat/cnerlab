import { count } from "console";
import { get } from "http";
import mongoose from "mongoose";
import { Model } from "mongoose";
import { Schema } from "mongoose";
import { getUserCount } from "../helpers/data";

const requestCountSchema = new mongoose.Schema({
  count: {
    type: Number,
    required: true,
    default: 0,
  },
});

const RequestCount = mongoose.model("RequestCount", requestCountSchema);

interface IVisitorCount extends Document {
  count: number;
}

interface IVisitorCountModel extends Model<IVisitorCount> {
  incrementVisit: () => Promise<number>;
}

const visitorCountSchema = new Schema<IVisitorCount>({
  count: {
    type: Number,
    default: 0,
  },
});

visitorCountSchema.statics.incrementVisit = async function () {
  let visitor = await this.findOne();

  if (!visitor) {
    visitor = new this();
  }

  visitor.count += 1;
  await visitor.save();

  return visitor.count;
};

const VisitorCount: IVisitorCountModel = mongoose.model<
  IVisitorCount,
  IVisitorCountModel
>("VisitorCount", visitorCountSchema);

// const usersCountSchema = new mongoose.Schema({
//   count: {
//     type: Number,
//     default: 0,
//   },
// });

// const UsersCount = mongoose.model("UsersCount", usersCountSchema);

export { RequestCount, VisitorCount };
