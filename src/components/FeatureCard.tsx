import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    delay?: number;
}

export function FeatureCard({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) {
    return (
        <div
            className="card-glow group animate-slide-up"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-accent-primary/10 text-accent-primary group-hover:bg-accent-primary group-hover:text-surface-primary transition-all duration-300">
                    <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <h3 className="font-display font-semibold text-content-primary mb-2 group-hover:text-accent-primary transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-content-secondary leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}
