import { getReviews } from "@/actions/admin/reviews/get-reviews";
import ReviewList from "@/components/admin-components/reviews/review-list";

const page = async () => {
  const reviews = await getReviews({ pagination: { page: 1 } });

  return (
    <main className="@container/main flex flex-1 flex-col gap-2 px-6">
      <div className="flex flex-col gap-4 py-18 md:gap-6 md:py-6">
        <ReviewList
          Reviews={reviews?.reviews}
          totalReview={reviews?.totalReview || 1}
          page={reviews?.page || 1}
        />
      </div>
    </main>
  );
};

export default page;
