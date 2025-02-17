"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  const router = useRouter();
  const [previousPage, setPreviousPage] = useState("");

  useEffect(() => {
    // Obtener historial desde localStorage
    const history = JSON.parse(localStorage.getItem("navigationHistory")) || [];
    
    if (history.length > 1) {
      setPreviousPage(history[history.length - 2]); // Última página visitada antes de la actual
    }
  }, []);

  const goBack = () => {
    router.back();
  };

  return (
    <button
      onClick={goBack}
       className="fixed top-4 left-4 flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition duration-300 ease-in-out"
    >
      <ArrowLeft className="w-5 h-5" />
      {previousPage ? `Volver a ${previousPage}` : "Volver"}
    </button>
  );
};

export default BackButton;
