export const Spinner = ({ text = "Loading..." }) => {
    return (
        <div className="global-loading-card">
            {/* Animated Spinner Circle */}
            <div className="spinner-circle" />

            {text && (
                <p className="spinner-text">
                    {text}
                </p>
            )}
        </div>
    );
};