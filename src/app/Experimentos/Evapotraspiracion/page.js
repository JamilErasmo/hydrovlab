'use client';
import React from 'react';
import Link from "next/link";
import BackButton from "@/components/BackButton"; // Ajusta la ruta según la ubicación

const LluviaEscorrentia = () => {
  return (
    <div className="home">
            <BackButton />

      {/* Título */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Evapotranspiración</h2>

      {/* Contenedor de Botones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { href: "/blaney-criddle-global", label: "Blaney Criddle Global" },
          { href: "/blaney-criddle-parcial", label: "Blaney Criddle Parcial" },
          { href: "/blaney-criddle-parcial-perenne", label: "Blaney Criddle Parcial Perenne" },
          { href: "/hargreaves", label: "Hargreaves" },
          { href: "/penman", label: "Penman" },
          { href: "/thorwaite", label: "Thorwaite" },
          { href: "/turc", label: "Turc" },
          { href: "/balance-hidrico", label: "Balance Hídrico" }
        ].map((button, index) => (
          <Link key={index} href={button.href}>
            <button className="w-full px-5 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition">
              {button.label}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LluviaEscorrentia;
