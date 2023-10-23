import React, { useState } from 'react';
import './Dropdown.css';
const Dropdown = ({ onOptionChange }) => {
  // Estado para gestionar la opción seleccionada
  const [selectedOption, setSelectedOption] = useState('');

  // Manejar el cambio en la selección
  // Manejar el cambio en la selección
  const handleSelectChange = (event) => {
    const option = event.target.value;
    setSelectedOption(option);
    onOptionChange(option); // Llama a la función pasada como prop en el componente padre
  };
  return (
    <div>
      <label className="label" htmlFor="dropdown">Selecciona un año:  </label>
      <select id="dropdown" value={selectedOption} onChange={handleSelectChange} className="select">
        <option value="">Click para seleccionar</option>
        <option value="2023">2023</option>
        <option value="2024">2024</option>
      </select>
    
    </div>
  );
};

export default Dropdown;
