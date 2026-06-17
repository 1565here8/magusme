export type SpellId = string & { __brand: "SpellId" };

export interface SpellRow {
  id: SpellId;
  title: string;
  slug: string;
  tradition_id: string | null;
  source_id: string | null;
  category_id: string | null;
  rating: number;
  review_count: number;
  difficulty: string | null;
  difficulty_level: number;
  danger: string | null;
  danger_level: number;
  element: string | null;
  timing: string | null;
  counter_spell: string | null;
  warning: string | null;
  summary: string | null;
  tags: string | null;
  full_text: string | null;
  reference_link: string | null;
  created_at: string;
  updated_at: string;
  verified: number;
  verification_status: 'pending' | 'verified' | 'rejected';
  verification_source: string | null;
  verified_by: string | null;
  verified_at: string | null;
}

export interface SpellTraditionRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface SpellSourceRow {
  id: string;
  title: string;
  author: string | null;
  year: string | null;
  institution: string | null;
  url: string | null;
  pdf_ref: string | null;
  verified: number;
  created_at: string;
}

export interface SpellCategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface SpellListItem {
  id: string;
  title: string;
  slug: string;
  tradition: string | null;
  category: string;
  rating: number;
  review_count: number;
  difficulty: string;
  danger: string;
  element: string | null;
  timing: string | null;
  counter_spell: string | null;
  warning: string | null;
  source: string | null;
  tags: string[];
  summary: string | null;
  reference_link: string | null;
  verified: number;
  verification_status: 'pending' | 'verified' | 'rejected';
  verification_source: string | null;
}

export interface SpellDetail extends SpellListItem {
  tradition_id: string | null;
  source_id: string | null;
  category_id: string | null;
  difficulty_level: number;
  danger_level: number;
  full_text: string | null;
  created_at: string;
  updated_at: string;
  verification_source: string | null;
  verified_by: string | null;
  verified_at: string | null;
}

export interface SpellReview {
  id: string;
  spell_id: string;
  user_id: string;
  rating: number;
  body: string;
  created_at: string;
}

export interface SpellReviewWithUser extends SpellReview {
  user_created_at: string;
}

export interface SpellSearchParams {
  query?: string;
  category?: string;
  tradition?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}
