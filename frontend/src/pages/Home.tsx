/**
 * Home Page
 *
 * Public landing page for the app.
 */

import { Link } from 'react-router-dom'
import { Button } from '@/components'
import { useAuth } from '@/hooks/useAuth'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-sunrise-50 via-dawn-50 to-rose-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="mx-auto max-w-3xl text-center">
          {/* Sun Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sunrise-400 to-dawn-500 shadow-lg">
            <svg
              className="h-12 w-12 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" />
            </svg>
          </div>
          <h1 className="mb-6 bg-gradient-to-r from-sunrise-600 via-dawn-600 to-rose-600 bg-clip-text text-5xl font-bold text-transparent">
            Sunrise
          </h1>
          <p className="mb-8 text-xl text-warmGray-600">
            Every day is a fresh start. Set your goals, track your progress, and
            rise to your best self alongside your community.
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-center gap-4">
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
        <div className="mx-auto mt-20 grid max-w-5xl gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-sunrise-100 bg-white/80 p-6 shadow-md backdrop-blur-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sunrise-400 to-sunrise-500">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-warmGray-900">
              Track Your Progress
            </h3>
            <p className="text-warmGray-600">
              Set meaningful goals and watch your progress grow day by day
            </p>
          </div>

          <div className="rounded-2xl border border-dawn-100 bg-white/80 p-6 shadow-md backdrop-blur-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-dawn-400 to-dawn-500">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-warmGray-900">
              Community Support
            </h3>
            <p className="text-warmGray-600">
              Rise together with friends and celebrate each other's wins
            </p>
          </div>

          <div className="rounded-2xl border border-rose-100 bg-white/80 p-6 shadow-md backdrop-blur-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400 to-rose-500">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-warmGray-900">
              Fresh Starts Daily
            </h3>
            <p className="text-warmGray-600">
              Every sunrise brings new opportunities to pursue your goals
            </p>
          </div>
        </div>

        {/* Data transparency */}
        <div className="mx-auto mt-16 max-w-2xl rounded-2xl border border-warmGray-200 bg-white/60 p-6 text-center backdrop-blur-sm">
          <h2 className="mb-2 text-lg font-semibold text-warmGray-900">
            How we use your data
          </h2>
          <p className="text-sm text-warmGray-600">
            Sunrise uses Google Sign-In to authenticate you. We only access your
            basic profile information (name and email) to create and identify
            your account. We do not share your data with third parties or use it
            for advertising.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 border-t border-warmGray-200 bg-white/40 py-6 text-center text-sm text-warmGray-500">
        <div className="flex justify-center gap-6">
          <Link
            to="/privacy-policy"
            className="hover:text-sunrise-600 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms-of-service"
            className="hover:text-sunrise-600 transition-colors"
          >
            Terms of Service
          </Link>
        </div>
        <p className="mt-2">&copy; {new Date().getFullYear()} Sunrise. All rights reserved.</p>
      </footer>
    </div>
  )
}
