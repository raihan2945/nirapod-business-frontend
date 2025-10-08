import ProjectCard from "@/views/projects/ProjectCard"


const projects = [
  {
    id: 1,
    title: "Green Valley Apartments",
    description: "A modern residential complex with eco-friendly features and sustainable design principles.",
    image: "/modern-apartment-building.png",
    status: "Active",
    funded: "75%",
    target: "BDT 50,000,000",
    raised: "BDT 37,500,000",
    investors: 245,
  },
  {
    id: 2,
    title: "Tech Hub Commercial Center",
    description: "State-of-the-art commercial space designed for technology companies and startups.",
    image: "/modern-office-building.png",
    status: "Active",
    funded: "92%",
    target: "BDT 75,000,000",
    raised: "BDT 69,000,000",
    investors: 412,
  },
  {
    id: 3,
    title: "Riverside Shopping Mall",
    description: "Premium shopping destination with waterfront views and luxury retail spaces.",
    image: "/shopping-mall-exterior.jpg",
    status: "Completed",
    funded: "100%",
    target: "BDT 120,000,000",
    raised: "BDT 120,000,000",
    investors: 678,
  },
  {
    id: 4,
    title: "Smart City Housing Project",
    description: "Integrated smart home technology in affordable housing units for modern families.",
    image: "/smart-home-residential.jpg",
    status: "Active",
    funded: "45%",
    target: "BDT 85,000,000",
    raised: "BDT 38,250,000",
    investors: 189,
  },
  {
    id: 5,
    title: "Healthcare Innovation Center",
    description: "Medical facility with cutting-edge equipment and patient-centered design.",
    image: "/modern-hospital.png",
    status: "Active",
    funded: "68%",
    target: "BDT 95,000,000",
    raised: "BDT 64,600,000",
    investors: 321,
  },
  {
    id: 6,
    title: "Educational Excellence Campus",
    description: "Modern educational facility with advanced learning spaces and recreational areas.",
    image: "/modern-school-campus.png",
    status: "Upcoming",
    funded: "15%",
    target: "BDT 60,000,000",
    raised: "BDT 9,000,000",
    investors: 87,
  },
]

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Investment <span className="text-lime-500">Projects</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Explore our diverse portfolio of Halal investment opportunities across real estate, technology, and
              infrastructure sectors.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      {/* <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium">Filter by:</span>
              <div className="flex gap-2 flex-wrap">
                <button className="px-4 py-2 bg-cyan-500 text-white rounded-full text-sm font-medium hover:bg-cyan-600 transition-colors">
                  All Projects
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors">
                  Active
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors">
                  Completed
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors">
                  Upcoming
                </button>
              </div>
            </div>
            <div className="text-gray-600">
              <span className="font-medium">{projects.length}</span> Projects Found
            </div>
          </div>
        </div>
      </section> */}

      {/* Projects Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
