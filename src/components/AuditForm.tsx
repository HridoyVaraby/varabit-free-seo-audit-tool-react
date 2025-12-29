import { useState } from 'react';
import { Search, ArrowRight, Loader2 } from 'lucide-react';
import { sanitizeUrl } from '../utils/urlUtils';

interface AuditFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export function AuditForm({ onSubmit, isLoading }: AuditFormProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const validateUrl = (input: string): boolean => {
    try {
      const urlObj = new URL(input);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const sanitizedUrl = sanitizeUrl(url);

    if (!sanitizedUrl) {
      setError('Please enter a URL');
      return;
    }

    if (!validateUrl(sanitizedUrl)) {
      setError('Please enter a valid URL (must start with http:// or https://)');
      return;
    }

    onSubmit(sanitizedUrl);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        {/* Glow effect container */}
        <div
          className={`
            absolute -inset-1 rounded-2xl transition-all duration-500
            ${isFocused ? 'bg-gradient-to-r from-accent-primary/30 via-cyan-500/30 to-emerald-500/30 blur-lg' : 'opacity-0'}
          `}
        />

        {/* Form container */}
        <div
          className={`
            relative flex flex-col sm:flex-row gap-3 p-2 
            bg-surface-tertiary rounded-2xl border transition-all duration-300
            ${isFocused ? 'border-accent-primary/50' : 'border-white/[0.06]'}
            ${error ? 'border-accent-error/50' : ''}
          `}
        >
          {/* Search icon */}
          <div className="absolute left-5 top-1/2 -translate-y-1/2 hidden sm:block">
            <Search className={`w-5 h-5 transition-colors ${isFocused ? 'text-accent-primary' : 'text-content-muted'}`} />
          </div>

          {/* Input field */}
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter website URL to analyze..."
            disabled={isLoading}
            className={`
              flex-1 bg-transparent text-content-primary placeholder-content-muted
              px-4 sm:pl-12 py-3 text-base
              focus:outline-none
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          />

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`
              flex items-center justify-center gap-2 px-6 py-3
              bg-accent-primary text-surface-primary font-semibold rounded-xl
              transition-all duration-300
              hover:bg-accent-primary-hover hover:shadow-glow-sm
              active:scale-[0.98]
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none
            `}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span>Analyze</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <p className="mt-3 text-sm text-accent-error flex items-center gap-2 animate-fade-in">
            <span className="w-1 h-1 rounded-full bg-accent-error" />
            {error}
          </p>
        )}
      </form>

      {/* Helper text */}
      <p className="mt-4 text-center text-sm text-content-muted">
        Enter any public URL to get a comprehensive SEO audit report
      </p>
    </div>
  );
}
