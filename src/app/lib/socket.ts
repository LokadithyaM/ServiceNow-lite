import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";

export const sendIncident = (companyId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(undefined, {
      path: "/api/sockets", 
      transports: ["websocket"], 
    });

    // 1️⃣ Join the company room
    socketInstance.emit("joinCompany", companyId);

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [companyId]);

  // 2️⃣ Function to send a new incident
  const sendIncident = (incident: any) => {
    if (socket) {
      socket.emit("newIncident", { companyId, incident });
    }
  };

  return { socket, sendIncident };
};
