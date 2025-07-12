// Sound effects system for the casino
class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map()
  private enabled: boolean = true

  constructor() {
    this.preloadSounds()
  }

  private preloadSounds() {
    if (typeof window === 'undefined') return

    const soundFiles = {
      'card-deal': '/sounds/card-deal.ogg',
      'card-flip': '/sounds/card-flip.ogg',
      'card-shuffle': '/sounds/card-shuffle.ogg',
      'chip-place': '/sounds/chip-place.ogg'
    }

    Object.entries(soundFiles).forEach(([name, path]) => {
      const audio = new Audio(path)
      audio.preload = 'auto'
      audio.volume = 0.3 // Default volume (30%)
      this.sounds.set(name, audio)
    })
  }

  play(soundName: string, volume: number = 0.3) {
    if (!this.enabled || typeof window === 'undefined') return

    const sound = this.sounds.get(soundName)
    if (sound) {
      sound.volume = volume
      sound.currentTime = 0 // Reset to beginning
      sound.play().catch(err => {
        // Ignore autoplay policy errors
        console.debug('Sound play failed:', err)
      })
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  setVolume(soundName: string, volume: number) {
    const sound = this.sounds.get(soundName)
    if (sound) {
      sound.volume = Math.max(0, Math.min(1, volume))
    }
  }

  setMasterVolume(volume: number) {
    this.sounds.forEach(sound => {
      sound.volume = Math.max(0, Math.min(1, volume))
    })
  }
}

// Create global sound manager instance
export const soundManager = new SoundManager()

// Convenience functions
export const playCardDeal = () => soundManager.play('card-deal', 0.4)
export const playCardFlip = () => soundManager.play('card-flip', 0.4)
export const playCardShuffle = () => soundManager.play('card-shuffle', 0.3)
export const playChipPlace = () => soundManager.play('chip-place', 0.5)