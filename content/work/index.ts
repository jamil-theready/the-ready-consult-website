// content/work/index.ts
import type { CaseStudy } from "@/lib/work-types";
import { teamNebula } from "./team-nebula";
import { perfectoHomes } from "./perfecto-homes";
import { cluely } from "./cluely";
import { ampere } from "./ampere";

// Order here = order of the next-case chain and featured listing.
export const CASES: CaseStudy[] = [teamNebula, perfectoHomes, cluely, ampere];
