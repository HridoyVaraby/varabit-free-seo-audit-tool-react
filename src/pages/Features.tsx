import {
    Zap,
    Search,
    FileText,
    Smartphone,
    Image,
    Type,
    CheckCircle,
    ArrowRight,
    Globe,
    Shield,
    TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
    {
        icon: Zap,
        title: 'Page Speed Analysis',
        description: 'Analyze Core Web Vitals including First Contentful Paint (FCP), Largest Contentful Paint (LCP), and Cumulative Layout Shift (CLS) using Google PageSpeed Insights API.',
        details: ['Mobile & Desktop scores', 'Performance metrics', 'Optimization suggestions'],
    },
    {
        icon: FileText,
        title: 'Meta Tags Audit',
        description: 'Comprehensive analysis of your pages meta information including title length, description optimization, Open Graph tags, and canonical URLs.',
        details: ['Title optimization', 'Description analysis', 'OG tags verification'],
    },
    {
        icon: Type,
        title: 'Heading Structure',
        description: 'Verify proper heading hierarchy from H1 to H6. Detect missing H1 tags, multiple H1s, empty headings, and skipped heading levels.',
        details: ['H1 validation', 'Hierarchy check', 'Empty heading detection'],
    },
    {
        icon: Image,
        title: 'Image Accessibility',
        description: 'Check all images for missing or empty alt attributes. Improve accessibility and help search engines understand your visual content.',
        details: ['Alt attribute audit', 'Accessibility score', 'Missing alt detection'],
    },
    {
        icon: Smartphone,
        title: 'Mobile-Friendliness',
        description: 'Validate viewport meta tag configuration and responsive design elements. Ensure your website works perfectly on mobile devices.',
        details: ['Viewport validation', 'Mobile optimization', 'Responsive checks'],
    },
    {
        icon: Search,
        title: 'Keyword Density',
        description: 'Analyze your content for keyword distribution and density. Get warnings about keyword stuffing and content length recommendations.',
        details: ['Word count analysis', 'Top keywords', 'Density warnings'],
    },
];

const benefits = [
    {
        icon: Globe,
        title: 'Improve Visibility',
        description: 'Boost your search engine rankings and get found by more potential customers.',
    },
    {
        icon: Shield,
        title: 'Best Practices',
        description: 'Follow industry-standard SEO guidelines and modern optimization techniques.',
    },
    {
        icon: TrendingUp,
        title: 'Track Progress',
        description: 'Download detailed PDF reports to track your SEO improvements over time.',
    },
];

export function Features() {
    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative py-20 lg:py-28 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-accent-primary/5 via-transparent to-transparent" />

                <div className="section relative text-center">
                    <h1 className="text-4xl sm:text-5xl font-display font-bold text-content-primary mb-6 animate-slide-up">
                        Powerful <span className="gradient-text">SEO Analysis</span> Features
                    </h1>
                    <p className="text-lg text-content-secondary max-w-2xl mx-auto animate-slide-up animation-delay-100">
                        Our free SEO audit tool provides comprehensive analysis across six key areas
                        to help you optimize your website for search engines.
                    </p>
                </div>
            </section>

            {/* Features Grid */}
            <section className="section pb-20">
                <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={feature.title}
                            className="card-glow group animate-slide-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-3 rounded-xl bg-accent-primary/10 text-accent-primary group-hover:bg-accent-primary group-hover:text-surface-primary transition-all duration-300">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-display font-semibold text-xl text-content-primary group-hover:text-accent-primary transition-colors">
                                        {feature.title}
                                    </h3>
                                </div>
                            </div>

                            <p className="text-content-secondary mb-4 leading-relaxed">
                                {feature.description}
                            </p>

                            <ul className="space-y-2">
                                {feature.details.map((detail) => (
                                    <li key={detail} className="flex items-center gap-2 text-sm text-content-tertiary">
                                        <CheckCircle className="w-4 h-4 text-accent-primary flex-shrink-0" />
                                        {detail}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Benefits Section */}
            <section className="section py-20 border-t border-white/[0.06]">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-display font-bold text-content-primary mb-4">
                        Why Use Our SEO Tool?
                    </h2>
                    <p className="text-content-secondary max-w-xl mx-auto">
                        Get actionable insights that help you improve your website's search performance.
                    </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-6">
                    {benefits.map((benefit, index) => (
                        <div
                            key={benefit.title}
                            className="text-center animate-slide-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="inline-flex p-4 rounded-2xl bg-surface-tertiary text-accent-primary mb-4">
                                <benefit.icon className="w-8 h-8" />
                            </div>
                            <h3 className="font-display font-semibold text-lg text-content-primary mb-2">
                                {benefit.title}
                            </h3>
                            <p className="text-sm text-content-secondary">
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="section py-20">
                <div className="card bg-gradient-to-r from-accent-primary/10 to-cyan-500/10 border-accent-primary/20 text-center">
                    <h2 className="text-2xl font-display font-bold text-content-primary mb-4">
                        Ready to Optimize Your Website?
                    </h2>
                    <p className="text-content-secondary mb-6 max-w-md mx-auto">
                        Start your free SEO audit now and get detailed recommendations in minutes.
                    </p>
                    <Link to="/" className="btn-primary inline-flex">
                        <span>Start Free Audit</span>
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
