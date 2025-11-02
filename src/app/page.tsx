"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
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

export default function page() {
  return (
    <div>
      <Navigation />
      <main className="flex grow flex-col items-center justify-center px-4 md:px-24 py-12">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold ">
            Dive into the world of anonymous Conversations
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            Explore AnonTalk Message - Where Your identify remains a secrter.
          </p>
        </section>

        <Carousel 
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-lg"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <div className="p-4 flex justify-center">
                    <Card className="w-[500px] h-[250px] bg-white/80 backdrop-blur-md rounded-2xl shadow-lg hover:scale-105 transform transition-all duration-300">
                      <CardHeader className="text-xl font-semibold text-indigo-600">
                        {message.title}
                      </CardHeader>
                      <CardContent className="flex items-center justify-center p-4">
                        <span className="text-3xl font-bold text-gray-900">
                          {message.content}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>
      <footer className="flex items-center justify-center w-full text-sm py-10">
        <p>@ 2025 AnonTalk Message. All rights reserved</p>
      </footer>
    </div>
  );
}
