import { Opaque } from 'type-fest';

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
    };
  };

  export const createDefault = (id: string) => {
    return construct({
      id: id as Id,
      name: '名前未設定',
    });
  };
}
export type User = ReturnType<typeof User.construct>;
