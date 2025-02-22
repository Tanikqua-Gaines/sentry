// Taken from https://stackoverflow.com/a/56859650/1015027
export function findTextWithMarkup(
  contentNode: null | Element,
  textMatch: string | RegExp
) {
  const hasText = (node: Element) => node.textContent === textMatch;
  const nodeHasText = hasText(contentNode as Element);
  const childrenDontHaveText = Array.from(contentNode?.children || []).every(
    child => !hasText(child)
  );
  return nodeHasText && childrenDontHaveText;
}

/**
 * May be used with a *ByText RTL matcher to match text within multiple nodes
 *
 * e.g.: <div>Hello <span>world</span></div>
 */
export function textWithMarkupMatcher(textMatch: string | RegExp) {
  return function (_: string, element: Element | null) {
    return findTextWithMarkup(element, textMatch);
  };
}
