'use client';

import { useState } from 'react';

export default function Home() {
  const [quote, setQuote] = useState('');
  const [source, setSource] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const verifyQuote = async () => {
    if (!quote || !source) return;
    setLoading(true);
    
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quote, source }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    }
    
    setLoading(false);
  };

  const handleCheckout = async (type: 'single' | 'subscription') => {
    const endpoint = type === 'single' ? '/api/checkout' : '/api/subscribe';
    try {
      const res = await fetch(endpoint, { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-5xl font-bold mb-2">QuoteVerify</h1>
      <h2 className="text-2xl text-gray-600 mb-8">Never Publish a Fake Quote Again</h2>
      
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-semibold mb-4">Verify a Quote</h3>
        <textarea
          className="w-full p-4 border rounded-lg mb-4 text-black"
          rows={4}
          placeholder="Paste the quote you want to verify..."
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
        />
        <textarea
          className="w-full p-4 border rounded-lg mb-4 text-black"
          rows={8}
          placeholder="Paste the source text (article, transcript, document)..."
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
        <button
          onClick={verifyQuote}
          disabled={loading}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Verify Quote ($1)'}
        </button>
      </div>

      {result && (
        <div className={`p-6 rounded-lg mb-8 ${result.found ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <h3 className="text-xl font-semibold mb-2">
            {result.found ? '✅ Quote Verified' : '❌ Quote Not Found'}
          </h3>
          <p className="mb-2"><strong>Confidence:</strong> {result.confidence}%</p>
          <p className="mb-2"><strong>Reasoning:</strong> {result.reasoning}</p>
          {result.context && (
            <div className="mt-4 p-4 bg-white rounded border">
              <strong>Context:</strong>
              <p className="mt-2 text-gray-700">{result.context}</p>
            </div>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-2">Pay Per Use</h3>
          <p className="text-4xl font-bold text-blue-600 mb-4">$1</p>
          <p className="text-gray-600 mb-4">per quote verification</p>
          <button
            onClick={() => handleCheckout('single')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Buy Credits
          </button>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg text-center border-2 border-blue-200">
          <h3 className="text-xl font-semibold mb-2">Unlimited</h3>
          <p className="text-4xl font-bold text-blue-600 mb-4">$29</p>
          <p className="text-gray-600 mb-4">per month</p>
          <button
            onClick={() => handleCheckout('subscription')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Subscribe
          </button>
        </div>
      </div>
    </main>
  );
}
