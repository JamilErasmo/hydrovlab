import { API_URL } from '../../config';
import Link from 'next/link';
async function getBlogById(id) {
  const res = await fetch(`${API_URL}/blogs/${id}?populate=author`);
  if (!res.ok) {
    throw new Error('Error al obtener el blog');
  }

  const { data } = await res.json();

  // Extraemos los atributos directamente en el objeto `blog` para evitar usar `attributes`
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
    <article className="bg-white text-gray-800 max-w-7xl mx-auto p-6 lg:px-8">
      {/* Título */}
      <header className="mt-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">{blog.title}</h1>
        <p className="mt-4 text-sm text-gray-500">Publicado el {blog.PublicationDate}</p>
        <p className="mt-2 text-sm text-gray-500">Por {blog.author}</p>
      </header>

      {/* Resumen */}
      {blog.summary && (
        <div className="mt-8 text-center text-xl font-light text-gray-600">
          <p>{blog.summary}</p>
        </div>
      )}

      {/* Contenido */}
      <section className="mt-12 leading-relaxed text-lg">
        <p className="text-gray-700 whitespace-pre-line">{blog.Content}</p>
      </section>

      {/* Autor */}
      <footer className="mt-16">
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Escrito por {blog.author}
              </p>
              <p className="text-xs text-gray-500">Publicado el {blog.PublicationDate}</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Enlace para editar el blog */}
      <div className="mt-8 flex justify-center">
        <Link href={`/blog-tecnico/${blog.id}/edit`}>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Editar blog
          </button>
        </Link>
      </div>
    </article>
  );
}
