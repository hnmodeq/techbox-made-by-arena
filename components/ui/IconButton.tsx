"use client";
import * as React from "react";
import { Button, type ButtonProps } from "./Button";
export function IconButton({ size="icon", variant="ghost", ...props }: ButtonProps){
  return <Button size="icon" variant={variant} {...props} />;
}
export default IconButton;
