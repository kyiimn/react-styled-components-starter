import React, { PropsWithChildren } from "react";
import styled from "styled-components";

interface ButtonProps {
  color?: string;
}

const ButtonComponent = styled.button<ButtonProps>`
  color: ${({ color }) => color || "black"};
`;

const Button = ({ color, children }: PropsWithChildren<ButtonProps>) => {
  return <ButtonComponent color={color}>{children}</ButtonComponent>;
};
export default Button;
