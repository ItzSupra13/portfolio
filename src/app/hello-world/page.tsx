'use client';

import { BsClock } from 'react-icons/bs';
import { HiOutlineBars3BottomLeft } from 'react-icons/hi2';
import Link from 'next/link';

const MORE_POSTS = [
  {
    date: '11/01/25',
    title: 'Design tokens 101',
    time: '2 m',
  },
  {
    date: '12/02/25',
    title: 'How AI is changing my workflow',
    time: '2 m',
  },
  {
    date: '16/02/25',
    title: 'UI Performance',
    time: '4 m',
  },
  {
    date: '21/02/25',
    title: 'How to think like both a designer & engineer',
    time: '2 m',
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#0e0e11] text-white">
      <div className="mx-auto max-w-3xl px-6 py-16">

        <Link
          href="/"
          className="text-sm text-white/40 hover:text-white/70 transition-colors flex items-center gap-2 mb-10"
        >
          ↩︎ BACK
        </Link>

        <div className="flex items-center justify-between text-sm text-white/40 mb-6">
          
          {/* Left */}
          <div className="flex items-center gap-3">
            <span className="tracking-wider uppercase font-mono">
              March 22, 2026
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1">
              <BsClock className="size-4" />
              <span>1 m</span>
            </div>

            <div className="flex items-center gap-1">
              <HiOutlineBars3BottomLeft className="size-4" />
              <span className='font-mono'>90 words</span>
            </div>
          </div>
        </div>


        <h1 className="text-5xl font-semibold tracking-tight mb-8">
          Hello World
        </h1>

        <div className="space-y-6 text-lg leading-relaxed text-white/60">
          <p>
            So what shall we talk about? Blog is a very new thing to me in order to express my thoughts in plain writing
          </p>

          <p>
            As a guy who has been calling himself a Full-Stack Engineer, AI Engineer, DL Enthusiast for the past 1½ years, I find myself as a complete liar. A chaser of the best words there are for recruiters.
            As someone from a non-CS background who loves this field, it has been a very wierd experience for me. Neither do I know how to catch up with others in terms of Projects, Leetcode, Competitive Programming (not CP hehe)
            In fact I've come to realize one thing. I'm a generalist, who can adapt to anything, may it be CFD, Design, Copywriting, DL, Electrical Circuits (Ive always wanted to invent something),    but also a coward, who hates going into depths of anything I work on.
          </p>

          <p>
            All I know is i'm very Tech-fluent. Ideas pop up randomly that range from helping the ones in need to ones with greed. I don't know if it's actually a personality type other people have.
            But this realization of loving depth but hating going into it, this irony is what kills me every day.

          </p>
          <p>A day wasted planning a random chrome extension I never finished.</p>
          <p>A day wasted in randomly learning business fundamentals to start a Startup of my own one day</p>
          <p>A day helping some friends out with their applications. They think I'm a knowledgeable guy, but I truly know that I'm really not</p>
          <p>
            Heck I dont even love whatever I do. Coding pains my eyes. What gets me going is the complexity humankind has given to any subject. Everything is just 'interesting' to me. And that causes me to not think twice and dive in. 
            Sheer interest I say. Not love. But the world is kinda cruel to Generalists. Everyone wants Specialists. It's only at the top positions I feel is being a generalist kinda useful.
          </p>
          <p>
            Again, interest. I love everything that makes my brain tickle. Economics? Heck Yeah. History? Maybe the fun facts. That's why maybe writing this blog may help me gain clarity.
            I'll try to post on twitter to gain following through Build In Public. That's also something I really like. I really like sharing something I learnt. But also BIP is kinda shit. Cuz how the hell is you posting something you find interesting so many times a day without losing focus.
            I'll try to do Leetcode. I'll try to make projects. I'll try to express myself more until I truly find what I like. Heck my college grades be tanking for focusing this much.
          </p>
          <p>
            Maybe writing this blog from beginning has given me some clarity. Maybe not. But again I say. I hate Tech, I only like it when my brain tingles. But yeah I do this to get a job at the end of the day.
            Maybe I'll make a game one day, who knows? Ive been interested in building games since childhood. But goal 1 is to keep myself from starving in this harsh market. Ill do whatever it takes to 'get rich' honestly.
            Something Ive also realized is Im pretty good at "Stealing like an Artist", maybe Ill look into more of that me later.
          </p>
          <p>
            I get a shit ton of fomo from those who are doing better. They deserve their achievements, but this feeling of being left out gets onto me. Then suddenly a brief 5 min motivation, daily planning, and back to square 0.
            I sometimes feel "Are they being performative". Obviously not, but that's jealousy for you. Every day this thought of feeling behind gets me even more behind honestly. The more I do the less I wanna do.
            Switching from coding books to old literature, to anime. My brain is a complete mess really. Heck that shows upon my music playlist. I kid you not every language ever has seen this playlist. Again, interest. I dont have a preference in music.
          </p>
          <p>
            Maybe someday I'll even make music to console someone in my state too, who knows. But yeah, here on now, I'll just pretend I like to do all that gets me money. Leetcode, AI engineering, anything, and Ill try my best to show what's up.
            Im almost turning 20. No 20 year old should feel this concerned I believe. But again seeing people with actual passion with this 'dynamic' passion of mine, it stings. 0 progress everywhere. But all I guarantee is adaptability. Maybe not tbh.
            Im guessing BIP is the only thing that's gonna give me any chances at earning money. I'd like to commit to it, it feels nice. Fuck the 'noone is seeing it' mindset, I just wanna build something useful that helps someone. That's all.
          </p>
          <p>
            If you've really read it all, I give you some credit. I've touched my phone thrice during writing this, my eyes dont like looking at the laptop anymore, I'd like to look at nature more tbh. But yeah, hope to gain more money by
            providing more clarity on topics that are interesting to me. Again, interest, but they say stick to your niche. My niche tbh is making money and keeping my brain healthy, maybe some stoic books, some psychology, my parent's love, a pinch of that fake glazing my friends do.
          </p>
          <p>
            Who knows what will become of me, but in the end I just wanna say <br /> <span className='text-white'>"Hello World, Im here to make a bucket load of money, with the healthy kind of greed and a honest path"</span>
          </p>
        </div>

        {/* 📚 MORE */}
        <div className="mt-16">
          <p className="text-xs tracking-[0.2em] text-white/30 mb-6">
            MORE
          </p>

          <div className="space-y-4">
            {MORE_POSTS.map((post, index) => (
              <div
                key={index}
                className="group flex items-center justify-between text-sm"
              >
                {/* Left */}
                <div className="flex items-center gap-6">
                  <span className="text-white/30 w-[80px]">
                    {post.date}
                  </span>

                  <span className="text-white/70 group-hover:text-white transition-colors">
                    {post.title}
                  </span>
                </div>

                {/* Right */}
                <div className="flex items-center gap-1 text-white/40">
                  <BsClock className="size-3.5" />
                  <span>{post.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}