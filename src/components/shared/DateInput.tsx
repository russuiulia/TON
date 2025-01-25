import InputMask from 'react-input-mask';
import { Input } from '@telegram-apps/telegram-ui';

export const DateInput = (props: any) => (
  <InputMask
    mask="99.99.9999"
    value={props.value}
    onChange={props.onChange}
    placeholder={'zz.ll.aaaa'}
    name={props.name}
  >
    {(inputProps: any) => (
      <Input
        {...inputProps}
        type="tel"
        disableUnderline
        status={props.isValid ? 'default' : 'error'}
      />
    )}
  </InputMask>
);
