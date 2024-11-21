import { useState, useEffect } from "react";
import axios from "axios";

interface Comment {
    id: number;
    postId: number;
    name: string;
    email: string;
    body: string;
}

export const useComments = (id: string | undefined) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [currentPostComments, setCurrentPostComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchCurrentPostComments = async () => {
        try {
            const commentsResponse = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);
            setCurrentPostComments(commentsResponse.data);
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const commentsResponse = await axios.get(`https://jsonplaceholder.typicode.com/comments`);
            setComments(commentsResponse.data);
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrentPostComments();
        fetchComments()
    }, [id]);

    const addComment = async (postName: string, body: string) => {
        const email = localStorage.getItem('email');
        if (!email) {
            console.error("Email not found in localStorage");
            return;
        }

        try {
            const response = await axios.post(`https://jsonplaceholder.typicode.com/comments`, {
                postId: Number(id),
                name: postName,
                body,
                email,
            });
            setCurrentPostComments((prevComments) => [response.data, ...prevComments]);
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    return { comments, currentPostComments, isLoading, addComment };
};
