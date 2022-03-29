import { useMount, useSetState } from "ahooks";
import React, { forwardRef, useRef, useImperativeHandle } from "react";
import Donut from "./Donut";
import "./Spinner.scss";
import anime from "animejs/lib/anime.es.js";

const Spinner = forwardRef(
  ({ items = [], defaultState, _ritem, _bgc }, ref) => {
    const [drawData, setDrawData] = useSetState({ drawItems: [] });
    const spinnerRef = useRef();
    useImperativeHandle(ref, () => ({
      runTo: (bool, options) => {
        const itemHeight =
          spinnerRef.current.scrollHeight /
          (drawData.drawItems.length * items.length);
        const scrollTo =
          itemHeight * items.length * (drawData.drawItems.length - 1) -
          (bool ? items.length * itemHeight : itemHeight);
        anime({
          targets: spinnerRef.current,
          duration: 5000,
          easing: "easeOutCubic",
          scrollTop: [defaultState ? 0 : itemHeight, scrollTo],
          ...options,
        });
      },
      reset: () => {
        anime({
          targets: spinnerRef.current,
          duration: 2000,
          easing: "easeOutCubic",
          scrollTop: 0,
        });
      },
    }));
    useMount(() => {
      setDrawData({
        drawItems: new Array(10).fill(items),
      });
    });
    return (
      <div className="spinner" ref={spinnerRef}>
        {drawData.drawItems.length ? (
          drawData.drawItems.map((items, i) =>
            items.map((item, $i) => (
              <div
                className="img-wrap flex flex-col"
                key={`${i}-${$i}-${item.id}`}
              >
                <div className="img-cover flex-1 flex items-end justify-center">
                  <img
                    src={_bgc ? _ritem : item.img}
                    alt={item.label}
                    style={{
                      width: "150px",
                    }}
                  />
                </div>
                {/* <label>{item.label}</label> */}
              </div>
            ))
          )
        ) : (
          <div className="img-wrap">
            <Donut />
          </div>
        )}
      </div>
    );
  }
);

export default Spinner;
