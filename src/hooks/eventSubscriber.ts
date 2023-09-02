import { useEffect } from 'react';
import { combineLatest, Subscription, withLatestFrom } from 'rxjs';
import { 鉢 } from '@frontend/domain/model/鉢';
import { notification } from 'antd';
import { 一括灌水モードイベント } from '@frontend/store/一括灌水/action';
import { 灌水時の施肥有無設定イベント } from '@frontend/store/灌水時の施肥有無設定/action';
import { use棚の一括灌水State } from '@frontend/eventBasedStore/棚の一括灌水/action';

// なぜかmaxCountの効果がない
notification.config({ maxCount: 1, duration: 2 });

export const useEventSubscriber = () => {
  const [api, contextHolder] = notification.useNotification();
  const 棚の一括灌水State = use棚の一括灌水State();

  useEffect(() => {
    const unSubs: Subscription[] = [];
    unSubs.push(
      鉢.events.フィールドを更新.subscribe(({ フィールド名, 更新後のValue }) => {
        api.success({
          message: `"${フィールド名}" を更新しました。`,
          description: `${更新後のValue}`,
          placement: 'bottomRight',
        });
      }),
    );
    unSubs.push(
      鉢.events.詳細を更新.subscribe(({ プロパティ名, 更新後のValue }) => {
        api.success({
          message: `"${プロパティ名}" を更新しました。`,
          description: `${更新後のValue}`,
          placement: 'bottomRight',
        });
      }),
    );
    unSubs.push(
      鉢.events.削除.subscribe(({ item }) => {
        api.success({ message: `削除しました。`, placement: 'bottomRight' });
      }),
    );
    unSubs.push(
      鉢.events.管理.pipe(withLatestFrom(棚の一括灌水State.event)).subscribe(([管理イベント, 棚の一括灌水イベント]) => {
        const 通知しないパターン = 管理イベント.type === '灌水' && 棚の一括灌水イベント.type === 'start';
        if (通知しないパターン) return;

        api.success({ message: `${管理イベント.type}しました。`, placement: 'bottomRight' });
      }),
    );
    unSubs.push(
      一括灌水モードイベント.subscribe(ON => {
        if (ON) {
          api.info({
            message: `一括灌水モードをON!`,
            description: '鉢をダブルクリックすると灌水されます。\n(灌水量は設定から変更可能)',
            placement: 'bottomRight',
          });
        }
      }),
    );
    unSubs.push(
      灌水時の施肥有無設定イベント.subscribe(ON => {
        if (ON) {
          api.info({
            message: `灌水時の施肥をON`,
            description: '灌水時に液肥を施したことが記録されます。',
            placement: 'bottomRight',
          });
        }
      }),
    );
    unSubs.push(
      棚の一括灌水State.event.subscribe(event => {
        switch (event.type) {
          case 'start':
            return;
          case 'done':
            api.success({ message: `${event.処理数}鉢に一括灌水しました。`, placement: 'bottomRight' });
            return;
          case 'error':
            api.error({ message: `一括灌水に失敗しました。`, placement: 'bottomRight' });
            return;
        }
      }),
    );
    return () => {
      unSubs.map(us => us.unsubscribe());
    };
  }, []);
  return { contextHolder };
};
