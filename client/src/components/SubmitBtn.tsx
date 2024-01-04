import { useNavigation } from 'react-router-dom';

type SubmitBtnProps = {
    formBtn?: boolean;
};

const SubmitBtn = ({ formBtn }: SubmitBtnProps) => {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';

    return (
        <button
            type="submit"
            className={`btn btn-block ${formBtn && "form-btn"}`}
            disabled={isSubmitting}
        >
            {isSubmitting ? "Submitting..." : "Submit"}
        </button>
    );
};

export default SubmitBtn;
