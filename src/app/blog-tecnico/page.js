'use client'
import useSWR, { mutate } from 'swr';
import { API_URL } from '../config';
import Link from 'next/link';

// Función para hacer el fetch de los blogs
const fetcher = (url) => fetch(url).then((res) => res.json());

// Número de blogs por página
const PAGE_SIZE = 6;

export default function Blog({ searchParams }) {
  const page = parseInt(searchParams.page) || 1;

  // Usamos SWR para obtener los blogs y refrescarlos automáticamente
  const { data, error, isLoading } = useSWR(`${API_URL}/blogs?populate=author&pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}`, fetcher, {
    revalidateOnFocus: true,  // Revalida al volver a enfocar la página
    refreshInterval: 10000,  // Refresca automáticamente cada 10 segundos
  });

  if (isLoading) return <div>Cargando blogs...</div>;
  if (error) return <div>Error al cargar los blogs.</div>;

  const blogs = data?.data || [];
  const totalPages = data?.meta?.pagination?.pageCount || 1;

  // Función para forzar la actualización de los blogs después de crear uno nuevo
  const handleBlogCreation = async () => {
    // Lógica para crear un nuevo blog
    // Una vez creado, usamos mutate para actualizar la lista de blogs
    await mutate(`${API_URL}/blogs?populate=author&pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}`);
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-4 w-full flex justify-end">
          <Link href="/blog-tecnico/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Crear nuevo blog
          </Link>
        </div>
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4 text-blue-700">Blog Técnico</h2>
          <p className="text-lg text-gray-700 mb-16">
            Explora nuestros artículos y guías sobre hidrología, simulaciones y temas técnicos relevantes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">
                {blog.title || 'Sin título'}
              </h3>
              <p className="text-gray-700 mb-4">
                {blog.summary || 'Sin resumen'}
              </p>
              <div className="text-sm text-gray-500 mb-4">
                <span>Por {blog.author?.name || 'Autor desconocido'}</span>
              </div>
              <Link href={`/blog-tecnico/${blog.documentId}`} className="text-blue-500 hover:text-blue-700 font-medium">
                Leer más
              </Link>
            </div>
          ))}
        </div>

        {/* Paginación */}
        <div className="mt-8 flex justify-center items-center space-x-4">
          {page > 1 && (
            <Link href={`/blog-tecnico?page=${page - 1}`}>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Anterior
              </button>
            </Link>
          )}

          <span>Página {page} de {totalPages}</span>

          {page < totalPages && (
            <Link href={`/blog-tecnico?page=${page + 1}`}>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Siguiente
              </button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
