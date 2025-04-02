import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";

// Define TypeScript Interface for User
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface UserSelectProps {
  value: string;
  onChange: (name: string) => void;
}

const UserSelect: React.FC<UserSelectProps> = ({ value, onChange }) => {
  const [users, setAllowedUsers] = useState<User[]>([]);



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
              console.log(err.message);
          }
      };

      fetchAllowedUsers();
  }, []);

  return (
    <Autocomplete
      className="w-full h-auto flex-grow bg-white"
      options={users}
      getOptionLabel={(option) => `${option.firstName} ${option.lastName}`} // Show full name
      value={users?.find((user) => `${user.firstName} ${user.lastName}` === value) || null}
      onChange={(_event, newValue) => onChange(newValue ? `${newValue.firstName} ${newValue.lastName}` : "")}
      renderInput={(params) => <TextField {...params} label="Assigned to" fullWidth />}
    />
  );
};

export default UserSelect;
