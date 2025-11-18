"use client";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";
import Navigation from "@/components/Navigation";

import messages from "@/data/messages.json";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0128] via-[#240046] to-[#0a0014] text-white">
      <Navigation />

      <main className="flex flex-col items-center justify-center px-4 md:px-24 py-16">

        {/* HERO SECTION */}
        <section className="text-center mb-12 max-w-3xl">
          <h1
            className="
              text-3xl md:text-5xl font-extrabold leading-tight
              bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 
              bg-clip-text text-transparent
              drop-shadow-[0_4px_16px_rgba(255,255,255,0.15)]
            "
          >
            Dive into Anonymous Conversations
          </h1>

          <p
            className="
              mt-4 md:mt-6 
              text-base md:text-lg 
              text-purple-200/90 
              leading-relaxed
            "
          >
            Explore AnonTalk — where your identity stays hidden,
            and your thoughts speak louder than ever.
          </p>
        </section>

        {/* CAROUSEL SECTION */}
        <Carousel
          plugins={[Autoplay({ delay: 2500 })]}
          className="w-full max-w-md md:max-w-xl"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-3 flex justify-center">
                  <Card
                    className="
                      w-full 
                      h-[180px] md:h-[220px]
                      bg-white/10 
                      backdrop-blur-xl 
                      rounded-3xl 
                      border border-white/10 
                      shadow-xl shadow-purple-900/30
                      hover:scale-[1.03] 
                      hover:shadow-purple-500/30
                      transition-all duration-300
                    "
                  >
                    <CardHeader
                      className="
                        text-lg md:text-xl font-semibold
                        text-purple-300
                      "
                    >
                      {message.title}
                    </CardHeader>

                    <CardContent className="flex items-center justify-center p-2">
                      <span
                        className="
                          text-xl md:text-2xl font-bold text-center
                          bg-gradient-to-r from-pink-200 to-purple-200
                          bg-clip-text text-transparent
                          leading-snug
                        "
                      >
                        {message.content}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="bg-purple-700/60 hover:bg-purple-800 border-none text-white shadow-md" />
          <CarouselNext className="bg-purple-700/60 hover:bg-purple-800 border-none text-white shadow-md" />
        </Carousel>

      </main>

      <footer
        className="
          flex items-center justify-center 
          w-full text-xs md:text-sm py-10 
          text-purple-200/70
        "
      >
        <p>© 2025 AnonTalk Message • All Rights Reserved</p>
      </footer>
    </div>
  );
}
