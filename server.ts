import path from "path";
import { createServer as createViteServer } from "vite";
import { app } from "./src/server-app";

async function startServer() {
  const PORT = 3000;

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(path.join(process.cwd(), 'assets'), (req, res, next) => next());
    app.use(path.join(process.cwd(), 'src/assets'), (req, res, next) => next());
    
    // Serve static files from dist
    app.use(require('express').static(distPath));
    app.get('*', (req: any, res: any) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
