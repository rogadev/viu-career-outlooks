import { type ReactElement } from 'react'
import Image from 'next/image'

interface LogoProps {
  /** Width of the image in pixels */
  width: number
  /** Height of the image in pixels */
  height: number
}

/**
 * VIU Logo component using next/image for optimization
 *
 * @param {LogoProps} props - The component props
 * @returns {ReactElement} The VIU logo
 *
 * @example
 * // Basic usage
 * <Logo width={40} height={40} />
 */
const Logo = ({ width, height }: LogoProps): ReactElement => {
  return (
    <Image
      src='/icons/viu_logo.svg'
      alt='VIU Logo'
      width={width}
      height={height}
      priority
    />
  )
}

export default Logo
