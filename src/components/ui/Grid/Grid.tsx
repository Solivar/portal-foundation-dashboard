import type React from 'react';
import styles from './Grid.module.scss';

type GridItemElement = 'article' | 'div' | 'section';

export type GridProps = {
  children: React.ReactNode;
  className?: string;
};

export type GridItemProps = {
  children: React.ReactNode;
  span: 4 | 6 | 12;
  as?: GridItemElement;
  className?: string;
};

function getClassName(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

export function Grid({ children, className }: GridProps) {
  return <div className={getClassName(styles.grid, className)}>{children}</div>;
}

export function GridItem({ children, span, as: Component = 'div', className }: GridItemProps) {
  return (
    <Component className={getClassName(styles.gridItem, styles[`span${span}`], className)}>
      {children}
    </Component>
  );
}
