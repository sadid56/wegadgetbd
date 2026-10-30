"use client";

import * as React from "react";
import MuiModal, { type ModalProps as MuiModalProps } from "@mui/material/Modal";
import MuiFade, { type FadeProps as MuiFadeProps } from "@mui/material/Fade";
import MuiSlide, { type SlideProps as MuiSlideProps } from "@mui/material/Slide";
import MuiCollapse, { type CollapseProps as MuiCollapseProps } from "@mui/material/Collapse";

export type ModalProps = MuiModalProps;
export type FadeProps = MuiFadeProps;
export type SlideProps = MuiSlideProps;
export type CollapseProps = MuiCollapseProps;

export function Modal(props: ModalProps) {
  return <MuiModal {...props} />;
}

export const Fade = React.forwardRef<unknown, FadeProps>(function Fade(props, ref) {
  return <MuiFade ref={ref} {...props} />;
});

export const Slide = React.forwardRef<unknown, SlideProps>(function Slide(props, ref) {
  return <MuiSlide ref={ref} {...props} />;
});

export const Collapse = React.forwardRef<unknown, CollapseProps>(function Collapse(props, ref) {
  return <MuiCollapse ref={ref} {...props} />;
});

export default Modal;

