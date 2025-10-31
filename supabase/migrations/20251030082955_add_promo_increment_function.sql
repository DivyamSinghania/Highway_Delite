/*
  # Add Promo Code Increment Function

  Creates a database function to safely increment promo code usage counter.

  ## Changes
  - Creates `increment_promo_usage` function that atomically increments current_uses
*/

CREATE OR REPLACE FUNCTION increment_promo_usage(promo_code_text TEXT)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE promo_codes
  SET current_uses = current_uses + 1
  WHERE code = promo_code_text AND is_active = true;
END;
$$;
