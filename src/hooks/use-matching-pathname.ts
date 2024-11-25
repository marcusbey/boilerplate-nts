import { usePathname } from "next/navigation";

export const useMatchingPathname = (links: string[]) => {
  const pathname = usePathname();
  const pathnameSegments = pathname.split("/");

  let maxMatchCount = 0;
  let bestMatch = "";

  links.forEach((link) => {
    const linkSegments = link.split("/");
    let matchCount = 0;

    linkSegments.forEach((segment, index) => {
      if (segment === pathnameSegments[index]) {
        matchCount++;
      }
    });

    if (matchCount > maxMatchCount) {
      maxMatchCount = matchCount;
      bestMatch = link;
    }
  });

  return bestMatch;
};
