"use client";
import { AnimatedTooltip } from "@/app/component/Home/Animate";
import { LiquidGlassCard } from "@/app/component/Home/Liquid";
import { ProgressiveBlur } from "@/app/component/Home/Progress";
import { TimelineContent } from "@/app/component/Home/Timeline"
import VerticalCutReveal from "@/app/component/Home/Vertical";
import { useMediaQuery } from "@/hooks/UseMedia";
import { Send } from "lucide-react";
import { AlignJustify, X } from "lucide-react";
import { useRef, useState } from "react";
import { Drawer } from "vaul";

const people = [
  {
    id: 1,
    name: "John Doe",
    designation: "Software Engineer",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=350&q=80",
  },
  {
    id: 2,
    name: "Robert Johnson",
    designation: "Product Manager",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=350&q=60",
  },
  {
    id: 3,
    name: "Jane Smith",
    designation: "Data Scientist",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=350&q=60",
  },
  {
    id: 4,
    name: "Emily Davis",
    designation: "UX Designer",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=350&q=60",
  },
];

function AgencyHero() {
  const isMobile = useMediaQuery("(max-width: 992px)");
  const [isOpen, setIsOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.4,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };
  const opacityVariants = {
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.4,
        duration: 0.5,
      },
    }),
    hidden: {
      opacity: 0,
    },
  };

  return (
    <section
      className=" max-h-screen relative pb-10 bg-cover bg-center bg-no-repeat"
      ref={heroRef}
    >
      <video
        autoPlay
     // loop fro repeate later
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source
          src="https://videos.pexels.com/video-files/9318313/9318313-uhd_2560_1440_24fps.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Header */}
      <TimelineContent
        as="header"
        animationNum={0}
        timelineRef={heroRef}
        customVariants={revealVariants}
        className="relative z-10 xl:px-0 px-5 py-4 max-w-7xl mx-auto"
      >
        {!isMobile ? (
          <nav className="flex items-center justify-between">
            <div className="flex gap-10 items-center">
              <div className="text-2xl font-semibold text-white">
                UI-Layouts
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <a
                  href="#"
                  className="text-gray-50 hover:text-white hover:bg-white/10 backdrop-blur-lg p-1 px-2 inline-block rounded-lg transition-colors duration-200"
                >
                  Projects
                </a>
                <a
                  href="#"
                  className="text-gray-50 hover:text-white hover:bg-white/10 backdrop-blur-lg p-1 px-2 inline-block rounded-lg transition-colors duration-200"
                >
                  Services
                </a>
                <a
                  href="#"
                  className="text-gray-50 hover:text-white hover:bg-white/10 backdrop-blur-lg p-1 px-2 inline-block rounded-lg transition-colors duration-200"
                >
                  Process
                </a>
                <a
                  href="#"
                  className="text-gray-50 hover:text-white hover:bg-white/10 backdrop-blur-lg p-1 px-2 inline-block rounded-lg transition-colors duration-200"
                >
                  Pricing
                </a>
                <a
                  href="/sign-up"
                  className="text-gray-50 hover:text-white hover:bg-white/10 backdrop-blur-lg p-1 px-2 inline-block rounded-lg transition-colors duration-200"
                >
                  Testimonials
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <a href="#" className="bg-blue-500 p-2 text-white rounded-full">
                <Send className="w-5 h-5" />
              </a>
              <button className="cursor-pointer bg-linear-to-t from-blue-500 to-blue-600 text-white backdrop-blur-xs border border-blue-500 shadow-md shadow-blue-600 px-6 py-2 rounded-full hover:bg-blue-600 transition-all duration-200">
                Book a call
              </button>
            </div>
          </nav>
        ) : (
          <>
            <Drawer.Root
              direction="left"
              open={isOpen}
              onOpenChange={setIsOpen}
            >
              <Drawer.Trigger className="px-2 text-white h-9 grid place-content-center bg-neutral-800 w-fit rounded-lg">
                <AlignJustify />
              </Drawer.Trigger>
              <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
                <Drawer.Content
                  className="left-2 top-2 bottom-2 fixed z-50 outline-hidden w-72 flex"
                  style={
                    {
                      "--initial-transform": "calc(100% + 8px)",
                    } as React.CSSProperties
                  }
                >
                  <div className="bg-linear-to-t from-black via-neutral-800 to-neutral-950 border border-neutral-700 text-white p-2 h-full w-full grow flex flex-col rounded-[16px]">
                    <div className="w-full flex justify-between">
                      <div className="flex gap-2 px-4 shrink-0 items-center text-2xl font-semibold  ">
                        <span>UI-Layouts</span>
                      </div>
                      <button
                        className="rounded-md w-fit bg-neutral-800 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-neutral-800 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                        onClick={() => setIsOpen(false)}
                      >
                        <X />
                      </button>
                    </div>
                    <div className="rounded-b-md py-2 px-3">
                      <ul className="space-y-2">
                        <li className="hover:bg-neutral-800 cursor-pointer p-1.5 px-2 rounded-md">
                          Projects
                        </li>
                        <li className="hover:bg-neutral-800 cursor-pointer p-1.5 px-2 rounded-md">
                          Services
                        </li>
                        <li className="hover:bg-neutral-800 cursor-pointer p-1.5 px-2 rounded-md">
                          Process
                        </li>
                        <li className="hover:bg-neutral-800 cursor-pointer p-1.5 px-2 rounded-md">
                          Pricing
                        </li>
                        <li className="hover:bg-neutral-800 cursor-pointer p-1.5 px-2 rounded-md">
                          Testimonials
                        </li>
                      </ul>
                      <div className="flex items-center space-x-4 pt-4">
                        <a
                          href="#"
                          className="bg-blue-500 p-2 text-white rounded-full"
                        >
                          <Send className="w-5 h-5" />
                        </a>
                        <button className="bg-linear-to-t from-blue-500 to-blue-600 cursor-pointer text-white backdrop-blur-xs border border-blue-500 shadow-md shadow-blue-600 px-6 py-2 rounded-full hover:bg-blue-600 transition-all duration-200">
                          Book a call
                        </button>
                      </div>
                    </div>
                  </div>
                </Drawer.Content>
              </Drawer.Portal>
            </Drawer.Root>
          </>
        )}
      </TimelineContent>

      {/* Main Content */}
      <div className="relative z-10 max-w-[1450px] mx-auto xl:px-0 px-5">
        <article className="max-w-2xl text-white space-y-4 pt-14">
          {/* Metric Badge */}
          <TimelineContent
            as="div"
            animationNum={1}
            timelineRef={heroRef}
            customVariants={revealVariants}
            className="flex items-center space-x-3"
          >
            <span className="relative flex size-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex size-4 rounded-full bg-blue-600"></span>
            </span>
            <span className="sm:text-lg text-sm">
              $3.8M+ Generated in direct sales for clients
            </span>
          </TimelineContent>

          {/* Main Headline */}
          <h1 className="sm:text-5xl text-3xl lg:text-6xl font-semibold leading-tight">
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.15}
              staggerFrom="first"
              reverse={true}
              containerClassName="justify-start"
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 40,
                delay: 0.8, // After metric badge (animationNum 1)
              }}
            >
              Design built to drive revenue, earn trust and raise rounds.
            </VerticalCutReveal>
          </h1>
        </article>

        <div className="grid lg:grid-cols-2 gap-12 items-end">
          {/* Left Content */}
          <div className="space-y-8 sm:pt-0 pt-4">
            {/* Subheading */}
            <TimelineContent
              as="p"
              animationNum={2}
              timelineRef={heroRef}
              customVariants={revealVariants}
              className="sm:text-xl text-lg text-white leading-relaxed max-w-lg"
            >
              We turn your vision into a product, site or brand that actually
              converts,{" "}
              <span className="text-gray-200">
                so you grow faster and scale with confidence.
              </span>
            </TimelineContent>

            {/* CTA Button */}
            <TimelineContent
              as="button"
              animationNum={3}
              timelineRef={heroRef}
              customVariants={revealVariants}
              className="bg-white text-black cursor-pointer px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-100 transition-colors duration-200 shadow-lg"
            >
              Book your free strategy call
            </TimelineContent>
          </div>

          {/* Right Content - Testimonial Card */}
          <TimelineContent
            as="div"
            animationNum={4}
            timelineRef={heroRef}
            customVariants={opacityVariants}
            className="lg:mt-24"
          >
            <LiquidGlassCard
              glowIntensity="md"
              shadowIntensity="sm"
              borderRadius="12px"
              blurIntensity="sm"
              className="p-4 ml-auto sm:w-md w-full"
            >
              {/* Avatar Stack */}
              <div className="flex items-center gap-10 mb-6">
                <div className="flex flex-row items-center justify-start">
                  <AnimatedTooltip items={people} />
                </div>
                <span className="text-white font-medium text-sm">
                  Trusted by 80+ high growth start-ups
                </span>
              </div>

              <div className="p-4 rounded-lg bg-white/10">
                {/* Testimonial */}
                <blockquote className="text-white text-sm leading-relaxed">
                  "In just 6 weeks Nuova transformed our MVP into a modern,
                  intuitive platform with a clear identity helping us attract
                  the right customers and investors."
                </blockquote>

                {/* Attribution */}
                <cite className="text-white pt-2 inline-block font-semibold">
                  Naymur Rahman, CEO @ui-layouts
                </cite>
              </div>
            </LiquidGlassCard>
          </TimelineContent>
        </div>
      </div>

      {/* Company Logos Section */}
      <TimelineContent
        as="div"
        animationNum={5}
        timelineRef={heroRef}
        customVariants={revealVariants}
        className="mt-28 xl:px-0 px-5 mb-12 text-white max-w-7xl mx-auto relative z-10"
      >
        <div className="flex flex-wrap items-center justify-between gap-8">
          <div className="flex items-center space-x-2">
            <span className="text-lg">5.0</span>
            <span className="">rating on Clutch</span>
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-yellow-400 rounded-xs"></div>
              ))}
            </div>
          </div>

          <div className="text-lg font-semibold">Nation</div>
          <div className="text-lg font-semibold">Jumexo</div>
          <div className="text-lg font-semibold">Revocalize</div>
          <div className="text-lg font-semibold">NARADA</div>
          <div className="text-lg font-semibold">AgentBoost</div>
        </div>
      </TimelineContent>

      <ProgressiveBlur
        className="pointer-events-none absolute bottom-0 left-0 h-[25%] w-full"
        blurIntensity={0.5}
      />
    </section>
  );
}

export default AgencyHero;
