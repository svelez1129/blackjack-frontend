'use client'

import { useEffect, useRef } from 'react'

interface BackgroundMusicProps {
  musicFile?: string
  volume?: number
  autoPlay?: boolean
}

export function BackgroundMusic({ 
  musicFile = '/audio/background-music.mp3', 
  volume = 0.3,
  autoPlay = true 
}: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio(musicFile)
    audio.loop = true
    audio.volume = volume
    audioRef.current = audio

    let handleFirstClick: (() => void) | null = null

    if (autoPlay) {
      // Start playing after user interaction (required by browsers)
      handleFirstClick = () => {
        audio.play().catch(console.error)
        if (handleFirstClick) {
          document.removeEventListener('click', handleFirstClick)
        }
      }
      document.addEventListener('click', handleFirstClick)
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (handleFirstClick) {
        document.removeEventListener('click', handleFirstClick)
      }
    }
  }, [musicFile, volume, autoPlay])

  return null // This component doesn't render anything visible
}