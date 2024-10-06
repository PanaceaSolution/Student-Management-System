import React from 'react'

const ResultShowing = ({start,end,total}) => {
  return (
    <div className="hidden sm:flex sm:flex-1 bg-[#FFFFFF] p-5 rounded sm:items-center sm:justify-between">
    <div>
      <p className="text-sm text-gray-700">
        Showing <span className="font-medium">{start}</span> to{" "}
        <span className="font-medium">{end}</span> of{" "}
        <span className="font-medium">{total}</span> results
      </p>
    </div>
  </div>
  )
}

export default ResultShowing
