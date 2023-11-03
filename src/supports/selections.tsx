import { 履歴の内容 } from 'src/domain/entity/鉢/entity/履歴';
import React from 'react';

const 量のアイコン: { [k in 履歴の内容.灌水.量のKey型]: React.ReactNode } = {
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

export const 灌水量の選択肢: { name: React.ReactNode; value: 履歴の内容.灌水.量のKey型 }[] = Object.values(
  履歴の内容.灌水.量の定義,
)
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
