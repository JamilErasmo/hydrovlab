import * as XLSX from 'xlsx';

/**
 * Función para calcular los resultados del método de Muskingum.
 * @param {Array} data - Datos de entrada [{ Qe, Qs, Tiempo, S, X1, X2, X3, X4 }]
 * @param {Object} inputs - Parámetros de entrada { Tiempo, X1, X2, X3, X4 }
 * @returns {Object} - Resultados con datos calculados y valores de K.
 */

export const calcularResultados = (data, inputs) => {
  const { Tiempo, X1, X2, X3, X4 } = inputs;
  const deltaT = parseFloat(Tiempo) || 0.5; // Intervalo de tiempo
  const xValues = [
    parseFloat(X1) || 0,
    parseFloat(X2) || 0.1,
    parseFloat(X3) || 0.2,
    parseFloat(X4) || 0.3,
  ];

  
  // Validación de los valores de X
  if (xValues.some((x) => x < 0 || x > 0.5)) {
    throw new Error('Los valores de X deben estar entre 0 y 0.5.');
  }

  let acumuladoTiempo = 0;
  let almacenamientoAnterior = 0;
  let maxAlmacenamiento = 0;
  let indexMax = 0;

  const resultados = data.map((row, index) => {
    if (index === 0) {
      return {
        ...row,
        Tiempo: acumuladoTiempo.toFixed(2),
        S: almacenamientoAnterior.toFixed(2),
        X1: 0,
        X2: 0,
        X3: 0,
        X4: 0,
      };
    }

    acumuladoTiempo += deltaT;
    const prevRow = data[index - 1];

    // Cálculo del almacenamiento S
    const S =
      almacenamientoAnterior +
      (deltaT / 2) *
        ((parseFloat(prevRow.Qe) || 0) +
          (parseFloat(row.Qe) || 0) -
          (parseFloat(prevRow.Qs) || 0) -
          (parseFloat(row.Qs) || 0));

    almacenamientoAnterior = S;

    if (S > maxAlmacenamiento) {
      maxAlmacenamiento = S;
      indexMax = index;
    }

    // Cálculo de los valores ponderados X1, X2, X3, X4
    return {
      ...row,
      Tiempo: acumuladoTiempo.toFixed(2),
      S: S.toFixed(2),
      X1: (
        xValues[0] * (parseFloat(row.Qe) || 0) +
        (1 - xValues[0]) * (parseFloat(row.Qs) || 0)
      ).toFixed(2),
      X2: (
        xValues[1] * (parseFloat(row.Qe) || 0) +
        (1 - xValues[1]) * (parseFloat(row.Qs) || 0)
      ).toFixed(2),
      X3: (
        xValues[2] * (parseFloat(row.Qe) || 0) +
        (1 - xValues[2]) * (parseFloat(row.Qs) || 0)
      ).toFixed(2),
      X4: (
        xValues[3] * (parseFloat(row.Qe) || 0) +
        (1 - xValues[3]) * (parseFloat(row.Qs) || 0)
      ).toFixed(2),
    };
  });

  // Cálculo de los valores de K para cada X
  const kValues = {
    K1: (maxAlmacenamiento / resultados[indexMax].X1).toFixed(2),
    K2: (maxAlmacenamiento / resultados[indexMax].X2).toFixed(2),
    K3: (maxAlmacenamiento / resultados[indexMax].X3).toFixed(2),
    K4: (maxAlmacenamiento / resultados[indexMax].X4).toFixed(2),
  };

  return { resultados, kValues };
};

/**
 * Exporta los datos calculados a un archivo Excel.
 * @param {Array} data - Datos calculados [{ Qe, Qs, Tiempo, S, X1, X2, X3, X4 }]
 */
export const exportarExcel = (data) => {
  // Define las columnas para el archivo Excel
  const columns = [
    { label: 'Qe (m³/s)', value: 'Qe' },
    { label: 'Qs (m³/s)', value: 'Qs' },
    { label: 'Tiempo (días)', value: 'Tiempo' },
    { label: 'S (m³/s)-d', value: 'S' },
    { label: 'X1', value: 'X1' },
    { label: 'X2', value: 'X2' },
    { label: 'X3', value: 'X3' },
    { label: 'X4', value: 'X4' },
  ];

  // Generar el contenido del archivo Excel
  const worksheet = XLSX.utils.json_to_sheet(data, {
    header: columns.map((col) => col.value),
  });

  // Añadir encabezados personalizados
  columns.forEach((col, idx) => {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: idx });
    worksheet[cellAddress].v = col.label;
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Resultados Muskingum');

  // Descargar el archivo
  XLSX.writeFile(workbook, 'Resultados_Muskingum.xlsx');
};
