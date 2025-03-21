import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";

interface Company {
  name: string;
  adminId: string;
}

interface UserSelectProps {
  value: string; // Now storing `adminId`
  onChange: (adminId: string) => void;
}

const UserSelect: React.FC<UserSelectProps> = ({ value, onChange }) => {
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch("/api/companies");
        if (!res.ok) throw new Error("Failed to fetch companies");

        const data: Company[] = await res.json();
        setCompanies(data);
      } catch (err: any) {
        console.error("Error fetching companies:", err.message);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <Autocomplete
      options={companies}
      getOptionLabel={(option) => option.name}
      value={companies.find((company) => company.adminId === value) || null} // Match by `adminId`
      onChange={(_event, newValue) => onChange(newValue ? newValue.adminId : "")} // Return `adminId`
      renderInput={(params) => <TextField {...params} label="Select Company" fullWidth />}
    />
  );
};

export default UserSelect;
