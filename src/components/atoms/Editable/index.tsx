import React, { useState } from 'react';
import { OPERATION_ICONS } from '@frontend/supports/icons';
import { useController, useForm } from 'react-hook-form';
import { MyInputWithAlert } from '@frontend/components/atoms/MyInputWithAlert';
import { ValidationRule } from 'react-hook-form/dist/types/validator';
import { ControllerRenderProps } from 'react-hook-form/dist/types/controller';

export type EditableProps<T, V> = {
  value: V;
  name: string;
  onSubmit: (v: V | undefined) => Promise<void>;
  type?: T;
  placeholder?: string;
};

type Value = string | number | undefined;

const maxLength: ValidationRule<number> = { value: 40, message: '最大40文字までです。' };
export function Editable<T extends 'text' | 'number' = 'text', V = T extends 'text' ? string : number | undefined>(
  props: EditableProps<T, V>,
) {
  const { type = 'text', value, name, onSubmit, placeholder } = props;
  const isNumber = type === 'number';
  const [isEditing, setIsEditing] = useState(false);
  const { control, setValue } = useForm<any, any>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      [name]: value,
    },
  });
  const controller = useController({
    control,
    name,
    rules: isNumber ? {} : { maxLength },
  });

  if (isEditing) {
    const onKeyDown = async (key: string) => {
      if (key !== 'Enter') return;
      await onClick();
    };
    const submitValue = async () => {
      const value = controller.field.value;
      if (isNumber) {
        // なぜかstringでくる
        // @ts-ignore
        await onSubmit(value ? parseInt(value) : undefined /*空文字相当*/);
        return;
      }
      await onSubmit(value);
    };
    const onClick = async () => {
      await submitValue();
      setIsEditing(false);
    };
    return (
      <div className="Editable">
        <MyInputWithAlert controller={controller} inputProps={{ type, autoFocus: true }} />
        <div onClick={onClick} role="button" tabIndex={0} onKeyDown={e => onKeyDown(e.key)}>
          <OPERATION_ICONS.完了 />
        </div>
      </div>
    );
  }

  const startEdit = () => {
    setValue(name, value);
    setIsEditing(true);
  };

  return (
    <div className="Editable">
      {value !== undefined ? (
        value
      ) : placeholder !== undefined ? (
        <span className="Placeholder">{placeholder}</span>
      ) : null}
      <div onClick={startEdit} role="button">
        <OPERATION_ICONS.EDIT />
      </div>
    </div>
  );
}

export namespace Editable {
  export const Number = (props: Omit<EditableProps<'number', number | undefined>, 'type'>) => {
    const Elem = Editable<'number'>;
    return <Elem {...props} type="number" />;
  };

  type WithSlotProps<V> = {
    value: V;
    name: string;
    onSubmit: (v: V | undefined) => Promise<void>;
    placeholder?: string;
    inputComponent: React.FC<{ field: ControllerRenderProps }>;
  };
  export function WithSlot(props: WithSlotProps<string>) {
    const { value, name, onSubmit, placeholder, inputComponent } = props;
    const [isEditing, setIsEditing] = useState(false);
    const { control, setValue } = useForm<any, any>({
      mode: 'onChange',
      reValidateMode: 'onChange',
      defaultValues: {
        [name]: value,
      },
    });

    const controller = useController({
      control,
      name,
      rules: { maxLength },
    });
    const Input = () => {
      const Elem = inputComponent;
      return <Elem field={controller.field} />;
    };

    if (isEditing) {
      const onKeyDown = async (key: string) => {
        if (key !== 'Enter') return;
        await onClick();
      };
      const submitValue = async () => {
        const value = controller.field.value;
        await onSubmit(value);
      };
      const onClick = async () => {
        await submitValue();
        setIsEditing(false);
      };
      return (
        <div className="Editable">
          <Input />
          <div onClick={onClick} role="button" tabIndex={0} onKeyDown={e => onKeyDown(e.key)}>
            <OPERATION_ICONS.完了 />
          </div>
        </div>
      );
    }

    const startEdit = () => {
      setValue(name, value);
      setIsEditing(true);
    };

    return (
      <div className="Editable">
        {value ? value : placeholder ? <span className="Placeholder">{placeholder}</span> : null}
        <div onClick={startEdit} role="button">
          <OPERATION_ICONS.EDIT />
        </div>
      </div>
    );
  }
}
