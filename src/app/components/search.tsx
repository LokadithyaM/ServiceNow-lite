import { Autocomplete, TextField } from "@mui/material";
import { useState, useEffect } from "react";

interface Option {
  id: string;
  name: string;
}

export default function SearchableDropdown({ label, name, value, onChange }: any) {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadOptions = async () => {
      setLoading(true);
      const res = await fetch("/api/fetchGroups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      
      const text = await res.text();

      // console.error(text);

      const jsonData = JSON.parse(text);

      // console.error(jsonData);

      setLoading(false);
    };

    loadOptions();
  }, []);

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.name}
      value={options.find((opt) => opt.id === value) || null}
      onChange={(_, newValue) => onChange(name, newValue?.id || "")}
      loading={loading}
      renderInput={(params) => <TextField {...params} label={label} variant="outlined" />}
    />
  );
}
