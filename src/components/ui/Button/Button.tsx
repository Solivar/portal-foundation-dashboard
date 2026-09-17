import type { ComponentPropsWithoutRef } from 'react';
import styles from './Button.module.scss';

export type ButtonProps = ComponentPropsWithoutRef<'button'>;

export function Button({ className, type = 'button', ...props }: ButtonProps) {
  const buttonClassName = className ? `${styles.button} ${className}` : styles.button;

  return <button {...props} className={buttonClassName} type={type} />;
}
