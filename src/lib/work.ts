// src/lib/work.ts
import { CASES } from "../../content/work";
import * as S from "./work-select";
import type { CaseStudy } from "./work-types";

export const getAllCases = (): CaseStudy[] => S.published(CASES);
export const getFeaturedCases = (): CaseStudy[] => S.featured(CASES);
export const getGridCases = (): CaseStudy[] => S.grid(CASES);
export const getCaseBySlug = (slug: string): CaseStudy | null => S.bySlug(CASES, slug);
export const getNextCase = (slug: string): CaseStudy | null => S.nextCase(CASES, slug);
