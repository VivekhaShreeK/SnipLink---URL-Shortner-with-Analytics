import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, UserPlus, AlertCircle } from 'lucide-react';
import { APP_NAME } from '../utils/constants';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const Register = () => {
  const { register, googleLogin } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useCallback(async () => {
    setError('');
    setGoogleLoading(true);

    try {
      // Wait for Google Identity Services to be available
      if (!window.google?.accounts?.id) {
        await new Promise((resolve, reject) => {
          let attempts = 0;
          const interval = setInterval(() => {
            if (window.google?.accounts?.id) {
              clearInterval(interval);
              resolve();
            } else if (++attempts > 50) {
              clearInterval(interval);
              reject(new Error('Google Sign-In failed to load. Please check your internet connection and try again.'));
            }
          }, 100);
        });
      }

      // Use the popup/One Tap flow — shows real Google accounts from the browser
      const credential = await new Promise((resolve, reject) => {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            if (response.credential) {
              resolve(response.credential);
            } else {
              reject(new Error('Google Sign-In was cancelled.'));
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
          context: 'signup',
          ux_mode: 'popup',
        });

        // Trigger the account chooser popup
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed()) {
            // If One Tap isn't available, fall back to the button-rendered popup
            const container = document.createElement('div');
            container.style.cssText = 'position:fixed;top:-9999px;left:-9999px;';
            document.body.appendChild(container);

            window.google.accounts.id.renderButton(container, {
              type: 'standard',
              size: 'large',
              theme: 'outline',
            });

            requestAnimationFrame(() => {
              const btn = container.querySelector('[role="button"]')
                || container.querySelector('div[tabindex]')
                || container.firstElementChild;
              if (btn) {
                btn.click();
              } else {
                document.body.removeChild(container);
                reject(new Error('Could not open Google Sign-In. Please try again.'));
              }
              setTimeout(() => {
                if (document.body.contains(container)) {
                  document.body.removeChild(container);
                }
              }, 120000);
            });
          } else if (notification.isSkippedMoment()) {
            // User dismissed the prompt — do nothing, let them try again
            setGoogleLoading(false);
          }
        });
      });

      await googleLogin(credential);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Google sign-in failed. Please try again.';
      if (message !== 'Google Sign-In was cancelled.') {
        setError(message);
      }
    } finally {
      setGoogleLoading(false);
    }
  }, [googleLogin]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-brand-500/10 dark:bg-brand-500/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="glass-card p-8 animate-scale-in">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
              Get started with {APP_NAME} for free
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 flex items-start gap-2 animate-slide-down">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Google Sign-Up Button — placed first like professional sites */}
          <button
            type="button"
            id="google-signup-btn"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="btn-secondary w-full py-3 mb-4"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-surface-300 dark:border-surface-600 border-t-brand-500 rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-200 dark:border-surface-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white dark:bg-surface-900 text-surface-400 dark:text-surface-500">or sign up with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  id="name"
                  type="text"
                  required
                  className="input pl-10"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  id="email"
                  type="email"
                  required
                  className="input pl-10"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  id="password"
                  type="password"
                  required
                  className="input pl-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  className="input pl-10"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-surface-500 dark:text-surface-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
