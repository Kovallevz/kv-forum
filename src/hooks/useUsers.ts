import { useState, useEffect } from "react";
import axios from "axios";

interface User {
    id: number;
    name: string;
    email: string;
}

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("https://jsonplaceholder.typicode.com/users");
            setUsers(response.data);
        } catch (error) {
            console.error("Error loading users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return { users, isLoading };
};
