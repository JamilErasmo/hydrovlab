'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';  // Importar useRouter
import { API_URL } from '../../config';  // Asegúrate de que esta URL esté configurada correctamente

export default function CreateBlog() {
  const router = useRouter();  // Instanciar useRouter para redirección
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    Content: '',
    PublicationDate: '',
    author: '',  // Este debería ser el ID del autor seleccionado del dropdown
  });
  const [authors, setAuthors] = useState([]);  // Estado para almacenar los autores
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Obtener los autores de la API cuando el componente se monta
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const res = await fetch(`${API_URL}/authors`);  // Asegúrate de que el endpoint esté correcto
        const { data } = await res.json();
        setAuthors(data);
      } catch (error) {
        console.error('Error al obtener los autores:', error);
      }
    };

    fetchAuthors();
  }, []);

  // Manejar el cambio en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Enviar los datos del formulario a Strapi
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Crear el objeto data con la información del blog
    const blogData = {
      title: formData.title,
      summary: formData.summary,
      Content: formData.Content,
      PublicationDate: formData.PublicationDate,
      author: formData.author,  // Asegúrate de que sea el ID del autor si es una relación
    };

    try {
      // Enviar la solicitud POST a Strapi con el JSON
      const res = await fetch(`${API_URL}/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: blogData }),
      });

      const result = await res.json();  // Obtener la respuesta en formato JSON

      // Imprimir la respuesta en la consola para verificar los datos enviados y recibidos
      console.log('Datos enviados:', blogData);
      console.log('Respuesta del servidor:', result);

      if (!res.ok) {
        console.error('Error en la solicitud:', result);
        throw new Error('Error al enviar el blog');
      }

      setSuccessMessage('Blog creado exitosamente.');

      // Redirigir a la página de blogs después de la creación
      setTimeout(() => {
        router.push('/blog-tecnico');  // Ajusta esta ruta según tu estructura
      }, 1500);

    } catch (error) {
      console.error('Error al hacer POST:', error.message);
      alert('Error al crear el blog. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-14">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Crear nuevo blog</h1>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo para el título */}
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

          {/* Campo para el resumen */}
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

          {/* Campo para el contenido */}
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

          {/* Campo para la fecha de publicación */}
          <div>
            <label htmlFor="PublicationDate" className="block text-sm font-medium text-gray-700">
              Fecha de Publicación
            </label>
            <input
              type="date"
              id="PublicationDate"
              name="PublicationDate"
              value={formData.PublicationDate}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Seleccionar el autor */}
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700">
              Autor
            </label>
            <select
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Selecciona un autor</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>

          {/* Botón de enviar */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {loading ? 'Enviando...' : 'Crear Blog'}
            </button>
          </div>
        </form>

        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="mt-6 text-green-600 font-bold">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
}
