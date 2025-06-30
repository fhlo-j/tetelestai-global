// SpinnerLoader.tsx
import { motion } from 'framer-motion'

const SpinnerLoader = ({
  size = 48,
  color = '#3B82F6',
}: {
  size?: number
  color?: string
}) => {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="rounded-full border-t-4 border-solid animate-spin"
        style={{
          width: size,
          height: size,
          borderColor: `${color} transparent transparent transparent`,
          borderWidth: size / 8,
        }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 1 }}
      />
    </div>
  )
}

export default SpinnerLoader
