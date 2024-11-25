// To avoid calling many time same function, you can cache them with react `cache` method

import { cache } from "react";
import { getCurrentOrg, getRequiredCurrentOrg } from "../organizations/get-org";

export const getCurrentOrgCache = cache(getCurrentOrg);
export const getRequiredCurrentOrgCache = cache(getRequiredCurrentOrg);
