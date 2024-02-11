import { User } from 'src/domain/entity/user';
import { 鉢 } from 'src/domain/entity/鉢';

export type _I鉢Service = {
  useAll: _I鉢Service.UseAll;
};
export namespace _I鉢Service {
  export type UseAll = (user: User | undefined, uniqueKey: string) => 鉢[];
}
