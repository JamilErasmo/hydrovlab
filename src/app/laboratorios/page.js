import Link from 'next/link';

export default function Simulaciones() {
    const categorias = [
        'Análisis estocástico',
        'Evapotranspiración',
        'Hidráulica de Pozos',
        'Infiltrado',
        'Lluvia escorrentía',
        'Modelo de Lluvia Escorrentía',
        'Producción de sedimentos',
        'Simulación continua',
        'Tránsito de Avenidas',
        'Transporte de sedimentos',
    ];

    const simulaciones = [
        {
            id: 1,
            title: 'Balance Hídrico',
            description: 'Realiza la simulación del balance hídrico considerando diferentes factores y parámetros de la cuenca. Foro',
            link: '/Experimentos/BalanceHidrico',
        },
        {
            id: 2,
            title: 'Blaney Criddle Global',
            description: 'Simulación para calcular la evapotranspiración utilizando el método global de Blaney-Criddle. Foro',
            link: '/Experimentos/BlaneyCriddleGlobal',
        },
        {
            id: 3,
            title: 'Blaney Criddle Parcial',
            description: 'Simulación del método de Blaney-Criddle para diferentes periodos parciales de tiempo. Foro',
            link: '/Experimentos/BlaneyCriddleParcial',
        },
        {
            id: 4,
            title: 'Blaney Criddle Parcial Perenne',
            description: 'Simulación del método de Blaney-Criddle para cultivos perennes y análisis de evapotranspiración. Foro',
            link: '/Experimentos/BlaneyCriddleParcialPerenne',
        },
        {
            id: 5,
            title: 'Efecto de la Tormenta',
            description: 'Simula el efecto de la tormenta utilizando hidrogramas para análisis de inundaciones. Foro',
            link: '/Experimentos/EfectoTormenta',
        },
        {
            id: 6,
            title: 'Hargreaves',
            description: 'Simulación del método de Hargreaves para el cálculo de evapotranspiración. Foro',
            link: '/Experimentos/Hargreaves',
        },
        {
            id: 7,
            title: 'Penman',
            description: 'Análisis y simulación utilizando el método de Penman para determinar la evapotranspiración potencial. Foro',
            link: '/Experimentos/Penman',
        },
        {
            id: 8,
            title: 'Thorwaite',
            description: 'Simulación del método de Thorwaite para estimar la evapotranspiración a partir de datos climáticos. Foro',
            link: '/Experimentos/Thorwaite',
        },
        {
            id: 9,
            title: 'Turc',
            description: 'Simulación del método de Turc para estimar la evapotranspiración basada en datos meteorológicos. Foro',
            link: '/Experimentos/Turc',
        },
    ];
    
    return (
        <section className="py-16 bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Menú lateral de categorías */}
                    <div className="bg-white shadow-lg rounded-lg p-6 ">
                        <h2 className="text-2xl font-bold mb-6 text-blue-700">Simulación</h2>
                        <ul>
                            {categorias.map((categoria, index) => (
                                <li key={index} className="mb-4 ">
                                    <Link href="#" className="text-gray-700 hover:text-blue-700">
                                        {categoria}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Aplicaciones existentes */}
                    <div className="lg:col-span-3">
                        <h2 className="text-2xl font-bold mb-6 text-blue-700">Aplicaciones existentes</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {simulaciones.map((simulacion) => (
                                <div key={simulacion.id} className="bg-white shadow-lg rounded-lg p-6">
                                    <h3 className="text-xl font-bold mb-2 text-gray-900">{simulacion.title}</h3>
                                    <p className="text-gray-700 mb-4">{simulacion.description}</p>

                                    {/* Botón para acceder a la página Efecto de la Precipitación */}
                                    <div className="mb-8">
                                        <Link href={simulacion.link}>
                                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                                Efecto de la Precipitación
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </section >
    );
}
