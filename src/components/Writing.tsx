'use client';

import Link from 'next/link';
import { BsClock } from 'react-icons/bs';

const writings = [
//   {
//     date: '21/02/25',
//     title: 'How to think like both a designer & engineer',
//     readTime: '2 m',
//     slug: 'hi'
//   },
//   {
//     date: '16/02/25',
//     title: 'UI Performance',
//     readTime: '4 m',
//     slug: 'hi',
//   },
//   {
//     date: '12/02/25',
//     title: 'How AI is changing my workflow',
//     readTime: '2 m',
//     slug: 'hi',
//   },
//   {
//     date: '11/01/25',
//     title: 'Design tokens 101',
//     readTime: '2 m',
//     slug: 'hi',
//   },
  {
    date: '01/04/25',
    title: 'Hello World',
    readTime: '1 m',
    slug: 'hello-world',
  },
];

export default function Writing() {
  return (
    <section className="pb-16">
      <div className="grid md:grid-cols-[125px_1fr] gap-x-10 gap-y-6">
        
        {/* Section Label */}
        <p className="text-lg text-white/60 font-medium md:text-right mt-1.5">
          Writing
        </p>

        {/* Content */}
        <div className="w-full">
          <div className="divide-y divide-white/5 overflow-hidden">
            
            {writings.map((item, index) => (
              <Link
                href={`/${item.slug}`}
                key={index}
                className="group w-full flex items-center justify-between px-4 py-2 transition-all duration-300 hover:bg-white/[0.04]"
              >
                {/* Left */}
                <div className="flex items-center gap-6">
                  
                  {/* Date */}
                  <span className="text-sm text-white/40 w-[80px]">
                    {item.date}
                  </span>

                  {/* Title */}
                  <span className="text-white tracking-tighter font-sans transition-colors">
                    {item.title}
                  </span>
                </div>

                {/* Right */}
                <div className="flex items-center gap-1 text-white/40 text-sm">
                  <BsClock className="size-3.5" />
                  <span>{item.readTime}</span>
                </div>
              </Link>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
}