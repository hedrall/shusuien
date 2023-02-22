import { 日光の強度, 日光の強度設定, 鉢 } from '@frontend/domain/model/item';
import React from 'react';
import { Descriptions, Select, SelectProps } from 'antd';
import { optionalCall } from '@frontend/supports/functions';
import { 鉢サイズ } from '@frontend/domain/model/history';
import { DATE_READONLY_FORMAT, x日前の表記 } from '@frontend/supports/date';
import { Editable, EditableProps } from '@frontend/components/atoms/Editable';
import dayjs, { Dayjs } from 'dayjs';
import { ICONS } from '@frontend/supports/icons';
import { 棚ID } from '@frontend/domain/model/tana';
import { useRecoilState } from 'recoil';
import { 棚Selector } from '@frontend/store/data/action';
import { useWithLoading } from '@frontend/supports/ui';
import { FSAppRepository } from '@frontend/domain/repository/firestore';

const F = DATE_READONLY_FORMAT;

export type MyDescProps = {
  鉢: 鉢;
};

const 最後の灌水の表示 = (最後の灌水: 鉢['snapshot']['最後の灌水'], now: Dayjs) => {
  if (!最後の灌水) return '';

  const 日前 = x日前の表記(now, 最後の灌水.日時);
  const 日 = 最後の灌水.日時.format('M月D日 H時');
  return `${日前.表記} (${日}), ${最後の灌水.量}`;
};

const 指定なし = '指定なし';
const 日光の強度一覧 = [...Object.values(日光の強度), 指定なし];
export const 鉢の情報: React.FC<MyDescProps> = props => {
  const now = dayjs();
  const { 鉢 } = props;
  const { name, 詳細, snapshot, 作成日時, 補足 } = 鉢;
  const 鉢のサイズ = optionalCall(snapshot.鉢のサイズ, 鉢サイズ.toString);
  const 最後の灌水 = 最後の灌水の表示(snapshot.最後の灌水, now);
  const 最後の植替え = [snapshot.最後の植替え?.format(F)].filter(Boolean).join(', ');
  function 詳細を更新<Key extends keyof 鉢['詳細'], V = 鉢['詳細'][Key]>(key: Key) {
    return async (value: V) => {
      await 鉢.詳細を更新(key, value);
    };
  }
  function フィールドを更新<Key extends 'name' | '補足', V = 鉢[Key]>(key: Key) {
    return async (value: V) => {
      await 鉢.フィールドを更新(key, value);
    };
  }

  const { isLoading, withLoading } = useWithLoading();
  const 棚を変更 = async (id: 棚ID) => {
    await withLoading(async () => {
      await 鉢.フィールドを更新('棚Id', id);
    });
  };
  const [棚一覧] = useRecoilState(棚Selector);
  const 棚SelectProps: SelectProps = {
    options: 棚一覧.map(i => ({ value: i.id, label: i.name })),
    onChange: e => 棚を変更(e as 棚ID),
    value: 鉢.棚Id,
    loading: isLoading,
    style: { width: '100%' },
    listHeight: 300,
  };
  function 日光の強度を更新<Key extends keyof 日光の強度設定, V = 日光の強度設定[Key]>(key: Key) {
    return async (value: V) => {
      await 鉢.日光の強度を更新(key, value === 指定なし ? undefined : value);
    };
  }
  const 日光の強度SelectProps = (key: keyof 日光の強度設定): SelectProps => {
    return {
      options: 日光の強度一覧.map(i => ({ value: i, label: i })),
      onChange: e => 日光の強度を更新(key)(e as 日光の強度),
      value: 鉢.詳細.日光の強度設定?.[key],
      loading: isLoading,
      style: { width: '100%' },
      size: 'small',
      popupClassName: '日光の強度SelectのPopup',
    };
  };

  return (
    <Descriptions
      className="鉢の情報"
      title="鉢の情報"
      size={'small'}
      bordered
      column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
    >
      <Descriptions.Item label="名前">
        <Editable value={name || ''} name="name" onSubmit={フィールドを更新('name')} />
      </Descriptions.Item>
      <Descriptions.Item label="棚">
        <Select {...棚SelectProps} />
      </Descriptions.Item>
      <Descriptions.Item label="科/属/種" className="科属種">
        <div className="項目">
          科: <Editable value={詳細.科 || ''} name="科" onSubmit={詳細を更新('科')} />
        </div>
        <div className="項目">
          属: <Editable value={詳細.属 || ''} name="属" onSubmit={詳細を更新('属')} />
        </div>
        <div className="項目">
          種名: <Editable value={詳細.種名 || ''} name="種名" onSubmit={詳細を更新('種名')} />
        </div>
      </Descriptions.Item>
      <Descriptions.Item label="耐寒温度">
        <Editable.Number value={詳細.耐寒温度} name="耐寒温度" onSubmit={詳細を更新('耐寒温度')} />
      </Descriptions.Item>
      <Descriptions.Item label="日光の強度" className="日光の強度">
        <div className="側">
          {(['春', '夏', '秋', '冬'] as const).map(季節 => {
            return (
              <div key={季節} className="Item">
                <p>{季節}</p>
                <Select {...日光の強度SelectProps(季節)} />
              </div>
            );
          })}
        </div>
      </Descriptions.Item>
      <Descriptions.Item label="水切れ日数">
        <Editable.Number value={詳細.水切れ日数} name="水切れ日数" onSubmit={詳細を更新('水切れ日数')} />
      </Descriptions.Item>
      <Descriptions.Item label="追加日時">{作成日時.format(F)}</Descriptions.Item>
      <Descriptions.Item label="入手元">
        <Editable value={詳細.入手元 || ''} name="入手元" onSubmit={詳細を更新('入手元')} />
      </Descriptions.Item>
      <Descriptions.Item label="金額">
        <Editable.Number value={詳細.金額} name="金額" onSubmit={詳細を更新('金額')} />
      </Descriptions.Item>
      <Descriptions.Item label="補足">
        <Editable value={補足 || ''} name="補足" onSubmit={フィールドを更新('補足')} />
      </Descriptions.Item>
      <Descriptions.Item label="鉢のサイズ">{鉢のサイズ}</Descriptions.Item>
      <Descriptions.Item
        label={
          <span className="項目名">
            <ICONS.灌水 />
            灌水
          </span>
        }
      >
        {最後の灌水}
      </Descriptions.Item>
      <Descriptions.Item
        label={
          <span className="項目名">
            <ICONS.植替え />
            植替え
          </span>
        }
      >
        {最後の植替え}
      </Descriptions.Item>
    </Descriptions>
  );
};
