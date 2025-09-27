export const getCallbackUrl = (fallbackUrl: string): string => {
  const searchParams = new URLSearchParams(window.location.search);
  const callbackUrlParams = searchParams.get("callbackUrl");

  if (callbackUrlParams) {
    if (callbackUrlParams.startsWith("/")) return callbackUrlParams;
    if (callbackUrlParams === "null") return "/";
    return `/${callbackUrlParams}`;
  }

  return fallbackUrl;
};
