import { FaSpotify } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

export default function Personal() {
  return (
    <section className="">
      <div className="grid md:grid-cols-[125px_1fr] gap-x-10 gap-y-6">
        <p className="text-lg text-white/60 font-medium md:pr-4 md:text-right">Personal</p>
        <div className="space-y-12">
          <Link 
            href="https://open.spotify.com/track/2A97bms3lEk8DlnGJGs88r?si=550a55a8172d486e"
            target="_blank"
            rel="noopener noreferrer"
            className="group block border border-dashed border-white/20 rounded-xl p-3 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
          >
            <div className="flex items-center gap-2 bg-white/5 p-2 border border-dashed border-white/10 rounded-xl">
              <Image
                src="/anohianotoki.jpg"
                alt="Anohi Anotoki Cover"
                height={80}
                width={80}
                className="rounded-md object-cover"
              />

              {/* Song Info */}
              <div className="flex-1">
                <h3 className="text-white font-medium tracking-tight">ラブ・ストーリーは突然に</h3>
                <p className="text-white/60 text-sm">Kazumasa Oda</p>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-between mt-2 text-sm">
              <p className="text-white/50">Current Favourite Song</p>
              
              {/* 2. Removed the nested <Link> and used group-hover instead */}
              <div className="flex items-center gap-1 mr-1 text-white/60 group-hover:text-white transition-colors">
                <span>Listen on Spotify</span>
                <FaSpotify />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}