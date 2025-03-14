import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useSession() {
    const [session, setSession] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (typeof window === "undefined") return; // Ensure it's only running on the client

        const checkSession = async () => {
            try {
                const res = await fetch("/api/server", { credentials: "include" });
                const data = await res.json();
                
                if (!data.session) {
                    router.replace("/signin"); // Use replace() to avoid back navigation issues
                } else {
                    setSession(data.session);
                }
            } catch (error) {
                console.error("Session check failed", error);
                router.replace("/signin");
            }
        };

        checkSession();
    }, [router]); // Include router as a dependency

    return session;
}

