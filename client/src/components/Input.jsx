// client/src/components/Input.jsx
export default function Input({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    error,
  }) {
    return (
      <div>
        <label className="block text-sm font-medium text-text-secondary">
          {label}
        </label>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`mt-1 block w-full px-3 py-2 bg-white border ${
            error ? 'border-red-500' : 'border-neutral'
          } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }