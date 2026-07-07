"use client";

import { SubmitEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export function ReviewForm({ dressId, type, orderId, orderItemId }: { dressId: string; type: string; orderId: string; orderItemId: string }) {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    if (!comment.trim()) {
      setError("Please enter a comment.");
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch("/api/reviews/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dressId, type, rating, comment, orderId, orderItemId }),
      });
      if (!response.ok) {
        setIsLoading(false);
        setError("Failed to submit the review. Please try again.");
      }
      // Handle successful submission (e.g., clear form, show success message)
    } catch (error) {
      setError("An error occurred while submitting the review.");
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-card p-6 rounded-lg border"
    >
      <div className="mb-4 border-b pb-6 flex items-center justify-between">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tighter">
          Write a Review
        </h1>
      </div>
      <div>
        <label className="block text-sm font-medium mb-3">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`transition-colors ${
                star <= rating
                  ? "text-yellow-400"
                  : "text-gray-300 hover:text-yellow-200"
              }`}
            >
              <Star size={32} fill={star <= rating ? "currentColor" : "none"} />
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {rating} out of 5 stars
        </p>
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium mb-2">
          Your Review
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this product..."
          rows={4}
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
          disabled={isLoading}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={isLoading || !comment.trim()}>
        {isLoading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
