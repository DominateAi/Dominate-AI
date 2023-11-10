import React from 'react'

const AuthInputField = ({
    className,
    type,
    name,
    value,
    placeholder,
    onChange
}) => {
    return (
        <div className="mb-10">
            <input autoComplete="off"
                className={className}
                type={type}
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={onChange} />
        </div>
    );
};

export default AuthInputField
