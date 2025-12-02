/**
 * A frequently asked question item
 */
export interface FAQItem {
  /**
   * Unique FAQ identifier
   */
  id: string;
  /**
   * The question text
   */
  question: string;
  /**
   * HTML formatted answer
   */
  answer: {
    [k: string]: unknown;
  };
  /**
   * FAQ category
   */
  category?: {
    [k: string]: unknown;
  };
  /**
   * Additional metadata in JSON format
   */
  metadata?: {
    [k: string]: unknown;
  };
  /**
   * Number of views (integer)
   */
  views?: number;
  /**
   * Helpfulness score with up to 2 decimal places
   */
  helpfulness?: number;
  /**
   * FAQ tags
   */
  tags?: string[];
  [k: string]: unknown;
}
