export const Spinner = ({ text = "Loading..." }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-800/80 backdrop-blur-sm border border-slate-700/60 rounded-xl shadow-xl max-w-xs mx-auto">
            {/* Animated Spinner Circle */}
            <div className="w-10 h-10 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin" />

            {text && (
                <p className="mt-4 text-sm font-medium text-slate-300 animate-pulse tracking-wide">
                    {text}
                </p>
            )}
        </div>
    );
};