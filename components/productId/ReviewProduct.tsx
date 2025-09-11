import React from "react";
import { Card } from "../ui/card";
import { Review } from "@/types/review";

interface ProductReviewsProps {
  reviews: Review[];
}

import { FaStar } from "react-icons/fa";

const getInitials = (name: string) => {
  if (!name) return "?";
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0][0];
  return parts[0][0] + parts[parts.length - 1][0];
};

const ReviewProduct: React.FC<ProductReviewsProps> = ({ reviews }) => {
  const averageRating =
    reviews && reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : null;

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 md:p-8">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-900">
        Customer Reviews
      </h2>

      {/* Average rating summary */}
      <div className="flex items-center gap-4 mb-6">
        {averageRating ? (
          <>
            <span className="text-3xl font-semibold text-yellow-500 flex items-center">
              {averageRating}
              <FaStar className="ml-1 text-yellow-400" />
            </span>
            <span className="text-gray-500 text-sm">
              ({reviews.length} review{reviews.length > 1 ? "s" : ""})
            </span>
          </>
        ) : (
          <span className="text-gray-400 text-base">No reviews yet</span>
        )}
      </div>

      {/* Review list */}
      {!reviews || reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No reviews yet.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Be the first to review this product!
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {reviews.map((review, index) => (
            <Card
              key={index}
              className="flex items-start gap-4 bg-gray-50/80 border border-gray-100 rounded-lg p-4 shadow-none hover:shadow-md transition-shadow"
            >
              {/* Avatar/Initials */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg">
                {getInitials(review.reviewerName)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">
                    {review.reviewerName}
                  </span>
                  <span className="flex items-center gap-0.5 ml-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar
                        key={i}
                        className={
                          i < review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                        size={16}
                      />
                    ))}
                  </span>
                </div>
                <div className="text-gray-700 text-sm mb-1">
                  {review.comment}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(review.date).toLocaleDateString()}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};

export default ReviewProduct;
