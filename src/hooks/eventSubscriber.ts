import { useEffect } from 'react';
import { Subscription } from 'rxjs';
import { 鉢 } from 'src/domain/model/鉢';
import { notification } from 'antd';
import { 一括灌水モードイベント } from '@frontend/store/operation/action';

export const useEventSubscriber = () => {
  const [api, contextHolder] = notification.useNotification();

  notification.config({ maxCount: 3 });
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
      鉢.events.管理.subscribe(({ type }) => {
        api.success({ message: `${type}しました。`, placement: 'bottomRight' });
      }),
    );
    // unSubs.push(
    //   一括灌水モードイベント.subscribe(ON => {
    //     if (ON) {
    //       api.info({
    //         message: `一括灌水モードをON!`,
    //         description: '鉢をダブルクリックすると灌水されます。\n(灌水量は設定から変更可能)',
    //         placement: 'bottomRight',
    //       });
    //     }
    //   }),
    // );
    return () => {
      unSubs.map(us => us.unsubscribe());
    };
  }, []);
  return { contextHolder };
};
