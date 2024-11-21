import { useState } from "react";

export interface PostInteractions {
    likesCount: { [key: number]: number };
    dislikesCount: { [key: number]: number };
    likedPosts: { [key: number]: boolean };
    dislikedPosts: { [key: number]: boolean };
    favorites: number[];
    handleLike: (id: number) => void;
    handleDislike: (id: number) => void;
    handleFavorite: (id: number) => void;
}

export const usePostInteractions = (): PostInteractions => {
    const [likesCount, setLikesCount] = useState<{ [key: number]: number }>({});
    const [dislikesCount, setDislikesCount] = useState<{ [key: number]: number }>({});
    const [likedPosts, setLikedPosts] = useState<{ [key: number]: boolean }>({});
    const [dislikedPosts, setDislikedPosts] = useState<{ [key: number]: boolean }>({});
    const [favorites, setFavorites] = useState<number[]>([]);

    const handleLike = (id: number) => {
        setLikedPosts((prev) => {
            const isLiked = prev[id] || false;
            setLikesCount((prevCount) => ({
                ...prevCount,
                [id]: isLiked ? (prevCount[id] || 0) - 1 : (prevCount[id] || 0) + 1,
            }));

            if (!isLiked && dislikedPosts[id]) {
                setDislikedPosts((prevDisliked) => ({ ...prevDisliked, [id]: false }));
                setDislikesCount((prevCount) => ({
                    ...prevCount,
                    [id]: (prevCount[id] || 0) - 1,
                }));
            }

            return { ...prev, [id]: !isLiked };
        });
    };

    const handleDislike = (id: number) => {
        setDislikedPosts((prev) => {
            const isDisliked = prev[id] || false;
            setDislikesCount((prevCount) => ({
                ...prevCount,
                [id]: isDisliked ? (prevCount[id] || 0) - 1 : (prevCount[id] || 0) + 1,
            }));

            if (!isDisliked && likedPosts[id]) {
                setLikedPosts((prevLiked) => ({ ...prevLiked, [id]: false }));
                setLikesCount((prevCount) => ({
                    ...prevCount,
                    [id]: (prevCount[id] || 0) - 1,
                }));
            }

            return { ...prev, [id]: !isDisliked };
        });
    };

    const handleFavorite = (id: number) => {
        setFavorites((prevFavorites) =>
            prevFavorites.includes(id) ? prevFavorites.filter((favId) => favId !== id) : [...prevFavorites, id]
        );
    };

    return {
        likesCount,
        dislikesCount,
        likedPosts,
        dislikedPosts,
        favorites,
        handleLike,
        handleDislike,
        handleFavorite,
    };
};
