const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const studentProfileRoutes = require("./routes/studentProfileRoutes");
const hrProfileRoutes = require("./routes/hrProfileRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/student-profiles", studentProfileRoutes);
app.use("/api/hr-profiles", hrProfileRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/api", (request, response) => {
  response.json({
    message: "CareerBridge backend is running",
  });
});

app.use("/api", (request, response) => {
  response.status(404).json({
    message: "API route not found",
  });
});

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(
    __dirname,
    "../frontend/dist"
  );

  app.use(express.static(frontendPath));

  app.get("/{*splat}", (request, response) => {
    response.sendFile(
      path.join(frontendPath, "index.html")
    );
  });
}

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CareerBridge server running on port ${PORT}`);
  });
});