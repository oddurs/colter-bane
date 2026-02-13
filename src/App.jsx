import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import VinylPlayer from './components/VinylPlayer'
import './App.css'

/* ---- Animation variants ---- */
const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.08 },
  }),
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

const letterVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
      delay: 0.2 + i * 0.025,
    },
  }),
}

const ruleVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1] },
  },
}

/* ---- Components ---- */
function SplitText({ text, className }) {
  return (
    <motion.h1
      className={className}
      aria-label={text}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={letterVariants}
          custom={i}
          initial="hidden"
          animate="visible"
          style={{ display: 'inline-block' }}
          aria-hidden="true"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.h1>
  )
}

function FadeInSection({ children, className, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp}
      custom={delay}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function AnimatedRule({ className }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={ruleVariants}
      style={{ originX: 0.5 }}
    />
  )
}

/* ---- App ---- */
export default function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState('0:00')
  const heroRef = useRef(null)

  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.99])

  function formatTime(s) {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return m + ':' + String(sec).padStart(2, '0')
  }

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play()
      setIsPlaying(true)
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }

  function handleTimeUpdate() {
    const audio = audioRef.current
    if (audio && audio.duration) {
      setProgress((audio.currentTime / audio.duration) * 100)
      setCurrentTime(formatTime(audio.currentTime))
    }
  }

  function handleEnded() {
    setIsPlaying(false)
    setProgress(0)
    setCurrentTime('0:00')
  }

  function handleSeek(e) {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration
  }

  function handleSeekKey(e) {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    const step = 5
    if (e.key === 'ArrowRight') audio.currentTime = Math.min(audio.currentTime + step, audio.duration)
    else if (e.key === 'ArrowLeft') audio.currentTime = Math.max(audio.currentTime - step, 0)
  }

  return (
    <>
      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      >
        <source src="/assets/ridgeline.m4a" type="audio/mp4" />
      </audio>

      {/* Ambient glow that breathes when music plays */}
      <div className={`ambient-glow ${isPlaying ? 'playing' : ''}`} />

      {/* ====== HERO ====== */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="hero"
      >
        <div className="hero-glow" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="hero-content"
        >
          <motion.p variants={fadeUp} className="hero-eyebrow">
            Brooklyn via Eastern Kentucky
          </motion.p>
          <SplitText text="Colter Bane" className="artist-name" />

          <motion.p variants={fadeUp} className="debut-line">
            Debut single
          </motion.p>
          <motion.p variants={fadeUp} className="debut-title">
            "Ridge Line"
          </motion.p>

          <motion.div variants={fadeUp} className="single-block">
            <VinylPlayer
              isPlaying={isPlaying}
              onTogglePlay={togglePlay}
              progress={progress}
              currentTime={currentTime}
              onSeek={handleSeek}
              onSeekKey={handleSeekKey}
              duration={audioRef.current?.duration || 0}
              coverSrc="/assets/ridgeline-cover-600.png"
            />

            <motion.div variants={fadeUp} className="listen-links">
              <a href="#">Spotify</a>
              <span className="sep">&middot;</span>
              <a href="#">Apple Music</a>
              <span className="sep">&middot;</span>
              <a href="#">Amazon</a>
              <span className="sep">&middot;</span>
              <a href="#">YouTube</a>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="scroll-cue"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ delay: 2.5, duration: 1.2 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </motion.section>

      {/* ====== BELOW THE FOLD ====== */}
      <section className="below">
        <FadeInSection className="pull-quote-block">
          <span className="pull-quote-mark">&ldquo;</span>
          <p className="pull-quote">
            Ridge Line is the kind of debut that makes you clear
            your schedule for whatever comes next.
          </p>
          <p className="pull-quote-source">Americana Highways</p>
        </FadeInSection>

        <AnimatedRule className="rule" />

        <FadeInSection className="bio">
          <p>
            <span className="bio-lead">Colter Bane is a singer-songwriter</span> out
            of Brooklyn by way of eastern Kentucky. Weathered baritone over
            fingerpicked guitar, fiddle, and the truth.
          </p>
          <p>
            His debut single "Ridge Line" is a love song that sounds like a
            prayer — for the woman who made a crooked timber feel like home.
          </p>
          <p>
            No Nashville polish. No tricks. Just a man and a guitar and something
            worth saying.
          </p>
        </FadeInSection>

        <FadeInSection className="one-liner-block">
          <AnimatedRule className="one-liner-rule" />
          <p className="one-liner">She was every road that led me home.</p>
          <AnimatedRule className="one-liner-rule" />
        </FadeInSection>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="site-footer">
        <div className="rule-footer" />
        <p className="contact-label">Booking &amp; Press</p>
        <p className="contact-email">
          <a href="mailto:mgmt@colterbane.com">mgmt@colterbane.com</a>
        </p>
        <p className="copyright">&copy; 2026 Colter Bane</p>
      </footer>
    </>
  )
}
