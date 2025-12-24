const mongoose = require("mongoose");

export const connectDB = async () => {
  await mongoose
    .connect(
      ""
    )
    .then(() => console.log("DB Connected"));
};
