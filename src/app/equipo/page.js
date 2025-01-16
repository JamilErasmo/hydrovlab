import Image from 'next/image';

const equipo = [
    
    {

        nombre: 'Fernando Rodrigo Oñate Valdivieso',
        rol: 'Director del Proyecto',
        filiacion: 'Loja, UCG-UTPL (Campus San Cayetano)',
        telefono: '(593) 07 2570275 Ext: 2613',
        email: 'fronate.v@gmail.com',
        web: 'www.fronate.pro.ec',
        descripcion: 'Fernando lidera el proyecto con experiencia en dirección y manejo de equipos multidisciplinarios.',
        imagen: '/images/Oñate.jpg'
    },
    {
        nombre: 'Luis Santiago Quiñones Cuenca',
        rol: 'Administrador Web',
        filiacion: 'Loja, UCG-UTPL (Campus San Cayetano)',
        telefono: '(593) 07 2570275 Ext: 2196',
        email: 'lsquinones@gmail.com',
        web: 'www.youtube.com/lsantiago84',
        descripcion: 'Luis gestiona la administración web del proyecto, asegurando la funcionalidad y eficiencia de la plataforma.',
        imagen: '/images/santiago.jpg'
    },
    {
        nombre: 'Fredy Jipson Cueva Castillo',
        rol: 'Desarrollador',
        filiacion: 'Loja, UCG-UTPL (Campus San Cayetano) – Escuela de Ingeniería Civil',
        telefono: '(593) 07 2580884',
        celular: '(593) 85974360',
        email: 'fjcueva@gmail.com',
        responsabilidad: 'Análisis de correlación, relación lluvias escorrentías y simulación continua mediante el Modelo de Témez.',
        imagen: '/images/Fredy.png'
    },
    {
        nombre: 'Jorge Fierro',
        rol: 'Desarrollador',
        filiacion: 'Loja, UCG-UTPL (Campus San Cayetano) – Escuela de Sistemas',
        email: 'joafierro@gmail.com',
        responsabilidad: 'Laboratorio Virtual de Hidrología.',
        imagen: '/images/Jorge.jpg'
    },
    {
        nombre: 'Marco Cueva Moreno',
        rol: 'Desarrollador',
        filiacion: 'Loja, UCG-UTPL (Campus San Cayetano) – Escuela de Ingeniería Civil',
        email: 'macumo69@hotmail.com',
        responsabilidad: 'Tránsito de Crecidas.',
        imagen: '/images/marco-cueva.jpg'
    },
    {
        nombre: 'Mario German Ordoñez Gonzaga',
        rol: 'Desarrollador',
        filiacion: 'Loja, UCG-UTPL (Campus San Cayetano) – Escuela de Ingeniería Civil',
        email: 'mgordg@gmail.com',
        responsabilidad: 'Análisis y Diseño de Encauzamiento.',
        imagen: '/images/mario.jpg'
    },
    {
        nombre: 'Manuel Minga',
        rol: 'Desarrollador',
        filiacion: 'Loja, UCG-UTPL (Campus San Cayetano) – Escuela de Ingeniería Civil',
        email: 'maminga1@hotmail.com',
        responsabilidad: 'Análisis Probabilístico.',
        imagen: '/images/ManuelMinga.jpg'
    },
    {
        nombre: 'Byron Rivadeneira',
        rol: 'Desarrollador',
        filiacion: 'Loja, UCG-UTPL (Campus San Cayetano) – Escuela de Ingeniería Civil',
        email: 'geovannybyron@gmail.com',
        responsabilidad: 'Infiltración.',
        imagen: '/images/ByronRivadeneira.jpg'
    },
    {
        nombre: 'Luis Miguel Granda Agila',
        rol: 'Desarrollador',
        filiacion: 'Loja, UCG-UTPL (Campus San Cayetano) - Ingeniería en Computación',
        email: 'luisgranda1605@gmail.com',
        responsabilidad: 'Laboratorio Virtual de Hidrología.',
        imagen: '/images/luis_miguel.jpg'
    },
    {

        nombre: 'Jamil Erasmo Quituizaca Jaramillo',
        rol: 'Desarrollador',
        filiacion: 'Loja, UCG-UTPL (Campus San Cayetano) - Ingeniería en Computación',
        telefono: '(593) 996197628',
        email: 'jamilerasmoq@gmail.com',
        descripcion: 'Soy una persona sencilla y amigable, me gusta aprender cosas nuevas y compartir mis conocimientos con los demás.',
        imagen: '/images/jamil.png'
    },
];


export default function Equipo() {
    return (
        <section className="py-16 bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Encabezado */}
                <div className="text-center">
                    <h2 className="text-4xl font-extrabold mb-6 text-blue-700">Nuestro equipo</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Somos un equipo de estudiantes apasionados de la Universidad Técnica Particular de Loja (UTPL),
                        comprometidos con proyectos innovadores para fomentar el desarrollo académico y tecnológico.
                    </p>
                </div>

                {/* Descripción */}
                <div className="py-12 text-center">
                    <p className="text-lg text-gray-700 mb-4 font-medium leading-relaxed">
                        Este proyecto es parte de nuestro trabajo curricular, donde hemos dedicado tiempo, esfuerzo y creatividad
                        para ofrecer una plataforma de calidad que promueva el aprendizaje y la colaboración en el área de hidrología.
                    </p>
                </div>

                {/* Tarjetas del equipo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                    {equipo.map((miembro, index) => (
                        <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden transform transition-transform hover:scale-105">
                            {/* Imagen del miembro */}
                            <div className="relative w-32 h-32 mx-auto mt-6">
                                <Image
                                    src={miembro.imagen}
                                    alt={miembro.nombre}
                                    layout="fill"
                                    className="rounded-full object-cover"
                                />
                            </div>

                            {/* Información */}
                            <div className="p-6 text-center">
                                <h3 className="text-xl font-semibold text-gray-900">{miembro.nombre}</h3>
                                <p className="text-blue-600 font-medium">{miembro.rol}</p>
                                <p className="text-gray-700 mt-2">{miembro.filiacion}</p>

                                {/* Información de contacto */}
                                {miembro.telefono && <p className="text-gray-600">Teléfono: {miembro.telefono}</p>}
                                {miembro.celular && <p className="text-gray-600">Celular: {miembro.celular}</p>}
                                <p className="text-gray-600">
                                    Email: <a href={`mailto:${miembro.email}`} className="text-blue-500 underline">{miembro.email}</a>
                                </p>
                                {miembro.web && (
                                    <p className="text-gray-600">
                                        Web: <a href={miembro.web} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{miembro.web}</a>
                                    </p>
                                )}

                                {/* Responsabilidad */}
                                {miembro.responsabilidad && (
                                    <p className="text-gray-700 italic mt-4">
                                        <strong>Responsable de:</strong> {miembro.responsabilidad}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

