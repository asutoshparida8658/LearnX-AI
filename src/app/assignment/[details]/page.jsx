"use client"
import React from 'react'
import UserAssignment from '@/utilities/Assignment/UserAssignment'
import useAuth from '../../../../hooks/useAuth';
const page = ({params}) => {
  const [data,loading] = useAuth();
  return (
    <div>
      <UserAssignment id={params.details} userid={data&&data._id}/>
    </div>
  )
}

export default page
