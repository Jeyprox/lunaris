import { motion } from "framer-motion";

const variants = {
  visible: { opacity: 1, scale: 1 },
  hidden: { opacity: 0, scale: 0.7 },
};

export const FadeInSection = ({ children }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};
