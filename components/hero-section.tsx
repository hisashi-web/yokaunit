"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-blue-50 to-white py-10 md:py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto text-center"
        >
          <motion.h1
            className="text-2xl md:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.span
              className="text-blue-600 inline-block"
              whileHover={{ scale: 1.05, color: "#1E40AF" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              "こんなの欲しかった"
            </motion.span>
            を、
            <br className="hidden sm:block" />
            カタチにするサイト
          </motion.h1>
          <motion.p
            className="text-base md:text-lg text-gray-700 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            無料で便利なWebツールを多数公開中。
            <br className="hidden sm:block" />
            あなたの「あったらいいな」も実現します。
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-5 text-base font-medium shadow-lg w-full sm:w-auto transition-all duration-300"
                onClick={() => {
                  window.location.href = "/tools"
                }}
              >
                ツールを探す
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* 背景装飾（改良版） */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-blue-100 rounded-full opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        ></motion.div>
        <motion.div
          className="absolute bottom-10 right-10 w-40 h-40 bg-blue-200 rounded-full opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        ></motion.div>
      </div>
    </section>
  )
}
