import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout() {
    return (
        <div className="min-h-screen flex flex-col bg-surface-primary bg-grid-pattern">
            <Header />

            {/* Main content with header offset */}
            <main className="flex-1 pt-16">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}
