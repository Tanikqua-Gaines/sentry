type Result = Record<string, {href: string; results: boolean | null; cursor: string}>;

export default function parseLinkHeader(header: string | null): Result {
  if (header === null || header === '') {
    return {};
  }

  const headerValues = header.split(',');
  const links = {};

  headerValues.forEach(val => {
    const match =
      /<([^>]+)>; rel="([^"]+)"(?:; results="([^"]+)")?(?:; cursor="([^"]+)")?/g.exec(
        val
      );
    const hasResults = match![3] === 'true' ? true : match![3] === 'false' ? false : null;

    links[match![2]] = {
      href: match![1],
      results: hasResults,
      cursor: match![4],
    };
  });

  return links;
}
