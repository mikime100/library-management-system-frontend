import { Clock, AlertTriangle } from 'lucide-react';

interface OverdueBooksProps {
  count: number;
}

export default function OverdueBooks({ count }: OverdueBooksProps) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Overdue Books
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Books that are past their due date
        </p>
      </div>
      <div className="px-4 py-5 sm:p-6">
        {count > 0 ? (
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-100 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-medium text-gray-900">
                {count} {count === 1 ? 'book is' : 'books are'} overdue
              </h4>
              <p className="text-sm text-gray-500">
                These books should be returned as soon as possible.
              </p>
            </div>
            <div className="ml-auto">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                View all
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No overdue books</h3>
            <p className="mt-1 text-sm text-gray-500">
              All books have been returned on time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
