export const getPropsObject = (obj: any) => {

  let props: string[] = [];

  do {
    const l = Object.getOwnPropertyNames(obj)
      .concat(Object.getOwnPropertySymbols(obj).map((s: any) => s.toString()))
      .sort()
      .filter((p, i, arr) =>
        typeof obj[p] === "function" &&
        p !== "constructor" &&
        (i === 0 || p !== arr[i - 1]) &&
        props.indexOf(p) === -1);
    props = props.concat(l);
  }
  while ((obj = Object.getPrototypeOf(obj)) &&
    Object.getPrototypeOf(obj)
  );

  return props;
};
