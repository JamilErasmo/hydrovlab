'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';  // Para redirigir después de editar
import { API_URL } from '../../../config';

// Función para hacer fetch del blog específico
const fetcher = async (id) => {
  const res = await fetch(`${API_URL}/blogs/${id}?populate=author`);
  if (!res.ok) {
    throw new Error('Error al obtener el blog');
  }
  const { data } = await res.json();
  return data;
};

export default function EditBlog({ params }) {
  const router = useRouter();
  const { id } = params;
  
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    Content: '',
  });

  const [blog, setBlog] = useState(null);

  // Usamos useEffect para obtener los datos del blog
  useEffect(() => {
    const getBlogData = async () => {
      const data = await fetcher(id);
      setBlog(data);  // Guardar los datos del blog
      setFormData({
        title: data.title,
        summary: data.summary,
        Content: data.Content,
      });
    };
    getBlogData();
  }, [id]);

  // Función para manejar los cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Función para actualizar el blog
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/blogs/${id}`, {
        method: 'PUT',  // Usamos PUT para actualizar
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: formData }),  // Actualizamos con los datos del formulario
      });

      if (!res.ok) {
        throw new Error('Error al actualizar el blog.');
      }

      // Redirigir a la página del blog después de actualizar
      router.push(`/blog-tecnico/${id}`);

    } catch (error) {
      console.error('Error al actualizar:', error.message);
    }
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Editar blog</h1>

        {blog ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Título
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                Resumen
              </label>
              <input
                type="text"
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label htmlFor="Content" className="block text-sm font-medium text-gray-700">
                Contenido
              </label>
              <textarea
                id="Content"
                name="Content"
                value={formData.Content}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                rows="6"
              />
            </div>

            <div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        ) : (
          <p>Cargando datos del blog...</p>
        )}
      </div>
    </section>
  );
}
