import React, { ReactNode } from 'react';

/**
 * 基础按钮组件属性
 */
interface ButtonProps {
  children: ReactNode; // 按钮内容
  onClick?: () => void; // 点击事件回调
  className?: string; // 自定义样式类名
  disabled?: boolean; // 是否禁用
  type?: 'button' | 'submit' | 'reset'; // 按钮类型
}

/**
 * 统一的按钮基础组件
 * 由于本项目中按钮样式差异较大（有的带边框，有的只有文字，有的带动画），
 * 此组件主要用于统一基础行为和常用样式类。
 */
export const Button = ({
  children,
  onClick,
  className = '',
  disabled = false,
  type = 'button'
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`transition-all duration-300 cursor-pointer disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};
