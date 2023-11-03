import React, { CSSProperties, useRef } from 'react';
import './index.scss';
import { use棚一覧 } from '@frontend/store/data/action';
import { useAuthState } from '@frontend/store/auth/action';
import { MyButton } from '@frontend/components/atoms/MyButton';
import { 棚作成モーダル } from 'src/components/organisms/棚作成モーダル';
import { closestCenter, DndContext } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DragEndEvent } from '@dnd-kit/core/dist/types';
import { 棚の並び順 } from 'src/domain/entity/棚の並び順';
import { 棚 } from 'src/domain/entity/棚';
import { useSubscribeState } from 'src/eventBasedStore';
import { Card, Popconfirm } from 'antd';
import { MyEditable } from 'src/components/atoms/Editable';
import { OPERATION_ICONS, SYMBOL_ICONS } from 'src/supports/icons';

type 棚のソートアイテムParams = { id: 棚.Id; name: string; on棚を削除: (id: 棚.Id) => void };
const 棚のソートアイテム = (props: 棚のソートアイテムParams) => {
  const { id, name, on棚を削除 } = props;
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none',
  };

  const 棚の名前を更新 = async (updatedName: string | undefined) => {
    if (!updatedName) return;
    await 棚.名前を更新(id, updatedName);
  };

  return (
    <Card className="SortableItem" ref={setNodeRef} style={style} size="small" bordered={false}>
      <div className="Content">
        <div className="Left">
          <div {...attributes} {...listeners}>
            <SYMBOL_ICONS.左メニュー />
          </div>
          <MyEditable value={name || ''} name="name" onSubmit={棚の名前を更新} />
        </div>
        <div className="Right">
          <Popconfirm
            title="本当に削除してもよろしいですか？"
            onConfirm={() => on棚を削除(id)}
            okText="削除"
            cancelText="キャンセル"
          >
            <span onClick={e => e.stopPropagation()}>
              <OPERATION_ICONS.DELETE style={{ marginRight: 4 }} />
              削除
            </span>
          </Popconfirm>
        </div>
      </div>
    </Card>
  );
};

export namespace 棚の設定ページ {
  export type Props = {};
}
export const 棚の設定ページ: React.FC<棚の設定ページ.Props> = () => {
  // --- hooks ---
  const { user } = useAuthState();
  const { 棚一覧: t } = use棚一覧.一覧を利用();
  const 棚一覧 = t as (棚 & { id: string /* sort用にidが必須 */ })[];
  const 棚Ids = 棚一覧.map(棚 => 棚.id!);

  const 更新状態 = useSubscribeState(棚の並び順.events.更新);
  const isLoading = 更新状態 === '開始';

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!active?.id || !over?.id) return;
    if (!user?.id) return;

    // active => overへ移動させる
    if (active.id !== over.id) {
      const items = 棚Ids.slice();
      const oldIndex = items.indexOf(active.id as 棚.Id);
      const newIndex = items.indexOf(over.id as 棚.Id);

      const movedIds = arrayMove(items, oldIndex, newIndex);
      const moved棚一覧 = movedIds.map(id => 棚一覧.find(棚 => 棚.id === id)!);

      await 棚の並び順.更新({ userId: user.id, 棚一覧: moved棚一覧 });
    }
  };

  // --- refs ---
  const 棚作成モーダルのRef = useRef<棚作成モーダル.Ref>(null);

  // --- modal操作 ---
  const 棚作成モーダルを開く = () => {
    棚作成モーダルのRef.current?.open();
  };

  // --- handlers ---
  const 棚を削除 = async (id: 棚.Id) => {
    const 棚 = 棚一覧.find(棚 => 棚.id === id);
    if (!棚) return;
    await 棚.削除();
  };

  return (
    <div className="棚の設定ページ">
      <div>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={棚一覧} disabled={isLoading} strategy={verticalListSortingStrategy}>
            {棚一覧.map(i => (
              <棚のソートアイテム key={i.name} id={i.id!} name={i.name} on棚を削除={棚を削除} />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <div className="Section">
        <MyButton title={'⨁ 棚を作成する'} onClick={棚作成モーダルを開く} />
      </div>

      {/* modals */}
      <棚作成モーダル ref={棚作成モーダルのRef} />
    </div>
  );
};
