import { NextRequest } from "next/server";
import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { Socket as NetSocket } from "net";

type CustomSocket = {
  server: HTTPServer & { io?: SocketIOServer };
};

export async function GET(req: NextRequest) {
  if (!(global as any).io) {
    console.log("Initializing WebSocket server...");

    const io = new SocketIOServer((global as any).server as HTTPServer, {
      path: "/api/socket_io",
      cors: { origin: "*" },
      transports: ["websocket"],
    });

    io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);

      socket.on("joinCompany", (companyId) => {
        socket.join(companyId);
        console.log(`User ${socket.id} joined company ${companyId}`);
      });

      socket.on("newIncident", ({ companyId, incident }) => {
        console.log(`New incident for company ${companyId}:`, incident);
        io.to(companyId).emit("incidentUpdate", incident);
      });

      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });

    (global as any).io = io;
  }

  return new Response(null, { status: 200 });
}
