import React, { CSSProperties, useRef, useState } from 'react';
import './index.scss';
import { use棚一覧 } from '@frontend/store/data/action';
import { useAuthState } from '@frontend/store/auth/action';
import { MyButton } from '@frontend/components/atoms/MyButton';
import { 棚作成モーダル } from 'src/components/organisms/棚作成モーダル';
import { closestCenter, DndContext } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DragEndEvent } from '@dnd-kit/core/dist/types';
import { 棚の並び順 } from 'src/domain/model/棚の並び順';
import { 棚, 棚ID } from 'src/domain/model/棚';

const 棚のソートアイテム = (props: { id: string; name: string }) => {
  const { id, name } = props;
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none',
  };

  return (
    <div className="SortableItem" ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {name}
    </div>
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

  // TODO: 変更時にloadingしたい

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!active?.id || !over?.id) return;
    if (!user?.id) return;

    // active => overへ移動させる
    if (active.id !== over.id) {
      const items = 棚Ids.slice();
      const oldIndex = items.indexOf(active.id as 棚ID);
      const newIndex = items.indexOf(over.id as 棚ID);

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

  return (
    <div className="棚の設定ページ">
      <div>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={棚一覧} disabled={false} strategy={verticalListSortingStrategy}>
            {棚一覧.map(i => (
              <棚のソートアイテム key={i.name} id={i.id!} name={i.name} />
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
