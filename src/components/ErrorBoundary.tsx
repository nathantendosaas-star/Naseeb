import React from 'react';
import { Link } from 'react-router-dom';

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
    // Wire up your error monitoring service here if/when you add one (e.g. Sentry)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
          <p className="text-xs font-black tracking-[0.6em] uppercase text-white/30 mb-6">
            Something went wrong
          </p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-8">
            An error occurred
          </h1>
          <p className="text-white/50 text-sm mb-12 max-w-md font-mono">
            {this.state.error?.message || 'Unknown error'}
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-8 py-3 bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-[#d4af37] transition-colors"
            >
              Try Again
            </button>
            <Link
              to="/"
              className="px-8 py-3 border border-white/20 text-xs font-black uppercase tracking-widest hover:border-white transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
