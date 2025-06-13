import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Review } from "@/types/review";

interface ProductReviewsProps {
  reviews: Review[];
}

const ReviewProduct: React.FC<ProductReviewsProps> = ({ reviews }) => {
  return (
    <div>
      <section>
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet.</p>
        ) : (
          <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4">
            {reviews.map((review, index) => (
              <Card key={index} className="bg-gray-50 p-4">
                <CardHeader className="flex justify-between items-center p-0 mb-2">
                  <CardTitle className="text-lg font-semibold">
                    {review.reviewerName}
                  </CardTitle>
                  <Badge variant="secondary">{review.rating} ⭐</Badge>
                </CardHeader>
                <CardDescription>{review.comment}</CardDescription>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ReviewProduct;
