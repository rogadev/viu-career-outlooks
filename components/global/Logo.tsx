import Image from 'next/image'

interface LogoProps {
  width?: number
  height?: number
}

export function Logo({ width = 150, height = 150 }: LogoProps) {
  return (
    <Image
      src='/icons/viu_logo.svg'
      alt='VIU Logo'
      width={width}
      height={height}
    />
  )
}
