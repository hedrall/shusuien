import React, { forwardRef, useImperativeHandle, useState } from 'react';
import './index.scss';
import { Descriptions, Modal, ModalProps } from 'antd';
import { 植物ごとのデフォルト設定 } from 'src/domain/entity/植物のデフォルト設定';
import { 季節 } from '@frontend/domain/const/季節';
import { 日光の強度Select } from '@frontend/components/atoms/SunStrengthSelect';
import { 育成タイプSelect } from '@frontend/components/atoms/GrowthTypeSelect';
import { MyEditable } from '@frontend/components/atoms/Editable';
import { use植物ごとのデフォルト設定 } from '@frontend/store/master/action';
import { 鉢 } from 'src/domain/entity/鉢';

export namespace 植物ごとのデフォルト設定編集モーダル {
  export type Ref = {
    open: (id: 植物ごとのデフォルト設定.Id) => void;
  };
  export type Props = {};
}

export const 植物ごとのデフォルト設定編集モーダル = forwardRef<
  植物ごとのデフォルト設定編集モーダル.Ref,
  植物ごとのデフォルト設定編集モーダル.Props
>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [設定Id, set設定Id] = useState<植物ごとのデフォルト設定.Id | undefined>(undefined);
  const { 設定 } = use植物ごとのデフォルト設定.単一購読(設定Id);

  const close = () => {
    set設定Id(undefined);
    setIsOpen(false);
  };

  const modalProps: ModalProps = {
    className: '植物ごとのデフォルト設定編集モーダル',
    open: isOpen,
    onCancel: close,
    okButtonProps: { style: { display: 'none' } },
    cancelText: '閉じる',
    destroyOnClose: true,
    // width: '90vw',
    // style: {
    //   maxWidth: 800,
    // },
  };

  useImperativeHandle(ref, () => {
    return {
      open: (id: 植物ごとのデフォルト設定.Id) => {
        set設定Id(id);
        setIsOpen(true);
      },
    };
  });
  if (!設定) return null;

  const 日光の強度SelectProps = (季節: 季節): 日光の強度Select.Props => {
    return {
      onChange: e => 設定.日光の強度設定を更新(e as 鉢.日光の強度, 季節),
      value: 設定.日光の強度設定?.[季節],
      isLoading: false,
      size: 'small',
    };
  };
  const 育成タイプSelectProps: 育成タイプSelect.Props = {
    value: 設定['育成タイプ'],
    onChange: e => 設定.ルートプロパティを更新('育成タイプ', e),
  };

  return (
    <Modal {...modalProps}>
      <h1>植物ごとのデフォルト設定を修正</h1>

      <Descriptions
        className="鉢の情報"
        size={'small'}
        bordered
        column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
        title={設定.order().split('-').join(' - ')}
      >
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
            value={設定['耐寒温度']}
            name={'耐寒温度'}
            onSubmit={e => 設定?.ルートプロパティを更新('耐寒温度', e)}
          />
        </Descriptions.Item>
        <Descriptions.Item label="水切れ日数">
          <MyEditable.Number
            value={設定['水切れ日数']}
            name={'水切れ日数'}
            onSubmit={e => 設定?.ルートプロパティを更新('水切れ日数', e)}
          />
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
});
