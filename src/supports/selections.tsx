import { 履歴 } from 'src/domain/entity/鉢/entity/履歴';
import React from 'react';

const 量のアイコン: { [k in 履歴.灌水.灌水量]: React.ReactNode } = {
  表面が濡れる程度: (
    <div className="灌水量アイコンの側">
      <div className="空 ぽち" />
      <div className="空 ぽち" />
      <div className="空 ぽち" />
    </div>
  ),
  '1/3程度': (
    <div className="灌水量アイコンの側">
      <div className="ぽち" />
      <div className="空 ぽち" />
      <div className="空 ぽち" />
    </div>
  ),
  '2/3程度': (
    <div className="灌水量アイコンの側">
      <div className="ぽち" />
      <div className="ぽち" />
      <div className="空 ぽち" />
    </div>
  ),
  鉢いっぱい: (
    <div className="灌水量アイコンの側">
      <div className="ぽち" />
      <div className="ぽち" />
      <div className="ぽち" />
    </div>
  ),
};

type Option = { name: React.ReactNode; value: 履歴.灌水.灌水量 };
export const 灌水量の選択肢: Option[] = Object.values(履歴.灌水.灌水量)
  .reverse()
  .map(def => {
    return {
      name: (
        <div className="灌水量の選択肢のLabel">
          {量のアイコン[def.key]} {def.表示名}
        </div>
      ),
      value: def.key,
    };
  });
