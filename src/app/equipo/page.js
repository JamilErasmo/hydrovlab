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
        imagen: '/images/fernando.jpg'
    },
    {
        nombre: 'Luis Santiago Quiñones Cuenca',
        rol: 'Administrador Web',
        filiacion: 'Loja, UCG-UTPL (Campus San Cayetano)',
        telefono: '(593) 07 2570275 Ext: 2196',
        email: 'lsquinones@gmail.com',
        web: 'www.youtube.com/lsantiago84',
        descripcion: 'Luis gestiona la administración web del proyecto, asegurando la funcionalidad y eficiencia de la plataforma.',
        imagen: '/images/luis.jpg'
    },
    {
        nombre: 'Fredy Jipson Cueva Castillo',
        rol: 'Desarrollador',
        filiacion: 'Loja, UCG-UTPL (Campus San Cayetano) – Escuela de Ingeniería Civil',
        telefono: '(593) 07 2580884',
        celular: '(593) 85974360',
        email: 'fjcueva@gmail.com',
        responsabilidad: 'Análisis de correlación, relación lluvias escorrentías y simulación continua mediante el Modelo de Témez.',
        imagen: '/images/fredy.jpg'
    },
    {
        nombre: 'Jorge Fierro',
        rol: 'Desarrollador',
        filiacion: 'Loja, UCG-UTPL (Campus San Cayetano) – Escuela de Sistemas',
        email: 'joafierro@gmail.com',
        responsabilidad: 'Laboratorio Virtual de Hidrología.',
        imagen: '/images/jorge.jpg'
    },
    {
        nombre: 'Marco Cueva Moreno',
        rol: 'Desarrollador',
        filiacion: 'Loja, UCG-UTPL (Campus San Cayetano) – Escuela de Ingeniería Civil',
        email: 'macumo69@hotmail.com',
        responsabilidad: 'Tránsito de Crecidas.',
        imagen: '/images/marco.jpg'
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
        imagen: '/images/manuel.jpg'
    },
    {
        nombre: 'Byron Rivadeneira',
        rol: 'Desarrollador',
        filiacion: 'Loja, UCG-UTPL (Campus San Cayetano) – Escuela de Ingeniería Civil',
        email: 'geovannybyron@gmail.com',
        responsabilidad: 'Infiltración.',
        imagen: '/images/byron.jpg'
    },
    {
        nombre: 'Luis Miguel Granda Agila',
        rol: 'Desarrollador',
        filiacion: 'Loja, UCG-UTPL (Campus San Cayetano) - Ingeniería en Computación',
        email: 'luisgranda1605@gmail.com',
        responsabilidad: 'Laboratorio Virtual de Hidrología.',
        imagen: '/images/luis_miguel.jpg'
    }
];


export default function Equipo() {
    return (
        <section className="py-16 bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-8 text-blue-700">Nuestro equipo</h2>
                    <p className="text-lg text-gray-700 mb-16">
                        Conoce al equipo de profesionales que ha desarrollado esta plataforma.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {equipo.map((miembro, index) => (
                        <div key={index} className="bg-white shadow-lg rounded-lg p-6 text-center">
                            <div className="relative w-40 h-40 mx-auto mb-4">
                                <Image
                                    src={miembro.imagen}
                                    alt={miembro.nombre}
                                    layout="fill"
                                    className="rounded-full object-cover"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{miembro.nombre}</h3>
                            <p className="text-blue-600 font-semibold mb-2">{miembro.rol}</p>
                            <p className="text-gray-700 mb-2">{miembro.filiacion}</p>
                            {miembro.telefono && <p className="text-gray-600 mb-1">Teléfono: {miembro.telefono}</p>}
                            {miembro.celular && <p className="text-gray-600 mb-1">Celular: {miembro.celular}</p>}
                            <p className="text-gray-600 mb-2">Email: <a href={`mailto:${miembro.email}`} className="text-blue-500 underline">{miembro.email}</a></p>
                            {miembro.web && (
                                <p className="text-gray-600 mb-2">
                                    Web: <a href={miembro.web} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{miembro.web}</a>
                                </p>
                            )}
                            {miembro.responsabilidad && (
                                <p className="text-gray-700 italic mt-4"><strong>Resposable de :</strong>{miembro.responsabilidad}</p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="py-20">
                    <p className="text-lg text-gray-700 mb-6 font-medium">
                        Somos un equipo de estudiantes apasionados de la Universidad Técnica Particular de Loja (UTPL),
                        comprometidos en llevar a cabo proyectos innovadores que aporten al desarrollo académico y tecnológico.
                    </p>
                    <p className="text-lg text-gray-700 mb-6 font-medium">
                        Este proyecto es parte de nuestro trabajo curricular, donde hemos dedicado tiempo, esfuerzo y creatividad
                        para ofrecer una plataforma de calidad que promueva el aprendizaje y la colaboración en el área de hidrología.
                    </p>
                </div>


            </div>
        </section>
    );
}
