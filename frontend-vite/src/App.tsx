import { BrowserRouter as Router, Link, Route, Routes, useLocation } from 'react-router-dom'
import { LogoutButton, RouteProtected } from "@/components";
import { Toaster } from "react-hot-toast";
import { AdminPage, ForbiddenPage, GuestPage, Home, LoginPage, RailwayCisternPage, UserPage } from "@/pages";

const HIDDEN_NAV_PATHS = ['/login', '/forbidden', '/guest'];

// Компонент для навигации и контроля авторизации
const Navigation = () => {
    const location = useLocation();

    if (HIDDEN_NAV_PATHS.includes(location.pathname)) {
        return null;
    }

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <ul className="flex space-x-6 text-white">
                    <li>
                        <Link to="/" className="hover:text-blue-300">Главная</Link>
                    </li>
                    <li>
                        <Link to="/cisterns" className="hover:text-blue-300">Таблица цистерн</Link>
                    </li>
                    <li>
                        <Link to="/admin" className="hover:text-blue-300">Страница администратора</Link>
                    </li>
                </ul>
                <LogoutButton />
            </div>
        </nav>
    );
};

function App() {
    return (
        <Router>
            <Toaster />
            <div className="min-h-screen bg-gray-100">
                <Navigation />

                <div>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/guest" element={<GuestPage />} />

                        <Route element={<RouteProtected allowedRoles={['User']} />}>
                            <Route path="/" element={<Home />} />

                            <Route path="/forbidden" element={<ForbiddenPage />} />

                            <Route path="/cisterns" element={<RailwayCisternPage />} />

                            <Route element={<RouteProtected allowedRoles={['Moderator']} />}>
                                <Route path="/moderator" element={<UserPage />} />
                            </Route>

                            <Route element={<RouteProtected allowedRoles={['Admin']} />}>
                                <Route path="/admin" element={<AdminPage />} />
                            </Route>
                        </Route>

                    </Routes>
                </div>
            </div>
        </Router>
    )
}

export default App
