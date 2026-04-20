import type { HTMLAttributes, ReactNode, ImgHTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

// 1. Main Wrapper (The ONLY thing we export)
export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`
        bg-smoke/50 backdrop-blur-md border border-smoke
        transition-all duration-300 ease-[var(--ease-out-expo)]
        hover:border-dust flex flex-col
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

// 2. Sub-components attached directly to the main Card object

interface CardImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
}

Card.Image = function CardImage({ src, alt, className = '', ...props }: CardImageProps) {
  return (
    <div className={`aspect-square bg-void overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500 ease-[var(--ease-out-expo)] hover:scale-110"
        {...props}
      />
    </div>
  )
}

interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

Card.Body = function CardBody({ children, className = '', ...props }: CardBodyProps) {
  return (
    <div
      className={`flex flex-col flex-grow p-5 gap-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
}

Card.Title = function CardTitle({ children, className = '', ...props }: CardTitleProps) {
  return (
    <h3
      className={`font-heading text-xl text-chalk uppercase tracking-wider ${className}`}
      {...props}
    >
      {children}
    </h3>
  )
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

Card.Footer = function CardFooter({ children, className = '', ...props }: CardFooterProps) {
  return (
    <div
      className={`flex flex-row items-center justify-between p-4 mt-auto border-t border-smoke ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}