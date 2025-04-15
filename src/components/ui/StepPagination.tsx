interface StepPaginationProps {
  currentStep: number;
  totalSteps: number;
  onNext?: () => void;
  onPrevious?: () => void;
  onStepClick?: (step: number) => void;
}

const StepPagination: React.FC<StepPaginationProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onStepClick,
}) => {
  return (
    <div className="flex items-center justify-center w-full gap-4 my-6">
      {/* Previous button */}
      <button
        onClick={onPrevious}
        disabled={currentStep <= 1}
        className={`flex cursor-pointer items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
          currentStep <= 1
            ? "text-blue-200 bg-blue-50 cursor-not-allowed"
            : "text-blue-400 bg-blue-50 hover:bg-blue-100"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Step indicators */}
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <button
          key={step}
          onClick={() => onStepClick && onStepClick(step)}
          className={`cursor-pointer flex items-center justify-center w-12 h-12 rounded-full font-medium transition-all duration-300 ${
            currentStep === step
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          {step.toString().padStart(2, "0")}
        </button>
      ))}

      {/* Next button */}
      <button
        onClick={onNext}
        disabled={currentStep >= totalSteps}
        className={`flex cursor-pointer items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
          currentStep >= totalSteps
            ? "text-blue-200 bg-blue-50 cursor-not-allowed"
            : "text-blue-400 bg-blue-50 hover:bg-blue-100"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
};

export default StepPagination;
