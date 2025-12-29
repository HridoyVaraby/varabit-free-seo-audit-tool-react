import { CheckCircle, Loader2 } from 'lucide-react';

interface ProgressStep {
    id: string;
    label: string;
    status: 'pending' | 'running' | 'complete';
}

interface ProgressIndicatorProps {
    steps: ProgressStep[];
    currentStep?: string;
}

export function ProgressIndicator({ steps }: ProgressIndicatorProps) {
    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center flex-1">
                        {/* Step indicator */}
                        <div className="flex flex-col items-center">
                            <div
                                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  transition-all duration-300
                  ${step.status === 'complete'
                                        ? 'bg-accent-primary text-surface-primary'
                                        : step.status === 'running'
                                            ? 'bg-accent-primary/20 text-accent-primary border-2 border-accent-primary'
                                            : 'bg-surface-tertiary text-content-muted border-2 border-white/10'
                                    }
                `}
                            >
                                {step.status === 'complete' ? (
                                    <CheckCircle className="w-4 h-4" />
                                ) : step.status === 'running' ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <span className="text-xs font-medium">{index + 1}</span>
                                )}
                            </div>
                            <span
                                className={`
                  mt-2 text-xs font-medium text-center max-w-[80px]
                  ${step.status === 'complete'
                                        ? 'text-accent-primary'
                                        : step.status === 'running'
                                            ? 'text-content-primary'
                                            : 'text-content-muted'
                                    }
                `}
                            >
                                {step.label}
                            </span>
                        </div>

                        {/* Connector line */}
                        {index < steps.length - 1 && (
                            <div className="flex-1 h-0.5 mx-2 mt-[-20px]">
                                <div
                                    className={`
                    h-full transition-all duration-500
                    ${step.status === 'complete'
                                            ? 'bg-accent-primary'
                                            : 'bg-surface-tertiary'
                                        }
                  `}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
