import { getReviews } from '@/actions/admin/get-reviews'
import ReviewCard from '@/components/admin-components/reviews/review-card'
import ReviewList from '@/components/admin-components/reviews/review-list'
import React from 'react'

const page = async () => {
    const reviews = await getReviews({pagination: {page: 1}})

  return (
    <div>
      <main className="@container/main flex flex-1 flex-col gap-2 px-6">
            <div className="flex flex-col gap-4 py-18 md:gap-6 md:py-6">
              <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl md:text-4xl font-bold tracking-tighter">
                  Reviews
                </h1>
              </div>
              <ReviewList Reviews={reviews?.reviews} totalReview={reviews?.totalReview as number} page={1} />
            </div>
          </main>
    </div>
  )
}

export default page
