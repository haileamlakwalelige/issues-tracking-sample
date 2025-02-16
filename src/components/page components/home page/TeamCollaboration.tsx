// components/TeamCollaboration.tsx
import React from "react";
import { FaUsers, FaHandshake, FaTrophy } from "react-icons/fa";

const TeamCollaboration = () => {
  return (
    <section className="bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-500 py-16">
      <div className="container mx-auto text-center text-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-12">Effective Team Collaboration</h2>
        <div className="flex flex-wrap justify-center gap-16">
          {/* Team Collaboration Cards */}
          <div className="w-full sm:w-1/3 lg:w-1/4 bg-white p-8 rounded-lg shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl">
            <FaUsers className="text-5xl mb-6 text-purple-700 mx-auto" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Build Connections</h3>
            <p className="text-gray-700">
              Foster strong relationships within your team and create a supportive work environment.
            </p>
          </div>

          <div className="w-full sm:w-1/3 lg:w-1/4 bg-white p-8 rounded-lg shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl">
            <FaHandshake className="text-5xl mb-6 text-indigo-600 mx-auto" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Collaborative Effort</h3>
            <p className="text-gray-700">
              Work together towards a common goal and achieve more through seamless collaboration.
            </p>
          </div>

          <div className="w-full sm:w-1/3 lg:w-1/4 bg-white p-8 rounded-lg shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl">
            <FaTrophy className="text-5xl mb-6 text-blue-600 mx-auto" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Achieve Milestones</h3>
            <p className="text-gray-700">
              Celebrate team milestones and accomplishments, and keep the momentum going.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamCollaboration;
