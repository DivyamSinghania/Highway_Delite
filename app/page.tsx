'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Experience } from '@/lib/supabase';

export default function Home() {
  const [experiences, setExperiences] =   useState<Experience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch('/api/experiences');
        if (!response.ok) throw new Error('Failed to fetch experiences');
        const data = await response.json();
        setExperiences(data.experiences);
        setFilteredExperiences(data.experiences); // initialize filtered list
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  // Update filtered experiences when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredExperiences(experiences);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredExperiences(
        experiences.filter(
          (exp) =>
            exp.title.toLowerCase().includes(query) ||
            exp.location.toLowerCase().includes(query) ||
            exp.category.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, experiences]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 shadow-lg">
        <header className="bg-white border-b sticky top-0 z-50 backdrop-blur-sm bg-white/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Highway Delite
            </h1> */}
            <img src='/logo_nobg.png' width="100px" alt='Highway Delite Logo'/>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12 text-center">
            <Skeleton className="h-12 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-[500px] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-52 w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <Card className="max-w-md p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 backdrop-blur-sm bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between gap-4">
          <Link href="/">
            {/* <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity">
              Highway Delite
            </h1> */}
            <img src='/logo_nobg.png' width="100px" alt='Highway Delite Logo'/>
          </Link>

          {/* Search bar */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search experiences..."
            className="flex-1 max-w-sm px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Discover Amazing Experiences
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Book unforgettable activities and create lasting memories
          </p>
        </div>

        {/* Cards Grid */}
        {filteredExperiences.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              No experiences found matching &quot;{searchQuery}&quot;.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExperiences.map((experience) => (
              <Card
                key={experience.id}
                image={experience.image_url}
                title={experience.title}
                location={experience.location}
                description="Curated small-group experience. Certified guide. Safety first with gear included."
                price={experience.price.toString()}
                onClick={() => (window.location.href = `/experience/${experience.id}`)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">
            &copy; 2025 Highway Delite. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
