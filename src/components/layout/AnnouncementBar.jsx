import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const messages = [
  "Complimentary shipping outside India on orders above INR 200,000",
  "Download the Madhu App & Get ₹5,000 Off",
  "Welcome to our store — Talk to us on +91 96195 87978",
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % messages.length), 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-noir text-champagne-light h-9 flex items-center justify-center overflow-hidden text-xs md:text-[13px] tracking-wide px-4">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="text-center truncate"
        >
          {messages[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}