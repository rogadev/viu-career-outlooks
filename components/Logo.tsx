import { type ReactElement } from 'react'
import Image from 'next/image'

/**
 * Props interface for the Logo component
 *
 * Using TypeScript interfaces helps catch errors at compile time
 * and provides excellent IDE autocomplete support for developers
 */
interface LogoProps {
  /**
   * Width of the image in pixels
   * Should be a positive number to ensure proper rendering
   */
  width: number
  /**
   * Height of the image in pixels
   * Should be a positive number to ensure proper rendering
   */
  height: number
}

/**
 * VIU Logo component using Next.js optimized Image component
 *
 * This component renders the Vancouver Island University logo with automatic
 * optimization benefits including:
 * - Lazy loading by default (except when priority=true)
 * - Automatic WebP/AVIF format conversion when supported
 * - Responsive image loading
 * - Prevention of Cumulative Layout Shift (CLS)
 *
 * Why next/image instead of <img>?
 * - Automatic image optimization and format conversion
 * - Built-in lazy loading for better performance
 * - Prevents layout shift during image load
 * - Automatic responsive image generation
 *
 * Why SVG format?
 * - Vector graphics scale perfectly at any size
 * - Small file size
 * - Crisp rendering on all devices and resolutions
 *
 * @param {LogoProps} props - The component props containing width and height
 * @returns {ReactElement} A optimized VIU logo image element
 *
 * @example
 * // Standard usage in header
 * <Logo width={40} height={40} />
 *
 * @example
 * // Larger usage for hero sections
 * <Logo width={120} height={120} />
 */
const Logo = ({ width, height }: LogoProps): ReactElement => {
  // Input validation: Ensure dimensions are positive numbers
  // This prevents rendering issues and provides clear error feedback
  if (width <= 0 || height <= 0) {
    console.warn('Logo component: width and height must be positive numbers')
    return <></> // Return empty fragment if invalid props
  }

  return (
    <Image
      // Path to logo file - stored in public/icons for easy access
      // Public folder files are served directly from domain root
      src='/icons/viu_logo.svg'
      // Alt text for accessibility - crucial for screen readers
      // Describes what the image represents, not just "logo"
      alt='VIU Logo'
      // Explicit dimensions prevent layout shift during loading
      // These should match the actual display size needed
      width={width}
      height={height}
      // Priority loading for above-the-fold images (like headers)
      // This disables lazy loading and loads the image immediately
      // Use this when the logo appears in the initial viewport
      priority

      // Additional optimization: next/image automatically adds
      // - loading="eager" (due to priority)
      // - decoding="async" for non-blocking image decode
      // - Proper sizing attributes to prevent CLS
    />
  )
}

export default Logo
