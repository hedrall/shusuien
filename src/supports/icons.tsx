import React, { CSSProperties } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDroplet } from '@fortawesome/free-solid-svg-icons';
import { faSpoon } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faTableCells } from '@fortawesome/free-solid-svg-icons';
import { faTableList } from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { faPills } from '@fortawesome/free-solid-svg-icons';
import { 履歴の内容 } from '@frontend/domain/model/履歴';

export const ICONS = {
  灌水: () => <FontAwesomeIcon icon={faDroplet} />,
  植替え: () => <FontAwesomeIcon icon={faSpoon} />,
  成長の記録: () => <FontAwesomeIcon icon={faPen} />,
} satisfies { [Key in 履歴の内容.Type]: React.FC };

export const OPERATION_ICONS = {
  DELETE: (p: { style?: CSSProperties }) => <FontAwesomeIcon icon={faTrash} style={{ ...p.style, color: '#ff2c2c' }} />,
  MENU: (p: { style?: CSSProperties }) => (
    <FontAwesomeIcon icon={faEllipsis} style={{ ...p.style, color: '#525252' }} />
  ),
  EDIT: (p: { style?: CSSProperties }) => (
    <FontAwesomeIcon icon={faPenToSquare} style={{ ...p.style, color: '#525252' }} />
  ),
  完了: (p: { style?: CSSProperties }) => (
    <FontAwesomeIcon icon={faCircleCheck} style={{ ...p.style, color: '#0ACF84' }} />
  ),
  FLOAT_MENU: (p: { style?: CSSProperties }) => <FontAwesomeIcon icon={faPlus} style={{ ...p.style }} />,
  設定: (p: { style?: CSSProperties }) => <FontAwesomeIcon icon={faGear} style={{ ...p.style }} />,
  肥料: (p: { style?: CSSProperties }) => <span style={{ ...p.style }}>💊</span>,
};

export const SYMBOL_ICONS = {
  グリッド: (p: { style?: CSSProperties }) => <FontAwesomeIcon icon={faTableCells} style={{ ...p.style }} />,
  テーブル: (p: { style?: CSSProperties }) => <FontAwesomeIcon icon={faTableList} style={{ ...p.style }} />,
  CLEAR: (p: { style?: CSSProperties }) => <FontAwesomeIcon icon={faCircleXmark} style={{ ...p.style }} />,
  FILTER: (p: { style?: CSSProperties }) => <FontAwesomeIcon icon={faFilter} style={{ ...p.style }} />,
  UP: (p: { style?: CSSProperties }) => <FontAwesomeIcon icon={faAngleUp} style={{ ...p.style }} />,
};
