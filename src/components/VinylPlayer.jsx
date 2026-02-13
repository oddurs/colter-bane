import { motion, animate, useMotionValue } from 'framer-motion'
import { useEffect, useRef } from 'react'
import './VinylPlayer.css'

export default function VinylPlayer({
  isPlaying,
  onTogglePlay,
  progress,
  currentTime,
  onSeek,
  onSeekKey,
  duration,
  coverSrc,
}) {
  const rotation = useMotionValue(0)
  const animRef = useRef(null)

  useEffect(() => {
    if (isPlaying) {
      const spin = () => {
        animRef.current = animate(rotation, rotation.get() + 360, {
          duration: 3,
          ease: 'linear',
          onComplete: spin,
        })
      }
      spin()
    } else {
      if (animRef.current) animRef.current.stop()
    }
    return () => { if (animRef.current) animRef.current.stop() }
  }, [isPlaying])

  const grooves = []
  for (let i = 0; i < 30; i++) {
    const r = 52 + i * 1.35
    if (r > 90) break
    grooves.push(
      <circle
        key={i}
        cx="100"
        cy="100"
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.03)"
        strokeWidth="0.3"
      />
    )
  }

  return (
    <div className="vinyl-wrapper">
      <div className="vinyl-stage">
        {/* Vinyl disc — slides right when playing */}
        <motion.div
          className="vinyl-disc"
          style={{ rotate: rotation }}
          animate={{ x: isPlaying ? 20 : 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <svg className="vinyl-grooves" viewBox="0 0 200 200">
            <defs>
              <radialGradient id="vinyl-sheen" cx="40%" cy="35%" r="60%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="99" fill="#1a1a18" />
            <circle cx="100" cy="100" r="99" fill="url(#vinyl-sheen)" />
            {grooves}
            <circle cx="100" cy="100" r="98.5" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="51" fill="#1d1d1a" />
            <circle cx="100" cy="100" r="51" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />
            <circle cx="100" cy="100" r="3" fill="var(--dark, #0d0b09)" />
          </svg>

          <div className="vinyl-label">
            <img src={coverSrc} alt="Ridge Line cover" />
          </div>
        </motion.div>

        {/* Static light-catch over the disc */}
        <motion.div
          className="vinyl-light-catch"
          animate={{ x: isPlaying ? 20 : 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        />

        {/* Sleeve — slides left when playing */}
        <motion.div
          className="vinyl-sleeve"
          animate={{ x: isPlaying ? -20 : 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <img src={coverSrc} alt="Ridge Line cover" />
        </motion.div>
      </div>

      <div className="vinyl-controls">
        <button
          className={`play-btn ${isPlaying ? 'playing' : ''}`}
          onClick={onTogglePlay}
          aria-label={isPlaying ? 'Pause Ridge Line' : 'Play Ridge Line'}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="5" y="3" width="4" height="18" />
              <rect x="15" y="3" width="4" height="18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <polygon points="7,3 21,12 7,21" />
            </svg>
          )}
        </button>
        <div className="progress-wrap">
          <div className="track-info">
            <span className="track-name">Ridge Line</span>
            <span className="time" aria-live="off">{currentTime}</span>
          </div>
          <div
            className="progress-bar"
            role="slider"
            tabIndex={0}
            aria-label="Seek through Ridge Line"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            onClick={onSeek}
            onKeyDown={onSeekKey}
          >
            <motion.div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
