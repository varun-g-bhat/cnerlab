import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Dynamic import to avoid build issues
    const { app } = await import("../server/src/app");
    const connectDB = (await import("../server/src/config/db")).default;

    // Connect to database
    await connectDB();

    // Use your existing Express app
    return app(req, res);
  } catch (error) {
    console.error("Serverless function error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
