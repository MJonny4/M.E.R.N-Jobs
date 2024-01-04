type FormRowProps = {
    type: string;
    name: string;
    labelText?: string;
    defaultValue?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const FormRow = ({
    type,
    name,
    labelText,
    defaultValue,
    onChange,
}: FormRowProps) => {
    return (
        <div className='form-row'>
            <label htmlFor={name} className='form-label'>
                {labelText || name}
            </label>
            <input
                type={type}
                id={name}
                name={name}
                className='form-input'
                defaultValue={defaultValue || ''}
                onChange={onChange}
                required
            />
        </div>
    );
};

export default FormRow;
