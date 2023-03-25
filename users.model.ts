import { model, Schema } from "mongoose";

const usersSchema = new Schema({
  _id: { type: String, required: true },
  tel: { type: String, index: true },
  first_name: { type: String, index: true },
  last_name: { type: String, index: true },
  gender: { type: String },
  link: { type: String, index: true },
  works_at: { type: String },
  studied_at: { type: String },
  lives_in: { type: String },
  from: { type: String },
  relationship_status: { type: String },
});

export default model("users", usersSchema);
