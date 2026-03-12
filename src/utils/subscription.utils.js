/**
 * Subscription utility helpers.
 * Import these across all features that need access-gating.
 *
 * Usage:
 *   import { hasActivePlan, isFullAccess, getDaysRemaining } from "../utils/subscription.utils";
 *
 *   if (!hasActivePlan(subscription)) → redirect to pricing
 *   if (isFullAccess(subscription))   → show premium content
 */

/**
 * Returns true if the student has an active subscription.
 * @param {object|null} subscription - The subscription object from API
 */
export function hasActivePlan(subscription) {
  if (!subscription) return false;
  return subscription.active === true;
}

/**
 * Returns true if the active plan is "full" tier.
 * @param {object|null} subscription
 */
export function isFullAccess(subscription) {
  if (!hasActivePlan(subscription)) return false;
  return subscription.plan?.tier === "full";
}

/**
 * Returns true if the active plan is "partial" tier.
 * @param {object|null} subscription
 */
export function isPartialAccess(subscription) {
  if (!hasActivePlan(subscription)) return false;
  return subscription.plan?.tier === "partial";
}

/**
 * Returns the number of whole days remaining until the subscription end_date.
 * Returns 0 if already expired.
 * @param {object|null} subscription
 */
export function getDaysRemaining(subscription) {
  if (!subscription?.end_date) return 0;
  const end = new Date(subscription.end_date);
  const now = new Date();
  // Zero out time portion for clean day diff
  end.setHours(23, 59, 59, 999);
  const diff = end - now;
  return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
}

/**
 * Returns a human-readable time-remaining string.
 * e.g. "2 days left", "Expires today", "Expired"
 * @param {object|null} subscription
 */
export function getExpiryLabel(subscription) {
  const days = getDaysRemaining(subscription);
  if (days === 0) return "Expires today";
  if (days < 0) return "Expired";
  if (days === 1) return "1 day left";
  return `${days} days left`;
}

/**
 * Returns which features are accessible on the current plan.
 * Useful for conditional rendering in Notes, Exams, Classes, etc.
 * @param {object|null} subscription
 */
export function getAccessibleFeatures(subscription) {
  if (!hasActivePlan(subscription)) {
    return {
      notes: false,
      exercises: false,
      exams: false,
      virtualClasses: false,
    };
  }
  const plan = subscription.plan;
  return {
    notes: plan?.notes_access ?? false,
    exercises: plan?.exercises_access ?? false,
    exams: plan?.exams_access ?? false,
    virtualClasses: plan?.virtual_classes_access ?? false,
  };
}