import { TransitionLink } from '@components/navigation/TransitionLink'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-void flex items-center justify-center">
      <div className="text-center">
        <p className="font-display text-[10rem] leading-none text-smoke/20">404</p>
        <p className="font-display text-4xl text-white tracking-wider mt-2">PAGE NOT FOUND</p>
        <p className="font-mono text-sm text-dust mt-4">
          The drop you&apos;re looking for doesn&apos;t exist.
        </p>
        <TransitionLink
          to="/"
          className="inline-block mt-8 font-heading text-sm uppercase tracking-widest px-6 py-3 bg-neon-green text-void border border-neon-green hover:bg-transparent hover:text-neon-green transition-all duration-300"
        >
          Back to Home
        </TransitionLink>
      </div>
    </div>
  )
}
