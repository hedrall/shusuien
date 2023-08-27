import React, { useRef } from 'react';
import './index.scss';
import { useNavigate } from 'react-router-dom';
import { TOPに戻るリンク } from '@frontend/components/atoms/MyLink';
import { 植物ごとのデフォルト設定の新規作成モーダル } from '@frontend/components/organisms/CreatePlantDefaultSettingModal';
import { MyButton } from '@frontend/components/atoms/MyButton';
import { use植物ごとのデフォルト設定 } from '@frontend/store/master/action';
import { Table, TableColumnsType } from 'antd';
import { Editable } from '@frontend/components/atoms/Editable';
import { 植物ごとのデフォルト設定 } from '@frontend/domain/model/植物のデフォルト設定';
import { 季節 } from '@frontend/domain/const/季節';
import { 日光の強度Select } from '@frontend/components/atoms/SunStrengthSelect';
import { 日光の強度 } from '@frontend/domain/model/鉢';
import { uniqueArray } from '@frontend/supports/array';
import { 育成タイプSelect } from '@frontend/components/atoms/GrowthTypeSelect';

export namespace 植物ごとのデフォルト設定ページ {
  export type Props = {};
}

type 科の要素 = { 科: string | undefined };
const columns: TableColumnsType<科の要素> = [
  {
    title: '科',
    dataIndex: '科',
    key: '科',
  },
];

const expandedRowRender = (設定一覧: 植物ごとのデフォルト設定[]) => (科の要素: 科の要素, index: number) => {
  const { 科 } = 科の要素;

  const columns: TableColumnsType<植物ごとのデフォルト設定> = [
    {
      title: '属',
      dataIndex: '属',
      key: '属',
      width: 200,
    },
    {
      title: '種',
      dataIndex: '種',
      key: '種',
      width: 200,
    },
    {
      title: '成長タイプ',
      dataIndex: '成長タイプ',
      key: '成長タイプ',
      width: 140,
      render: (_, 設定) => {
        const props: 育成タイプSelect.Props = {
          value: 設定['育成タイプ'],
          onChange: e => 設定.更新.ルートプロパティ('育成タイプ', e),
        };
        return <育成タイプSelect {...props} />;
      },
    },
    ...(['耐寒温度', '水切れ日数'] as const).map(key => {
      return {
        title: key,
        dataIndex: '種',
        key: '種',
        render: (_: any, 設定: 植物ごとのデフォルト設定) => {
          return <Editable.Number value={設定[key]} name={key} onSubmit={v => 設定.更新.ルートプロパティ(key, v)} />;
        },
        width: 80,
      };
    }),
    {
      title: '日光の強度',
      dataIndex: '日光の強度',
      key: '日光の強度',
      className: '日光の強度',
      width: 300,
      render: (_, 設定) => {
        const 日光の強度SelectProps = (季節: 季節): 日光の強度Select.Props => {
          return {
            onChange: e => 設定.更新.日光の強度設定(e as 日光の強度, 季節),
            value: 設定.日光の強度設定?.[季節],
            isLoading: false,
            size: 'small',
          };
        };
        return (
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
        );
      },
    },
    {
      title: '',
      render: () => null,
    },
  ];

  const この科の種 = 設定一覧.filter(i => i.科 === 科);
  const data = この科の種.map(i => ({ ...i, key: i.order }));
  return <Table key={科} columns={columns} dataSource={data} />;
};

export const 植物ごとのデフォルト設定ページ: React.FC<植物ごとのデフォルト設定ページ.Props> = props => {
  const navigator = useNavigate();
  const 新規作成モーダルのRef = useRef<植物ごとのデフォルト設定の新規作成モーダル.Ref | null>(null);

  const { 植物ごとのデフォルト設定一覧: 設定一覧 } = use植物ごとのデフォルト設定.一覧を利用();

  const 科一覧 = uniqueArray(設定一覧.map(i => i.科)).map(i => ({ 科: i, key: i }));
  return (
    <div className="植物ごとのデフォルト設定ページ">
      <TOPに戻るリンク navigator={navigator} />
      <Table
        columns={columns}
        expandable={{ expandedRowRender: expandedRowRender(設定一覧) }}
        dataSource={科一覧}
        pagination={false}
      ></Table>

      <div className="Section">
        <MyButton title={'⨁ 設定を作成する'} onClick={() => 新規作成モーダルのRef.current?.open()} />
      </div>
      <植物ごとのデフォルト設定の新規作成モーダル ref={新規作成モーダルのRef} />
    </div>
  );
};
