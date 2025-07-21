"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Define the types
type TranslatedName = {
  language_name: string;
  name: string;
};

type Chapter = {
  id: number;
  revelation_place: "makkah" | "madinah";
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  pages: [number, number];
  translated_name: TranslatedName;
};

type ChaptersResponse = {
  chapters: Chapter[];
};

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getChapters() {
      try {
        const res = await fetch("/api/quran/chapters");
        if (!res.ok) {
          throw new Error("Failed to fetch chapters");
        }

        const data: ChaptersResponse = await res.json();

        if (!data.chapters || !Array.isArray(data.chapters)) {
          throw new Error("Unexpected response format");
        }

        setChapters(data.chapters);
      } catch (err: unknown) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    }

    getChapters();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-red-500 text-center">
        <p>{error}</p>
      </div>
    );
  }

  if (chapters.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-gray-500">
        <p>No chapters found.</p>
      </div>
    );
  }

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {chapters.map((chapter) => (
        <Link
          href={`/test/${chapter.id}`}
          key={chapter.id}
          className="border rounded-xl p-4 shadow-sm hover:shadow-md transition duration-200"
        >
          <h2 className="text-lg font-bold mb-1">{chapter.name_arabic}</h2>
          <p className="text-sm text-gray-600">
            {chapter.translated_name.name}
          </p>
          <p className="text-xs text-gray-400 capitalize">
            {chapter.revelation_place} - {chapter.verses_count} آيات
          </p>
        </Link>
      ))}
    </div>
  );
};

export default Page;
