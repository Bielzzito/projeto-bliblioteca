import cors from "cors";

const corsMiddleware =cors({
     origin: ["http://127.0.0.1:5500",
         "https://localhost:5500"]
});

export default corsMiddleware;