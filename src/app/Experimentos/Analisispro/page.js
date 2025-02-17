import React from 'react';
import Link from 'next/link';

const AnalisisProbabilisticoMenu = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-4">Análisis Probabilístico</h2>
      <p className="text-center text-gray-700 text-lg mb-6 max-w-2xl mx-auto">
        El análisis probabilístico es una herramienta fundamental para entender y modelar la incertidumbre en diversos contextos.
        En esta sección, tendrás la oportunidad de trabajar con funciones de distribución de probabilidad, que permiten describir
        matemáticamente fenómenos aleatorios, y realizar pruebas de bondad de ajuste, esenciales para evaluar si un conjunto de datos
        sigue una distribución esperada. Estas herramientas son ideales para fortalecer tus conocimientos en estadística y
        resolver problemas prácticos basados en datos.
      </p>
      <div className="box border border-gray-300 rounded-lg p-6 shadow-lg max-w-4xl mx-auto">
        <div className="buttons grid grid-cols-2 gap-12 justify-center items-start">
          <div className="flex flex-col items-center">
            <Link
              href="/Experimentos/Analisispro/Distribucion-Probabilidad"
              className="px-6 py-4 text-lg font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all mb-6"
            >
              Funciones de Distribución de Probabilidad
            </Link>
            <p className="text-gray-600 text-base text-center max-w-sm">
              <strong>Descripción: </strong>Explora las principales funciones de distribución de probabilidad y su uso para modelar eventos aleatorios en tus experimentos.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Link
              href="/Experimentos/Analisispro/Bondad-Ajuste"
              className="px-6 py-4 text-lg font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all mb-6"
            >
              Prueba de Bondad de Ajuste
            </Link>
            <p className="text-gray-600 text-base text-center max-w-sm">
              <strong>Descripción: </strong>Realiza pruebas estadísticas para verificar si tus datos se ajustan a una distribución esperada, usando metodologías estándar.
            </p>
          </div>
        </div>
      </div>
    </div>






  );
};
export default AnalisisProbabilisticoMenu;