'use client'
import { useState } from 'react';
import Link from 'next/link';

export default function RecursosAcademicos() {
  const [categoriaDocumentos, setCategoriaDocumentos] = useState('Todos');
  const [categoriaVideos, setCategoriaVideos] = useState('Todos');
  const [paginaActual, setPaginaActual] = useState('Documentos');

  const filtrarDocumentos = (categoria) => {
    return categoria === 'Todos'
      ? DOCUMENTOS
      : DOCUMENTOS.filter(documento => documento.category === categoria);
  };

  const filtrarVideos = (categoria) => {
    return categoria === 'Todos'
      ? VIDEOS
      : VIDEOS.filter(video => video.category === categoria);
  };
  const CATEGORIAS_DOCUMENTOS = ['Todos', 'Manuales', 'Simulaciones', 'Laboratorios'];
  const DOCUMENTOS = [
    { id: 1, title: 'Manual de Hidrología', description: 'Guía detallada sobre hidrología aplicada.', category: 'Manuales', year: 2020, author: 'Dr. Juan Pérez', link: '/recursos/manual-hidrologia.pdf' },
    { id: 2, title: 'Guía de Simulaciones', description: 'Instrucciones paso a paso para realizar simulaciones.', category: 'Simulaciones', year: 2021, author: 'Ing. María López', link: '/recursos/guia-simulaciones.pdf' },
    { id: 3, title: 'Prácticas de Laboratorio', description: 'Conjunto de prácticas para el laboratorio virtual.', category: 'Laboratorios', year: 2019, author: 'Dr. Carlos García', link: '/recursos/practicas-laboratorio.pdf' },
    { id: 4, title: 'Estudio de Caso de Hidrología', description: 'Análisis detallado de un caso de estudio en hidrología.', category: 'Manuales', year: 2021, author: 'Dr. Juan Pérez', link: '/recursos/estudio-caso-hidrologia.pdf' },
    { id: 5, title: 'Simulación Avanzada', description: 'Guía para realizar simulaciones avanzadas en hidrología.', category: 'Simulaciones', year: 2022, author: 'Ing. María López', link: '/recursos/simulacion-avanzada.pdf' },
    { id: 6, title: 'Laboratorio de Hidráulica', description: 'Prácticas de laboratorio enfocadas en hidráulica.', category: 'Laboratorios', year: 2020, author: 'Dr. Carlos García', link: '/recursos/laboratorio-hidraulica.pdf' }
  ];

  const CATEGORIAS_VIDEOS = ['Todos', 'Tutoriales', 'Conferencias', 'Entrevistas'];
  const VIDEOS = [
    {
      id: 1,
      title: 'Equilibrio',
      description: 'Video sobre el concepto de equilibrio en física.',
      category: 'Tutoriales',
      link: 'https://www.youtube.com/watch?v=BDBeQ6UHIgo',
      thumbnail: 'https://i.ytimg.com/vi/BDBeQ6UHIgo/hqdefault.jpg'
    },
    {
      id: 2,
      title: 'Rozamiento',
      description: 'Explicación sobre el concepto de rozamiento.',
      category: 'Tutoriales',
      link: 'https://www.youtube.com/watch?v=y0g1w7bE-Iw',
      thumbnail: 'https://i.ytimg.com/vi/y0g1w7bE-Iw/hqdefault.jpg'
    },
    {
      id: 3,
      title: 'Fuerzas en cables',
      description: 'Introducción a las fuerzas aplicadas en cables.',
      category: 'Tutoriales',
      link: 'https://www.youtube.com/watch?v=KeXg2n5yAcs',
      thumbnail: 'https://i.ytimg.com/vi/KeXg2n5yAcs/hqdefault.jpg'
    },
    {
      id: 4,
      title: 'Vectores fuerza',
      description: 'Video introductorio sobre vectores de fuerza.',
      category: 'Tutoriales',
      link: 'https://www.youtube.com/watch?v=airE-yaEKfI',
      thumbnail: 'https://i.ytimg.com/vi/airE-yaEKfI/hqdefault.jpg'
    },
    {
      id: 5,
      title: 'Análisis estructural',
      description: 'Tutorial sobre análisis estructural en ingeniería.',
      category: 'Tutoriales',
      link: 'https://www.youtube.com/watch?v=GRzE_NTfFzA',
      thumbnail: 'https://i.ytimg.com/vi/GRzE_NTfFzA/hqdefault.jpg'
    },
    {
      id: 6,
      title: 'Resultante de un sistema de fuerzas cont',
      description: 'Explicación sobre la resultante de un sistema de fuerzas.',
      category: 'Tutoriales',
      link: 'https://www.youtube.com/watch?v=9bAdIjVCb2M',
      thumbnail: 'https://i.ytimg.com/vi/9bAdIjVCb2M/hqdefault.jpg'
    },
    {
      id: 7,
      title: 'Vectores fuerza cont',
      description: 'Continuación del análisis de vectores fuerza.',
      category: 'Tutoriales',
      link: 'https://www.youtube.com/watch?v=bR-jxlbqswU',
      thumbnail: 'https://i.ytimg.com/vi/bR-jxlbqswU/hqdefault.jpg'
    },
    {
      id: 8,
      title: 'Resultante de un sistema de fuerzas',
      description: 'Tutorial sobre cómo calcular la resultante de fuerzas.',
      category: 'Tutoriales',
      link: 'https://www.youtube.com/watch?v=c4lgSDOkgO8',
      thumbnail: 'https://i.ytimg.com/vi/c4lgSDOkgO8/hqdefault.jpg'
    },
    {
      id: 9,
      title: 'Análisis estructural cont',
      description: 'Análisis estructural avanzado en ingeniería.',
      category: 'Tutoriales',
      link: 'https://www.youtube.com/watch?v=mZjMwR4a0dg',
      thumbnail: 'https://i.ytimg.com/vi/mZjMwR4a0dg/hqdefault.jpg'
    }
  ];

  const documentosFiltrados = filtrarDocumentos(categoriaDocumentos);
  const videosFiltrados = filtrarVideos(categoriaVideos);

  return (
    <section className="py-8 bg-gradient-to-r from-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold mb-2 text-blue-800">Recursos Académicos</h1>
          <p className="text-lg text-gray-800 mb-6">
            Encuentra aquí manuales, guías y otros recursos útiles para tus estudios.
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setPaginaActual('Documentos')}
            className={`px-4 py-2 mx-2 font-semibold rounded-lg transition-colors duration-300 ${paginaActual === 'Documentos' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
          >
            Documentos
          </button>
          <button
            onClick={() => setPaginaActual('Videos')}
            className={`px-4 py-2 mx-2 font-semibold rounded-lg transition-colors duration-300 ${paginaActual === 'Videos' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
          >
            Videos
          </button>
        </div>

        {paginaActual === 'Documentos' && (
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-4 text-blue-800 text-center">Documentos</h2>
            <div className="flex justify-center mb-4">
              <select
                value={categoriaDocumentos}
                onChange={(e) => setCategoriaDocumentos(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg shadow-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                {CATEGORIAS_DOCUMENTOS.map((categoria) => (
                  <option key={categoria} value={categoria} className="text-gray-600">
                    {categoria}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {documentosFiltrados.length > 0 ? (
                documentosFiltrados.map((documento) => (
                  <div key={documento.id} className="bg-white shadow-lg rounded-lg p-4 text-center transform transition-transform duration-300 hover:scale-105">
                    <img src="/images/pdf.png" alt="PDF Icon" className="w-16 h-16 mx-auto mb-3" />
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{documento.title}</h3>
                    <p className="text-gray-700 mb-3">{documento.description}</p>
                    <p className="text-gray-500 mb-3">Año: {documento.year}</p>
                    <p className="text-gray-500 mb-4">Autor: {documento.author}</p>
                    <Link href={documento.link} target="_blank" rel="noopener noreferrer">
                      <button className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-3 rounded-lg">
                        Ver documento
                      </button>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No se encontraron documentos en esta categoría.</p>
              )}
            </div>
          </div>
        )}

        {paginaActual === 'Videos' && (
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-4 text-blue-800 text-center">Videos</h2>
            <div className="flex justify-center mb-4">
              <select
                value={categoriaVideos}
                onChange={(e) => setCategoriaVideos(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg"
              >
                {CATEGORIAS_VIDEOS.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videosFiltrados.length > 0 ? (
                videosFiltrados.map((video) => (
                  <div key={video.id} className="bg-white shadow-lg rounded-lg p-4 text-center transform transition-transform duration-300 hover:scale-105">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover mb-3 rounded-lg" />
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{video.title}</h3>
                    <p className="text-gray-700 mb-3">{video.description}</p>
                    <Link href={video.link} target="_blank" rel="noopener noreferrer">
                      <button className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-3 rounded-lg">
                        Ver video
                      </button>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No se encontraron videos en esta categoría.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );

}

