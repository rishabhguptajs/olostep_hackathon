import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
  scrapedData: [
    {
      title: {
        type: String,
      },
      description: {
        type: String,
      },
      url: {
        type: String,
      },
    }
  ]
});

const User = mongoose.model("User", UserSchema);

export default User;
