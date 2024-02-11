import { 鉢 } from 'src/domain/entity/鉢';

export type _IFilterService = {
  Use: () => {
    set: _IFilterService.Use.Set;
    フィルタを鉢に適用(i: 鉢): boolean;
    isデフォルト状態: () => boolean;
  };
};
export namespace _IFilterService {
  export namespace Use {
    export type Set = {
      耐寒温度: (start: number | undefined, end: number | undefined) => void;
      日光の強度: (v?: 鉢.日光の強度) => void;
      keyword: (v?: string) => void;
      最後の灌水からの経過日数: (v: number | undefined) => void;
      toggleEnabled: () => void;
      clear: () => void;
    };
  }
}
