import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { client } from '../../../../../sanity/lib/client'
import { urlForImage } from '../../../../../sanity/lib/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 60

async function getProject(slug: string) {
  try {
    const query = `*[_type == "project" && slug.current == $slug][0]`
    return await client.fetch(query, { slug })
  } catch (error) {
    console.warn("Sanity fetch failed for slug:", slug)
    return null
  }
}

async function getMoreProjects(slug: string) {
  try {
    const query = `*[_type == "project" && slug.current != $slug][0...2]{
      _id,
      title,
      slug,
      coverImage
    }`
    return await client.fetch(query, { slug })
  } catch (error) {
    return null
  }
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const sanityProject = await getProject(params.slug)
  const sanityMoreProjects = await getMoreProjects(params.slug)

  // Fallback data
  const fallbackProject = {
    title: 'The Snow Village',
    client: 'The Snow Village',
    role: 'Lead Designer',
    deliverables: 'Branding, Brochures',
    year: '2025',
    description: 'A comprehensive branding and editorial design overhaul for an exclusive winter resort nestled in the Himalayan peaks.',
    fallbackCoverUrl: 'https://cdn.dribbble.com/userupload/48455518/file/7353b9c4a0c7ea4f8ca4063ec797b79e.webp?resize=1504x846&vertical=center',
    storyFallback: (
      <>
        <p>The Snow Village needed a visual identity that captured the pristine, isolated luxury of their Himalayan resort. They were struggling to attract premium travelers because their previous marketing materials felt generic and lacked a cohesive narrative.</p>
        <p>The solution was a highly editorial, minimalist approach. We designed a massive, tactile brochure utilizing expansive whitespace, crisp typography, and full-bleed imagery that allows the breathtaking landscapes to speak for themselves. The entire identity was crafted to evoke a sense of quiet luxury.</p>
      </>
    ),
    colors: ['#F7F8FA', '#D1D5DB', '#374151', '#111827'],
    fallbackGallery: [
      'https://cdn.dribbble.com/userupload/46336375/file/04f5b18ea71058304b5334760192a1cd.jpg?crop=0x0-3660x2745&resize=1600x1200',
      'https://cdn.dribbble.com/userupload/33190146/file/original-aadbf502530d17ffd80a9e72155f3f28.jpg?resize=1600x1200'
    ]
  }
  const project = sanityProject || fallbackProject

  const fallbackMoreProjects = [
    {
      _id: '1',
      title: 'Humsafar Community',
      slug: { current: 'humsafar-community' },
      coverImage: null,
      fallbackUrl: '/images/inspiration.png',
    },
    {
      _id: '3',
      title: 'Nomad Commune',
      slug: { current: 'nomad-commune' },
      coverImage: null,
      fallbackUrl: 'https://cdn.dribbble.com/userupload/46336375/file/04f5b18ea71058304b5334760192a1cd.jpg?crop=0x0-3660x2745&resize=1600x1200',
    }
  ]

  const moreProjects = sanityMoreProjects || fallbackMoreProjects

  const coverUrl = project.coverImage ? urlForImage(project.coverImage).url() : project.fallbackCoverUrl

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 sm:py-24 space-y-20 sm:space-y-28">
      <Header />

      {/* PROJECT INTRO */}
      <section className="space-y-10 sm:space-y-14">
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
            {project.title}
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs sm:text-sm font-medium border-t border-zinc-100 dark:border-zinc-800 pt-8">
          <div className="space-y-1.5">
            <span className="block uppercase tracking-widest text-zinc-400 dark:text-zinc-500 text-[10px]">Client</span>
            <span className="block text-zinc-900 dark:text-zinc-100">{project.client}</span>
          </div>
          <div className="space-y-1.5">
            <span className="block uppercase tracking-widest text-zinc-400 dark:text-zinc-500 text-[10px]">Role</span>
            <span className="block text-zinc-900 dark:text-zinc-100">{project.role}</span>
          </div>
          <div className="space-y-1.5">
            <span className="block uppercase tracking-widest text-zinc-400 dark:text-zinc-500 text-[10px]">Deliverables</span>
            <span className="block text-zinc-900 dark:text-zinc-100">{project.deliverables}</span>
          </div>
          <div className="space-y-1.5">
            <span className="block uppercase tracking-widest text-zinc-400 dark:text-zinc-500 text-[10px]">Year</span>
            <span className="block text-zinc-900 dark:text-zinc-100">{project.year}</span>
          </div>
        </div>
      </section>

      {/* HERO COVER IMAGE */}
      <section>
        <div className="relative rounded-none overflow-hidden bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50 w-full aspect-video shadow-sm">
          <img src={coverUrl} alt={project.title} className="absolute inset-0 w-full h-full object-cover" />
        </div>
      </section>

      {/* THE STORY */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        <div className="md:col-span-4 flex items-start gap-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">The Brief</h2>
          <svg className="w-5 h-5 text-[#f5c75d]/90 dark:text-[#f5c75d]/70 select-none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 11.5 C12 10, 13.5 10, 14 11 C14.5 12, 13.5 13.5, 12 13.5 C10 13.5, 9.5 11.5, 10.5 9.5 C11.5 7.5, 15 7.5, 16 9.5 C17 11.5, 15.5 16, 12 16 C8.5 16, 7.5 13, 8 10 C8.5 7, 12 5.5, 14.5 6 C17 6.5, 19.5 10, 18.5 13.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="md:col-span-8 space-y-4 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
          {project.story ? <p>Render rich text here...</p> : project.storyFallback}
        </div>
      </section>

      {/* DESIGN ELEMENTS */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Design System</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="space-y-4">
            <span className="text-[10px] font-medium tracking-widest uppercase text-zinc-400 dark:text-zinc-500">Color Palette</span>
            <div className="flex gap-3">
              {project.colors?.map((color: string, i: number) => (
                <div key={i} className="w-12 h-12 rounded-none border border-zinc-200 dark:border-zinc-700 shadow-sm" style={{ backgroundColor: color }}></div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <span className="text-[10px] font-medium tracking-widest uppercase text-zinc-400 dark:text-zinc-500">Typography</span>
            <div className="p-4 border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50 dark:bg-zinc-800/20">
              <div className="font-sans text-xl text-zinc-900 dark:text-zinc-100">Plus Jakarta Sans</div>
              <div className="font-sans text-xs text-zinc-500 dark:text-zinc-400 mt-2">Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz</div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="space-y-6 sm:space-y-8">
        {project.gallery ? (
          project.gallery.map((img: any, i: number) => (
             <div key={i} className="relative rounded-none overflow-hidden bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50 w-full aspect-video shadow-sm">
                <img src={urlForImage(img).url()} alt={`Gallery ${i}`} className="absolute inset-0 w-full h-full object-cover" />
             </div>
          ))
        ) : (
          project.fallbackGallery?.map((url: string, i: number) => (
             <div key={i} className="relative rounded-none overflow-hidden bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50 w-full aspect-video shadow-sm">
                <img src={url} alt={`Gallery ${i}`} className="absolute inset-0 w-full h-full object-cover" />
             </div>
          ))
        )}
      </section>

      {/* MORE WORK */}
      <section className="space-y-6 sm:space-y-8 pt-10 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">More Work</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {moreProjects.map((p: any) => {
            const imgUrl = p.coverImage ? urlForImage(p.coverImage).url() : p.fallbackUrl
            return (
              <Link key={p._id} href={`/project/${p.slug.current}`} className="group cursor-pointer flex flex-col gap-2 block">
                <div className="relative rounded-none overflow-hidden bg-zinc-100 dark:bg-zinc-800/50 shadow-sm border border-zinc-200/50 dark:border-zinc-700/50 w-full aspect-[4/3]">
                  {imgUrl && <img src={imgUrl} alt={p.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                </div>
                <div className="px-0.5 flex justify-between items-center text-xs text-zinc-500 dark:text-zinc-400 font-medium group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                  <span>{p.title}</span>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* NEXT PROJECT LINK */}
      <section className="pt-8 flex justify-between items-center border-t border-zinc-100 dark:border-zinc-800">
        <Link href="/#projects" className="text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500 hover:text-black dark:hover:text-white transition-colors">
          ← Back to Projects
        </Link>
        <Link href="/" className="group flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:text-[#f5c75d] transition-colors">
          Next Project
          <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
        </Link>
      </section>

      <Footer />
    </div>
  )
}
