type Props = {
  className?: string;
};
export default function Line({ className = "" }: Props) {
  return <div className={`w-[1px] h-6 bg-[#E4E5E8] ${className}`}></div>;
}
