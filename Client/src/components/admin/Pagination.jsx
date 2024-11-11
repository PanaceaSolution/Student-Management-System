import {
   Pagination as PaginationComponent,
   PaginationContent,
   PaginationEllipsis,
   PaginationItem,
   PaginationLink,
   PaginationNext,
   PaginationPrevious,
} from "@/components/ui/pagination";

export function Pagination({ currentPage, totalPages, onPageChange }) {
   const handlePageChange = (page) => {
      onPageChange(page);
   };

   return (
      <PaginationComponent className="p-2">
         <PaginationContent>
            <PaginationItem>
               <PaginationPrevious
                  onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
                  href="#"
                  disabled={currentPage === 1}
               />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => (
               <PaginationItem key={index + 1}>
                  <PaginationLink
                     onClick={() => handlePageChange(index + 1)}
                     href="#"
                     isActive={currentPage === index + 1}
                     className={"rounded-full"}
                  >
                     {index + 1}
                  </PaginationLink>
               </PaginationItem>
            ))}
            <PaginationItem>
               <PaginationEllipsis />
            </PaginationItem>
            {currentPage < totalPages - 1 && <PaginationEllipsis />}
            <PaginationItem>
               <PaginationNext
                  onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : totalPages)}
                  href="#"
                  disabled={currentPage === totalPages}
               />
            </PaginationItem>
         </PaginationContent>
      </PaginationComponent>
   );
}
