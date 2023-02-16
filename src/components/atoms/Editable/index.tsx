import React, { useState } from 'react';
import { OPERATION_ICONS } from '@frontend/supports/icons';
import { useController, useForm } from 'react-hook-form';
import { MyInputWithAlert } from '@frontend/components/atoms/MyInputWithAlert';
import { ValidationRule } from 'react-hook-form/dist/types/validator';

export type EditableProps<V, K> = {
  value: V;
  name: string;
  onSubmit: (v: V | undefined) => Promise<void>;
};

type Value = string | number;

const maxLength: ValidationRule<number> = { value: 40, message: '最大40文字までです。' };
export function Editable<V extends Value, K extends string>(props: EditableProps<V, K>) {
  const { value, name, onSubmit } = props;
  const isNumber = typeof value === 'number';
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
    const onClick = async () => {
      await onSubmit(controller.field.value);
      setIsEditing(false);
    };
    return (
      <div className="Editable">
        <MyInputWithAlert
          controller={controller}
          inputProps={{ type: isNumber ? 'number' : 'text', autoFocus: true, onKeyDown: e => onKeyDown(e.key) }}
        />
        <div onClick={onClick} role="button">
          <OPERATION_ICONS.完了 />
        </div>
      </div>
    );
  }

  const startEdit = () => {
    setValue(name, value);
    console.log('set value', { name, value });
    console.log('get value', controller.field.value);
    setIsEditing(true);
  };

  return (
    <div className="Editable">
      {value}
      <div onClick={startEdit} role="button">
        <OPERATION_ICONS.EDIT />
      </div>
    </div>
  );
}
