import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { client } from '../../../sanity/lib/client'
import { urlForImage } from '../../../sanity/lib/image'
import Link from 'next/link'

export const revalidate = 60

async function getProjects() {
  try {
    const query = `*[_type == "project"] | order(_createdAt desc)`
    return await client.fetch(query)
  } catch (error) {
    console.warn("Sanity fetch failed (likely missing project ID). Using fallbacks.")
    return []
  }
}

export default async function Home() {
  const sanityProjects = await getProjects()

  // Fallback data so the site still looks great before Sanity is populated
  const defaultProjects = [
    {
      _id: '1',
      title: 'Humsafar Community',
      slug: { current: 'humsafar-community' },
      coverImage: null,
      fallbackUrl: '/images/inspiration.png',
    },
    {
      _id: '2',
      title: 'The Snow Village',
      slug: { current: 'the-snow-village' },
      coverImage: null,
      fallbackUrl: 'https://cdn.dribbble.com/userupload/48455518/file/7353b9c4a0c7ea4f8ca4063ec797b79e.webp?resize=1504x846&vertical=center',
    },
    {
      _id: '3',
      title: 'Nomad Commune',
      slug: { current: 'nomad-commune' },
      coverImage: null,
      fallbackUrl: 'https://cdn.dribbble.com/userupload/46336375/file/04f5b18ea71058304b5334760192a1cd.jpg?crop=0x0-3660x2745&resize=1600x1200',
    },
    {
      _id: '4',
      title: 'Travel Objects',
      slug: { current: 'travel-objects' },
      coverImage: null,
      fallbackUrl: 'https://cdn.dribbble.com/userupload/33190146/file/original-aadbf502530d17ffd80a9e72155f3f28.jpg?resize=400x0',
    },
  ]

  const projects = sanityProjects.length > 0 ? sanityProjects : defaultProjects

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 sm:py-24 space-y-20 sm:space-y-28">
      <Header />

      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-12" id="about">
        <div className="space-y-6 max-w-lg">
          <h1 className="space-y-1 sm:space-y-2">
            <span className="block text-base sm:text-lg font-normal text-zinc-500 dark:text-zinc-400 tracking-tight leading-relaxed">
              Hi, I’m Abhay Tank. I design
            </span>
            <span className="block text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight relative pb-1 select-none">
              Itineraries, Brochures, & Digital Content for <span className="relative inline-block">travel brands.
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#f5c75d]/90 dark:text-[#f5c75d]/80" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 6C30 3 60 3 98 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M6 9C35 6 68 5 94 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              </span>
            </span>
          </h1>
          <div className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
            <p>
              Great trips deserve great design. I create beautiful itineraries, engaging social media posts, and professional brochures that help travel agencies and tour operators stand out and sell more packages.
            </p>
          </div>
        </div>
        
        {/* Rotating Stamp Sticker */}
        <div className="relative w-36 h-36 flex-shrink-0 hidden md:flex items-center justify-center font-medium text-[11px] tracking-wider uppercase text-zinc-400 dark:text-zinc-600 select-none">
          <svg className="absolute w-full h-full animate-[spin_25s_linear_infinite]" viewBox="0 0 100 100">
            <path id="circlePath" d="M 50, 50 m -42, 0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0" fill="none" />
            <text className="fill-current">
              <textPath href="#circlePath" startOffset="0%">
                • ui/ux design • brand design • visual identity • product design 
              </textPath>
            </text>
          </svg>
          <span className="text-2xl">✦</span>
        </div>
      </section>

      {/* SERVICES */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Services</h2>
          {/* Hand-drawn focus spiral doodle */}
          <svg className="w-5 h-5 text-[#f5c75d]/90 dark:text-[#f5c75d]/70 select-none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 11.5 C12 10, 13.5 10, 14 11 C14.5 12, 13.5 13.5, 12 13.5 C10 13.5, 9.5 11.5, 10.5 9.5 C11.5 7.5, 15 7.5, 16 9.5 C17 11.5, 15.5 16, 12 16 C8.5 16, 7.5 13, 8 10 C8.5 7, 12 5.5, 14.5 6 C17 6.5, 19.5 10, 18.5 13.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="space-y-2 text-sm sm:text-base">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline py-3 sm:py-4.5 border-b border-zinc-100 dark:border-zinc-800 gap-1 sm:gap-4">
            <span className="font-medium text-zinc-900 dark:text-zinc-100">Itinerary & Brochure Design</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Custom Itineraries / Destination Booklets / Travel Brochures</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline py-3 sm:py-4.5 border-b border-zinc-100 dark:border-zinc-800 gap-1 sm:gap-4">
            <span className="font-medium text-zinc-900 dark:text-zinc-100">Social Media Graphics</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Instagram Posts / Carousel Designs / Story Templates</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline py-3 sm:py-4.5 border-b border-zinc-100 dark:border-zinc-800 gap-1 sm:gap-4">
            <span className="font-medium text-zinc-900 dark:text-zinc-100">Digital Ad Creatives</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Facebook & Instagram Ads / Display Banners / Promotional Graphics</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline py-3 sm:py-4.5 border-b border-zinc-100 dark:border-zinc-800 gap-1 sm:gap-4">
            <span className="font-medium text-zinc-900 dark:text-zinc-100">Posters & Print Promo</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Event Posters / Flyers / Trade Show Banners</span>
          </div>
        </div>
      </section>

      <section className="space-y-6 sm:space-y-8" id="projects">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Selected Work</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
          {projects.map((project: any) => {
            const imageUrl = project.coverImage ? urlForImage(project.coverImage).url() : project.fallbackUrl;
            return (
              <Link href={`/project/${project.slug?.current}`} key={project._id} className="group cursor-pointer flex flex-col gap-2 block">
                <div className="relative rounded-none overflow-hidden bg-zinc-100 dark:bg-zinc-800/50 shadow-sm border border-zinc-200/50 dark:border-zinc-700/50 w-full aspect-[4/3]">
                  <img src={imageUrl} alt={project.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="px-0.5 flex justify-between items-center text-xs text-zinc-500 dark:text-zinc-400 font-medium group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                  <span>{project.title}</span>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <Footer />
    </div>
  )
}
