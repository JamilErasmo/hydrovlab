import Image from 'next/image';

const equipo = [
    {
        nombre: 'Juan Pérez',
        rol: 'Desarrollador Full Stack',
        descripcion: 'Juan es un apasionado de la tecnología con experiencia en el desarrollo de aplicaciones web y móviles.',
        imagen: '/images/juan.jpg',
    },
    {
        nombre: 'Ana Gómez',
        rol: 'Diseñadora UI/UX',
        descripcion: 'Ana se especializa en la creación de interfaces de usuario amigables y atractivas.',
        imagen: '/images/ana.jpg',
    },
    {
        nombre: 'Carlos Fernández',
        rol: 'Ingeniero DevOps',
        descripcion: 'Carlos es experto en infraestructura y automatización de despliegues con más de 10 años de experiencia.',
        imagen: '/images/carlos.jpg',
    },
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
                            <p className="text-blue-600 mb-2">{miembro.rol}</p>
                            <p className="text-gray-700">{miembro.descripcion}</p>
                        </div>
                    ))}
                </div>
                <div className ="py-20">
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
