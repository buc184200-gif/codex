import { Variants } from "framer-motion";

export const premiumEase = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.62, ease: premiumEase } }
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: premiumEase } }
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.075,
      delayChildren: 0.05
    }
  }
};

export const cardMotion: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.985 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: premiumEase } },
  exit: { opacity: 0, y: 14, scale: 0.98, transition: { duration: 0.24, ease: premiumEase } }
};

export const panelMotion: Variants = {
  hidden: { opacity: 0, x: 28 },
  show: { opacity: 1, x: 0, transition: { duration: 0.42, ease: premiumEase } },
  exit: { opacity: 0, x: 28, transition: { duration: 0.28, ease: premiumEase } }
};

export const pageMotion: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: premiumEase } }
};
