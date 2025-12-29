import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'About', path: '/about' },
];

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    return (
        <header className="fixed top-0 inset-x-0 z-50 glass">
            <div className="section">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center transition-transform group-hover:scale-110">
                            <Search className="w-4 h-4 text-surface-primary" />
                        </div>
                        <span className="font-display font-bold text-lg text-content-primary">
                            Varabit<span className="text-accent-primary">SEO</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.path
                                        ? 'text-accent-primary bg-accent-primary/10'
                                        : 'text-content-secondary hover:text-content-primary hover:bg-surface-tertiary'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* CTA Button */}
                    <div className="hidden md:block">
                        <Link to="/" className="btn-primary text-sm">
                            <Search className="w-4 h-4" />
                            Start Audit
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-content-secondary hover:text-content-primary transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-white/[0.06] animate-fade-in">
                        <nav className="flex flex-col gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.path
                                            ? 'text-accent-primary bg-accent-primary/10'
                                            : 'text-content-secondary hover:text-content-primary hover:bg-surface-tertiary'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                to="/"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="btn-primary text-sm mt-2"
                            >
                                <Search className="w-4 h-4" />
                                Start Audit
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
