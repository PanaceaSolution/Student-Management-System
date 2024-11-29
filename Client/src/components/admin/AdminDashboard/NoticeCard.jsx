import React from 'react'
import dayjs from 'dayjs';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
   Card,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card"


const NoticeCard = ({ notices, handleDelete, role }) => {
   const sortedData = notices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
   return (
      <div className='space-y-2 max-h-80 overflow-y-auto scrollbar-thumb-gray-300 scrollbar-thin'>
         {sortedData.map((notice) => (
            <Card className="bg-white">
               <CardHeader className="relative">
                  <CardTitle className="capitalize">{notice.title}</CardTitle>
                  <CardDescription className="text-primary">{dayjs(notice.createdAt).format("YY-MM-DD")}</CardDescription>
                  {role === "ADMIN" && <Button
                     variant="ghost"
                     size="icon"
                     onClick={() => handleDelete(notice.noticeID)}
                     className="absolute top-2 right-2 text-red-500 hover:text-red-600 hover:bg-transparent"
                  >
                     <Trash2 />
                  </Button>}
               </CardHeader>
               <CardFooter>
                  <p>{notice.description}</p>
               </CardFooter>
            </Card>
         ))}
      </div>

   )
}

export default NoticeCard