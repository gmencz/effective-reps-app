export function parseNumberParam(param: string | undefined) {
  if (param === undefined) {
    return null;
  }

  const number = Number(param);
  if (Number.isNaN(number)) {
    return null;
  }

  return number;
}
