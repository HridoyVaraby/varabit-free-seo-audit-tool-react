import {
    Target,
    Users,
    Code,
    Heart,
    ArrowRight,
    Github,
    Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function About() {
    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative py-20 lg:py-28 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-accent-primary/5 via-transparent to-transparent" />

                <div className="section relative">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl sm:text-5xl font-display font-bold text-content-primary mb-6 animate-slide-up">
                            About <span className="gradient-text">VarabitSEO</span>
                        </h1>
                        <p className="text-lg text-content-secondary animate-slide-up animation-delay-100">
                            A free, open-source SEO audit tool built by developers, for everyone who wants
                            to improve their website's search engine visibility.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="section pb-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="animate-slide-up">
                        <div className="inline-flex p-3 rounded-xl bg-accent-primary/10 text-accent-primary mb-4">
                            <Target className="w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-display font-bold text-content-primary mb-4">
                            Our Mission
                        </h2>
                        <p className="text-content-secondary leading-relaxed mb-4">
                            We believe that SEO optimization tools should be accessible to everyone,
                            not just enterprise companies with big budgets. That's why we built VarabitSEO
                            as a free, comprehensive audit tool.
                        </p>
                        <p className="text-content-secondary leading-relaxed">
                            Our goal is to help website owners, developers, and marketers understand
                            and improve their SEO without needing expensive subscriptions or complex software.
                        </p>
                    </div>

                    <div className="card animate-slide-up animation-delay-200">
                        <h3 className="font-display font-semibold text-xl text-content-primary mb-6">
                            What Makes Us Different
                        </h3>
                        <ul className="space-y-4">
                            {[
                                'Completely free, no signup required',
                                'Open source under GPL v2 license',
                                'Privacy-focused - we don\'t store your data',
                                'Real-time analysis using modern APIs',
                                'Downloadable PDF reports for documentation',
                                'Regular updates with new features',
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-3 text-content-secondary">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent-primary mt-2 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="section py-20 border-t border-white/[0.06]">
                <div className="text-center mb-12">
                    <div className="inline-flex p-3 rounded-xl bg-accent-primary/10 text-accent-primary mb-4">
                        <Users className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-content-primary mb-4">
                        Built by Varabit
                    </h2>
                    <p className="text-content-secondary max-w-xl mx-auto">
                        Varabit is a software development company focused on creating useful tools
                        and applications for the web.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <div className="card-interactive text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-primary to-cyan-400 mx-auto mb-4 flex items-center justify-center">
                            <Code className="w-8 h-8 text-surface-primary" />
                        </div>
                        <h3 className="font-display font-semibold text-content-primary mb-2">
                            Development
                        </h3>
                        <p className="text-sm text-content-secondary">
                            Built with React, TypeScript, and modern web technologies.
                        </p>
                    </div>

                    <div className="card-interactive text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-warning to-orange-400 mx-auto mb-4 flex items-center justify-center">
                            <Heart className="w-8 h-8 text-surface-primary" />
                        </div>
                        <h3 className="font-display font-semibold text-content-primary mb-2">
                            Community
                        </h3>
                        <p className="text-sm text-content-secondary">
                            Open source and welcoming contributions from everyone.
                        </p>
                    </div>

                    <div className="card-interactive text-center sm:col-span-2 lg:col-span-1">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-400 mx-auto mb-4 flex items-center justify-center">
                            <Target className="w-8 h-8 text-surface-primary" />
                        </div>
                        <h3 className="font-display font-semibold text-content-primary mb-2">
                            Mission
                        </h3>
                        <p className="text-sm text-content-secondary">
                            Making SEO accessible and understandable for everyone.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="section py-20">
                <div className="card bg-surface-tertiary text-center max-w-2xl mx-auto">
                    <h2 className="text-2xl font-display font-bold text-content-primary mb-4">
                        Get In Touch
                    </h2>
                    <p className="text-content-secondary mb-6">
                        Have questions, feedback, or want to contribute? We'd love to hear from you.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="mailto:support@varabit.com"
                            className="btn-primary"
                        >
                            <Mail className="w-5 h-5" />
                            <span>Email Us</span>
                        </a>
                        <a
                            href="https://github.com/varabit"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary"
                        >
                            <Github className="w-5 h-5" />
                            <span>View on GitHub</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section pb-20">
                <div className="text-center">
                    <Link to="/" className="btn-primary inline-flex">
                        <span>Try the SEO Audit Tool</span>
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
