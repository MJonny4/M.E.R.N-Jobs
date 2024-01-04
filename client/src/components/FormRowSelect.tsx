const FormRowSelect = ({ name, labelText, list, defaultValue, onChange }) => {
    return (
        <div className="form-row">
            <label htmlFor={name} className="form-label">
                {labelText || name}
            </label>
            <select
                name={name}
                id={name}
                className="form-select"
                defaultValue={defaultValue}
                onChange={onChange}
            >
                {list.map((item) => {
                    return (
                        <option value={item} key={item}>
                            {item.charAt(0).toUpperCase() +
                                item.slice(1).toLowerCase()}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};

export default FormRowSelect;
