import * as React from 'react';
import styled from '@emotion/styled';
import omit from 'lodash/omit';

import ExternalLink from 'sentry/components/links/externalLink';
import Link from 'sentry/components/links/link';
import {IconChevron} from 'sentry/icons';
import space from 'sentry/styles/space';

type Size = 'small' | 'normal';
type Priority = 'info' | 'warning' | 'success' | 'error' | 'muted';

type LinkProps = React.ComponentPropsWithoutRef<typeof Link>;

type OtherProps = {
  ['data-test-id']?: string;
  icon?: string | React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
};

type DefaultProps = {
  size: Size;
  priority: Priority;
  withoutMarginBottom: boolean;
  openInNewTab: boolean;
  href?: string;
};

type Props = OtherProps & Partial<DefaultProps> & Partial<Pick<LinkProps, 'to'>>;

type StyledLinkProps = DefaultProps &
  Partial<Pick<LinkProps, 'to'>> &
  Omit<LinkProps, 'to' | 'size'>;

function AlertLink({
  size = 'normal',
  priority = 'warning',
  icon,
  children,
  onClick,
  withoutMarginBottom = false,
  openInNewTab = false,
  to,
  href,
  ['data-test-id']: dataTestId,
}: Props) {
  return (
    <StyledLink
      data-test-id={dataTestId}
      to={to}
      href={href}
      onClick={onClick}
      size={size}
      priority={priority}
      withoutMarginBottom={withoutMarginBottom}
      openInNewTab={openInNewTab}
    >
      {icon && <IconWrapper>{icon}</IconWrapper>}
      <AlertLinkText>{children}</AlertLinkText>
      <IconLink>
        <IconChevron direction="right" />
      </IconLink>
    </StyledLink>
  );
}

export default AlertLink;

const StyledLink = styled(({openInNewTab, to, href, ...props}: StyledLinkProps) => {
  const linkProps = omit(props, ['withoutMarginBottom', 'priority', 'size']);
  if (href) {
    return <ExternalLink {...linkProps} href={href} openInNewTab={openInNewTab} />;
  }

  return <Link {...linkProps} to={to || ''} />;
})`
  display: flex;
  background-color: ${p => p.theme.alert[p.priority].backgroundLight};
  color: ${p => p.theme.textColor};
  border: 1px dashed ${p => p.theme.alert[p.priority].border};
  padding: ${p => (p.size === 'small' ? `${space(1)} ${space(1.5)}` : space(2))};
  margin-bottom: ${p => (p.withoutMarginBottom ? 0 : space(3))};
  border-radius: 0.25em;
  transition: 0.2s border-color;

  &.focus-visible {
    outline: none;
    box-shadow: ${p => p.theme.alert[p.priority].border}7f 0 0 0 2px;
  }
`;

const IconWrapper = styled('span')`
  display: flex;
  margin: ${space(0.5)} ${space(1.5)} ${space(0.5)} 0;
`;

const IconLink = styled(IconWrapper)`
  margin: ${space(0.5)} 0;
`;

const AlertLinkText = styled('div')`
  line-height: 1.5;
  flex-grow: 1;
`;
