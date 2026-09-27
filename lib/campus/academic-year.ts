/**
 * Academic Year Utilities for URPASS Campus
 *
 * In higher education (India/Global), academic years typically run from
 * July 1 to June 30 of the following calendar year.
 */

export function getCurrentAcademicYear(referenceDate = new Date()): string {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth(); // 0 = Jan, 5 = June, 6 = July

  // If July (month 6) or later, current academic year is year-(year+1)
  // If before July, current academic year started in (year-1) and ends in year
  const startYear = month >= 5 ? year : year - 1;
  const endYearShort = String((startYear + 1) % 100).padStart(2, "0");

  return `${startYear}-${endYearShort}`;
}

export function getAcademicYearOptions(baseYear?: number): string[] {
  const current = baseYear ?? new Date().getFullYear();
  const options: string[] = [];

  // 2 past years, current year, 2 future years
  for (let offset = -2; offset <= 2; offset++) {
    const start = current + offset;
    const endShort = String((start + 1) % 100).padStart(2, "0");
    options.push(`${start}-${endShort}`);
  }

  return options;
}

export function isValidAcademicYear(yearStr: string): boolean {
  return /^\d{4}-\d{2,4}$/.test(yearStr.trim());
}
