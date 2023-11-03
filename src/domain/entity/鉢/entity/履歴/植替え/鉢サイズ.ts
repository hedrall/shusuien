import { _植替え履歴 } from 'src/domain/entity/鉢/entity/履歴/植替え/index';

export const _鉢サイズ = {
  番号: ['2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5'],
  タイプ: ['通常', 'L'],
  toString: (size: _植替え履歴.鉢サイズ) => {
    const postfix = size.タイプ === '通常' ? '' : ` ${size.タイプ}`;
    return `${size.番号}号${postfix}`;
  },
};
export namespace _鉢サイズ {
  export type 番号 = typeof _鉢サイズ.番号[number];
  export type タイプ = typeof _鉢サイズ.タイプ[number];
}
export type _鉢サイズ = { 番号: _鉢サイズ.番号; タイプ: _鉢サイズ.タイプ };
