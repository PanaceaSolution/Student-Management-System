import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '../ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { Pagination } from './Pagination'
import ResultShowing from '../common/ResultShowing'



const TableWithActions = ({
  tableHead,
  tableBody,
  tableFields,
  noDataMessage,
  handleEdit,
  handleDelete
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  const totalPages = Math.ceil(tableBody.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPageData = tableBody.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Calculate the range of results being displayed
  const startResult = startIndex + 1;
  const endResult = Math.min(startIndex + ITEMS_PER_PAGE, tableBody.length);
  const totalResults = tableBody.length;
  return (
    <div>
      <ResultShowing
        start={startResult}
        end={endResult}
        total={totalResults}
      />

      <Table className="border-b">
        <TableHeader>
          <TableRow>
            {tableHead.map((head) => (
              <TableHead key={head}>{head}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableBody.length === 0 ? (
            <TableRow>
              <TableCell colSpan={tableHead.length}>
                <div className="text-center py-4">{noDataMessage}</div>
              </TableCell>
            </TableRow>
          ) : (
            currentPageData.map((data) => (
              <TableRow key={data.id}>
                {tableFields.map((field, i) => (
                  <TableCell key={i}>{data[field]}</TableCell>
                ))}
                <TableCell className="flex justify-center gap-2">
                  <Button
                    variant="edit"
                    size="icon"
                    className="uppercase mr-2"
                    onClick={() => handleEdit(data)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="uppercase"
                    onClick={() => handleDelete(data.id)}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

export default TableWithActions