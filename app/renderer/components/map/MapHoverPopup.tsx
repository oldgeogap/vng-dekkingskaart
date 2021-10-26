import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import { styled } from "renderer/ui/theme";
import { HoverInfo } from "./MapHover";
import classnames from "classnames";
const _WIDTH = 140;
const _HEIGHT = 50;
const _H_WIDTH = _WIDTH / 2;
const _H_HEIGHT = _HEIGHT / 2;
const _ARROW_HEIGHT = 16;

export interface MapHoverPopupProps {
  hoverInfo: HoverInfo;
  title: string;
  children?: React.ReactNode;
  actionable?: boolean;
}

export function MapHoverPopup({ hoverInfo, title, children, actionable }: MapHoverPopupProps) {
  const flip = hoverInfo !== null && hoverInfo.y < _HEIGHT + _ARROW_HEIGHT;

  let style = {};
  if (hoverInfo !== null) {
    if (flip) {
      style = {
        left: hoverInfo.x - _H_WIDTH,
        top: hoverInfo.y + _ARROW_HEIGHT,
        width: _WIDTH
      };
    } else {
      style = {
        left: hoverInfo.x - _H_WIDTH,
        bottom: hoverInfo.containerHeight - hoverInfo.y,
        width: _WIDTH
      };
    }
  }

  return (
    <AnimatePresence>
      {hoverInfo !== null && (
        <HoverInfoContainer
          style={style}
          initial={{ scale: 1, rotateX: "-90deg", opacity: 0 }}
          animate={{ scale: 1, rotateX: "0deg", opacity: 1 }}
          exit={{ scale: 0.2, opacity: 0 }}
          className={classnames({
            flip,
            actionable
          })}
        >
          {flip && <PointyMcPointFace className="flip" />}
          <section>
            <h4>{title}</h4>
            {children && <div>{children}</div>}
          </section>
          {!flip && <PointyMcPointFace />}
        </HoverInfoContainer>
      )}
    </AnimatePresence>
  );
}

const _HoverInfoContainer = styled.div`
  position: absolute;
  pointer-events: none;

  z-index: 888;

  transform-origin: bottom center;
  text-align: center;

  &.actionable {
    pointer-events: all;
  }

  section {
    border-radius: 4px;
    background-color: #2f4c4e;
    padding: 4px 8px;
    color: #fff;
    box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.2);

    h4 {
      font-size: 14px;
      margin: 0;
      padding: 0;
      font-weight: bold;
    }
  }
`;

const PointyMcPointFace = styled.div`
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;

  border-top: 8px solid #2f4c4e;
  margin: auto;
  z-index: 1;

  &.flip {
    border-top: 0;
    border-bottom: 8px solid #2f4c4e;
  }
`;

const HoverInfoContainer = motion(_HoverInfoContainer);
