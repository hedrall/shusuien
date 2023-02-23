import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@frontend/settings/routes';
import { MyLink } from '@frontend/components/atoms/MyLink';
import { 植物ごとのデフォルト設定の新規作成モーダル } from '@frontend/components/organisms/CreatePlantDefaultSettingModal';
import { MyButton } from '@frontend/components/atoms/MyButton';
import { use植物ごとのデフォルト設定 } from '@frontend/store/master/action';
import { Collapse, Descriptions } from 'antd';
import { Editable } from '@frontend/components/atoms/Editable';
import { 植物ごとのデフォルト設定 } from '@frontend/domain/model/plantDefautlSetting';
import { 季節 } from '@frontend/domain/const/season';
import { 日光の強度Select } from '@frontend/components/atoms/SunStrengthSelect';
import { 日光の強度 } from '@frontend/domain/model/item';

export namespace 植物ごとのデフォルト設定ページ {
  export type Props = {};
}

const { Panel } = Collapse;

const 要素 = ({ 設定 }: { 設定: 植物ごとのデフォルト設定 }) => {
  const 日光の強度SelectProps = (季節: 季節): 日光の強度Select.Props => {
    return {
      onChange: e => 設定.更新.日光の強度設定(e as 日光の強度, 季節),
      value: 設定.日光の強度設定?.[季節],
      isLoading: false,
      size: 'small',
    };
  };

  return (
    <Descriptions
      className="要素"
      title="設定内容"
      size={'small'}
      bordered
      column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
    >
      <Descriptions.Item label="科/属/種" className="科属種">
        <div className="項目">科: {設定.科 || ''}</div>
        <div className="項目">属: {設定.属}</div>
        <div className="項目">種: {設定.種}</div>
      </Descriptions.Item>
      <Descriptions.Item label="耐寒温度">
        <Editable.Number
          value={設定.耐寒温度}
          name="耐寒温度"
          onSubmit={設定.更新.ルートプロパティ.bind(null, '耐寒温度')}
        />
      </Descriptions.Item>
      <Descriptions.Item label="水切れ日数">
        <Editable.Number
          value={設定.水切れ日数}
          name="水切れ日数"
          onSubmit={設定.更新.ルートプロパティ.bind(null, '水切れ日数')}
        />
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
    </Descriptions>
  );
};
export const 植物ごとのデフォルト設定ページ: React.FC<植物ごとのデフォルト設定ページ.Props> = props => {
  const navigator = useNavigate();
  const 新規作成モーダルのRef = useRef<植物ごとのデフォルト設定の新規作成モーダル.Ref | null>(null);

  const { 植物ごとのデフォルト設定一覧 } = use植物ごとのデフォルト設定.一覧を利用();

  return (
    <div className="植物ごとのデフォルト設定ページ">
      <MyLink path={ROUTES.TOP.PATH} navigator={navigator} text="TOPへ戻る" />
      <Collapse className="一覧表示" size="small">
        {植物ごとのデフォルト設定一覧.map((item, index) => {
          return (
            <Panel key={index} header={item.order}>
              <要素 設定={item} />
            </Panel>
          );
        })}
      </Collapse>

      <div className="Section">
        <MyButton title={'⨁ 設定を作成する'} onClick={() => 新規作成モーダルのRef.current?.open()} />
      </div>
      <植物ごとのデフォルト設定の新規作成モーダル ref={新規作成モーダルのRef} />
    </div>
  );
};
