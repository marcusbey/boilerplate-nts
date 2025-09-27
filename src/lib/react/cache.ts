// To avoid calling many time same function, you can cache them with react `cache` method

import { cache } from "react";
import { getRequiredCurrentOrg } from "../organizations/get-org";

export const getRequiredCurrentOrgCache = cache(getRequiredCurrentOrg);
