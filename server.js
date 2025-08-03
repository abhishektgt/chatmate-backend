const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/user", require("./routes/user"));
app.use("/api/messages", require("./routes/message"));
app.use("/api/test", require("./routes/test"));
app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
