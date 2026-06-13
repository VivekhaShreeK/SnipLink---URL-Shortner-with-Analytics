import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Link2,
  BarChart3,
  Shield,
  Zap,
  QrCode,
  Globe,
  ArrowRight,
  Check,
  Mail,
  UserPlus,
} from 'lucide-react';
import { APP_NAME } from '../utils/constants';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    desc: 'Generate short links in milliseconds with automatic unique code generation.',
    color: 'from-amber-400 to-orange-500',
  },
  {
    icon: BarChart3,
    title: 'Rich Analytics',
    desc: 'Track clicks, devices, locations, referrers, and daily trends with interactive charts.',
    color: 'from-brand-400 to-brand-600',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    desc: 'JWT authentication, rate limiting, and per-user data isolation keep your links safe.',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    icon: QrCode,
    title: 'QR Codes',
    desc: 'Instantly generate downloadable QR codes for every shortened URL.',
    color: 'from-purple-400 to-pink-500',
  },
  {
    icon: Link2,
    title: 'Custom Aliases',
    desc: 'Create memorable branded links with custom aliases like /my-link.',
    color: 'from-cyan-400 to-blue-500',
  },
  {
    icon: Globe,
    title: 'Public Stats',
    desc: 'Share link performance publicly or keep analytics private — your choice.',
    color: 'from-rose-400 to-red-500',
  },
];

const Landing = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-500/10 dark:bg-brand-500/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-brand-500/5 to-purple-500/5 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 text-sm font-medium mb-8 animate-fade-in">
              <Zap className="w-4 h-4" />
              Powerful URL Shortening & Analytics
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-balance animate-slide-up">
              Shorten Links.
              <br />
              <span className="gradient-text">Track Everything.</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg sm:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto text-balance animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Create short, memorable URLs and gain powerful insights into your audience with real-time analytics, device tracking, and geographic data.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link
                to="/register"
                className="btn-primary px-8 py-3.5 text-base shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40"
              >
                Start for Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/register"
                className="btn-secondary px-8 py-3.5 text-base"
              >
                <UserPlus className="w-5 h-5" />
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="btn-secondary px-8 py-3.5 text-base"
              >
                Sign In
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-surface-400 dark:text-surface-500 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {['No credit card required', 'Free forever', 'Open source'].map(
                (item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-500" />
                    {item}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white">
              Everything you need to manage your links
            </h2>
            <p className="mt-4 text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto">
              A complete suite of tools for URL shortening, analytics, and link management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="glass-card p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card p-12 relative overflow-hidden">
            <div className="absolute inset-0 animated-gradient opacity-5" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-4">
                Ready to supercharge your links?
              </h2>
              <p className="text-lg text-surface-500 dark:text-surface-400 mb-8 max-w-lg mx-auto">
                Join {APP_NAME} today and start tracking your link performance with beautiful analytics.
              </p>
              <Link
                to="/register"
                className="btn-primary px-10 py-4 text-base shadow-xl shadow-brand-500/25"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-200 dark:border-surface-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-surface-400 dark:text-surface-500">
          <p>© {new Date().getFullYear()} {APP_NAME}. Built with React, Express & MongoDB.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
