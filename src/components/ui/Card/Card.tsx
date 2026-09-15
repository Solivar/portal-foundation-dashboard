import type React from 'react';
import styles from './Card.module.scss';

export type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  const cardClassName = className ? `${styles.card} ${className}` : styles.card;

  return <div className={cardClassName}>{children}</div>;
}
