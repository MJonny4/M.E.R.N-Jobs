import PropTypes from "prop-types";

const FormRow = ({ type, name, labelText, defaultValue, onChange }) => {
    return (
        <div className="form-row">
            <label htmlFor={name} className="form-label">
                {labelText || name}
            </label>
            <input
                type={type}
                id={name}
                name={name}
                className="form-input"
                defaultValue={defaultValue || ""}
                onChange={onChange}
                required
            />
        </div>
    );
};

FormRow.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    labelText: PropTypes.string,
    defaultValue: PropTypes.string,
};

export default FormRow;
