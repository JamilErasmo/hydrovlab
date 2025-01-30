const Table = ({ data, inputs, onInputChange }) => (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th>Qe</th>
            <th>Qs</th>
            <th>
              Tiempo
              <input
                type="number"
                value={inputs.Tiempo}
                onChange={(e) => onInputChange({ ...inputs, Tiempo: e.target.value })}
              />
            </th>
            <th>S</th>
            <th>
              X1
              <input
                type="number"
                value={inputs.X1}
                onChange={(e) => onInputChange({ ...inputs, X1: e.target.value })}
              />
            </th>
            <th>X2</th>
            <th>X3</th>
            <th>X4</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.Qe}</td>
              <td>{row.Qs}</td>
              <td>{row.Tiempo}</td>
              <td>{row.S}</td>
              <td>{row.X1}</td>
              <td>{row.X2}</td>
              <td>{row.X3}</td>
              <td>{row.X4}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
  export default Table;
  