import { ROUTES } from "@/constants/routes";
import { Button } from "./ui/button";
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className="bg-black text-primary-foreground p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">KV Forum</h1>
                <nav>
                    <Button variant="ghost" className="mr-2" onClick={() => navigate(ROUTES.POSTS)}>All posts</Button>
                    <Button variant="ghost" onClick={() => navigate(ROUTES.USER_PROFILE)}>Profile</Button>
                </nav>

            </div>
        </header>
    );
};

export default Header;