import React, { useState, useEffect } from 'react';

export default function App() {
  const TOTAL_WEEKS = 5000;
  const birthDate = new Date(1991, 6, 14); // masked birth week
  const today = new Date();

  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    global: true,
    australia: true,
    tech: true,
    markets: true,
    culture: true,
    health: true,
    chinese: true,
    travel: true
  });

  const benchmarks = {
    Australia: Math.floor(85.1 * 52),
    Japan: Math.floor(87.1 * 52),
    China: Math.floor(81 * 52)
  };

  const weekIndexFromDate = (dateObj) =>
    Math.floor((dateObj - birthDate) / (1000 * 60 * 60 * 24 * 7));

  const livedWeeks = weekIndexFromDate(today);

  useEffect(() => {
    fetch('/data/events.json')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error('Error loading events:', err));
  }, []);

  const toggleFilter = (cat) =>
    setFilters((prev) => ({ ...prev, [cat]: !prev[cat] }));

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">My Life in 5000 Weeks</h1>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.keys(filters).map((cat) => (
          <button
            key={cat}
            onClick={() => toggleFilter(cat)}
            className={`px-3 py-1 rounded ${
              filters[cat] ? 'bg-blue-500 text-white' : 'bg-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-52 gap-1 text-[8px]">
        {Array.from({ length: TOTAL_WEEKS }).map((_, i) => {
          let bgColor = 'bg-gray-200';
          if (i < livedWeeks) bgColor = 'bg-gray-500';
          if (i === weekIndexFromDate(birthDate)) bgColor = 'bg-yellow-400';
          if (i === benchmarks.Australia) bgColor = 'bg-green-400';
          if (i === benchmarks.Japan) bgColor = 'bg-blue-400';
          if (i === benchmarks.China) bgColor = 'bg-red-400';
          return <div key={i} className={`w-3 h-3 ${bgColor}`}></div>;
        })}
      </div>

      {/* Timeline */}
      <div className="mt-6 border-t pt-4">
        <h2 className="text-xl font-semibold mb-2">Timeline</h2>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {events
            .filter((ev) => filters[ev.category])
            .map((ev, idx) => (
              <div key={idx} className="p-2 bg-gray-100 rounded">
                <div className="font-medium">{ev.name}</div>
                {ev.wiki && (
                  <a
                    href={ev.wiki}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    Learn more
                  </a>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
