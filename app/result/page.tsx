// "use client";

// import { useEffect, useState } from "react";
// import { useRouter} from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Check } from "lucide-react";

// export default function Result() {
//   const router = useRouter();
//   // const [searchParams] = useSearchParams();
//   const [isVisible, setIsVisible] = useState(false);
  
//   // const refId = searchParams.get("ref") || "HUF568SO";

//   useEffect(() => {
//     // Trigger animation on mount
//     setIsVisible(true);
//   }, []);

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
//       <div 
//         className={`transform transition-all duration-700 ${
//           isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
//         }`}
//       >
//         <div className="text-center space-y-6 max-w-md mx-auto">
//           {/* Success Icon */}
//           <div className="flex justify-center text-white">
//             <div 
//               className={`relative transform transition-all duration-500 delay-200 ${
//                 isVisible ? "scale-100 rotate-0" : "scale-0 rotate-180"
//               }`}
//             >
//               <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
//                 <Check className="w-12 h-12 text-green-bg-green-500-foreground stroke-[3]" />
//               </div>
//               {/* Pulse effect */}
//               <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></div>
//             </div>
//           </div>

//           {/* Heading */}
//           <div className="space-y-2">
//             <h1 className="text-3xl md:text-4xl font-bold text-foreground">
//               Booking Confirmed
//             </h1>
//             <p className="text-muted-foreground text-lg">
//               Ref ID: <span className="font-mono font-semibold text-foreground"> HUF56&SO</span>
//             </p>
//           </div>

//           {/* Back Button */}
//           <div className="pt-4">
//             <Button
//               onClick={() => router.push("/")}
//               variant="secondary"
//               size="lg"
//               className="min-w-[200px] hover:scale-105 transition-transform"
//             >
//               Back to Home
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };



"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface BookingResult {
  success: boolean;
  booking?: {
    booking_reference: string;
  };
  error?: string;
  experience?: {
    title: string;
    image: string;
  };
}

export default function Result() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [result, setResult] = useState<BookingResult | null>(null);

  useEffect(() => {
    setIsVisible(true);

    const stored = sessionStorage.getItem("bookingResult");
    if (stored) {
      setResult(JSON.parse(stored));
      sessionStorage.removeItem("bookingResult"); // clean up
    }
  }, []);

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        Loading...
      </div>
    );
  }

  const isSuccess = result.success;
  const refId = isSuccess ? result.booking?.booking_reference : null;
  const message = isSuccess ? "Booking Confirmed" : "Booking Failed";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <div
        className={`transform transition-all duration-700 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <div className="text-center space-y-6 max-w-md mx-auto">
          {/* Icon */}
          <div className="flex justify-center text-white">
            <div
              className={`relative transform transition-all duration-500 delay-200 ${
                isVisible ? "scale-100 rotate-0" : "scale-0 rotate-180"
              }`}
            >
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg ${
                  isSuccess ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {isSuccess ? (
                  <Check className="w-12 h-12 text-green-bg-green-500-foreground stroke-[3]" />
                ) : (
                  <X className="w-12 h-12 text-red-100 stroke-[3]" />
                )}
              </div>
              {isSuccess && (
                <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></div>
              )}
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {message}
            </h1>
            {isSuccess && refId && (
              <p className="text-muted-foreground text-lg">
                Ref ID:{" "}
                <span className="font-mono font-semibold text-foreground">
                  {refId}
                </span>
              </p>
            )}
            {!isSuccess && result.error && (
              <p className="text-muted-foreground text-lg">
                {result.error}
              </p>
            )}
          </div>

          {/* Back Button */}
          <div className="pt-4">
            <Button
              onClick={() => router.push("/")}
              variant="secondary"
              size="lg"
              className="min-w-[200px] hover:scale-105 transition-transform"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
