import React from "react";

export default function ItemInput({
  type,
  value,
  name,
  onChange,
  className,
  style,

  disabled,
}) {
  const emailInputRef = React.useRef(null);
  React.useEffect(() => {
    emailInputRef.current.focus();
  }, []);
  return (
    <div>
      <input
        className={className}
        type={type}
        value={value}
        name={name}
        onChange={onChange}
        disabled={disabled}
        ref={emailInputRef}
      />
    </div>
  );
}
