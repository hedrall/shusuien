import { _日光の強度設定 } from '../consts/日光の強度設定';
import { _育成タイプ } from '../consts/育成タイプ';

export namespace _詳細 {
  export type Props = {
    科?: string;
    属?: string;
    種名?: string;
    育成タイプ?: _育成タイプ;
    耐寒温度?: number;
    日光の強度設定?: _日光の強度設定;
    水切れ日数?: number;
    入手元?: string;
    金額?: number;
  };

  export const construct = (props: Props) => {
    return {
      ...props,
      科: props.科,
      属: props.属,
      種名: props.種名,
      育成タイプ: props.育成タイプ,
      耐寒温度: props.耐寒温度,
      日光の強度設定: props.日光の強度設定,
      水切れ日数: props.水切れ日数,
      入手元: props.入手元,
      金額: props.金額,
    };
  };
}
export type _詳細 = ReturnType<typeof _詳細.construct>;
