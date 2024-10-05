const mongoose = require("mongoose");

export const connectDB = async () => {
  await mongoose
    .connect(
      "mmongodb+srv://ronyDas:<db_password>@cluster0.gqcb7.mongodb.net/userDB"
    )
    .then(() => console.log("DB Connected"));
};
