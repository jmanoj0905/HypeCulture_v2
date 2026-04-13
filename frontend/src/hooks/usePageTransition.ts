import { useContext } from 'react'
import { TransitionContext } from '@context/TransitionContext'

export function usePageTransition() {
  return useContext(TransitionContext)
}
