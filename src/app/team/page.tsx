"use client";
import { useEffect, useState } from "react";
import { Button, Modal, TextField, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import Group from "@/components/group";
import Image from "next/image";
import router from "next/router";

export default function Teams() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [allowedUsers, setAllowedUsers] = useState<AllowedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");



  useEffect(() => {
      const fetchAllowedUsers = async () => {
          try {
              const res = await fetch("/api/allowedUsers");
              if (!res.ok) {
                  throw new Error("Failed to fetch allowed users");
              }
              const data = await res.json();
              setAllowedUsers(data.allowedUsers);
          } catch (err: any) {
              setError(err.message);
          } finally {
              setLoading(false);
          }
      };

      fetchAllowedUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  interface AllowedUser {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  }



  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    console.log("waiting for this feature to come");
  };

  return (
    <div className="flex flex-col bg-white items-start justify-center min-h-screen p-2 gap-2 sm:font-[family-name:var(--font-geist-sans)]">
      <div className="border-2 p-2 flex flex-col gap-2 border-black w-full h-[800px]">
        <Group name="my Group"/>
        <div className="border-2 p-2 gap-2 border-black w-full h-full flex">
          {/* Three equally sized boxes */}
          <div className="border-2 border-black flex-1 gap-2 flex flex-col justify-start p-2">
            <div className="border-2 border-black h-[500px] w-full"></div>
            <div className="border-2 border-black flex-1 w-full"></div> {/* Change h-full to flex-1 */}
          </div>

          <div className="border-2 border-black flex-1 gap-2 flex flex-col justify-start p-2">
            <div className="border-2 border-black h-[500px] w-full"></div>
            <div className="border-2 border-black flex-1 w-full"></div> {/* Change h-full to flex-1 */}
          </div>

          <div className="border-2 border-black flex-1 gap-2 flex flex-col justify-start p-2">
            <div className="border-2 border-black h-[500px] w-full"></div>
            <div className="border-2 border-black flex-1 w-full"></div> {/* Change h-full to flex-1 */}
          </div>
        </div>
      </div>

      <div className="border-2 border-black w-full min-h-screen">
        <div
          className="bg-gray-200 border-2 p-4 aspect-square w-[8vw] max-w-[70px] min-w-[50px] rounded-full 
          overflow-hidden cursor-pointer fixed bottom-[8vh] right-[5vw] shadow-black shadow-xl"
          onClick={() => router.push("/forms")}
        >
            <Image
              className="dark:invert object-contain"
              src="/add.svg"
              alt="Logo"
              width={40}
              height={40}
            />
          </div>

        {/* Table for Team Members */}
        <TableContainer component={Paper} className="p-4">
          <Table>
            <TableHead className="bg-gray-400">
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allowedUsers.map((member, index) => (
                <TableRow key={index}>
                  <TableCell>{member.firstName}</TableCell>
                  <TableCell>{member.lastName}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      
      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-white shadow-md border-2 border-black">
          <h2 className="mb-2">Invite New Member</h2>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button className="mt-2" variant="contained" color="primary" onClick={handleSubmit}>
            Send Invite
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
