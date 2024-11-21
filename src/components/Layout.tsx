import { Outlet } from "react-router-dom";
import Header from "./Header";

function Layout() {
    return (
        <div className="min-h-screen bg-background text-foreground w-full ">
            <Header />
            <main className="container mx-auto py-8 w-full">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;