import Image from 'next/image'
import { ReactElement } from 'react'

/**
 * Props interface for the Logo component
 *
 * @interface LogoProps
 * @property {number} [width=150] - Width of the logo in pixels (optional)
 * @property {number} [height=150] - Height of the logo in pixels (optional)
 */
interface LogoProps {
  /** Width of the logo in pixels. Defaults to 150px for optimal visibility */
  width?: number
  /** Height of the logo in pixels. Defaults to 150px to maintain square aspect ratio */
  height?: number
}

/**
 * Logo Component
 *
 * A reusable VIU (Vancouver Island University) logo component that renders
 * an optimized SVG image using Next.js Image component for better performance.
 *
 * Features:
 * - Automatic image optimization via Next.js
 * - Lazy loading for performance
 * - Customizable dimensions while maintaining aspect ratio
 * - Proper accessibility with alt text
 * - SVG format for crisp rendering at any size
 *
 * @param {LogoProps} props - Component props
 * @param {number} [props.width=150] - Logo width in pixels
 * @param {number} [props.height=150] - Logo height in pixels
 * @returns {ReactElement} - Rendered logo image element
 *
 * @example
 * ```tsx
 * // Default size (150x150px)
 * <Logo />
 *
 * // Custom size
 * <Logo width={200} height={200} />
 *
 * // Small logo for header
 * <Logo width={60} height={60} />
 * ```
 */
export function Logo({ width = 150, height = 150 }: LogoProps): ReactElement {
  return (
    <Image
      // SVG logo path - stored in public/icons for Next.js static asset serving
      src='/icons/viu_logo.svg'
      // Descriptive alt text for screen readers and accessibility compliance
      alt='VIU Logo'
      // Explicit dimensions required by Next.js Image component for layout stability
      // and to prevent Cumulative Layout Shift (CLS)
      width={width}
      height={height}
      // Additional benefits of Next.js Image component:
      // - Automatic WebP/AVIF conversion for supported browsers
      // - Lazy loading by default (loads when entering viewport)
      // - Built-in responsive image sizing
      // - Prevents layout shift during image load
    />
  )
}
