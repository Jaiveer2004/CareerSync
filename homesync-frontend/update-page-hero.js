const fs = require('fs');

const pg = './src/app/page.tsx';
let content = fs.readFileSync(pg, 'utf8');

const heroReplace = `<section className="pt-32 pb-20 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto text-center max-w-4xl">
          <p className="text-sm font-semibold tracking-widest text-[#1e40af] uppercase mb-4">
            Reliable Household Professionals
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 font-serif leading-tight">
            Premium home services,<br />
            <span className="text-[#1e40af]">scheduled in minutes</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            From emergency repairs to recurring maintenance, HomeSync connects you with verified experts and transparent pricing.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link href="/services">
              <Button className="w-full sm:w-auto px-8 py-6 text-lg bg-[#1e40af] hover:bg-blue-900 text-white rounded-lg shadow-md transition-all">
                Book a Service
              </Button>
            </Link>
            <Link href="#categories">
              <Button variant="outline" className="w-full sm:w-auto px-8 py-6 text-lg border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg transition-all">
                Explore Categories
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 text-center">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 px-10 shadow-sm w-full sm:w-auto flex-1 max-w-[240px]">
              <div className="text-4xl font-bold text-[#1e40af] mb-2">4.8</div>
              <div className="text-slate-500 font-medium">Average Service Rating</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 px-10 shadow-sm w-full sm:w-auto flex-1 max-w-[240px]">
              <div className="text-4xl font-bold text-[#1e40af] mb-2">50K+</div>
              <div className="text-slate-500 font-medium">Satisfied Customers</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 px-10 shadow-sm w-full sm:w-auto flex-1 max-w-[240px]">
              <div className="text-4xl font-bold text-[#1e40af] mb-2">1,200+</div>
              <div className="text-slate-500 font-medium">Verified Partners</div>
            </div>
          </div>
        </div>
      </section>`;

// Replace from <section className="pt-24 to </section> for the hero
const match = /<section className="pt-24[^>]*>[\s\S]*?<\/section>/;
content = content.replace(match, heroReplace);

fs.writeFileSync(pg, content);
