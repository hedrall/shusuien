import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import './index.scss';
import { useAuthState } from '@frontend/store/auth/action';
import { Col, Modal, ModalProps, Row } from 'antd';
import { 鉢 } from '@frontend/domain/model/鉢';
import { 棚 } from '@frontend/domain/model/棚';
import { 鉢一覧の要素 } from '@frontend/components/atoms/ItemListCell';
import { use一括灌水モード設定 } from '@frontend/store/一括灌水/action';
import { use灌水時の施肥有無設定 } from '@frontend/store/灌水時の施肥有無設定/action';
import { MyProgress, useProgress } from '@frontend/components/atoms/MyProgress';
import { sleep } from '@frontend/supports/functions';
import react from '@vitejs/plugin-react';
import { use棚の一括灌水State } from '@frontend/store/棚の一括灌水/action';

type State = { 棚: 棚; 鉢一覧: 鉢[] };
export namespace 一括灌水モーダル {
  export type Ref = {
    open: (state: State) => void;
  };
  export type Props = {};
}

export const 一括灌水モーダル = forwardRef<一括灌水モーダル.Ref, 一括灌水モーダル.Props>((props, ref) => {
  // ---- states ----
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<State | undefined>(undefined);
  const [除外する鉢一覧, set除外する鉢一覧] = useState<鉢[]>([]);
  const progress = useProgress();

  // ---- hooks ----
  const { user } = useAuthState();
  const 一括灌水モード設定 = use一括灌水モード設定();
  const 灌水時の施肥有無設定 = use灌水時の施肥有無設定();
  const 棚の一括灌水State = use棚の一括灌水State();

  const close = () => {
    if (棚の一括灌水State.is灌水中) return;
    setIsOpen(false);
    setState(undefined);
    set除外する鉢一覧([]);
  };

  const is一括灌水を実行可能 = (() => {
    if (!state) return false;
    return state.鉢一覧.length > 除外する鉢一覧.length;
  })();

  const is除外する鉢 = (鉢: 鉢) => 除外する鉢一覧.some(i => i.id === 鉢.id);
  const 灌水する鉢一覧 = (state?.鉢一覧 || []).filter(i => 除外する鉢一覧.every(j => j.id !== i.id));

  const 一括灌水を実行 = async () => {
    if (!is一括灌水を実行可能) return;
    if (!state) return;
    if (!user) return;

    progress.start(灌水する鉢一覧.length);
    棚の一括灌水State.start();

    let 処理済み = 0;
    try {
      for (const item of 灌水する鉢一覧) {
        await sleep(100);
        await 鉢.管理.灌水({
          item,
          userId: user.id,
          灌水量: 一括灌水モード設定.灌水量,
          液肥入り: 灌水時の施肥有無設定.is,
        });

        progress.progress(++処理済み);
      }
    } catch (e: any) {
      console.error(e);
      progress.error();
      棚の一括灌水State.error();
    } finally {
      // stateが更新される様にnextTickで実行
      setTimeout(() => {
        棚の一括灌水State.end(処理済み);
      }, 200);
    }
    close();
  };

  const modalProps: ModalProps = {
    className: '一括灌水モーダル',
    open: isOpen,
    onCancel: close,
    onOk: () => 一括灌水を実行(),
    closable: true,
    okText: '一括灌水',
    cancelText: '閉じる',
    okButtonProps: {
      disabled: !is一括灌水を実行可能,
      loading: 棚の一括灌水State.is灌水中,
    },
    destroyOnClose: true,
    width: '90vw',
    style: {
      maxWidth: 800,
    },
  };

  // 除外する鉢に追加・削除(Toggle)する
  const 鉢を選択 = (鉢: 鉢) => {
    console.log('鉢を選択', { 鉢 });
    if (除外する鉢一覧.some(i => i.id === 鉢.id)) {
      set除外する鉢一覧(cur => cur.filter(i => i.id !== 鉢.id));
      return;
    }
    set除外する鉢一覧(cur => [...cur, 鉢]);
  };

  useImperativeHandle(ref, () => {
    return {
      open: (state: State) => {
        setState(state);
        setIsOpen(true);
      },
    };
  });

  return (
    <Modal {...modalProps}>
      <h1 className="モーダルの見出し">
        一括灌水 <span className="棚名">{state?.棚.name}</span>
      </h1>
      {!棚の一括灌水State.is灌水中 ? null : <MyProgress state={progress.state} style={{ width: '100%' }} />}
      <Row
        gutter={[
          { xs: 8, sm: 16, md: 24, lg: 32 },
          { xs: 8, sm: 16, md: 24, lg: 32 },
        ]}
      >
        {state?.鉢一覧.map(鉢 => {
          const is除外 = is除外する鉢(鉢);
          return (
            <Col key={鉢.id} lg={2} sm={4} xs={8}>
              <鉢一覧の要素
                item={鉢}
                鉢を選択={鉢を選択}
                一括灌水モード={false}
                style={{ grey: is除外, overlapItem: is除外 ? <span style={{ fontSize: 32 }}>❌</span> : undefined }}
              />
            </Col>
          );
        })}
      </Row>
    </Modal>
  );
});
