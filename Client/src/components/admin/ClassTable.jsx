import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {Button} from '../ui/button'



const ClassTable = ({tableHead,tableBody}) => {

  return (
    <Table>
    <TableHeader>
      <TableRow> 
        {tableHead.map((head, index) => (
          <TableHead key={index}>{head}</TableHead>
        ))}
      </TableRow>
      
    </TableHeader>
    <TableBody>
     
        {
          tableBody.map((data) => (
            <TableRow key={data.id}>
            <TableCell >{data.teacherName}</TableCell>
            <TableCell >{data.gender}</TableCell>
            <TableCell >{data.subject}</TableCell>
            <TableCell >{data.class}</TableCell>
            <TableCell >
            <Button
               variant="edit"
               className="uppercase"
            >
              Edit
            </Button>
            <Button
               variant="destructive"
               className="uppercase"
            >
               Delete
            </Button>
            </TableCell>
            </TableRow>
          ))
        }
        


     
      
    </TableBody>
  </Table>
  )
}

export default ClassTable
