// pages/index.tsx
export default function HomeFeature() {
    return (
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 text-gray-800 py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Features That Empower You
          </h2>
          <p className="mb-12 text-lg md:text-xl text-gray-700">Our issue tracking system offers powerful tools to help you stay on top of every project.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Real-time Tracking', desc: 'Monitor and manage issues as they happen with our real-time dashboard.' },
              { title: 'Collaboration', desc: 'Work seamlessly with your team using integrated tools and notifications.' },
              { title: 'Custom Workflows', desc: 'Adapt the system to fit your unique processes with flexible workflows.' },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 opacity-20 blur-xl"></div>
                <h3 className="text-2xl font-bold mb-4 text-gradient bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {feature.title}
                </h3>
                <p className="text-gray-600 relative z-10">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  