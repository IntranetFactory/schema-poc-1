/**
 * A product in the catalog
 */
export interface Product {
  /**
   * Unique product identifier
   */
  id: string;
  /**
   * Product name
   */
  name: string;
  /**
   * Multiline product description
   */
  description?: {
    [k: string]: unknown;
  };
  /**
   * HTML formatted detailed description
   */
  detailedDescription?: {
    [k: string]: unknown;
  };
  /**
   * Additional metadata in JSON format
   */
  metadata?: {
    [k: string]: unknown;
  };
  /**
   * Product price with up to 2 decimal places
   */
  price?: number;
  /**
   * Stock quantity (integer)
   */
  stock?: number;
  /**
   * Average rating with up to 1 decimal place
   */
  rating?: number;
  /**
   * Product tags
   */
  tags?: string[];
  [k: string]: unknown;
}
