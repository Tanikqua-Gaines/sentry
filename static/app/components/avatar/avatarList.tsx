import {Component} from 'react';
import {css} from '@emotion/react';
import styled from '@emotion/styled';

import UserAvatar from 'sentry/components/avatar/userAvatar';
import Tooltip from 'sentry/components/tooltip';
import {AvatarUser} from 'sentry/types';

const defaultProps = {
  avatarSize: 28,
  maxVisibleAvatars: 5,
  typeMembers: 'users',
  tooltipOptions: {},
};

type DefaultProps = Readonly<typeof defaultProps>;
type Mutable<T> = {-readonly [P in keyof T]: T[P]};

type Props = {
  className?: string;
  users: AvatarUser[];
  renderTooltip?: UserAvatar['props']['renderTooltip'];
  tooltipOptions: Mutable<UserAvatar['props']['tooltipOptions']>;
} & DefaultProps;

export default class AvatarList extends Component<Props> {
  static defaultProps = defaultProps;

  render() {
    const {
      className,
      users,
      avatarSize,
      maxVisibleAvatars,
      renderTooltip,
      typeMembers,
      tooltipOptions,
    } = this.props;

    const visibleUsers = users.slice(0, maxVisibleAvatars);
    const numCollapsedUsers = users.length - visibleUsers.length;

    if (!tooltipOptions.position) {
      tooltipOptions.position = 'top';
    }

    return (
      <AvatarListWrapper className={className}>
        {!!numCollapsedUsers && (
          <Tooltip title={`${numCollapsedUsers} other ${typeMembers}`}>
            <CollapsedUsers size={avatarSize} data-test-id="avatarList-collapsedusers">
              {numCollapsedUsers < 99 && <Plus>+</Plus>}
              {numCollapsedUsers}
            </CollapsedUsers>
          </Tooltip>
        )}
        {visibleUsers.map(user => (
          <StyledAvatar
            key={`${user.id}-${user.email}`}
            user={user}
            size={avatarSize}
            renderTooltip={renderTooltip}
            tooltipOptions={tooltipOptions}
            hasTooltip
          />
        ))}
      </AvatarListWrapper>
    );
  }
}

// used in releases list page to do some alignment
export const AvatarListWrapper = styled('div')`
  display: flex;
  flex-direction: row-reverse;
`;

const Circle = p => css`
  border-radius: 50%;
  border: 2px solid ${p.theme.background};
  margin-left: -8px;
  cursor: default;

  &:hover {
    z-index: 1;
  }
`;

const StyledAvatar = styled(UserAvatar)`
  overflow: hidden;
  ${Circle};
`;

const CollapsedUsers = styled('div')<{size: number}>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  text-align: center;
  font-weight: 600;
  background-color: ${p => p.theme.gray200};
  color: ${p => p.theme.gray300};
  font-size: ${p => Math.floor(p.size / 2.3)}px;
  width: ${p => p.size}px;
  height: ${p => p.size}px;
  ${Circle};
`;

const Plus = styled('span')`
  font-size: 10px;
  margin-left: 1px;
  margin-right: -1px;
`;
