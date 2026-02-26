import express from "express"
import userRouter from "./src/routes/user.route.js"
import adminRouter from "./src/routes/admin.route.js"
import cookieParser from "cookie-parser"
import ENV from "./src/lib/env.js"  
import connectToDatabase from "./src/lib/db.js"
import cors from "cors"

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", userRouter)
app.use("/api/admin", adminRouter) // Admin routes can be added here

app.get("/home", (req, res) => {
    res.send("Hello World");
})

const startServer = async () => {

    try {
        await connectToDatabase();
        app.listen(ENV.PORT, () => {
            console.log(`✓ Server running on http://localhost:${ENV.PORT}`)
        })
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
}

startServer();