/**
 * HUD MTSP (Multifamily Tax Subsidy Project) Income Limits
 * Frozen limits for 2026 Rule Year used for deterministic calculation.
 * 
 * Source: HUD MTSP Income Limit Documentation, 2026 Rule Year.
 * Effective Date: 03/01/2026
 */

export const HUD_MTSP_LIMITS_2026 = {
  "Boston-Cambridge-Newton, MA-NH": {
    1: 63180, 2: 72180, 3: 81180, 4: 90180, 5: 97440, 6: 104640, 7: 111840, 8: 119040
  },
  "New York-Newark-Jersey City, NY-NJ-PA": {
    1: 62880, 2: 71880, 3: 80880, 4: 89880, 5: 97080, 6: 104280, 7: 111480, 8: 118680
  },
  "Los Angeles-Long Beach-Anaheim, CA": {
    1: 59340, 2: 67800, 3: 76260, 4: 84720, 5: 91560, 6: 98340, 7: 105120, 8: 111900
  },
  "Chicago-Naperville-Elgin, IL-IN-WI": {
    1: 52200, 2: 59640, 3: 67080, 4: 74520, 5: 80520, 6: 86460, 7: 92460, 8: 98400
  },
  "San Francisco-Oakland-Hayward, CA": {
    1: 76020, 2: 86880, 3: 97740, 4: 108600, 5: 117300, 6: 126000, 7: 134700, 8: 143400
  },
  "Austin-Round Rock, TX": {
    1: 49080, 2: 56100, 3: 63120, 4: 70140, 5: 75780, 6: 81420, 7: 87000, 8: 92640
  }
};

export function getMtspLimit(householdSize, metroArea) {
  if (!householdSize || householdSize < 1) return null;
  const size = Math.min(householdSize, 8); // Cap at 8
  
  // Default to Boston if area not selected or not found
  const areaData = HUD_MTSP_LIMITS_2026[metroArea] || HUD_MTSP_LIMITS_2026["Boston-Cambridge-Newton, MA-NH"];
  
  return areaData[size];
}
