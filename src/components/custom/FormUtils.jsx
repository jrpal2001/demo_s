import React from 'react';
import Switch from '@mui/material/Switch';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

// General Input Field
const InputField = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false,
  ...props
}) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && (
        <label
          htmlFor={name}
          style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}
        >
          {label} {required && <span style={{ color: '#dc3545' }}>*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          borderRadius: '4px',
          boxSizing: 'border-box',
          border: '1px solid #ced4da',
          ...(error ? { borderColor: '#dc3545' } : {}),
        }}
        required={required}
        disabled={disabled}
        {...props}
      />
      {error && <div style={{ fontSize: '0.875rem', color: '#dc3545' }}>{error}</div>}
    </div>
  );
};

// Dropdown Component
const Dropdown = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  error,
  disabled = false,
}) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && (
        <label
          htmlFor={name}
          style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}
        >
          {label} {required && <span style={{ color: '#dc3545' }}>*</span>}
        </label>
      )}
      <select
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          borderRadius: '4px',
          boxSizing: 'border-box',
          border: '1px solid #ced4da',
          ...(error ? { borderColor: '#dc3545' } : {}),
        }}
        required={required}
        disabled={disabled}
      >
        <option value="">Select</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div style={{ fontSize: '0.875rem', color: '#dc3545' }}>{error}</div>}
    </div>
  );
};

// Number Input
const NumberInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false,
}) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && (
        <label
          htmlFor={name}
          style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}
        >
          {label} {required && <span style={{ color: '#dc3545' }}>*</span>}
        </label>
      )}
      <input
        type="number"
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          borderRadius: '4px',
          boxSizing: 'border-box',
          border: '1px solid #ced4da',
          ...(error ? { borderColor: '#dc3545' } : {}),
        }}
        required={required}
        disabled={disabled}
      />
      {error && <div style={{ fontSize: '0.875rem', color: '#dc3545' }}>{error}</div>}
    </div>
  );
};

// Switch Button
const SwitchButton = ({ label, checked, onChange, disabled = false }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
      {label && <label style={{ fontWeight: '600' }}>{label}</label>}
      <Switch {...label} checked={checked} onChange={onChange} disabled={disabled} />
    </div>
  );
};

export { InputField, Dropdown, NumberInput, SwitchButton };
