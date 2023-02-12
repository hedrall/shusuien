import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDroplet } from '@fortawesome/free-solid-svg-icons';
import { faSpoon } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { 履歴の内容 } from '@frontend/domain/model/history';

export const ICONS = {
  灌水: () => <FontAwesomeIcon icon={faDroplet} />,
  植替え: () => <FontAwesomeIcon icon={faSpoon} />,
  成長の記録: () => <FontAwesomeIcon icon={faPen} />,
  画像を更新: () => <FontAwesomeIcon icon={faImage} />,
} satisfies { [Key in 履歴の内容.Type]: React.FC };
