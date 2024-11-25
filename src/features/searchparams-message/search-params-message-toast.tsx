import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";
import {
  deleteSearchParamsMessageUrl,
  SearchParamsMessageKeys,
} from "./createSearchParamsMessageUrl";

const SearchParamsMessageToast = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    let toastId: string | number | null = null;

    if (searchParams.get(SearchParamsMessageKeys.message)) {
      toastId = toast(
        searchParams.get(SearchParamsMessageKeys.message) as string,
      );
    }
    if (searchParams.get(SearchParamsMessageKeys.success)) {
      toastId = toast.success(
        searchParams.get(SearchParamsMessageKeys.success) as string,
      );
    }
    if (searchParams.get(SearchParamsMessageKeys.error)) {
      toastId = toast.error(
        searchParams.get(SearchParamsMessageKeys.error) as string,
      );
    }

    deleteSearchParamsMessageUrl();
    return () => {
      if (toastId) {
        toast.dismiss(toastId);
      }
    };
  }, [searchParams]);
  return null;
};

export const SearchParamsMessageToastSuspended = () => {
  return (
    <Suspense fallback={null}>
      <SearchParamsMessageToast />
    </Suspense>
  );
};
