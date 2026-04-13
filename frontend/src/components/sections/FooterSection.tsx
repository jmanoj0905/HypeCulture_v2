import { NeonDivider } from '@components/ui/NeonDivider'
import { TransitionLink } from '@components/navigation/TransitionLink'

export function FooterSection() {
  return (
    <footer className="bg-void border-t border-smoke">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          {/* Logo + tagline */}
          <div>
            <h2 className="font-display text-4xl tracking-wider">
              <span className="text-neon-green">HYPE</span>
              <span className="text-white">CULTURE</span>
            </h2>
            <p className="font-body text-dust text-sm mt-3 max-w-xs">
              The underground sneaker marketplace. Buy, sell, and trade the most coveted kicks.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            <div>
              <h4 className="font-heading text-xs uppercase tracking-widest text-dust mb-4">Navigate</h4>
              <div className="flex flex-col gap-2">
                <TransitionLink to="/browse" className="font-body text-sm text-chalk hover:text-neon-green transition-colors">
                  Browse
                </TransitionLink>
                <TransitionLink to="/login" className="font-body text-sm text-chalk hover:text-neon-green transition-colors">
                  Sign In
                </TransitionLink>
              </div>
            </div>
            <div>
              <h4 className="font-heading text-xs uppercase tracking-widest text-dust mb-4">Roles</h4>
              <div className="flex flex-col gap-2">
                <span className="font-body text-sm text-dust">Customer</span>
                <span className="font-body text-sm text-dust">Seller</span>
                <span className="font-body text-sm text-dust">Admin</span>
              </div>
            </div>
          </div>
        </div>

        <NeonDivider className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-xs text-smoke">
            Built with obsession. &copy; {new Date().getFullYear()} HYPECULTURE
          </p>
          <p className="font-mono text-xs text-smoke">
            React + Three.js + GSAP + Tailwind
          </p>
        </div>
      </div>
    </footer>
  )
}
