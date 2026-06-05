import { FC, ReactNode } from 'react';
import styles from './layout.module.css';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export const Layout: FC<LayoutProps> = ({ children, title }) => (
  <div className={styles.layout}>
    <p className={styles.title}>{title ?? ''}</p>
    <div>{children}</div>
  </div>
);
