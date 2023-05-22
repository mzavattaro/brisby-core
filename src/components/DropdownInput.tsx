import React, { useState } from 'react';

const DropdownInput: React.FC = () => {
  // const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const onClick = () => setIsActive(!isActive);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="rounded border border-gray-300 px-3 py-2"
      />
      <button
        type="button"
        onClick={onClick}
        className="absolute right-0 top-0 px-3 py-2"
      >
        ▼
      </button>
      {isActive && (
        <div className="absolute left-0 mt-1 w-full rounded border border-gray-300 bg-white shadow">
          <ul>
            <li className="px-3 py-2">Option 1</li>
            <li className="px-3 py-2">Option 2</li>
            <li className="px-3 py-2">Option 3</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownInput;
