"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  totalItems: number;
  pageSize: number;
}

export function Pagination({ totalItems, pageSize }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentPage = parseInt(searchParams.get("page") || "1");
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-zinc-900 px-4 py-6 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-none border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm font-black text-zinc-400 hover:bg-zinc-900 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-none border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm font-black text-zinc-400 hover:bg-zinc-900 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">
            Showing <span className="text-white text-sm">{(currentPage - 1) * pageSize + 1}</span> to <span className="text-white text-sm">{Math.min(currentPage * pageSize, totalItems)}</span> of <span className="text-white text-sm">{totalItems}</span> results
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px" aria-label="Pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center border border-zinc-800 bg-zinc-950 px-2 py-2 text-zinc-500 hover:bg-zinc-900 focus:z-20 focus:outline-offset-0 disabled:opacity-20"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={cn(
                  "relative inline-flex items-center px-4 py-2 text-xs font-black tracking-widest border border-zinc-800 transition-colors uppercase",
                  currentPage === i + 1 
                    ? "z-10 bg-[#00DC82] text-black border-[#00DC82]" 
                    : "bg-zinc-950 text-zinc-500 hover:bg-zinc-900"
                )}
              >
                {i + 1}
              </button>
            ))}

            <button
               onClick={() => handlePageChange(currentPage + 1)}
               disabled={currentPage === totalPages}
               className="relative inline-flex items-center border border-zinc-800 bg-zinc-950 px-2 py-2 text-zinc-500 hover:bg-zinc-900 focus:z-20 focus:outline-offset-0 disabled:opacity-20"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
