import Link from "next/link";

// Custom Lucide-style Icons (Self-contained)
const Youtube = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" /></svg>
);

const Instagram = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);

const Linkedin = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
);

const Facebook = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);

const Pin = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" x2="12" y1="17" y2="22" /><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.79-.9A2 2 0 0 1 15 10.76V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3v4.76a2 2 0 0 1-1.11 1.79l-1.79.9A2 2 0 0 0 5 15.24Z" /></svg>
);

export default function Footer() {
  return (
    <footer className="w-full bg-[#0b0b0b] text-white px-6 md:px-10 lg:px-16 py-16 rounded-t-[24px]">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <img src="/images/logo.png" alt="Maple Logo" className="h-8 w-auto object-contain" />
            <p className="text-gray-400 text-sm">What are you waiting for?</p>
            <h3 className="text-3xl sm:text-4xl font-semibold leading-tight">
              Transform <span className="text-[#00DC82]">Learning.</span><br />
              Empower <span className="text-[#00DC82]">Teams.</span><br />
              Drive Real <span className="text-[#00DC82]">Results.</span>
            </h3>

            <Link href="/contact">
              <button className="mt-4 px-6 py-3 bg-black border border-[#1f1f1f] rounded-lg hover:border-[#00DC82] hover:shadow-[0_0_20px_rgba(0,220,130,0.4)] transition-all">
                Get in touch
              </button>
            </Link>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Pages</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link href="https://www.maplelearningsolutions.com/">Home</Link></li>
              <li><Link href="https://www.maplelearningsolutions.com/blog">Blogs</Link></li>
              <li><Link href="https://www.maplelearningsolutions.com/our-work">Works</Link></li>
              <li><Link href="https://www.maplelearningsolutions.com/contact">Contact</Link></li>
              <li><Link href="https://www.maplelearningsolutions.com/privacy-policy">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Company</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link href="https://www.maplelearningsolutions.com/about-us">About us</Link></li>
              <li><Link href="https://www.maplelearningsolutions.com/allsolutions">Solutions</Link></li>
              <li><Link href="https://www.maplelearningsolutions.com/alldomains">Domains</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Locations</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link href="https://www.maplelearningsolutions.com">India</Link></li>
              <li><Link href="https://www.maplelearningsolutions.com/ar/elearning-solutions-in-uae">UAE</Link></li>
              <li><Link href="https://www.maplelearningsolutions.com/usa">USA</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Social Links</h4>
            <div className="flex gap-3">
              {[
                { icon: Youtube, href: "https://www.youtube.com/channel/UCObkCM6XEdSA96dUwUbnV-g" },
                { icon: Instagram, href: "https://www.instagram.com/maple_learning_solutions/?fbclid=IwZXh0bgNhZW0CMTEAAR38GDDdbWwHhFKV-gbxU-buo5mLjFaT2RQqPUWl6ZNnVpJ84nnwDNiv9Zc_aem_13lDd8ebkbmOWcShtrBNlw" },
                { icon: Linkedin, href: "https://www.linkedin.com/company/maple-learning-solutions/?originalSubdomain=in" },
                { icon: Facebook, href: "https://www.facebook.com/people/Maple-Learning-Solutions/61578896339989/" },
                { icon: Pin, href: "https://in.pinterest.com/maple_learning_solutions/" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <Link key={i} href={item.href}>
                    <div className="w-11 h-11 flex items-center justify-center rounded-lg bg-[#161616] border border-[#222] hover:border-[#00DC82] hover:bg-[#00DC82] group transition-all duration-300">
                      <Icon className="w-5 h-5 text-[#00DC82] group-hover:text-black" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-16 text-gray-500 text-sm">
          ©2026 Maple Learning Solutions
        </div>
      </div>
    </footer>
  );
}
