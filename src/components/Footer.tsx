import { Link } from 'react-router-dom';
import { Search, Github, Twitter, Mail } from 'lucide-react';

const footerLinks = {
    product: [
        { name: 'Features', path: '/features' },
        { name: 'How It Works', path: '/about' },
        { name: 'Pricing', path: '/' },
    ],
    resources: [
        { name: 'Documentation', path: '/' },
        { name: 'API', path: '/' },
        { name: 'SEO Guide', path: '/' },
    ],
    company: [
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/' },
        { name: 'Privacy', path: '/' },
    ],
};

export function Footer() {
    return (
        <footer className="bg-surface-secondary border-t border-white/[0.06]">
            <div className="section py-12 lg:py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 group mb-4">
                            <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center transition-transform group-hover:scale-110">
                                <Search className="w-4 h-4 text-surface-primary" />
                            </div>
                            <span className="font-display font-bold text-lg text-content-primary">
                                Varabit<span className="text-accent-primary">SEO</span>
                            </span>
                        </Link>
                        <p className="text-content-secondary text-sm leading-relaxed mb-6">
                            Free, powerful SEO analysis tool to help you improve your website's search engine visibility.
                        </p>
                        <div className="flex items-center gap-3">
                            <a
                                href="https://github.com/varabit"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-surface-tertiary text-content-secondary hover:text-content-primary hover:bg-surface-elevated transition-colors"
                                aria-label="GitHub"
                            >
                                <Github className="w-4 h-4" />
                            </a>
                            <a
                                href="https://twitter.com/varabit"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-surface-tertiary text-content-secondary hover:text-content-primary hover:bg-surface-elevated transition-colors"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a
                                href="mailto:support@varabit.com"
                                className="p-2 rounded-lg bg-surface-tertiary text-content-secondary hover:text-content-primary hover:bg-surface-elevated transition-colors"
                                aria-label="Email"
                            >
                                <Mail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="font-display font-semibold text-content-primary mb-4">Product</h4>
                        <ul className="space-y-2">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-sm text-content-secondary hover:text-accent-primary transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-display font-semibold text-content-primary mb-4">Resources</h4>
                        <ul className="space-y-2">
                            {footerLinks.resources.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-sm text-content-secondary hover:text-accent-primary transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-display font-semibold text-content-primary mb-4">Company</h4>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-sm text-content-secondary hover:text-accent-primary transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-content-muted">
                        © {new Date().getFullYear()} Varabit. All rights reserved.
                    </p>
                    <p className="text-sm text-content-muted">
                        Version 2.0.0 • GPL v2 License
                    </p>
                </div>
            </div>
        </footer>
    );
}
