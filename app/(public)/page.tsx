import { Container } from '@/components/Container';
import Link from 'next/link';
import { getJobs } from "@/actions/jobs";
import { JobCard } from "@/components/JobCard";
import Footer from '@/components/footer';

export default async function HomePage() {
  const jobs = await getJobs("OPEN");
  const latestJobs = jobs.slice(0, 3);
  const perks = [
    {
      title: "Teamwork",
      description: "Our employees work in teams and share even the boldest ideas.",
      icon: "groups"
    },
    {
      title: "Room for New Ideas",
      description: "We're always ready to listen and discuss new initiatives.",
      icon: "tips_and_updates"
    },
    {
      title: "Competitive Salary",
      description: "Get paid well for your skills! We offer competitive salary + benefits.",
      icon: "payments"
    },
    {
      title: "Personal Development",
      description: "We encourage you to study and cover your expenses on courses.",
      icon: "school"
    }
  ];

  return (
    <main className="w-full overflow-x-hidden selection:bg-[#00dc82] selection:text-[#051f18]">
      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="bg-[#051f18] min-h-[calc(100vh-64px)] flex items-center relative overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#00dc82]/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

        <Container className="py-12 md:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="space-y-6">
                <p className="text-[#00dc82] font-black uppercase tracking-[0.4em] text-[10px] flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-[#00dc82]/40" />
                  Hello and welcome
                  <span className="w-8 h-[1px] bg-[#00dc82]/40" />
                </p>
                <h1 className="font-headline text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
                  Start Your Career<br />
                  in <span className="text-[#00dc82]">Maple</span>
                </h1>
              </div>
              
              <p className="text-xl text-white/60 font-medium max-w-lg leading-relaxed tracking-tight">
                We are the people who dream & do.
              </p>

              <div className="flex flex-wrap gap-6 pt-4">
                <Link href="/about">
                  <button className="bg-[#00dc82] text-[#051f18] px-10 py-5 rounded-2xl font-headline font-black uppercase tracking-[0.2em] text-xs soft-scale shadow-2xl shadow-[#00dc82]/20 hover:scale-105 transition-all">
                    About us
                  </button>
                </Link>
                <Link href="/jobs">
                  <button className="border-2 border-white/20 bg-white/5 backdrop-blur-md text-white px-10 py-5 rounded-2xl font-headline font-black uppercase tracking-[0.2em] text-xs soft-scale hover:bg-white/10 hover:border-white/40 transition-all">
                    Vacancies
                  </button>
                </Link>
              </div>

              <div className="pt-8 border-t border-white/10">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] leading-loose">
                  Hot vacancies : <span className="text-white/80">UX Designer, JS Developer, iOS Developer, Product Manager</span>
                </p>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-end gap-6 animate-in fade-in slide-in-from-right-8 duration-1000">
               <div className="relative group">
                  <div className="absolute inset-0 bg-[#00dc82]/10 rounded-[3rem] blur-3xl group-hover:blur-[4rem] transition-all duration-700 opacity-40 -z-10" />
                  <div className="relative w-[320px] h-[520px] rounded-[3rem] overflow-hidden border-8 border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] rotate-1 group-hover:rotate-0 transition-all duration-1000 ease-out">
                     <img 
                       src="/images/hero_woman.png" 
                       alt="Maple Team Member" 
                       className="w-full h-full object-cover scale-110 group-hover:scale-105 transition-transform duration-1000"
                     />
                  </div>
               </div>

               <div className="flex flex-col gap-6 pt-12">
                  <div className="w-52 h-52 rounded-[2.5rem] overflow-hidden border-4 border-white/5 shadow-2xl -rotate-2 hover:rotate-0 transition-all duration-700 cursor-pointer">
                     <img 
                       src="/images/hero_office.png" 
                       alt="Maple Office Environment" 
                       className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                     />
                  </div>
                  <div className="w-52 h-52 rounded-[2.5rem] overflow-hidden border-4 border-white/5 shadow-2xl rotate-2 hover:rotate-0 transition-all duration-700 cursor-pointer">
                     <img 
                       src="/images/hero_meeting.png" 
                       alt="Maple Collaborative Space" 
                       className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                     />
                  </div>
               </div>
            </div>
          </div>
        </Container>
      </section>

      

      {/* ── Perks Section ────────────────────────────────────────────────── */}
      <section className="py-24 bg-white relative overflow-hidden">
        <Container>
          <div className="text-center space-y-6 mb-20">
            <p className="text-[#00dc82] font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-2">
              <span className="w-8 h-[1px] bg-[#00dc82]/40" />
              Perks
              <span className="w-8 h-[1px] bg-[#00dc82]/40" />
            </p>
            <h2 className="font-headline text-4xl md:text-5xl font-black text-[#051f18] tracking-tighter leading-none">
              Main Reasons Why You Should Work Here
            </h2>
            <p className="text-base text-on-surface-variant font-medium opacity-60 tracking-tight">
              Being a part of <span className="text-[#051f18] font-bold">Maple</span> means enjoying every working day!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">
            {perks.map((perk, i) => (
              <div key={i} className="space-y-8 group">
                <div className="relative w-16 h-16 flex items-center justify-center">
                   <div className="absolute inset-0 bg-[#00dc82]/5 rounded-[1.25rem] group-hover:bg-[#00dc82]/10 group-hover:scale-110 transition-all duration-500 ease-out" />
                   <span className="material-symbols-outlined text-3xl text-[#051f18] relative z-10 transition-transform duration-500 group-hover:-translate-y-1">
                      {perk.icon}
                   </span>
                </div>
                <div className="space-y-4">
                   <h3 className="font-headline text-xl font-black text-[#051f18] tracking-tight uppercase group-hover:text-[#00dc82] transition-colors duration-300">
                      {perk.title}
                   </h3>
                   <div className="w-10 h-1.5 bg-[#00dc82]/20 rounded-full overflow-hidden">
                      <div className="w-1/3 h-full bg-[#00dc82] group-hover:w-full transition-all duration-700 ease-out" />
                   </div>
                   <p className="text-sm text-on-surface-variant leading-relaxed font-medium opacity-70">
                      {perk.description}
                   </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Benefits Section ──────────────────────────────────────────────── */}
      <section className="bg-[#fcf9f2] overflow-hidden border-y border-[#051f18]/5">
        <div className="flex flex-col lg:flex-row">
          {/* Left Content Column */}
          <div className="flex-1 py-16 md:py-24 px-6 md:px-12 lg:px-24 flex flex-col justify-center bg-[#fcf9f2]">
            <div className="max-w-xl space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="space-y-4">
                <p className="text-[#00dc82] font-black uppercase tracking-[0.4em] text-[10px] flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-[#00dc82]/40" />
                  Benefits
                  <span className="w-8 h-[1px] bg-[#00dc82]/40" />
                </p>
                <h2 className="font-headline text-4xl md:text-5xl font-black text-[#051f18] tracking-tighter leading-[0.95]">
                  Feel and Do<br />Your Best
                </h2>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-lg font-bold text-[#051f18] tracking-tight">
                    We really care about our employees.
                  </p>
                  <p className="text-sm md:text-base text-on-surface-variant font-medium opacity-70 leading-relaxed max-w-lg">
                    Working in <span className="text-[#051f18] font-bold">Maple</span>, you get a range of benefits, resources, and expert guidance to help you to prioritize your well-being and find a work-life balance. The main benefits include:
                  </p>
                </div>

                <ul className="space-y-5">
                  {[
                    "Full healthcare coverage for you and your family;",
                    "Wellbeing reimbursement (up to $500 every month);",
                    "Home office budget to make your home workplace comfortable;"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 group">
                      <div className="mt-1 w-6 h-6 rounded-lg bg-[#00dc82] flex items-center justify-center text-[#051f18] shadow-lg shadow-[#00dc82]/20 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[16px] font-black">check</span>
                      </div>
                      <span className="text-sm md:text-base font-bold text-[#051f18]/80 leading-snug group-hover:text-[#051f18] transition-colors">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="text-xs md:text-sm text-on-surface-variant font-medium opacity-60 leading-relaxed max-w-lg italic">
                  You also can get paid sick leaves, 28 vacation days per year, separate budgets on education, your hobbies, family time, and so on. Being a part of our team is beneficial and really exciting!
                </p>
              </div>

              <button className="bg-[#051f18] text-white px-12 py-5 rounded-2xl font-headline font-black uppercase tracking-[0.2em] text-[10px] soft-scale hover:bg-opacity-95 shadow-xl shadow-[#051f18]/10 transition-all w-fit">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Image Column */}
          <div className="flex-1 relative min-h-[450px] lg:min-h-[700px] group overflow-hidden">
            <img 
              src="/images/career-sideIMG.webp" 
              alt="Professional at Maple" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            {/* Subtle Overlay to match the aesthetic */}
            <div className="absolute inset-0 bg-[#051f18]/5 group-hover:bg-transparent transition-colors duration-700" />
          </div>
        </div>
      </section>

      {/* ── Latest Jobs Section ──────────────────────────────────────────── */}
      <section className="py-24 bg-surface text-on-surface relative border-t border-surface-container/10">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="space-y-4 max-w-2xl">
              <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px] flex items-center gap-2">
                <span className="w-8 h-[1px] bg-primary/40" />
                Opportunities
              </p>
              <h2 className="font-headline text-4xl md:text-5xl font-black tracking-tighter leading-none">
                Latest Open Roles
              </h2>
            </div>
            <Link href="/jobs">
              <button className="bg-[#00dc82] text-on-primary px-8 py-4 rounded-2xl font-headline font-black uppercase tracking-[0.2em] text-[10px] soft-scale shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                View All Roles
              </button>
            </Link>
          </div>

          {latestJobs.length === 0 ? (
            <div className="text-center py-16 bg-surface-container-lowest border border-surface-container/20 rounded-[2.5rem] shadow-sm flex flex-col items-center">
              <div className="w-16 h-16 bg-surface-container-low rounded-2xl flex items-center justify-center text-outline/30 mb-6">
                 <span className="material-symbols-outlined text-4xl">event_busy</span>
              </div>
              <p className="text-on-surface-variant font-medium text-sm">No active operational slots at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {latestJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* ── About Us / Values Section ───────────────────────────────────── */}
      <section className="flex flex-col lg:flex-row w-full overflow-hidden bg-[#faefe9]">
        {/* Left Image */}
        <div className="lg:w-1/2 relative min-h-[400px] lg:min-h-[auto]">
          <img 
            src="/images/about-us.png" 
            alt="About Maple Team" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        
        {/* Right Content */}
        <div className="lg:w-1/2 py-16 px-8 md:px-16 lg:py-24 lg:px-20 flex flex-col justify-center">
          <div className="max-w-xl space-y-8">
            <div className="space-y-4">
              <p className="text-[#00dc82] font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-left gap-2">
              <span className="w-8 h-[1px] bg-[#00dc82]/40" />
              Our Values
              <span className="w-8 h-[1px] bg-[#00dc82]/40" />
            </p>
              <h2 className="font-headline text-4xl md:text-5xl font-black text-[#222222] tracking-tighter leading-tight">
                Working in Maple Be Like...
              </h2>
            </div>
            
            <p className="text-[#4a4a4a] font-semibold text-lg">
              Learn more about working in our company.
            </p>
            
            <p className="text-sm text-[#666666] leading-relaxed">
              We're an international team of enthusiastic professional committed to delivering the best technological solutions, websites, and applications for our clients. At Maple, everyone is invited to combine their talent and skills with cutting-edge tech to develop outstanding products.
            </p>
            
            <div className="space-y-8 pt-4">
              {/* Point 1 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0 text-[#4a4a4a]">
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'wght' 300" }}>lightbulb</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#222222] mb-1">Creativity at the core</h3>
                  <p className="text-sm text-[#666666] leading-relaxed">
                    Employees' creativity is a valuable asset to Maple. Here we encourage your to share new ideas and improve processes.
                  </p>
                </div>
              </div>
              
              {/* Point 2 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0 text-[#4a4a4a]">
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'wght' 300" }}>settings</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#222222] mb-1">Modern approaches</h3>
                  <p className="text-sm text-[#666666] leading-relaxed">
                    We use cutting-edge web development technologies and web design tools to deliver the best results.
                  </p>
                </div>
              </div>
              
              {/* Point 3 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0 text-[#4a4a4a]">
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'wght' 300" }}>important_devices</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#222222] mb-1">Impactful projects</h3>
                  <p className="text-sm text-[#666666] leading-relaxed">
                    We collaborate with world-famous companies and develop projects for them that have significant social impact.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ──────────────────────────────────────────────────── */}
       <section className="w-full bg-[#efe5df] py-16 px-4 sm:px-6 lg:px-8 mt-24">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#222222]">
            Start Your Career in Maple
          </h2>

          {/* Subtext */}
          <p className="mt-4 text-[#5a5a5a] text-base sm:text-lg">
            If you are motivated and driven to succeed, we invite you to apply today!
          </p>

          {/* Features */}
          <div className="mt-6 flex flex-wrap justify-center items-center gap-x-5 gap-y-2 text-[#6b6b6b] text-sm sm:text-base">
            {[
              "Friendly team",
              "Beautiful office",
              "Flexible working hours",
              "Competitive salary",
            ].map((item, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {item}
              </span>
            ))}
          </div>

          {/* CTA Button */}
          <div className="mt-8">
            <Link href="/jobs">
              <button className="bg-[#00dc82] text-black px-6 py-3 rounded-md text-sm sm:text-base font-medium hover:bg-[#00dc82] transition-all duration-300 inline-flex items-center gap-2">
                Apply Now
                <span className="text-lg">→</span>
              </button>
            </Link>
          </div>

        </div>
      </Container>
    </section>

    <Footer/>

      {/* ── Fixed Floating Elements ─────────────────────────────────────── */}
      <div className="fixed bottom-10 right-10 z-50">
         <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-blue-600/40 soft-scale cursor-pointer hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-4 border-white rounded-full" />
         </div>
      </div>
    </main>
  );
}
