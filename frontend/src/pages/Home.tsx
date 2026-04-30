/**
 * Home Page
 *
 * Public landing page for the app.
 */

import { Link } from 'react-router-dom';
import { Button } from '@/components';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sunrise-50 via-dawn-50 to-rose-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto">
          {/* Sun Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-sunrise-400 to-dawn-500 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-sunrise-600 via-dawn-600 to-rose-600 bg-clip-text text-transparent mb-6">
            Sunrise
          </h1>
          <p className="text-xl text-warmGray-600 mb-8">
            Every day is a fresh start. Set your resolutions, track your progress,
            and rise to your best self alongside your community.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg">Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-md border border-sunrise-100">
            <div className="w-12 h-12 bg-gradient-to-br from-sunrise-400 to-sunrise-500 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-warmGray-900 mb-2">
              Track Your Progress
            </h3>
            <p className="text-warmGray-600">
              Set meaningful goals and watch your progress grow day by day
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-md border border-dawn-100">
            <div className="w-12 h-12 bg-gradient-to-br from-dawn-400 to-dawn-500 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-warmGray-900 mb-2">
              Community Support
            </h3>
            <p className="text-warmGray-600">
              Rise together with friends and celebrate each other's wins
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-md border border-rose-100">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-rose-500 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-warmGray-900 mb-2">
              Fresh Starts Daily
            </h3>
            <p className="text-warmGray-600">
              Every sunrise brings new opportunities to pursue your goals
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
