import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { BookOpen, X, Upload } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import api from "../../lib/api";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Textarea from "../../components/ui/Textarea";

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  publishedYear: z.coerce
    .number()
    .min(1000, "Invalid year")
    .max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  genre: z.string().min(1, "Genre is required"),
  availableCopies: z.coerce.number().int().min(0, "Cannot be negative"),
});

type BookFormData = z.infer<typeof bookSchema>;

interface BookFormProps {
  defaultValues?: BookFormData & { id?: string };
  isEditing?: boolean;
  onSuccess?: () => void;
}

export default function BookForm({
  defaultValues,
  isEditing = false,
  onSuccess,
}: BookFormProps) {
  const navigate = useNavigate();

  const {
    data: genres = [],
    isLoading: genresLoading,
    error: genresError,
  } = useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      const { data } = await api.get("/genres");
      return data.map((g: any) => ({
        id: g.id?.toString() ?? "",
        name: typeof g.name === "string" ? g.name : "",
      }));
    },
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
  } = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      author: "",
      publishedYear: new Date().getFullYear(),
      genre: "",
      availableCopies: 1,
      ...defaultValues,
    },
  });

  const availableCopies = watch("availableCopies") as number;

  const onSubmit: SubmitHandler<BookFormData> = async (data: BookFormData) => {
    try {
      if (isEditing && defaultValues?.id) {
        const payload = {
          title: data.title,
          author: data.author,
          published_year: Number(data.publishedYear),
          genre_id: Number(data.genre),
          available_copies: Number(data.availableCopies),
        };
        await api.patch(`/books/${defaultValues.id}`, payload);
      } else {
        const payload = {
          title: data.title,
          author: data.author,
          published_year: Number(data.publishedYear),
          genre_id: Number(data.genre),
          available_copies: Number(data.availableCopies),
        };
        await api.post("/books", payload);
      }
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/books");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(
          ([field, message]) => {
            setError(field as keyof BookFormData, {
              type: "manual",
              message: Array.isArray(message) ? message[0] : String(message),
            });
          }
        );
      } else {
        setError("root", {
          type: "manual",
          message: errorMessage,
        });
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-xl mx-auto"
    >
      {errors.root?.message && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{errors.root.message}</p>
            </div>
          </div>
        </div>
      )}
      {errors.root && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{errors.root.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {isEditing ? "Edit Book" : "Add New Book"}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {isEditing
              ? "Update the book details below."
              : "Fill in the details to add a new book to the library."}
          </p>
        </div>

        <div className="px-4 py-5 sm:p-6 space-y-6">
          {/* Removed Book Cover Upload section for Add Book modal */}

          {/* Book Details */}
          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <Input
                id="title"
                {...register("title")}
                error={errors.title?.message as string}
                placeholder="Enter book title"
                fullWidth
              />
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Author <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <Input
                id="author"
                {...register("author")}
                error={errors.author?.message as string}
                placeholder="Enter author name"
                fullWidth
              />
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
            <label
              htmlFor="publishedYear"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Published Year <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <Input
                id="publishedYear"
                type="number"
                {...register("publishedYear")}
                error={errors.publishedYear?.message as string}
                placeholder="e.g., 2023"
                fullWidth
              />
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
            <label
              htmlFor="genre"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Genre <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <Controller
                name="genre"
                control={control}
                render={({ field }) => (
                  <Select
                    id="genre"
                    {...field}
                    error={errors.genre?.message as string}
                    disabled={genresLoading}
                  >
                    <option value="">
                      {genresLoading ? "Loading genres..." : "Select a genre"}
                    </option>
                    {genres.map((genre: any) => (
                      <option key={genre.id} value={genre.id}>
                        {genre.name}
                      </option>
                    ))}
                  </Select>
                )}
              />
              {genresError && (
                <p className="mt-2 text-sm text-red-600">
                  Failed to load genres. Please try again.
                </p>
              )}
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
            <label
              htmlFor="availableCopies"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Available Copies <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <Input
                id="availableCopies"
                type="number"
                min="0"
                {...register("availableCopies")}
                error={errors.availableCopies?.message as string}
                fullWidth
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="mr-3"
            as="button"
            to=""
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="primary"
            as="button"
            to=""
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : isEditing ? (
              "Update Book"
            ) : (
              "Add Book"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
