import { Opaque } from 'type-fest';
import { FSAppRepository } from 'src/domain/repository/firestore';

async function _名前を変更する(this: User, name: string) {
  if (!name) throw new Error('名前が空です');
  await FSAppRepository.User.更新(this.id, { name });
}

async function _新規ユーザを作成(uid: string) {
  const newUser = User.createDefault(uid);
  await FSAppRepository.User.作成(newUser, uid as User.Id);
}

function _名前が未設定(this: User): boolean {
  return !this.name || this.name === User.名前が未設定時の名称;
}

export namespace User {
  export type Id = Opaque<string, 'UserId'>;
  export type Props = {
    id: Id;
    name: string;
  };

  export const construct = (props: Props) => {
    return {
      id: props.id,
      name: props.name,
      名前を変更する: _名前を変更する,
      名前が未設定: _名前が未設定,
    };
  };

  export const 名前が未設定時の名称 = '名前未設定';
  export const createDefault = (id: string) => {
    return construct({
      id: id as Id,
      name: User.名前が未設定時の名称,
    });
  };

  export const 新規ユーザを作成 = _新規ユーザを作成;
}
export type User = ReturnType<typeof User.construct>;
