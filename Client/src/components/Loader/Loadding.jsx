import { LoaderCircle } from 'lucide-react'
import React from 'react'

const Loadding = () => {
  return (
    <div className='grid items-center'>
      <LoaderCircle className='animate-spin' color="#167203" />
    </div>
  )
}

export default Loadding
