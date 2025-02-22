import {Fragment} from 'react';
import styled from '@emotion/styled';
import classNames from 'classnames';
import moment from 'moment';

import AvatarList from 'sentry/components/avatar/avatarList';
import Tooltip from 'sentry/components/tooltip';
import {IconShow} from 'sentry/icons';
import {t} from 'sentry/locale';
import ConfigStore from 'sentry/stores/configStore';
import space from 'sentry/styles/space';
import {AvatarUser, User} from 'sentry/types';
import {userDisplayName} from 'sentry/utils/formatters';

type Props = {
  // Avatar size
  avatarSize?: number;

  // List of *all* users that have seen something
  seenBy?: User[];

  // Tooltip message for the "Seen By" icon
  iconTooltip?: string;

  // Max avatars to display
  maxVisibleAvatars?: number;

  iconPosition?: 'left' | 'right';
  className?: string;
};

const SeenByList = ({
  avatarSize = 28,
  seenBy = [],
  iconTooltip = t('People who have viewed this'),
  maxVisibleAvatars = 10,
  iconPosition = 'left',
  className,
}: Props) => {
  const activeUser = ConfigStore.get('user');
  const displayUsers = seenBy.filter(user => activeUser.id !== user.id);

  if (displayUsers.length === 0) {
    return null;
  }

  // Note className="seen-by" is required for responsive design
  return (
    <SeenByWrapper
      iconPosition={iconPosition}
      className={classNames('seen-by', className)}
    >
      <AvatarList
        users={displayUsers}
        avatarSize={avatarSize}
        maxVisibleAvatars={maxVisibleAvatars}
        renderTooltip={user => (
          <Fragment>
            {userDisplayName(user)}
            <br />
            {moment((user as AvatarUser).lastSeen).format('LL')}
          </Fragment>
        )}
      />
      <IconWrapper iconPosition={iconPosition}>
        <Tooltip title={iconTooltip}>
          <IconShow size="sm" color="subText" />
        </Tooltip>
      </IconWrapper>
    </SeenByWrapper>
  );
};

const SeenByWrapper = styled('div')<{iconPosition: Props['iconPosition']}>`
  display: flex;
  margin-top: 15px;
  float: right;
  ${p => (p.iconPosition === 'left' ? 'flex-direction: row-reverse' : '')};
`;

const IconWrapper = styled('div')<{iconPosition: Props['iconPosition']}>`
  display: flex;
  align-items: center;
  background-color: transparent;
  color: ${p => p.theme.textColor};
  height: 28px;
  width: 24px;
  text-align: center;
  padding-top: ${space(0.5)};
  ${p => (p.iconPosition === 'left' ? 'margin-right: 10px' : '')};
`;

export default SeenByList;
