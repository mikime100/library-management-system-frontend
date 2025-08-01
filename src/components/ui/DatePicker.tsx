import React, { forwardRef, FC } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
  id: string;
  label?: string;
  selected: Date | null;
  onChange: (date: Date | null) => void;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
  showYearDropdown?: boolean;
  showMonthDropdown?: boolean;
  dropdownMode?: "scroll" | "select";
  placeholderText?: string;
  required?: boolean;
  className?: string;
  icon?: React.ElementType;
  showTimeSelect?: boolean;
  timeFormat?: string;
  timeIntervals?: number;
  dateFormat?: string;
  disabled?: boolean;
}

interface CustomInputProps {
  value: string;
  onClick: () => void;
  error?: string;
  icon?: React.ElementType;
  className?: string;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ value, onClick, error, icon: Icon, className, ...props }, ref) => (
    <div className="relative">
      <input
        type="text"
        value={value}
        onClick={onClick}
        ref={ref}
        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
          error
            ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
        } ${className || ""}`}
        {...props}
      />
      {Icon && (
        <Icon
          className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 ${
            error ? "text-red-400" : ""
          }`}
          size={16}
        />
      )}
    </div>
  )
);

const DatePicker: FC<DatePickerProps> = ({
  id,
  label,
  selected,
  onChange,
  error,
  minDate,
  maxDate,
  showYearDropdown = false,
  showMonthDropdown = false,
  dropdownMode = "scroll",
  placeholderText,
  required = false,
  className = "",
  icon: Icon,
  showTimeSelect = false,
  timeFormat = "HH:mm",
  timeIntervals = 30,
  dateFormat = "dd/MM/yyyy",
  disabled = false,
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <ReactDatePicker
        id={id}
        selected={selected}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        showYearDropdown={showYearDropdown}
        showMonthDropdown={showMonthDropdown}
        dropdownMode={dropdownMode}
        placeholderText={placeholderText}
        required={required}
        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
          error
            ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
        } ${className}`}
        customInput={
          <CustomInput value="" onClick={() => {}} error={error} icon={Icon} />
        }
        dateFormat={showTimeSelect ? `${dateFormat} ${timeFormat}` : dateFormat}
        disabled={disabled}
        showTimeSelect={showTimeSelect}
        timeFormat={timeFormat}
        timeIntervals={timeIntervals}
        closeOnScroll={true}
        portalId="date-picker-portal"
        popperPlacement="bottom-start"
        popperModifiers={[
          {
            name: "offset",
            options: { offset: [0, 10] },
            fn: () => ({ y: 10 }),
          },
        ]}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default DatePicker;
