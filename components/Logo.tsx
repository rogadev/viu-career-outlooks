import { type ReactElement } from 'react'

interface LogoProps {
  /** Width of the SVG in pixels */
  width: number
  /** Height of the SVG in pixels */
  height: number
  /** Optional CSS classes to apply to the SVG element */
  className?: string
}

/**
 * A circular logo component rendered as an SVG.
 * Uses currentColor for fill, allowing the logo to inherit its color from parent elements.
 *
 * @param {LogoProps} props - The component props
 * @returns {ReactElement} A circular SVG logo
 *
 * @example
 * // Basic usage
 * <Logo width={40} height={40} />
 *
 * @example
 * // With custom color via className
 * <Logo width={40} height={40} className="text-blue-500" />
 */
const Logo = ({ width, height, className }: LogoProps): ReactElement => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox='0 0 40 40'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      {/* Simple circle path with radius of 20 units centered at 20,20 */}
      <path
        d='M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z'
        fill='currentColor'
      />
    </svg>
  )
}

export default Logo
