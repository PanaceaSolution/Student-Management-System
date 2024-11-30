import React from 'react';
import dayjs from 'dayjs';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
   Card,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";

const NoticeCard = ({ notices = [], handleDelete, role }) => {
   // Sort notices based on the creation date
   const sortedData = notices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

   return (
      <div className='space-y-2 max-h-80 overflow-y-auto scrollbar-thumb-gray-300 scrollbar-thin'>
         {sortedData.length === 0 ? (
            <div className="text-center text-gray-500">No notices available</div>
         ) : (
            sortedData.map((notice) => (
               <Card className="bg-white" key={`${notice.noticeId}-${notice.createdAt}`}>
                  <CardHeader className="relative">
                     <CardTitle className="capitalize">{notice.title}</CardTitle>
                     <CardDescription className="text-primary">{dayjs(notice.createdAt).format("YY-MM-DD")}</CardDescription>
                     {role === "ADMIN" && (
                        <Button
                           variant="ghost"
                           size="icon"
                           onClick={() => handleDelete(notice.noticeId)} // Make sure property matches
                           className="absolute top-2 right-2 text-red-500 hover:text-red-600 hover:bg-transparent"
                        >
                           <Trash2 />
                        </Button>
                     )}
                  </CardHeader>
                  <CardFooter>
                     <p>{notice.description}</p>
                  </CardFooter>
               </Card>
            ))
         )}
      </div>
   );
}

export default NoticeCard;
