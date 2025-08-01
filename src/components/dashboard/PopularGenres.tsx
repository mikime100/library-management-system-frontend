import { BookOpen } from 'lucide-react';

interface Genre {
  name: string;
  count: number;
}

interface PopularGenresProps {
  genres: Genre[];
}

export default function PopularGenres({ genres }: PopularGenresProps) {
  // Sort genres by count in descending order and take top 5
  const topGenres = [...genres]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Calculate the maximum count for percentage calculation
  const maxCount = topGenres[0]?.count || 1;

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Popular Genres
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Most borrowed genres this month
        </p>
      </div>
      <div className="px-4 py-5 sm:p-6">
        {topGenres.length > 0 ? (
          <div className="space-y-4">
            {topGenres.map((genre) => {
              const percentage = (genre.count / maxCount) * 100;
              return (
                <div key={genre.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {genre.name}
                    </span>
                    <span className="text-xs font-medium text-gray-500">
                      {genre.count} {genre.count === 1 ? 'book' : 'books'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
              <BookOpen className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No genre data</h3>
            <p className="mt-1 text-sm text-gray-500">
              No borrowing data available for genres.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
