import { 履歴 } from 'src/domain/entity/鉢/entity/履歴';
import dayjs, { Dayjs } from 'dayjs';
import { optionalCall } from 'src/supports/functions';

export namespace _Snapshot {
  export type Props = {
    鉢のサイズ?: 履歴.植替え.鉢サイズ;
    最後の植替え?: Dayjs;
    最後の灌水?: {
      日時: Dayjs;
      量: 履歴.灌水.灌水量;
    };
    最後の液肥: { 日時?: Dayjs };
    画像のURL?: string;
    small画像のURL?: string;
    更新日時: Dayjs;
  };
  export const construct = (props: Props) => {
    return {
      ...props,
      最後の植替え: optionalCall(props.最後の植替え, dayjs),
      最後の灌水: optionalCall(props.最後の灌水, v => ({
        日時: dayjs(v.日時),
        量: v.量,
      })),
      最後の液肥: {
        日時: optionalCall(props.最後の液肥?.日時, dayjs),
      },
      画像のURL: props.画像のURL,
      small画像のURL: props.small画像のURL,
      更新日時: dayjs(props.更新日時),
    };
  };
}
export type _Snapshot = ReturnType<typeof _Snapshot.construct>;
