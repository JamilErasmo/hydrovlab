'use client';
// 1. pages/index.js
import Head from 'next/head';
import { useState } from 'react';
import InputForm from '../../../components/InputForm';
import Results from '../../../components/Results';

export default function Home() {
  const [results, setResults] = useState(null);

  return (
    <>
      <Head>
        <title>Modelo de Témez</title>
        <meta name="description" content="Simulador del Modelo de Témez" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-100 p-6">
        {/* Título principal */}
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            Simulador del Modelo de Témez
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Realiza simulaciones y visualiza los resultados de manera interactiva.
          </p>
        </div>

        {/* Formulario de entrada */}
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg mt-6 p-6">
          <InputForm setResults={setResults} />
        </div>

        {/* Resultados */}
        {results && (
          <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg mt-6 p-6">
            <Results results={results} />
          </div>
        )}
      </main>
    </>
  );
}