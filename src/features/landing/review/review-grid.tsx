import { SectionLayout } from "../section-layout";
import type { ReviewItemProps } from "./review-item";
import { ReviewItem } from "./review-item";

type ReviewGridProps = {
  reviews: ReviewItemProps[];
};

export const ReviewGrid = (props: ReviewGridProps) => {
  return (
    <SectionLayout className="m-auto max-w-5xl columns-1 gap-4 md:columns-2 xl:columns-3">
      {props.reviews.map((review) => (
        <ReviewItem
          {...review}
          key={review.image}
          className="mb-4 break-inside-avoid-column"
        />
      ))}
    </SectionLayout>
  );
};
