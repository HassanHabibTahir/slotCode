import { useSetState } from "ahooks";
import React, { useRef, forwardRef, useImperativeHandle } from "react";
import "./SlotMachine.scss";
import Spinner from "./Spinner";
const randomBool = () => Math.round(Math.random());
const SlotMachine = forwardRef(
  (
    { defaultState, singleItems, backedCondition, _ritem, citem_three },
    ref
  ) => {
    const leftSpinner = useRef();
    const midleSpinner = useRef();
    const rightSpinner = useRef();
    const [states, setStates] = useSetState(defaultState);
    useImperativeHandle(ref, () => ({
      run: (bool, cb = () => {}) => {
        const boolArr = bool ? [1, 1, 1] : [randomBool(), randomBool(), 0];
        leftSpinner.current.runTo(boolArr[0], {
          delay: 200,
          begin: () => {
            midleSpinner.current.runTo(boolArr[1], {
              delay: 150,
              begin: () => {
                rightSpinner.current.runTo(boolArr[2], {
                  delay: 150,
                  complete: () => {
                    setStates(boolArr);
                    cb(boolArr);
                  },
                });
              },
            });
          },
        });
      },
      reset: () => {
        leftSpinner.current.reset();
        midleSpinner.current.reset();
        rightSpinner.current.reset();
      },
    }));

    // if (!toggle) {
    return (
      <div>
        <div className="slot-machine">
          <Spinner
            items={singleItems.one}
            ref={leftSpinner}
            defaultState={states[0]}
            _ritem={_ritem}
            _bgc={backedCondition}
          />
          <Spinner
            items={singleItems.two}
            ref={midleSpinner}
            defaultState={states[1]}
            _ritem={_ritem}
            _bgc={backedCondition}
          />
          <Spinner
            items={singleItems.three}
            ref={rightSpinner}
            defaultState={states[2]}
            _ritem={_ritem}
            _bgc={backedCondition}
          />
        </div>
      </div>
    );
    // } else
    //   return (
    //     <div className="slot-machine">
    //       <Spinner items={items} ref={leftSpinner} defaultState={states[0]} />
    //       <Spinner items={items} ref={midleSpinner} defaultState={states[1]} />
    //       <Spinner items={items} ref={rightSpinner} defaultState={states[2]} />
    //     </div>
    //   );
  }
);

export default SlotMachine;
