export function readFileAsync(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
  
  export function parseArchivo(txt) {
    if (txt.charCodeAt(0) === 0xfeff) {
      txt = txt.slice(1);
    }
    const lines = txt
      .trim()
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line !== '');
    if (lines.length > 0) {
      const firstCols = lines[0].split(/\s+/);
      if (firstCols.length >= 18 && isNaN(parseFloat(firstCols[4]))) {
        lines.shift();
      }
    }
    return lines
      .map((line) => {
        const cols = line.split(/\s+/);
        if (cols.length < 18) return null;
        const row = cols.slice(5, 17).map((v) => parseFloat(v));
        return row.map((x) => (Number.isNaN(x) ? 0 : x));
      })
      .filter((row) => row && row.length === 12);
  }
  
  export function parseArchivoCompleto(txt) {
    if (txt.charCodeAt(0) === 0xfeff) {
      txt = txt.slice(1);
    }
    const lines = txt
      .trim()
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line !== '');
    if (lines.length > 0) {
      const firstCols = lines[0].split(/\s+/);
      if (firstCols.length >= 18 && isNaN(parseFloat(firstCols[4]))) {
        lines.shift();
      }
    }
    return lines.map((line) => line.split(/\s+/)).filter((row) => row.length >= 18);
  }
  
  export function calculaErrores(Qo, Qs) {
    if (!Qo || !Qs || Qo.length !== Qs.length || Qo.length === 0) return [0, 0, 0];
    const n = Qo.length;
    const meanObs = Qo.reduce((sum, v) => sum + v, 0) / n;
    let num = 0, denObs = 0, denSim = 0;
    for (let i = 0; i < n; i++) {
      const o = Qo[i] - meanObs;
      const s = Qs[i] - meanObs;
      num += o * s;
      denObs += o * o;
      denSim += s * s;
    }
    const r2 = denObs * denSim !== 0 ? (num * num) / (denObs * denSim) : 0;
    let numEF = 0, denEF = 0;
    for (let i = 0; i < n; i++) {
      numEF += (Qo[i] - Qs[i]) ** 2;
      denEF += (Qo[i] - meanObs) ** 2;
    }
    const ef = denEF !== 0 ? 1 - numEF / denEF : 0;
    const rmse = Math.sqrt(
      Qo.reduce((sum, v, ii) => sum + (v - Qs[ii]) ** 2, 0) / n
    );
    return [r2, ef, rmse];
  }
  
  export function temezCalcular(
    precip,
    etp,
    numYears,
    mesInicio,
    K,
    C,
    hmax,
    imax,
    q0,
    alfa,
    humIni,
    dias,
    area
  ) {
    const totalMeses = numYears * 12;
    const Qsim = new Array(totalMeses).fill(0);
    let Hant = humIni;
    for (let i = 0; i < totalMeses; i++) {
      const yIndex = Math.floor(i / 12);
      const mIndex = (i + Number(mesInicio)) % 12;
      const P_i = precip[yIndex][mIndex];
      const ETPi = etp[yIndex][mIndex];
      const EPi = K * ETPi;
      const P0 = C * Math.max(0, hmax - Hant);
      let T_i = 0;
      if (P_i > P0) {
        const delta = Math.max(0, hmax - Hant) + EPi;
        T_i = ((P_i - P0) ** 2) / (P_i + delta);
      }
      const I_i = (T_i * imax) / ((T_i + imax) || 1e-9);
      const Asup = T_i - I_i;
      const fi = alfa * I_i;
      Qsim[i] = i === 0 ? Asup + fi + q0 : Asup + fi;
      const X = P_i + Hant - T_i;
      const ERi = X >= EPi ? EPi : Math.max(0, X);
      const Hi = Math.max(0, X - ERi);
      Hant = Hi;
    }
    return Qsim;
  }
  
  export function simularMensualPorAno(
    precipData,
    etpData,
    K,
    C,
    hmax,
    imax,
    q0,
    alfa,
    humIni,
    dias,
    area,
    mesInicio
  ) {
    const years = precipData.length;
    const simMensArray = [];
    for (let y = 0; y < years; y++) {
      const sim = temezCalcular(
        [precipData[y]],
        [etpData[y]],
        1,
        mesInicio,
        K,
        C,
        hmax,
        imax,
        q0,
        alfa,
        humIni,
        dias,
        area
      );
      simMensArray.push(sim);
    }
    return simMensArray;
  }
  
  export function dibujarGrafico(canvas, labels, dataObs, dataSim, titulo) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const marginLeft = 60, marginRight = 30, marginTop = 50, marginBottom = 60;
    const left = marginLeft, right = w - marginRight, top = marginTop, bottom = h - marginBottom;
    const width = right - left, height = bottom - top;
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#E8F0F8');
    grad.addColorStop(1, '#AACCFF');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, w, h);
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = '#000';
    const tw = ctx.measureText(titulo).width;
    ctx.fillText(titulo, (w - tw) / 2, marginTop - 20);
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(left, bottom);
    ctx.lineTo(right, bottom);
    ctx.moveTo(left, bottom);
    ctx.lineTo(left, top);
    ctx.stroke();
    ctx.font = '10px Arial';
    const stepX = labels.length > 1 ? width / (labels.length - 1) : width;
    labels.forEach((label, i) => {
      const x = left + i * stepX;
      ctx.fillStyle = '#000';
      ctx.fillText(label, x - 10, bottom + 15);
    });
    ctx.font = 'bold 12px Arial';
    ctx.fillText('Mes / Año', (left + right) / 2 - 20, h - 10);
    ctx.save();
    ctx.translate(15, (top + bottom) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Caudal (?)', 0, 0);
    ctx.restore();
    const allData = dataObs.concat(dataSim);
    const maxVal = Math.max(...allData, 1);
    const minVal = 0;
    ctx.strokeStyle = '#E74C3C';
    ctx.lineWidth = 2;
    ctx.beginPath();
    dataObs.forEach((val, i) => {
      const x = left + i * stepX;
      const y = bottom - ((val - minVal) / (maxVal - minVal)) * height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.strokeStyle = '#3498DB';
    ctx.lineWidth = 2;
    ctx.beginPath();
    dataSim.forEach((val, i) => {
      const x = left + i * stepX;
      const y = bottom - ((val - minVal) / (maxVal - minVal)) * height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.fillStyle = '#E74C3C';
    ctx.fillRect(right - 130, top, 12, 12);
    ctx.fillStyle = '#000';
    ctx.fillText('Observado', right - 110, top + 10);
    ctx.fillStyle = '#3498DB';
    ctx.fillRect(right - 130, top + 20, 12, 12);
    ctx.fillStyle = '#000';
    ctx.fillText('Simulado', right - 110, top + 30);
  }
  