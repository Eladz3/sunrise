/**
 * Home Page
 *
 * Community progress view with tabs for By User and By Resolution.
 * Connected to Firestore with live updates.
 */

import { useState } from 'react';
import { ResolutionCard, Spinner } from '@/components';
import {
  useCommunityResolutions,
  groupResolutionsByUser,
  calculateCommunityProgress,
} from '@/hooks/useCommunityResolutions';

type HomeTab = 'byUser' | 'byResolution';

export function HomePage() {
  const [activeTab, setActiveTab] = useState<HomeTab>('byUser');
  const { resolutions, loading, error } = useCommunityResolutions();

  const resolutionsByUser = groupResolutionsByUser(resolutions);
  const communityProgress = calculateCommunityProgress(resolutions);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sunrise-500 via-dawn-500 to-rose-500 rounded-2xl shadow-lg p-6 text-white">
        <h1 className="text-2xl font-bold text-center mb-1">
          Community Progress
        </h1>
        <p className="text-sunrise-100 text-center text-sm mb-4">
          Rising together towards our goals
        </p>
        <div className="w-full bg-white/30 rounded-full h-4">
          <div
            className="bg-white h-4 rounded-full transition-all duration-500"
            style={{ width: `${communityProgress.percentage}%` }}
          />
        </div>
        <p className="text-center text-sunrise-100 mt-3 text-lg font-semibold">
          {communityProgress.percentage}% complete
        </p>
      </section>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Tab Section */}
      <section className="bg-white rounded-2xl shadow-sm p-4">
        <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
          <button
            onClick={() => setActiveTab('byUser')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'byUser'
                ? 'bg-white text-sunrise-600 shadow-sm'
                : 'text-warmGray-500 hover:text-warmGray-700'
            }`}
          >
            By User
          </button>
          <button
            onClick={() => setActiveTab('byResolution')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'byResolution'
                ? 'bg-white text-sunrise-600 shadow-sm'
                : 'text-warmGray-500 hover:text-warmGray-700'
            }`}
          >
            By Resolution
          </button>
        </div>

        {/* Empty State */}
        {resolutions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">No resolutions yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Be the first to add a goal!
            </p>
          </div>
        )}

        {/* Tab Content - By User */}
        {activeTab === 'byUser' && resolutions.length > 0 && (
          <div className="space-y-6">
            {Object.entries(resolutionsByUser).map(([userName, userResolutions]) => {
              const totalTarget = userResolutions.reduce((sum, r) => sum + r.target_value, 0);
              const totalCurrent = userResolutions.reduce((sum, r) => sum + r.current_value, 0);
              const userProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

              return (
                <div key={userName} className="space-y-3">
                  {/* User Header */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-medium">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-700">{userName}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, userProgress)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round(userProgress)}% overall progress
                    </p>
                  </div>

                  {/* User's Resolutions */}
                  <div className="space-y-2 pl-4">
                    {userResolutions.map((resolution) => (
                      <ResolutionCard
                        key={resolution.id}
                        title={resolution.title}
                        current_value={resolution.current_value}
                        target_value={resolution.target_value}
                        unit={resolution.unit}
                        category={resolution.category}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab Content - By Resolution */}
        {activeTab === 'byResolution' && resolutions.length > 0 && (
          <div className="space-y-3">
            {resolutions.map((resolution) => (
              <ResolutionCard
                key={resolution.id}
                title={resolution.title}
                user_name={resolution.user_name}
                current_value={resolution.current_value}
                target_value={resolution.target_value}
                unit={resolution.unit}
                category={resolution.category}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
