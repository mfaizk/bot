"use client"
import React from 'react'
import ComingIndicator from './comming-indicator'

const CommingSoon = () => {
  return (
    <div className="min-h-[100%] w-full flex items-center justify-center">
    {/* <ComingIndicator isLoading className={"h-12 w-12"} />
    <p className="text-2xl font-semibold">Coming Soon</p> */}
      <img
                  src="/assets/other/comingsoon.png"
                  alt="comming son"
                  className="w-[200px] sm:w-[400px]  h-[200px] sm:h-[400px]  transform group-hover:scale-105 transition-transform duration-300"
                />
  </div>
  )
}

export default CommingSoon