import React from 'react';
import './Slider.css';

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label: string;
  showValue?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  min,
  max,
  step = 0.1,
  onChange,
  label,
  showValue = true,
}) => {
  return (
    <div className="slider-container">
      <div className="slider-header">
        <label className="slider-label">{label}</label>
        {showValue && <span className="slider-value">{value.toFixed(2)}</span>}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="slider"
      />
      <div className="slider-markers">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};