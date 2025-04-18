import { ButtonProps } from '../../types'
import Link from 'next/link'
export default function NavLink({ children, className = "", href= '#', ...props }: ButtonProps & { href?:string}) {
  return (
    <Link href={href} passHref>
      <button
      className={`
        py-[14px]
        flex
        items-center
        cursor-pointer
        hover:shadow-[inset_0_-2px_0_0_#0A65CC]
        hover:text-blue-500 
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
    </Link>
    
  );
}
