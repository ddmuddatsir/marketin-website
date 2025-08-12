import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UseNotFoundOptions } from "@/types/notfount";

export function useNotFound({
  condition,
  redirectTo,
  delay = 0,
}: UseNotFoundOptions) {
  const router = useRouter();

  useEffect(() => {
    if (condition) {
      if (redirectTo) {
        if (delay > 0) {
          setTimeout(() => {
            router.push(redirectTo);
          }, delay);
        } else {
          router.push(redirectTo);
        }
      } else {
        // Trigger Next.js not-found page
        if (delay > 0) {
          setTimeout(() => {
            router.push("/not-found");
          }, delay);
        } else {
          router.push("/not-found");
        }
      }
    }
  }, [condition, redirectTo, delay, router]);
}

export function useProductNotFound(
  productExists: boolean | undefined,
  isLoading: boolean
) {
  useNotFound({
    condition: !isLoading && productExists === false,
    redirectTo: "/products/not-found",
  });
}

export function useRedirectAfterDelay(
  condition: boolean,
  redirectTo: string,
  delay: number = 3000
) {
  useNotFound({
    condition,
    redirectTo,
    delay,
  });
}
