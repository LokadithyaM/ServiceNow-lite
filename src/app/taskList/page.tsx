"use client";
import { useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
    TableSortLabel, TablePagination, TextField, Select, MenuItem
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useSWR from "swr";

interface Incident {
    id: string;
    opened: string;
    Short_description: string;
    caller: string;
    priority: "Low" | "Medium" | "High" | "Critical";
    state: "New" | "In Progress" | "Resolved" | "On Hold";
    category: string;
    assigned_to: string;
    updated: string;
    updated_by: string;
}

const fetcher = async (url: string) => {
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "fetch_Incident_Id" }),
        credentials: "include",
    });
    if (!res.ok){
        throw new Error(`Error login again please: ${res.status} ${await res.text()}`);
    }
    const data = await res.json();
    if (typeof data.incidents !== "object" || data.incidents === null) {
        throw new Error("Invalid response format: Expected an object (map)");
    }
    return data.incidents;
};

export default function Home() {
    const router = useRouter();
    const { data: incidents, error } = useSWR<Record<string, Incident>>("/api/incidnets", fetcher, {
        refreshInterval: 15000,
    });

    // Sorting State
    const [sortBy, setSortBy] = useState<keyof Incident>("opened");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    // Filtering State
    const [search, setSearch] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");

    // Pagination State
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);

    if (error) return <div>Error: {error.message}</div>;
    if (!incidents) return <div>Loading...</div>;

    // Convert map to array for sorting & filtering
    let incidentList = Object.entries(incidents).map(([id, data]) => ({ ...data, id }));

    // Sorting Logic
    incidentList.sort((a, b) => {
        let valA = a[sortBy] || "";
        let valB = b[sortBy] || "";
        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });

    // Filtering Logic
    incidentList = incidentList.filter(
        (incident) =>
            incident.Short_description.toLowerCase().includes(search.toLowerCase()) &&
            (priorityFilter ? incident.priority === priorityFilter : true)
    );

    // Handle Sorting
    const handleSort = (column: keyof Incident) => {
        setSortBy(column);
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    function handleClick(incident: { id: string; opened: string; Short_description: string; caller: string; priority: "Low" | "Medium" | "High" | "Critical"; state: "New" | "In Progress" | "Resolved" | "On Hold"; category: string; assigned_to: string; updated: string; updated_by: string; }): void{
        const encodedIncident = encodeURIComponent(JSON.stringify(incident));
    
        router.push(`/IncidentDiscussion?data=${encodedIncident}`);    
    }

    return (
        <div className="border-2 border-white bg-[#1B1B1B] bg-white flex flex-col items-center min-h-screen">
            <div className="border-2 border-black w-full min-h-[750px] p-4">
                {/* Floating Add Button */}
                <div
                    className="bg-gray-200 border-2 p-4 w-[8vw] max-w-[70px] min-w-[50px] rounded-full fixed bottom-[8vh] right-[5vw] cursor-pointer shadow-xl"
                    onClick={() => router.push("/forms")}
                >
                    <Image className="object-contain" src="/add.svg" alt="Add" width={40} height={40} />
                </div>

                {/* Filters */}
                <div className="flex gap-4 mb-4 items-center">
                    <TextField
                        label="Search by short description"
                        variant="outlined"
                        size="small"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Select
                        value={priorityFilter}
                        displayEmpty
                        onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                        <MenuItem value="">All Priorities</MenuItem>
                        <MenuItem value="Low">Low</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="High">High</MenuItem>
                        <MenuItem value="Critical">Critical</MenuItem>
                    </Select>
                </div>

                {/* Table */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow className="bg-gray-300">
                                <TableCell>
                                    <TableSortLabel active={sortBy === "id"} direction={sortOrder} onClick={() => handleSort("id")}>
                                        Id
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel active={sortBy === "opened"} direction={sortOrder} onClick={() => handleSort("opened")}>
                                        Opened
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>Short Description</TableCell>
                                <TableCell>Caller</TableCell>
                                <TableCell>Priority</TableCell>
                                <TableCell>State</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Assigned To</TableCell>
                                <TableCell>Updated</TableCell>
                                <TableCell>Updated By</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {incidentList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((incident) => (
                                <TableRow key={incident.id} onClick={()=>handleClick(incident)}>
                                    <TableCell className="cursor-pointer">{incident.id}</TableCell>
                                    <TableCell>{incident.opened}</TableCell>
                                    <TableCell>{incident.Short_description}</TableCell>
                                    <TableCell>{incident.caller}</TableCell>
                                    <TableCell>{incident.priority}</TableCell>
                                    <TableCell>{incident.state}</TableCell>
                                    <TableCell>{incident.category}</TableCell>
                                    <TableCell>{incident.assigned_to}</TableCell>
                                    <TableCell>{incident.updated || "(empty)"}</TableCell>
                                    <TableCell>{incident.updated_by || "(empty)"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination */}
                <TablePagination component="div" count={incidentList.length} page={page} rowsPerPage={rowsPerPage} onPageChange={(_, newPage) => setPage(newPage)} onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))} />
            </div>
        </div>
    );
}
