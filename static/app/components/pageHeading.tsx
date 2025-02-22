import styled from '@emotion/styled';

import space from 'sentry/styles/space';

type Props = {
  children: React.ReactNode;
  className?: string;
  withMargins?: boolean;
};

const PageHeading = styled('h1')<Props>`
  color: ${p => p.theme.textColor};
  font-size: ${p => p.theme.headerFontSize};
  line-height: ${p => p.theme.headerFontSize};
  font-weight: normal;
  margin: 0;
  margin-bottom: ${p => p.withMargins && space(3)};
  margin-top: ${p => p.withMargins && space(1)};
`;

export default PageHeading;
