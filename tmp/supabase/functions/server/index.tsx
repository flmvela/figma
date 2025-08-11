import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { initializeStorage } from './storage.tsx';
import { authRoutes } from './auth-routes.tsx';
import { curriculumRoutes } from './curriculum-routes.tsx';
import { progressRoutes } from './progress-routes.tsx';
import { fileRoutes } from './file-routes.tsx';
import { analyticsRoutes } from './analytics-routes.tsx';

const app = new Hono();

// Middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));
app.use('*', logger(console.log));

// Initialize storage on startup
initializeStorage();

// Mount route modules
app.route('/', authRoutes);
app.route('/', curriculumRoutes);
app.route('/', progressRoutes);
app.route('/', fileRoutes);
app.route('/', analyticsRoutes);

// Health check
app.get('/make-server-cdba2fd9/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
Deno.serve(app.fetch);