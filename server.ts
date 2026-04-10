import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Paradise Hub API is running" });
  });

  // Mock data for courses
  app.get("/api/courses", (req, res) => {
    res.json([
      {
        id: "1",
        title: "Smart Irrigation Systems",
        category: "Agro-Tech",
        description: "Learn how to build automated irrigation systems using IoT and sensors.",
        image: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=800&auto=format&fit=crop",
        points: 1200,
        difficulty: "Intermediate"
      },
      {
        id: "2",
        title: "Modern Web Development",
        category: "Tech",
        description: "Master React, Next.js and Tailwind CSS to build world-class applications.",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
        points: 1500,
        difficulty: "Beginner"
      },
      {
        id: "3",
        title: "Precision Farming with Drones",
        category: "Agro-Tech",
        description: "Use drone technology to monitor crop health and optimize yield.",
        image: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?q=80&w=800&auto=format&fit=crop",
        points: 2000,
        difficulty: "Advanced"
      }
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Paradise Hub Server running on http://localhost:${PORT}`);
  });
}

startServer();
