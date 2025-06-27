'use client';

import { useState } from 'react';

export default function Home() {
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dbResponse, setDbResponse] = useState<any>(null);

  const testApi = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/hello');
      const data = await response.json();
      setApiResponse(data);
    } catch (error) {
      setApiResponse({ error: 'Failed to fetch from API' });
    }
    setLoading(false);
  };

  const testDb = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/dbtest');
      const data = await response.json();
      setDbResponse(data);
    } catch (error) {
      setDbResponse({ error: 'Failed to fetch from DB API' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <main className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your Self-Hosted Application!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            This application is successfully deployed on your self-hosted k3s cluster.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <button
            onClick={testApi}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {loading ? 'Testing API...' : 'Test API Connection'}
          </button>

          <button
            onClick={testDb}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:bg-green-400 mt-4"
          >
            {loading ? 'Testing DB...' : 'Test DB Connection'}
          </button>

          {apiResponse && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <h2 className="text-lg font-semibold mb-2">API Response:</h2>
              <pre className="whitespace-pre-wrap text-sm">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          )}

          {dbResponse && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <h2 className="text-lg font-semibold mb-2">DB API Response:</h2>
              <pre className="whitespace-pre-wrap text-sm">
                {JSON.stringify(dbResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
