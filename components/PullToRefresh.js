'use client'
import { useState, useRef, useEffect } from 'react'

export default function PullToRefresh({ onRefresh, children }) {
  const [pulling, setPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const startY = useRef(0)
  const threshold = 80

  useEffect(() => {
    const el = document.documentElement

    const onTouchStart = (e) => {
      if (el.scrollTop === 0) {
        startY.current = e.touches[0].clientY
        setPulling(true)
      }
    }

    const onTouchMove = (e) => {
      if (!pulling) return
      const dist = e.touches[0].clientY - startY.current
      if (dist > 0 && el.scrollTop === 0) {
        e.preventDefault()
        setPullDistance(Math.min(dist * 0.5, threshold + 20))
      }
    }

    const onTouchEnd = async () => {
      if (pullDistance >= threshold) {
        setRefreshing(true)
        setPullDistance(0)
        setPulling(false)
        await onRefresh()
        setRefreshing(false)
      } else {
        setPullDistance(0)
        setPulling(false)
      }
    }

    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd)

    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [pulling, pullDistance, onRefresh])

  return (
    <div style={{ position: 'relative' }}>
      {/* Pull indicator */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: pullDistance > 0 ? 'none' : 'all 0.3s',
        height: `${pullDistance}px`,
        overflow: 'hidden',
        width: '100%',
        background: 'rgba(22,163,74,0.1)',
      }}>
        {refreshing ? (
          <div style={{
            width: '24px', height: '24px',
            border: '3px solid #16a34a',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }}/>
        ) : pullDistance > 0 ? (
          <span style={{
            fontSize: '20px',
            transform: `rotate(${Math.min(pullDistance / threshold * 180, 180)}deg)`,
            transition: 'transform 0.1s'
          }}>↓</span>
        ) : null}
      </div>

      <div style={{ transform: `translateY(${pullDistance}px)`, transition: pullDistance > 0 ? 'none' : 'transform 0.3s' }}>
        {children}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
