import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ExperienceCardProps {
  image?: string;
  title?: string;
  location?: string;
  description?: string;
  price?: string;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode; // Allow children for skeletons
}

const Card = React.forwardRef<HTMLDivElement, ExperienceCardProps>(
  ({ image, title, location, description, price, onClick, children }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl overflow-hidden shadow-md bg-white hover:shadow-lg transition-all duration-300 border border-gray-100 w-full max-w-sm"
      )}
    >
      {children ? (
        children
      ) : (
        <>
          <div className="relative w-full h-52">
            <img src={image} alt={title} className="w-full h-full object-cover" />
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <span className="text-sm bg-gray-200 text-gray-800 px-2.5 py-0.5 rounded-md">
                {location}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4">{description}</p>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div>
                <span className="text-sm text-gray-600">From </span>
                <span className="text-lg font-bold text-gray-900">₹{price}</span>
              </div>
              <Button
                onClick={onClick}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium text-sm rounded-md px-4 py-1.5"
              >
                View Details
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
);

Card.displayName = "Card";
export { Card };
