import React, { useRef } from 'react';
import './index.scss';
import { 鉢 } from 'src/domain/entity/鉢';
import { Button, Descriptions, Select, SelectProps } from 'antd';
import { optionalCall, optionalValue } from '@frontend/supports/functions';
import { 鉢サイズ } from 'src/domain/entity/鉢/entity/履歴';
import { DATE_READONLY_FORMAT, x日前の表記 } from '@frontend/supports/date';
import { MyEditable } from '@frontend/components/atoms/Editable';
import dayjs, { Dayjs } from 'dayjs';
import { ICONS, OPERATION_ICONS } from '@frontend/supports/icons';
import { 棚ID } from 'src/domain/entity/棚';
import { useRecoilState } from 'recoil';
import { 棚Selector } from '@frontend/store/data/action';
import { useWithLoading } from '@frontend/supports/ui';
import { 季節 } from '@frontend/domain/const/季節';
import { 日光の強度Select } from '@frontend/components/atoms/SunStrengthSelect';
import { 植物ごとのデフォルト設定サービス } from '@frontend/domain/service/plantDefaultSetting';
import { use植物ごとのデフォルト設定 } from '@frontend/store/master/action';
import { デフォルト設定から選択するモーダル } from '@frontend/components/organisms/植物ごとのデフォルト設定モーダル/選択';
import { 育成タイプSelect } from '@frontend/components/atoms/GrowthTypeSelect';
import { 植物ごとのデフォルト設定編集モーダル } from '@frontend/components/organisms/植物ごとのデフォルト設定モーダル/編集';
import { 棚移動モーダル } from 'src/components/organisms/棚移動モーダル';
import { 日光の強度設定 } from 'src/domain/entity/鉢/日光の強度設定';
import { 日光の強度 } from 'src/domain/entity/鉢/日光の強度';
import { 育成タイプ } from 'src/domain/entity/鉢/育成タイプ';

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

const 指定なし = '';
export const 鉢の情報: React.FC<MyDescProps> = props => {
  const now = dayjs();
  const { 鉢 } = props;
  const { name, 詳細, snapshot, 作成日時, 補足 } = 鉢;

  // --- refs ---
  const デフォルト設定から選択するモーダルref = useRef<デフォルト設定から選択するモーダル.Ref | null>(null);
  const 植物ごとのデフォルト設定編集モーダルref = useRef<植物ごとのデフォルト設定編集モーダル.Ref | null>(null);
  const 棚移動モーダルref = useRef<棚移動モーダル.Ref | null>(null);

  const 棚を変更 = async (id: 棚ID) => {
    await withLoading(async () => {
      await 鉢.フィールドを更新('棚Id', id);
    });
  };
  const on移動先の棚を選択 = 棚を変更;
  const 棚移動モーダルを開く = () => {
    棚移動モーダルref.current?.open();
  };

  const 鉢のサイズ = optionalCall(snapshot.鉢のサイズ, 鉢サイズ.toString);
  const 最後の灌水 = 最後の灌水の表示(snapshot.最後の灌水, now);
  const 最後の植替え = [snapshot.最後の植替え?.format(F)].filter(Boolean).join(', ');
  const { 植物ごとのデフォルト設定一覧 } = use植物ごとのデフォルト設定.一覧を利用();
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

  const [棚一覧] = useRecoilState(棚Selector);

  function 日光の強度を更新<Key extends keyof 日光の強度設定, V = 日光の強度設定[Key]>(key: Key) {
    return async (value: V) => {
      await 鉢.日光の強度を更新(key, value === 指定なし ? undefined : value);
    };
  }
  const デフォルト設定一覧 = 植物ごとのデフォルト設定サービス.鉢の設定を特定(植物ごとのデフォルト設定一覧, 鉢);
  const 耐寒温度のデフォルト = 植物ごとのデフォルト設定サービス.デフォルト直を加味した直の取得(
    デフォルト設定一覧,
    鉢,
    '耐寒温度',
  );
  const 水切れ日数のデフォルト = 植物ごとのデフォルト設定サービス.デフォルト直を加味した直の取得(
    デフォルト設定一覧,
    鉢,
    '水切れ日数',
  );
  const 日光の強度SelectProps = (季節: 季節): 日光の強度Select.Props => {
    const 強度 = 詳細.日光の強度設定?.[季節];
    const { 一致Type, value, デフォルトを適用 } =
      植物ごとのデフォルト設定サービス.デフォルト直を加味した四季のある直の取得(
        デフォルト設定一覧,
        鉢,
        '日光の強度設定',
        季節,
      );
    return {
      onChange: e => 日光の強度を更新(季節)(e as 日光の強度),
      value: 強度,
      isLoading,
      size: 'small',
      placeholder: デフォルトを適用 ? `${value} (${一致Type}より)` : undefined,
    };
  };
  const 育成タイプSelectProps: 育成タイプSelect.Props = (() => {
    const value = 詳細.育成タイプ;
    const {
      一致Type,
      value: defaultValue,
      デフォルトを適用,
    } = 植物ごとのデフォルト設定サービス.デフォルト直を加味した直の取得(デフォルト設定一覧, 鉢, '育成タイプ');
    return {
      onChange: e => 詳細を更新('育成タイプ')(e as 育成タイプ),
      value,
      isLoading,
      size: 'small',
      placeholder: デフォルトを適用 ? `${defaultValue} (${一致Type}より)` : undefined,
    };
  })();

  const 耐寒性のPlaceholder = 耐寒温度のデフォルト.デフォルトを適用
    ? `${耐寒温度のデフォルト.value} (${耐寒温度のデフォルト.一致Type}より)`
    : undefined;
  const 水切れ日数のPlaceholder = 水切れ日数のデフォルト.デフォルトを適用
    ? `${水切れ日数のデフォルト.value} (${水切れ日数のデフォルト.一致Type}より)`
    : undefined;
  return (
    <>
      <Descriptions
        className="鉢の情報"
        title="鉢の情報"
        size={'small'}
        bordered
        column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
      >
        <Descriptions.Item label="名前">
          <MyEditable value={name || ''} name="name" onSubmit={フィールドを更新('name')} />
        </Descriptions.Item>
        <Descriptions.Item label="棚">
          <div className="棚Select">
            {棚一覧.find(i => i.id === 鉢.棚Id)?.name}
            <div onClick={棚移動モーダルを開く}>
              <OPERATION_ICONS.EDIT />
            </div>
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="科/属/種" className="科属種">
          <div className="項目">
            科: <MyEditable value={詳細.科 || ''} name="科" onSubmit={詳細を更新('科')} />
          </div>
          <div className="項目">
            属: <MyEditable value={詳細.属 || ''} name="属" onSubmit={詳細を更新('属')} />
          </div>
          <div className="項目">
            種名: <MyEditable value={詳細.種名 || ''} name="種名" onSubmit={詳細を更新('種名')} />
          </div>
          <div className="候補となっているデフォルト設定">
            ※ 候補となっているデフォルト設定
            {デフォルト設定一覧.map((設定, index) => {
              const onClick = () => 植物ごとのデフォルト設定編集モーダルref.current?.open?.(設定.デフォルト設定.id!);
              return (
                <div className="Item" key={設定.デフォルト設定.order}>
                  <p>
                    {index + 1}: {設定.デフォルト設定.order.split('-').join(' - ')}
                  </p>
                  <div onClick={onClick} onKeyDown={e => e.key === 'Enter' && onClick()} role="button" tabIndex={0}>
                    <OPERATION_ICONS.EDIT />
                  </div>
                </div>
              );
            })}
          </div>
          <Button
            tabIndex={0}
            onClick={() => デフォルト設定から選択するモーダルref.current?.open(鉢)}
            onKeyDown={e => {
              if (e.key === 'Enter') デフォルト設定から選択するモーダルref.current?.open(鉢);
            }}
            role="button"
            size="small"
          >
            デフォルト設定から選択する
          </Button>
        </Descriptions.Item>
        <Descriptions.Item label="日光の強度" className="日光の強度">
          <div className="側">
            {Object.values(季節).map(s => {
              return (
                <div key={s} className="Item">
                  <p>{s}</p>
                  <日光の強度Select {...日光の強度SelectProps(s)} />
                </div>
              );
            })}
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="育成タイプ">
          <育成タイプSelect {...育成タイプSelectProps} />
        </Descriptions.Item>
        <Descriptions.Item label="耐寒温度">
          <MyEditable.Number
            value={optionalValue(詳細.耐寒温度, undefined)}
            name="耐寒温度"
            onSubmit={詳細を更新('耐寒温度')}
            placeholder={耐寒性のPlaceholder}
          />
        </Descriptions.Item>
        <Descriptions.Item label="水切れ日数">
          <MyEditable.Number
            value={optionalValue(詳細.水切れ日数, undefined)}
            name="水切れ日数"
            onSubmit={詳細を更新('水切れ日数')}
            placeholder={水切れ日数のPlaceholder}
          />
        </Descriptions.Item>
        <Descriptions.Item label="追加日時">{作成日時.format(F)}</Descriptions.Item>
        <Descriptions.Item label="入手元">
          <MyEditable value={詳細.入手元 || ''} name="入手元" onSubmit={詳細を更新('入手元')} />
        </Descriptions.Item>
        <Descriptions.Item label="金額">
          <MyEditable.Number value={詳細.金額} name="金額" onSubmit={詳細を更新('金額')} />
        </Descriptions.Item>
        <Descriptions.Item label="補足">
          <MyEditable value={補足 || ''} name="補足" onSubmit={フィールドを更新('補足')} />
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
      <デフォルト設定から選択するモーダル ref={デフォルト設定から選択するモーダルref} />
      <植物ごとのデフォルト設定編集モーダル ref={植物ごとのデフォルト設定編集モーダルref} />
      <棚移動モーダル ref={棚移動モーダルref} on移動先の棚を選択={on移動先の棚を選択} />
    </>
  );
};
