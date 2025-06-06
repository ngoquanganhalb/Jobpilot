type Props = {
  className?: string;
};
export default function JobIcon({ className = "" }: Props) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
    >
      <g clipPath="url(#clip0_4112_12817)">
        <path
          opacity="0.2"
          d="M20.0001 23.75C14.7341 23.7583 9.55961 22.3739 5.00128 19.7373V32.5C5.00128 32.6642 5.03361 32.8267 5.09643 32.9784C5.15925 33.1301 5.25132 33.2679 5.3674 33.3839C5.48347 33.5 5.62127 33.5921 5.77293 33.6549C5.92458 33.7177 6.08713 33.75 6.25128 33.75H33.7513C33.9154 33.75 34.078 33.7177 34.2296 33.6549C34.3813 33.5921 34.5191 33.5 34.6352 33.3839C34.7512 33.2679 34.8433 33.1301 34.9061 32.9784C34.969 32.8267 35.0013 32.6642 35.0013 32.5V19.7358C30.4424 22.3734 25.267 23.7583 20.0001 23.75Z"
          fill="#0A65CC"
        />
        <path
          d="M33.7513 11.25H6.25128C5.56093 11.25 5.00128 11.8096 5.00128 12.5V32.5C5.00128 33.1904 5.56093 33.75 6.25128 33.75H33.7513C34.4416 33.75 35.0013 33.1904 35.0013 32.5V12.5C35.0013 11.8096 34.4416 11.25 33.7513 11.25Z"
          stroke="#0A65CC"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M26.25 11.25V8.75C26.25 8.08696 25.9866 7.45107 25.5178 6.98223C25.0489 6.51339 24.413 6.25 23.75 6.25H16.25C15.587 6.25 14.9511 6.51339 14.4822 6.98223C14.0134 7.45107 13.75 8.08696 13.75 8.75V11.25"
          stroke="#0A65CC"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M35.0013 19.7358C30.4424 22.3734 25.2669 23.7583 20 23.75C14.734 23.7583 9.55941 22.3739 5.00104 19.7372"
          stroke="#0A65CC"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.125 18.75H21.875"
          stroke="#0A65CC"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_4112_12817">
          <rect width="40" height="40" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
