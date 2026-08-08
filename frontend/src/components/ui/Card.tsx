import type { HTMLAttributes, ReactNode, ImgHTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`
        bg-asphalt border border-smoke rounded-[14px]
        transition-colors duration-[750ms] ease-[cubic-bezier(0.65,0.05,0,1)]
        hover:border-chalk flex flex-col overflow-hidden
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

interface CardImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
}

Card.Image = function CardImage({ src, alt, className = '', ...props }: CardImageProps) {
  return (
    <div className={`aspect-square bg-concrete overflow-hidden rounded-[14px] ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-[750ms] ease-[cubic-bezier(0.65,0.05,0,1)] hover:scale-105"
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
      className={`flex flex-col flex-grow p-6 gap-2 ${className}`}
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
      className={`font-heading font-bold text-2xl text-chalk leading-tight tracking-tight ${className}`}
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
      className={`flex flex-row items-center justify-between px-6 py-4 mt-auto border-t border-smoke ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
