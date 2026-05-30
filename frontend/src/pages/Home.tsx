/**
 * Home Page
 *
 * Public landing page for the app.
 */

import { Link } from 'react-router-dom'
import { Button } from '@/components'
import { useAuth } from '@/hooks/useAuth'
import { Icon } from '@/components/ui/Icon'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-sunrise-50 via-dawn-50 to-rose-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="mx-auto max-w-3xl text-center">
          {/* Sun Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sunrise-400 to-dawn-500 shadow-lg">
            <Icon name="sunrise" size={48} className="text-white" />
          </div>
          <h1 className="mb-6 bg-gradient-to-r from-sunrise-600 via-dawn-600 to-rose-600 bg-clip-text text-5xl font-bold text-transparent">Sunrise</h1>
          <p className="mb-8 text-xl text-warmGray-600">Every day is a fresh start. Set your goals, track your progress, and rise to your best self alongside your community.</p>

          {/* CTA Buttons */}
          <div className="flex justify-center gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg">Go to Dashboard</Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="lg">Get Started</Button>
              </Link>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mx-auto mt-20 grid max-w-5xl gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-sunrise-100 bg-white/80 p-6 shadow-md backdrop-blur-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sunrise-400 to-sunrise-500">
              <Icon name="check-circle" size={24} className="text-white" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-warmGray-900">Track Your Progress</h3>
            <p className="text-warmGray-600">Set meaningful goals and watch your progress grow day by day</p>
          </div>

          <div className="rounded-2xl border border-dawn-100 bg-white/80 p-6 shadow-md backdrop-blur-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-dawn-400 to-dawn-500">
              <Icon name="user-group" size={24} className="text-white" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-warmGray-900">Community Support</h3>
            <p className="text-warmGray-600">Rise together with friends and celebrate each other's wins</p>
          </div>

          <div className="rounded-2xl border border-rose-100 bg-white/80 p-6 shadow-md backdrop-blur-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400 to-rose-500">
              <Icon name="zap" size={24} className="text-white" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-warmGray-900">Fresh Starts Daily</h3>
            <p className="text-warmGray-600">Every sunrise brings new opportunities to pursue your goals</p>
          </div>
        </div>

        {/* Data transparency */}
        <div className="mx-auto mt-16 max-w-2xl rounded-2xl border border-warmGray-200 bg-white/60 p-6 text-center backdrop-blur-sm">
          <h2 className="mb-2 text-lg font-semibold text-warmGray-900">How we use your data</h2>
          <p className="text-sm text-warmGray-600">Sunrise uses Google Sign-In to authenticate you. We only access your basic profile information (name and email) to create and identify your account. We do not share your data with third parties or use it for advertising.</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 border-t border-warmGray-200 bg-white/40 py-6 text-center text-sm text-warmGray-500">
        <div className="flex justify-center gap-6">
          <Link to="/privacy-policy" className="transition-colors hover:text-sunrise-600">
            Privacy Policy
          </Link>
          <Link to="/terms-of-service" className="transition-colors hover:text-sunrise-600">
            Terms of Service
          </Link>
        </div>
        <p className="mt-2">&copy; {new Date().getFullYear()} Sunrise. All rights reserved.</p>
      </footer>
    </div>
  )
}
