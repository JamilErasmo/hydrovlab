'use client'
import { API_URL } from '../../config';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

async function getBlogById(id) {
  const res = await fetch(`${API_URL}/blogs/${id}?populate=author`);
  if (!res.ok) {
    throw new Error('Error al obtener el blog');
  }

  const { data } = await res.json();

  const blog = {
    id: data.documentId,
    title: data.title,
    summary: data.summary,
    Content: data.Content,
    PublicationDate: data.PublicationDate,
    author: data.author?.name || 'Autor desconocido',
  };

  return blog;
}

export default async function BlogPost({ params }) {
  const blog = await getBlogById(params.id);

  return (
    <div className="py-16">
      <article className="py-16 bg-gray-100 text-gray-800 max-w-4xl mx-auto p-8 lg:p-12 shadow-lg rounded-lg">
        {/* Título */}
        <header className="text-center">
          <h1 className="text-3xl font-bold text-blue-700">{blog.title}</h1>
          <p className="mt-2 text-sm text-gray-500">
            Publicado el <span className="font-medium">{blog.PublicationDate}</span> por{' '}
            <span className="font-medium">{blog.author}</span>
          </p>
        </header>

        {/* Imagen de portada */}
        <div className="mt-8">
          <Image
            src="/images/Blog-paisaje.png"
            alt={`Imagen de portada de ${blog.title}`}
            width={1000} // Ajusta según necesites
            height={400} // Ajusta según necesites
            className="rounded-lg shadow-md"
          />
        </div>

        {/* Resumen */}
        {blog.summary && (
          <div className="mt-6 text-center text-lg italic text-gray-600 bg-gray-200 p-4 rounded-md">
            <p>{blog.summary}</p>
          </div>
        )}

        {/* Contenido */}
        <section className="mt-10 leading-relaxed text-lg text-gray-700 whitespace-pre-line">
          <p>{blog.Content}</p>
        </section>

        {/* Autor */}
        <footer className="mt-12">
          <div className="flex items-center space-x-4 border-t border-gray-300 pt-6">
            <div className="bg-blue-500 w-12 h-12 flex items-center justify-center rounded-full text-white font-bold">
              {blog.author.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Escrito por <span className="font-semibold">{blog.author}</span>
              </p>
              <p className="text-xs text-gray-500">Publicado el {blog.PublicationDate}</p>
            </div>
          </div>
        </footer>

        {/* Botón para editar */}
        <div className="mt-10 flex justify-center">
          <Link href={`/blog-tecnico/${blog.id}/edit`}>
            <button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-900 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
              Editar blog
            </button>
          </Link>
        </div>
      </article>

      {/* Puntuación del Blog */}
      <div className="mt-12 bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">¿Qué te pareció este blog?</h2>
        <RatingSection />
      </div>
    </div>
  );
}

function RatingSection() {
  const [rating, setRating] = useState(null);

  const handleRating = (value) => {
    setRating(value);
    // Aquí puedes agregar lógica para enviar la puntuación al servidor
    console.log(`Puntuación seleccionada: ${value}`);
  };

  return (
    <div className="flex justify-center space-x-4">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          onClick={() => handleRating(value)}
          className={`w-12 h-12 flex items-center justify-center rounded-full font-bold text-white transition transform hover:scale-110 shadow-md ${
            rating >= value ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          {value}
        </button>
      ))}
      {rating && (
        <p className="text-lg font-medium text-gray-700 ml-4">¡Gracias por tu puntuación!</p>
      )}
    </div>
  );
}