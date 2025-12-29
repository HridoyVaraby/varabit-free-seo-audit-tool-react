interface ScoreCircleProps {
    score: number;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    label?: string;
}

export function ScoreCircle({ score, size = 'md', showLabel = true, label }: ScoreCircleProps) {
    const clampedScore = Math.min(100, Math.max(0, score));

    const sizeConfig = {
        sm: { width: 60, strokeWidth: 4, fontSize: 'text-sm', labelSize: 'text-2xs' },
        md: { width: 100, strokeWidth: 6, fontSize: 'text-xl', labelSize: 'text-xs' },
        lg: { width: 140, strokeWidth: 8, fontSize: 'text-3xl', labelSize: 'text-sm' },
    };

    const config = sizeConfig[size];
    const radius = (config.width - config.strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = ((100 - clampedScore) / 100) * circumference;

    const getScoreColor = () => {
        if (clampedScore >= 80) return 'text-accent-primary stroke-accent-primary';
        if (clampedScore >= 50) return 'text-accent-warning stroke-accent-warning';
        return 'text-accent-error stroke-accent-error';
    };

    const getTrackColor = () => {
        if (clampedScore >= 80) return 'stroke-accent-primary/20';
        if (clampedScore >= 50) return 'stroke-accent-warning/20';
        return 'stroke-accent-error/20';
    };

    return (
        <div className="relative flex flex-col items-center">
            <svg
                width={config.width}
                height={config.width}
                className="transform -rotate-90"
            >
                {/* Background track */}
                <circle
                    cx={config.width / 2}
                    cy={config.width / 2}
                    r={radius}
                    fill="none"
                    strokeWidth={config.strokeWidth}
                    className={getTrackColor()}
                />
                {/* Progress arc */}
                <circle
                    cx={config.width / 2}
                    cy={config.width / 2}
                    r={radius}
                    fill="none"
                    strokeWidth={config.strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={progress}
                    className={`${getScoreColor()} transition-all duration-1000 ease-out`}
                    style={{
                        '--progress-value': progress,
                    } as React.CSSProperties}
                />
            </svg>

            {/* Score text in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`font-display font-bold ${config.fontSize} ${getScoreColor()}`}>
                    {clampedScore}
                </span>
                {showLabel && (
                    <span className={`${config.labelSize} text-content-tertiary`}>
                        {label || 'Score'}
                    </span>
                )}
            </div>
        </div>
    );
}
