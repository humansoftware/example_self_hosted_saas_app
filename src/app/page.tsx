'use client';

import { useState } from 'react';

export default function Home() {
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dbResponse, setDbResponse] = useState<any>(null);
  const [cassandraResponse, setCassandraResponse] = useState<any>(null);
  const [elasticResponse, setElasticResponse] = useState<any>(null);

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

  const testCassandra = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cassandratest');
      const data = await response.json();
      setCassandraResponse(data);
    } catch (error) {
      setCassandraResponse({ error: 'Failed to fetch from Cassandra API' });
    }
    setLoading(false);
  };

  const testElastic = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/elastictest');
      const data = await response.json();
      setElasticResponse(data);
    } catch (error) {
      setElasticResponse({ error: 'Failed to fetch from Elastic API' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <main className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your Self-Hosted Application!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            This application is successfully deployed on your self-hosted k3s cluster.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="p-4">Test</th>
                <th className="p-4">Result</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-4">
                  <button
                    onClick={testApi}
                    disabled={loading}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                  >
                    {loading ? 'Testing...' : 'Test API'}
                  </button>
                </td>
                <td className="p-4">
                  {apiResponse && (
                    <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-2 rounded-md">
                      {JSON.stringify(apiResponse, null, 2)}
                    </pre>
                  )}
                </td>
              </tr>
              <tr className="border-t">
                <td className="p-4">
                  <button
                    onClick={testDb}
                    disabled={loading}
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:bg-green-400"
                  >
                    {loading ? 'Testing...' : 'Test DB'}
                  </button>
                </td>
                <td className="p-4">
                  {dbResponse && (
                    <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-2 rounded-md">
                      {JSON.stringify(dbResponse, null, 2)}
                    </pre>
                  )}
                </td>
              </tr>
              <tr className="border-t">
                <td className="p-4">
                  <button
                    onClick={testCassandra}
                    disabled={loading}
                    className="bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors disabled:bg-yellow-400"
                  >
                    {loading ? 'Testing...' : 'Test Cassandra'}
                  </button>
                </td>
                <td className="p-4">
                  {cassandraResponse && (
                    <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-2 rounded-md">
                      {JSON.stringify(cassandraResponse, null, 2)}
                    </pre>
                  )}
                </td>
              </tr>
              <tr className="border-t">
                <td className="p-4">
                  <button
                    onClick={testElastic}
                    disabled={loading}
                    className="bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors disabled:bg-teal-400"
                  >
                    {loading ? 'Testing...' : 'Test Elasticsearch'}
                  </button>
                </td>
                <td className="p-4">
                  {elasticResponse && (
                    <>
                      <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-2 rounded-md mb-2">
                        {JSON.stringify(elasticResponse, null, 2)}
                      </pre>
                      {elasticResponse.debugInfo && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-xs text-gray-500">Show debug info</summary>
                          <pre className="whitespace-pre-wrap text-xs bg-gray-100 p-2 rounded-md">
                            {JSON.stringify(elasticResponse.debugInfo, null, 2)}
                          </pre>
                        </details>
                      )}
                    </>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
