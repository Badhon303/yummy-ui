"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ChevronDown } from "lucide-react"
import { useLayoutEffect, useRef } from "react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const leafA = "rounded-[0px_64px_0px_64px]"
const leafB = "rounded-[64px_0px_64px_0px]"

type Col = {
  top: { src: string; radius: string }
  bottom: { src: string; radius: string }
  parallax: number
  offset: string
}

const leftCols: Col[] = [
  {
    parallax: -220,
    offset: "lg:mt-0",
    top: { src: "/products/cream-bun.jpg", radius: leafA },
    bottom: { src: "/products/swiss-roll.jpg", radius: leafB },
  },
  {
    parallax: -130,
    offset: "lg:mt-56",
    top: { src: "/products/cinnamon-roll.jpg", radius: leafA },
    bottom: { src: "/products/vanilla-cupcake.jpg", radius: leafB },
  },
]

const rightCols: Col[] = [
  {
    parallax: -130,
    offset: "lg:mt-56",
    top: { src: "/products/sugar-donuts.jpg", radius: leafB },
    bottom: { src: "/products/laddu.jpg", radius: leafA },
  },
  {
    parallax: -220,
    offset: "lg:mt-0",
    top: { src: "/products/pizza-bread.jpg", radius: leafB },
    bottom: { src: "/products/stuffed-bread.jpg", radius: leafA },
  },
]

const mobileImages = [
  { src: "/products/cream-bun.jpg", radius: leafA },
  { src: "/products/cinnamon-roll.jpg", radius: leafB },
  { src: "/products/special-bread.jpg", radius: leafA },
  { src: "/products/pizza-bread.jpg", radius: leafB },
  { src: "/products/sugar-donuts.jpg", radius: leafA },
  { src: "/products/swiss-roll.jpg", radius: leafB },
]

function SideCol({
  col,
  refCb,
}: {
  col: Col
  refCb: (el: HTMLDivElement | null) => void
}) {
  return (
    <div
      ref={refCb}
      data-parallax={col.parallax}
      className={`hidden flex-1 flex-col gap-6 lg:flex ${col.offset}`}
    >
      {[col.top, col.bottom].map((img, j) => (
        <motion.div
          key={j}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 * j }}
          className={`relative aspect-square w-full overflow-hidden shadow-soft ${img.radius}`}
        >
          <Image
            src={img.src}
            alt=""
            fill
            className="object-cover transition-transform duration-700 hover:scale-110"
            sizes="20vw"
          />
        </motion.div>
      ))}
    </div>
  )
}

export default function Hero() {
  const root = useRef<HTMLDivElement>(null)
  const colRefs = useRef<(HTMLDivElement | null)[]>([])
  const centerImg = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add("(min-width: 1024px)", () => {
        const trigger = {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        }
        colRefs.current.forEach((col) => {
          if (!col) return
          gsap.to(col, {
            y: Number(col.dataset.parallax) || -160,
            ease: "none",
            scrollTrigger: trigger,
          })
        })
        if (centerImg.current) {
          gsap.to(centerImg.current, {
            y: -180,
            ease: "none",
            scrollTrigger: trigger,
          })
        }
      })
    }, root)
    return () => ctx.revert()
  }, [])

  let refIndex = 0
  const nextRef = () => {
    const idx = refIndex++
    return (el: HTMLDivElement | null) => {
      colRefs.current[idx] = el
    }
  }

  return (
    <section
      ref={root}
      className="relative min-h-0 overflow-hidden bg-[#f9f7f2] mb-8 pt-24 sm:pt-28 lg:min-h-[100svh] lg:pb-0 lg:pt-20"
    >
      <div className="absolute inset-0">
        <Image
          src="/products/hero-bg.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-70"
        />
      </div>

      {/* Centered headline */}
      <div className="relative z-20 flex flex-col items-center px-4 text-center lg:pointer-events-none lg:absolute lg:inset-x-0 lg:top-[15%]">
        <motion.h5
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[11px] font-semibold uppercase tracking-[0.3em] text-caramel sm:text-sm"
        >
          Explore our world
        </motion.h5>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-3 font-display text-[clamp(2.25rem,8vw,6rem)] font-bold leading-[0.95] text-choco sm:text-[clamp(2.5rem,7vw,5.5rem)] lg:text-[clamp(3rem,6vw,6rem)]"
        >
          Yummy Vibes
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-display text-[clamp(2.25rem,8vw,6rem)] font-bold leading-[0.95] text-choco sm:text-[clamp(2.5rem,7vw,5.5rem)] lg:text-[clamp(3rem,6vw,6rem)]"
        >
          Bakery
        </motion.h1>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          onClick={() =>
            window.scrollBy({ top: window.innerHeight, behavior: "smooth" })
          }
          className="pointer-events-auto mt-7 flex h-12 w-12 items-center justify-center rounded-full bg-caramel text-white shadow-soft transition-transform hover:scale-105"
          aria-label="Scroll down"
        >
          <ChevronDown size={22} />
        </motion.button>
      </div>

      {/* Desktop: full-bleed staggered grid */}
      <div className="relative z-10 hidden w-full items-start gap-4 px-4 lg:flex lg:h-[100svh] lg:max-h-[900px] lg:pt-16">
        {leftCols.map((col, i) => (
          <SideCol key={`l${i}`} col={col} refCb={nextRef()} />
        ))}

        <div className="flex flex-1 flex-col lg:translate-y-5">
          <motion.div
            ref={centerImg}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative mx-auto mt-[24rem] aspect-[3/4] w-full overflow-hidden rounded-t-[80px] shadow-soft lg:mt-[26rem] xl:mt-[28rem]"
          >
            <Image
              src="/products/special-bread.jpg"
              alt=""
              fill
              priority
              className="object-cover"
              sizes="20vw"
            />
          </motion.div>
        </div>

        {rightCols.map((col, i) => (
          <SideCol key={`r${i}`} col={col} refCb={nextRef()} />
        ))}
      </div>

      {/* Mobile: swipeable carousel, placed lower */}
      <div className="relative z-10 mt-4 sm:mt-6 lg:hidden">
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {mobileImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.05 * i }}
              className={`relative aspect-[3/4] w-[55%] shrink-0 snap-center overflow-hidden shadow-soft min-[480px]:w-[60%] sm:w-[44%] ${img.radius}`}
            >
              <Image
                src={img.src}
                alt=""
                fill
                priority={i < 2}
                className="object-cover"
                sizes="66vw"
              />
            </motion.div>
          ))}
        </div>
        <p className="mt-2 text-center text-xs text-choco/40">
          Swipe to explore
        </p>
      </div>
    </section>
  )
}
