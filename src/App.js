import "./styles.scss";
import SlotMachine from "./SlotMachine";
import { useRef, useEffect, useState, useContext } from "react";
import { Header } from "./components/header";
import { UseSpinContract, UseSpinTokenContract } from "./context/hooks";
import { AppContext } from "./context/context";
import Environment from "./context/environment/env";
import { toast } from "react-toastify";
import CustomizedDialogs from "./components/modal";

export default function App() {
  const drawRef = useRef();
  const [toggle, setToggle] = useState(true);
  const [open, setOpen] = useState(false);
  const [_bcondition, _setBCondition] = useState(false);
  const [cost, setCost] = useState(0);
  const { account, signer, connect, disconnect } = useContext(AppContext);
  const contract = UseSpinContract(signer);
  const tokenContract = UseSpinTokenContract(signer);
  const _getRandom = [
    "https://cdn4.iconfinder.com/data/icons/slot-machines/512/Lemon-512.png",
    "https://cdn4.iconfinder.com/data/icons/slot-machines/512/Cherry-512.png",
    "https://cdn4.iconfinder.com/data/icons/slot-machines/512/Watermelon-512.png",
  ];
  var _ritem = _getRandom[Math.floor(Math.random() * _getRandom.length)];

  const itemsone = [
    {
      id: 0,
      value: false,
      label: "lemon",
      img: "https://cdn4.iconfinder.com/data/icons/slot-machines/512/Lemon-512.png",
    },
    {
      id: 1,
      value: false,
      label: "cherry",
      img: "https://cdn4.iconfinder.com/data/icons/slot-machines/512/Cherry-512.png",
    },
    {
      id: 2,
      value: false,
      label: "watermelon",
      img: "https://cdn4.iconfinder.com/data/icons/slot-machines/512/Watermelon-512.png",
    },
  ];

  const itemstwo = [
    {
      id: 0,
      value: false,
      label: "lemon",
      img: "https://cdn4.iconfinder.com/data/icons/slot-machines/512/Lemon-512.png",
    },

    {
      id: 1,
      value: false,
      label: "watermelon",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyVLbXhYwPqyqlRKZVbTv1AHIf85w-3p7LOQ&usqp=CAU",
    },
    {
      id: 2,
      value: false,
      label: "cherry",
      img: "https://cdn4.iconfinder.com/data/icons/slot-machines/512/Cherry-512.png",
    },
  ];

  const itemsthree = [
    {
      id: 0,
      value: false,
      label: "cherry",
      img: "https://cdn4.iconfinder.com/data/icons/slot-machines/512/Cherry-512.png",
    },
    {
      id: 1,
      value: false,
      label: "lemon",
      img: "https://cdn4.iconfinder.com/data/icons/slot-machines/512/Lemon-512.png",
    },
    {
      id: 2,
      value: false,
      label: "watermelon",
      img: "https://cdn4.iconfinder.com/data/icons/slot-machines/512/Watermelon-512.png",
    },
  ];

  let inter;
  useEffect(() => {
    if (!toggle) {
      inter = setInterval(() => {
        drawRef.current.run(Math.round(Math.random()));
      }, 500);
    }
    return () => clearInterval(inter);
  }, [toggle]);
  const handleStartTransaction = async () => {
    if (!account) {
      toast.error("Please connect your wallet");
      return;
    }
    if (+cost < 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    try {
      // _setBCondition(false);

      setToggle(false);
      _setBCondition(false);
      const approveTx = await tokenContract.approve(
        Environment.SpinContractAddress,
        cost
      );
      await approveTx.wait();
      const tx = await contract.Spin();
      await tx.wait();
      const _desion = await contract.GetUserLastSpin(account);
      if (_desion) {
        toast.success("Congratulation You won!");
        _setBCondition(true);
        setToggle(true);
      } else {
        setToggle(true);
        _setBCondition(false);
        setOpen(true);
        toast.error("You lost");
      }
      setTimeout(() => {
        window.location.reload();
      }, 7000);
    } catch (error) {
      if (error?.data?.message) {
        toast.error(error?.data?.message);
      } else {
        toast.error(error?.message);
      }
      setToggle(true);
      // console.log(e);
    }
  };

  // const handleStop = () => {
  //   // clearInterval(inter);
  //   setToggle(true);
  //   _setBCondition(false);
  // };

  useEffect(() => {
    if (account) {
      const init = async () => {
        const cost = await contract.spinCost();
        setCost(cost);
        // console.log(cost);
      };
      init();
      // const getSpinConst
    }
  }, [account]);

  return (
    <div>
      <CustomizedDialogs open={open} setOpen={setOpen} />
      <Header />
      <div className="slot-machine-container">
        <SlotMachine
          defaultState={[0, 0, 0]}
          ref={drawRef}
          // items={items}
          singleItems={{
            one: itemsone,
            two: itemstwo,
            three: itemsthree,
          }}
          backedCondition={_bcondition}
          _ritem={_ritem}
        />
      </div>

      <div className="btn-container">
        <button
          disabled={!toggle}
          onClick={() => {
            account ? handleStartTransaction() : connect();
          }}
          className="btn-start"
        >
          Transaction{" "}
        </button>
        {/* <button onClick={handleStop}> Stop </button> */}
      </div>
    </div>
  );
}
